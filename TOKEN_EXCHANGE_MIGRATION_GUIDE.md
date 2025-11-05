# Migration Guide: Third-Party Auth → Token Exchange

This guide walks you through migrating from the Third-Party Auth pattern to the Token Exchange pattern using `signInWithIdToken`.

## Benefits of Token Exchange

✅ **No AWS Lambda required** - No Pre-Token Generation Trigger needed  
✅ **Realtime works automatically** - Supabase JWT includes `role: 'authenticated'`  
✅ **Simpler RLS policies** - Use `auth.uid()` everywhere  
✅ **UUID-based user IDs** - Consistent with Supabase's design  
✅ **Better integration** - Supabase manages users in `auth.users` table  

## Migration Steps

### Step 1: Configure OIDC Provider in Supabase

1. Follow the guide in `OIDC_SETUP_GUIDE.md`
2. Configure Cognito as an OIDC provider in Supabase Dashboard
3. Set provider name to `cognito`
4. Verify the configuration works

**Test the configuration:**
```typescript
const { tokens } = await fetchAuthSession();
const { data, error } = await supabase.auth.signInWithIdToken({
  provider: 'cognito',
  token: tokens?.idToken?.toString(),
});
```

If you get an error like "Custom OIDC provider 'cognito' not allowed", the OIDC provider isn't configured correctly.

### Step 2: Update Client Code ✅ COMPLETED

The client code has been updated:

- ✅ `src/repositories/supabase/supabaseClient.ts` - Removed `accessToken` option, enabled session persistence
- ✅ `src/hooks/useAuthentication.ts` - Added `signInWithIdToken` call after Cognito sign-in
- ✅ `signOut()` - Now signs out from both Supabase and Cognito

**What changed:**
- Supabase client now stores sessions in AsyncStorage
- `signIn()` calls `supabase.auth.signInWithIdToken()` after Cognito sign-in
- Returns Supabase user ID instead of Cognito sub

### Step 3: Update RLS Policies

**File:** `RLS_MIGRATION_TOKEN_EXCHANGE.sql`

Apply this migration to your Supabase database:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `RLS_MIGRATION_TOKEN_EXCHANGE.sql`
3. Run the migration

**What this does:**
- Updates all RLS policies to use `auth.uid()` instead of Cognito sub
- Updates `is_member_v2()` function to use `auth.uid()`
- Updates trigger to auto-fill `user_id` from `auth.uid()`

### Step 4: Migrate Existing Data

**File:** `DATA_MIGRATION_TOKEN_EXCHANGE.sql`

This step converts existing `user_id` values from Cognito sub (TEXT) to Supabase UUID (TEXT).

**Important:** Run this AFTER:
1. ✅ OIDC provider is configured
2. ✅ Users have signed in at least once (so they exist in `auth.users`)
3. ✅ RLS policies have been updated

**Process:**

1. **First, sign in all users** - This creates entries in `auth.users` table
2. **Run verification query** to see which users need migration:
   ```sql
   SELECT DISTINCT user_id as cognito_sub
   FROM memberships
   UNION
   SELECT DISTINCT user_id as cognito_sub
   FROM messages
   UNION
   SELECT DISTINCT created_by as cognito_sub
   FROM rooms;
   ```
3. **Find Supabase UUID for each Cognito sub:**
   ```sql
   SELECT 
     u.id as supabase_uuid,
     i.id as cognito_sub,
     u.email
   FROM auth.users u
   JOIN auth.identities i ON u.id = i.user_id
   WHERE i.provider = 'cognito'
     AND i.id = '<COGNITO_SUB>';
   ```
4. **Run automated migration** (if you have many users):
   ```sql
   SELECT * FROM public.migrate_all_users_to_uuid();
   ```
   Or manually for each user:
   ```sql
   SELECT public.migrate_user_to_uuid(
     '223584e4-b081-7045-a0ee-d98808ce891a',  -- Cognito sub
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid  -- Supabase UUID
   );
   ```

### Step 5: Update Test Functions

Update `src/utils/testSupabaseMessages.ts` to use Supabase user ID:

```typescript
// OLD: Get Cognito sub from token
const userId = payload.sub; // Cognito sub

// NEW: Get Supabase user ID
const { data: { user } } = await supabase.auth.getUser();
const userId = user?.id; // Supabase UUID
```

### Step 6: Verify Everything Works

1. **Test sign-in:**
   - Sign in with Cognito
   - Check console logs for "Supabase token exchange successful"
   - Verify Supabase user ID is displayed

2. **Test data operations:**
   - Try fetching messages
   - Try inserting a message (should work without explicit `user_id`)
   - Verify trigger auto-fills `user_id`

3. **Test Realtime:**
   - Subscribe to a channel
   - Should get `SUBSCRIBED` status (not `CHANNEL_ERROR`)
   - Send a message and verify realtime notification arrives

## Rollback Plan

If you need to rollback:

1. **Revert client code:**
   - Restore `accessToken` option in `supabaseClient.ts`
   - Remove `signInWithIdToken` call from `useAuthentication.ts`

2. **Revert RLS policies:**
   - Restore policies that use Cognito sub
   - Use the previous version of `is_member_v2()`

3. **Revert data:**
   - Restore `user_id` values from backup (if you created one)
   - Or manually map Supabase UUIDs back to Cognito subs

## Common Issues

### Error: "Custom OIDC provider 'cognito' not allowed"

**Solution:** OIDC provider isn't configured in Supabase Dashboard. Follow `OIDC_SETUP_GUIDE.md`.

### Error: "Invalid issuer"

**Solution:** Check that your issuer URL in Supabase Dashboard matches:
```
https://cognito-idp.<REGION>.amazonaws.com/<USER_POOL_ID>
```

### Error: RLS policy violation after migration

**Solution:** 
1. Verify user signed in at least once (exists in `auth.users`)
2. Check that `user_id` in your tables matches Supabase UUID
3. Run data migration if needed

### Realtime still fails

**Solution:**
1. Verify OIDC provider is configured correctly
2. Check that `signInWithIdToken` succeeded
3. Verify Supabase session exists: `await supabase.auth.getSession()`

## Next Steps After Migration

1. ✅ Remove old helper functions (if not needed)
2. ✅ Update documentation
3. ✅ Test all features
4. ✅ Monitor for any issues

## Files Changed

- ✅ `src/repositories/supabase/supabaseClient.ts` - Token exchange setup
- ✅ `src/hooks/useAuthentication.ts` - Added `signInWithIdToken`
- 📝 `OIDC_SETUP_GUIDE.md` - OIDC configuration guide
- 📝 `RLS_MIGRATION_TOKEN_EXCHANGE.sql` - RLS policy updates
- 📝 `DATA_MIGRATION_TOKEN_EXCHANGE.sql` - Data migration script

## Summary

After completing this migration:
- ✅ No AWS Lambda needed
- ✅ Realtime works automatically
- ✅ RLS uses `auth.uid()` everywhere
- ✅ User IDs are Supabase UUIDs
- ✅ Simpler, more maintainable code

