-- ============================================================================
-- COMPLETE SUPABASE SCHEMA FIX FOR COGNITO JWT AUTHENTICATION
-- ============================================================================
-- This script fixes all RLS policies and functions to work with Cognito JWT
-- Execute this entire script in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop ALL existing RLS policies
-- ============================================================================

-- Drop messages policies
DROP POLICY IF EXISTS "messages_delete_service_role_only" ON messages;
DROP POLICY IF EXISTS "messages_insert_member_only" ON messages;
DROP POLICY IF EXISTS "messages_select_member_only" ON messages;
DROP POLICY IF EXISTS "messages_update_service_role_only" ON messages;
DROP POLICY IF EXISTS "Users can insert messages for their rooms" ON messages;
DROP POLICY IF EXISTS "Users can read messages from their rooms" ON messages;

-- Drop memberships policies
DROP POLICY IF EXISTS "memberships_write_service_role_only" ON memberships;
DROP POLICY IF EXISTS "memberships_select_self_or_comembers" ON memberships;

-- Drop rooms policies
DROP POLICY IF EXISTS "rooms_delete_by_creator" ON rooms;
DROP POLICY IF EXISTS "rooms_insert_by_auth_user" ON rooms;
DROP POLICY IF EXISTS "rooms_select_member_only" ON rooms;
DROP POLICY IF EXISTS "rooms_update_by_creator" ON rooms;

-- ============================================================================
-- STEP 2: Fix the is_member function to use correct JWT extraction
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_member(p_room uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.memberships m
    WHERE m.room_id = p_room
      AND m.user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
  );
$$;

-- ============================================================================
-- STEP 3: Create corrected RLS policies for messages table
-- ============================================================================

-- INSERT: Users can insert messages if they are members of the room
CREATE POLICY "messages_insert_member_only"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
  is_member(room_id) 
  AND user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
);

-- SELECT: Users can read messages from rooms they are members of
CREATE POLICY "messages_select_member_only"
ON messages
FOR SELECT
TO authenticated
USING (
  is_member(room_id)
);

-- UPDATE: Only service role can update messages
CREATE POLICY "messages_update_service_role_only"
ON messages
FOR UPDATE
TO authenticated
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- DELETE: Only service role can delete messages
CREATE POLICY "messages_delete_service_role_only"
ON messages
FOR DELETE
TO authenticated
USING (auth.role() = 'service_role');

-- ============================================================================
-- STEP 4: Create corrected RLS policies for memberships table
-- ============================================================================

-- SELECT: Users can see their own memberships or memberships in rooms they belong to
CREATE POLICY "memberships_select_self_or_comembers"
ON memberships
FOR SELECT
TO authenticated
USING (
  user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
  OR EXISTS (
    SELECT 1 
    FROM memberships m2
    WHERE m2.room_id = memberships.room_id 
      AND m2.user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
  )
);

-- ALL (INSERT/UPDATE/DELETE): Only service role can modify memberships
CREATE POLICY "memberships_write_service_role_only"
ON memberships
FOR ALL
TO authenticated
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- STEP 5: Create corrected RLS policies for rooms table
-- ============================================================================

-- INSERT: Authenticated users can create rooms
CREATE POLICY "rooms_insert_by_auth_user"
ON rooms
FOR INSERT
TO authenticated
WITH CHECK (
  created_by = (current_setting('request.jwt.claims', true)::json->>'sub')
);

-- SELECT: Users can see rooms they are members of
CREATE POLICY "rooms_select_member_only"
ON rooms
FOR SELECT
TO authenticated
USING (
  is_member(id)
);

-- UPDATE: Only the creator can update the room
CREATE POLICY "rooms_update_by_creator"
ON rooms
FOR UPDATE
TO authenticated
USING (created_by = (current_setting('request.jwt.claims', true)::json->>'sub'))
WITH CHECK (created_by = (current_setting('request.jwt.claims', true)::json->>'sub'));

-- DELETE: Only the creator can delete the room
CREATE POLICY "rooms_delete_by_creator"
ON rooms
FOR DELETE
TO authenticated
USING (created_by = (current_setting('request.jwt.claims', true)::json->>'sub'));

-- ============================================================================
-- VERIFICATION QUERIES (Optional - run these to verify)
-- ============================================================================

-- Check that all policies are created:
-- SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, cmd;

-- Check the is_member function definition:
-- SELECT pg_get_functiondef('public.is_member(uuid)'::regprocedure);

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
