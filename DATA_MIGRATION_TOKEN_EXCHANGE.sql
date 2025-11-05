-- Data Migration: Convert user_ids from Cognito sub (TEXT) to Supabase UUID (TEXT)
-- This migration must be run AFTER:
-- 1. OIDC provider is configured in Supabase
-- 2. Users have signed in at least once (so they exist in auth.users)
-- 3. RLS policies have been updated (see RLS_MIGRATION_TOKEN_EXCHANGE.sql)

-- ============================================================================
-- IMPORTANT: This migration uses a SECURITY DEFINER function to bypass RLS
-- ============================================================================

-- Function to migrate a single user's data from Cognito sub to Supabase UUID
CREATE OR REPLACE FUNCTION public.migrate_user_to_uuid(
  p_cognito_sub text,
  p_supabase_uuid uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update memberships
  UPDATE memberships
  SET user_id = p_supabase_uuid::text
  WHERE user_id = p_cognito_sub;
  
  -- Update messages
  UPDATE messages
  SET user_id = p_supabase_uuid::text
  WHERE user_id = p_cognito_sub;
  
  -- Update rooms created_by
  UPDATE rooms
  SET created_by = p_supabase_uuid::text
  WHERE created_by = p_cognito_sub;
  
  RAISE NOTICE 'Migrated user % to UUID %', p_cognito_sub, p_supabase_uuid;
END;
$$;

-- ============================================================================
-- Manual Migration Process
-- ============================================================================

-- Step 1: Find all unique Cognito subs in your tables
SELECT DISTINCT user_id as cognito_sub
FROM memberships
UNION
SELECT DISTINCT user_id as cognito_sub
FROM messages
UNION
SELECT DISTINCT created_by as cognito_sub
FROM rooms
WHERE created_by IS NOT NULL
ORDER BY cognito_sub;

-- Step 2: For each Cognito sub, find the corresponding Supabase UUID
-- This requires checking auth.users table which has the identity provider info
-- The identity.id should match the Cognito sub

-- Query to find mapping (run this for each user):
SELECT 
  u.id as supabase_uuid,
  u.raw_user_meta_data->>'sub' as cognito_sub_check,
  u.email,
  u.created_at
FROM auth.users u
WHERE u.raw_user_meta_data->>'sub' = '<COGNITO_SUB_HERE>'
  OR u.raw_app_meta_data->>'provider' = 'cognito'
ORDER BY u.created_at;

-- Step 3: For each user, run the migration function
-- Example:
-- SELECT public.migrate_user_to_uuid(
--   '223584e4-b081-7045-a0ee-d98808ce891a',  -- Cognito sub
--   'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid  -- Supabase UUID
-- );

-- ============================================================================
-- Automated Migration Script (if you have many users)
-- ============================================================================

-- This function attempts to automatically migrate all users
-- It matches Cognito sub from identity.id in auth.users
CREATE OR REPLACE FUNCTION public.migrate_all_users_to_uuid()
RETURNS TABLE(
  cognito_sub text,
  supabase_uuid uuid,
  migrated boolean,
  error_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
  migration_count INTEGER := 0;
BEGIN
  -- Loop through all users in auth.users that have Cognito identity
  FOR user_record IN
    SELECT 
      u.id as supabase_uuid,
      i.id as cognito_sub,
      i.provider
    FROM auth.users u
    JOIN auth.identities i ON u.id = i.user_id
    WHERE i.provider = 'cognito'
  LOOP
    BEGIN
      -- Migrate this user's data
      PERFORM public.migrate_user_to_uuid(
        user_record.cognito_sub,
        user_record.supabase_uuid
      );
      
      migration_count := migration_count + 1;
      
      RETURN QUERY SELECT 
        user_record.cognito_sub,
        user_record.supabase_uuid,
        true,
        NULL::text;
    EXCEPTION WHEN OTHERS THEN
      RETURN QUERY SELECT 
        user_record.cognito_sub,
        user_record.supabase_uuid,
        false,
        SQLERRM;
    END;
  END LOOP;
  
  RAISE NOTICE 'Migration completed. Migrated % users.', migration_count;
END;
$$;

-- Run the automated migration:
-- SELECT * FROM public.migrate_all_users_to_uuid();

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Check if any Cognito subs remain (should be empty after migration)
SELECT DISTINCT user_id
FROM memberships
WHERE user_id NOT LIKE '%-%-%-%-%'  -- UUID format check
  OR LENGTH(user_id) != 36;

SELECT DISTINCT user_id
FROM messages
WHERE user_id NOT LIKE '%-%-%-%-%'
  OR LENGTH(user_id) != 36;

SELECT DISTINCT created_by
FROM rooms
WHERE created_by IS NOT NULL
  AND (created_by NOT LIKE '%-%-%-%-%' OR LENGTH(created_by) != 36);

-- Check that all user_ids match Supabase UUIDs
SELECT 
  m.user_id,
  COUNT(*) as count,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM auth.users u WHERE u.id::text = m.user_id
    ) THEN '✅ Valid UUID'
    ELSE '❌ Invalid UUID'
  END as status
FROM memberships m
GROUP BY m.user_id
ORDER BY count DESC;

-- ============================================================================
-- Rollback (if needed)
-- ============================================================================

-- If you need to rollback, you'll need to manually map Supabase UUIDs back
-- to Cognito subs. This requires storing the mapping before migration.
-- 
-- Create a backup table first:
-- CREATE TABLE user_id_mapping AS
-- SELECT 
--   u.id as supabase_uuid,
--   i.id as cognito_sub
-- FROM auth.users u
-- JOIN auth.identities i ON u.id = i.user_id
-- WHERE i.provider = 'cognito';

