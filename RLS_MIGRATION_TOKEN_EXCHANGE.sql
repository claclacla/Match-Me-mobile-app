-- Migration: Update RLS Policies for Token Exchange Pattern
-- This migration updates RLS policies to use auth.uid() (Supabase UUID) instead of Cognito sub
-- Apply this AFTER configuring Cognito as OIDC provider in Supabase Dashboard

-- ============================================================================
-- STEP 1: Update messages table policies
-- ============================================================================

-- Drop existing messages policies
DROP POLICY IF EXISTS "messages_select_member_only" ON messages;
DROP POLICY IF EXISTS "messages_select_member_only_public" ON messages;
DROP POLICY IF EXISTS "messages_insert_member_check" ON messages;
DROP POLICY IF EXISTS "messages_update_service_role_only" ON messages;
DROP POLICY IF EXISTS "messages_delete_service_role_only" ON messages;

-- New SELECT policy: Use auth.uid() and is_member() function
CREATE POLICY "messages_select_member_only"
ON messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM memberships m
    WHERE m.room_id = messages.room_id
      AND m.user_id = auth.uid()::text
  )
);

-- New INSERT policy: Use auth.uid() for user_id
CREATE POLICY "messages_insert_member_check"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()::text
  AND EXISTS (
    SELECT 1
    FROM memberships m
    WHERE m.room_id = messages.room_id
      AND m.user_id = auth.uid()::text
  )
);

-- UPDATE/DELETE: Only service_role (unchanged)
CREATE POLICY "messages_update_service_role_only"
ON messages
FOR UPDATE
TO authenticated
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "messages_delete_service_role_only"
ON messages
FOR DELETE
TO authenticated
USING (auth.role() = 'service_role');

-- ============================================================================
-- STEP 2: Update rooms table policies
-- ============================================================================

DROP POLICY IF EXISTS "rooms_select_member_only" ON rooms;
DROP POLICY IF EXISTS "rooms_insert_by_auth_user" ON rooms;
DROP POLICY IF EXISTS "rooms_update_by_creator" ON rooms;
DROP POLICY IF EXISTS "rooms_delete_by_creator" ON rooms;

-- SELECT: Users can see rooms they're members of
CREATE POLICY "rooms_select_member_only"
ON rooms
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM memberships m
    WHERE m.room_id = rooms.id
      AND m.user_id = auth.uid()::text
  )
);

-- INSERT: Users can create rooms, set created_by to their UUID
CREATE POLICY "rooms_insert_by_auth_user"
ON rooms
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid()::text);

-- UPDATE: Only creators can update
CREATE POLICY "rooms_update_by_creator"
ON rooms
FOR UPDATE
TO authenticated
USING (created_by = auth.uid()::text)
WITH CHECK (created_by = auth.uid()::text);

-- DELETE: Only creators can delete
CREATE POLICY "rooms_delete_by_creator"
ON rooms
FOR DELETE
TO authenticated
USING (created_by = auth.uid()::text);

-- ============================================================================
-- STEP 3: Update memberships table policies
-- ============================================================================

DROP POLICY IF EXISTS "memberships_select_for_membership_check" ON memberships;
DROP POLICY IF EXISTS "memberships_write_service_role_only" ON memberships;

-- SELECT: Allow reading memberships for membership checks
-- This is needed for RLS policies to check membership
CREATE POLICY "memberships_select_for_membership_check"
ON memberships
FOR SELECT
TO authenticated
USING (
  -- Users can see memberships for rooms they belong to
  EXISTS (
    SELECT 1
    FROM memberships m2
    WHERE m2.room_id = memberships.room_id
      AND m2.user_id = auth.uid()::text
  )
);

-- Write: Only service_role can create/update/delete memberships
-- (This should be done via backend/Edge Functions)
CREATE POLICY "memberships_write_service_role_only"
ON memberships
FOR ALL
TO authenticated
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- STEP 4: Update trigger to use auth.uid()
-- ============================================================================

-- Update the trigger function to use auth.uid()
CREATE OR REPLACE FUNCTION public.set_message_user_id_from_auth()
RETURNS trigger
LANGUAGE plpgsql
AS $$
begin
  if new.user_id is null then
    new.user_id := auth.uid()::text;
  end if;
  return new;
end;
$$;

-- The trigger should already exist, but recreate it to be sure
DROP TRIGGER IF EXISTS trg_messages_set_user ON messages;
CREATE TRIGGER trg_messages_set_user
BEFORE INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION public.set_message_user_id_from_auth();

-- ============================================================================
-- STEP 5: Update helper functions (optional cleanup)
-- ============================================================================

-- is_member_v2() can be simplified to only use auth.uid()
CREATE OR REPLACE FUNCTION public.is_member_v2(p_room uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.memberships m
    WHERE m.room_id = p_room
      AND m.user_id = auth.uid()::text
  );
END;
$$;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. After applying this migration, you MUST run the data migration script
--    to convert existing user_ids from Cognito sub to Supabase UUID
--
-- 2. The trigger will auto-fill user_id from auth.uid(), so clients can
--    omit user_id when inserting messages
--
-- 3. All RLS policies now use auth.uid() which works with Token Exchange
--
-- 4. Realtime will work automatically because Supabase JWT has role: authenticated

