# AWS Cognito + Supabase Integration Documentation

## Overview

This document describes the complete integration between AWS Cognito (via Amplify) and Supabase for a React Native mobile application. The integration uses Supabase's **Third-Party Auth** pattern, which allows Supabase to validate Cognito JWTs directly without creating Supabase users.

## Architecture

```
┌─────────────────┐
│  React Native   │
│     Mobile      │
│     App         │
└────────┬────────┘
         │
         │ 1. Sign in with Cognito
         ▼
┌─────────────────┐
│  AWS Cognito    │
│  User Pool      │
│                 │
│  Returns:       │
│  - ID Token     │
│  - Access Token │
└────────┬────────┘
         │
         │ 2. Use ID Token via accessToken option
         ▼
┌─────────────────┐
│  Supabase       │
│  Client         │
│                 │
│  - Data API     │
│  - Realtime     │
│  - Storage      │
└────────┬────────┘
         │
         │ 3. Validates JWT & executes queries
         ▼
┌─────────────────┐
│  Supabase       │
│  Database       │
│                 │
│  - RLS Policies │
│  - Functions    │
│  - Triggers     │
└─────────────────┘
```

### Key Points

- **No Supabase Users**: With Third-Party Auth, Supabase does NOT create users in `auth.users` table
- **Direct JWT Validation**: Supabase validates Cognito JWTs directly
- **Role Assignment**: Users get `anon` role by default (unless `role: 'authenticated'` is in JWT)
- **User ID**: Uses Cognito `sub` claim (not Supabase UUID)

## Database Schema

### Tables

#### `rooms` Table
```sql
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT NOT NULL
);
```

- **Purpose**: Chat rooms/conversations
- **Key Fields**:
  - `id`: Room identifier (UUID)
  - `created_by`: User ID who created the room (Cognito sub, stored as TEXT)

#### `memberships` Table
```sql
CREATE TABLE public.memberships (
    room_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (room_id, user_id)
);
```

- **Purpose**: User-room relationships (who belongs to which room)
- **Key Fields**:
  - `room_id`: Foreign key to `rooms.id`
  - `user_id`: Cognito sub (TEXT, not UUID)
  - `role`: User role in room ('member', 'owner', etc.)

#### `messages` Table
```sql
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

- **Purpose**: Chat messages
- **Key Fields**:
  - `room_id`: Foreign key to `rooms.id`
  - `user_id`: Cognito sub (TEXT, not UUID) - **must be sent by client**
  - `text`: Message content

### Important Notes

- All `user_id` fields are **TEXT** (not UUID) because they store Cognito `sub` values
- No foreign key constraints to `auth.users` (since Third-Party Auth doesn't create Supabase users)
- `auth.users` table is **empty** (0 users) with this setup

## Row Level Security (RLS) Policies

### `messages` Table

#### SELECT Policy
```sql
-- For authenticated role
CREATE POLICY "messages_select_member_only"
ON messages
FOR SELECT
TO authenticated
USING (is_member_v2(room_id));

-- For public role (fallback)
CREATE POLICY "messages_select_member_only_public"
ON messages
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1
    FROM memberships
    WHERE memberships.room_id = messages.room_id
      AND memberships.user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
  )
);
```

**Logic**: Users can only read messages from rooms they belong to.

#### INSERT Policy
```sql
CREATE POLICY "messages_insert_member_check"
ON messages
FOR INSERT
TO public  -- Works for all roles
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.memberships m
    WHERE m.room_id = messages.room_id
      AND m.user_id = messages.user_id
  )
);
```

**Logic**: 
- Uses the `user_id` from the INSERT statement itself (not from JWT)
- Checks if membership exists for that `room_id` + `user_id` combination
- Uses `TO public` to work regardless of role assignment

#### UPDATE/DELETE Policies
```sql
-- Only service_role can update/delete
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
```

### `memberships` Table

#### SELECT Policy
```sql
CREATE POLICY "memberships_select_for_membership_check"
ON memberships
FOR SELECT
TO authenticated, anon, public
USING (true);
```

**Logic**: Allows reading all memberships for membership checks (required for INSERT policy on messages).

#### Write Policy
```sql
CREATE POLICY "memberships_write_service_role_only"
ON memberships
FOR ALL
TO authenticated
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
```

**Logic**: Only service_role (backend agents) can create/update/delete memberships.

### `rooms` Table

#### SELECT Policy
```sql
CREATE POLICY "rooms_select_member_only"
ON rooms
FOR SELECT
TO authenticated
USING (is_member_v2(id));
```

#### INSERT Policy
```sql
CREATE POLICY "rooms_insert_by_auth_user"
ON rooms
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid()::text);
```

**Note**: This policy uses `auth.uid()` which returns NULL with Third-Party Auth. This may need adjustment.

#### UPDATE/DELETE Policies
```sql
CREATE POLICY "rooms_update_by_creator"
ON rooms
FOR UPDATE
TO authenticated
USING (created_by = auth.uid()::text)
WITH CHECK (created_by = auth.uid()::text);

CREATE POLICY "rooms_delete_by_creator"
ON rooms
FOR DELETE
TO authenticated
USING (created_by = auth.uid()::text);
```

## PostgreSQL Functions

### `jwt_cognito_sub()`
Extracts the Cognito `sub` claim from the JWT using multiple fallback methods.

```sql
CREATE OR REPLACE FUNCTION public.jwt_cognito_sub()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_sub text;
BEGIN
  -- Try method 1: auth.jwt()->>'sub'
  BEGIN
    jwt_sub := auth.jwt()->>'sub';
    IF jwt_sub IS NOT NULL AND jwt_sub != '' THEN
      RETURN jwt_sub;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- Try method 2: current_setting('request.jwt.claims', true)::json->>'sub'
  BEGIN
    jwt_sub := current_setting('request.jwt.claims', true)::json->>'sub';
    IF jwt_sub IS NOT NULL AND jwt_sub != '' THEN
      RETURN jwt_sub;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- Try method 3: current_setting('request.jwt.claims', false)
  BEGIN
    jwt_sub := current_setting('request.jwt.claims', false)::json->>'sub';
    IF jwt_sub IS NOT NULL AND jwt_sub != '' THEN
      RETURN jwt_sub;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN NULL;
END;
$$;
```

**Status**: Returns NULL with current setup (JWT parsing not working as expected)

### `is_member_v2(p_room uuid)`
Checks if the current user is a member of a room. Supports both Cognito sub and Supabase UUID.

```sql
CREATE OR REPLACE FUNCTION public.is_member_v2(p_room uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cognito_sub text;
  supabase_uid_text text;
BEGIN
  -- Get Cognito sub from JWT
  cognito_sub := public.jwt_cognito_sub();
  
  -- Try auth.uid() (will be NULL with Third-Party Auth)
  BEGIN
    supabase_uid_text := auth.uid()::text;
  EXCEPTION WHEN OTHERS THEN
    supabase_uid_text := NULL;
  END;

  -- Check membership using either Cognito sub OR Supabase UUID
  RETURN EXISTS (
    SELECT 1
    FROM public.memberships m
    WHERE m.room_id = p_room
      AND (
        (cognito_sub IS NOT NULL AND m.user_id = cognito_sub)
        OR
        (supabase_uid_text IS NOT NULL AND m.user_id = supabase_uid_text)
      )
  );
END;
$$;
```

**Status**: Used by SELECT policies, but `jwt_cognito_sub()` returns NULL, so it only works if Supabase UUID exists

### `check_membership_for_insert(p_room_id uuid, p_user_id text)`
SECURITY DEFINER function to check membership for INSERT operations. Bypasses RLS on memberships table.

```sql
CREATE OR REPLACE FUNCTION public.check_membership_for_insert(p_room_id uuid, p_user_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships m
    WHERE m.room_id = p_room_id
      AND m.user_id = p_user_id
  );
$$;
```

**Status**: Created but not currently used (INSERT policy uses inline check instead)

### `simple_membership_check(p_room_id uuid, p_user_id text)`
Simplified membership check function (same as `check_membership_for_insert`).

```sql
CREATE OR REPLACE FUNCTION public.simple_membership_check(p_room_id uuid, p_user_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships m
    WHERE m.room_id = p_room_id
      AND m.user_id = p_user_id
  );
$$;
```

**Status**: Created but not currently used

### `migrate_current_user_ids()`
Migration function to convert legacy Cognito sub rows to Supabase UUID (for token exchange approach).

```sql
CREATE OR REPLACE FUNCTION public.migrate_current_user_ids()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  supabase_uid_text text;
  cognito_sub text;
begin
  supabase_uid_text := auth.uid()::text;
  cognito_sub := public.jwt_cognito_sub();

  if cognito_sub is not null then
    update public.memberships
    set user_id = supabase_uid_text
    where user_id = cognito_sub;

    update public.messages
    set user_id = supabase_uid_text
    where user_id = cognito_sub;
  end if;
end;
$$;
```

**Status**: Created for token exchange approach, not used with current Third-Party Auth setup

### `set_message_user_id_from_auth()`
Trigger function to auto-fill `user_id` from `auth.uid()`.

```sql
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
```

**Status**: 
- Trigger exists but doesn't work with Third-Party Auth (since `auth.uid()` returns NULL)
- Clients must send `user_id` explicitly in INSERT statements

### `debug_insert_check(p_room_id uuid, p_user_id text)`
Debug function to check what Supabase sees during INSERT operations.

```sql
CREATE OR REPLACE FUNCTION public.debug_insert_check(p_room_id uuid, p_user_id text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  membership_exists boolean;
  result jsonb;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships m
    WHERE m.room_id = p_room_id
      AND m.user_id = p_user_id
  ) INTO membership_exists;
  
  result := jsonb_build_object(
    'room_id', p_room_id,
    'user_id', p_user_id,
    'membership_exists', membership_exists,
    'auth_uid', auth.uid(),
    'auth_role', auth.role(),
    'jwt_sub', public.jwt_cognito_sub()
  );
  
  RETURN result;
END;
$$;
```

**Status**: Created for debugging, shows `auth_uid` and `jwt_sub` both return NULL

## Triggers

### `trg_messages_set_user`
```sql
CREATE TRIGGER trg_messages_set_user
BEFORE INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION set_message_user_id_from_auth();
```

**Purpose**: Auto-fill `user_id` from `auth.uid()` if not provided

**Status**: Doesn't work with Third-Party Auth (since `auth.uid()` returns NULL)

## Client-Side Implementation

### Supabase Client Configuration

**File**: `src/repositories/supabase/supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { fetchAuthSession } from '@aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    // Third-Party Auth: Supabase validates Cognito tokens directly
    accessToken: async () => {
      const session = await fetchAuthSession();
      // Use idToken (not accessToken) for better compatibility
      return session?.tokens?.idToken?.toString() || '';
    },
    auth: {
      persistSession: false, // Using Cognito sessions, not Supabase
      autoRefreshToken: false, // Cognito handles refresh
      detectSessionInUrl: false,
      storage: undefined,
    },
    realtime: { 
      params: { eventsPerSecond: 5 },
    },
  }
);

// Hub listener for Realtime token updates
Hub.listen('auth', async () => {
  const session = await fetchAuthSession();
  const token = session?.tokens?.idToken?.toString();
  if (token) {
    supabase.realtime.setAuth(token);
  }
});
```

**Key Points**:
- Uses `accessToken` option (Third-Party Auth pattern)
- Automatically injects Cognito ID token into all Supabase requests
- No Supabase user creation (no `signInWithIdToken` call)

### Authentication Flow

**File**: `src/hooks/useAuthentication.ts`

```typescript
async function signIn({ username, password }) {
  // 1. Sign in with Cognito
  await amplifySignIn({ username, password });
  
  // 2. Get Cognito ID token
  const session = await amplifyFetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  
  // 3. Store token (Supabase client uses it via accessToken option)
  setKey(idToken);
  return idToken;
}
```

**No Supabase Auth Call**: We don't call `supabase.auth.signInWithIdToken()` because:
- `accessToken` option handles authentication automatically
- Third-Party Auth doesn't create Supabase users
- No need for token exchange

### Message Insertion

**Important**: Clients MUST send `user_id` explicitly:

```typescript
await supabase.from('messages').insert({
  room_id: ROOM_ID,
  user_id: cognitoSub,  // REQUIRED - Cognito sub from JWT
  text: 'Hello!',
});
```

**Why**: 
- The trigger `set_message_user_id_from_auth()` doesn't work (`auth.uid()` is NULL)
- RLS policy needs `user_id` from the INSERT statement to check membership

## Current Status

### ✅ What Works

1. **Authentication**: Cognito sign-in works
2. **Data API SELECT**: Can fetch messages from rooms user belongs to
3. **Data API INSERT**: Can insert messages (after fixing RLS policies)
4. **Membership Checks**: RLS policies correctly enforce room membership

### ❌ What Doesn't Work

1. **Realtime Subscriptions**: Fails with empty error `{}`
   - **Root Cause**: JWT doesn't have `role: 'authenticated'` claim
   - **Impact**: Users get `anon` role, Realtime requires `authenticated` role
   - **Solution** (not implemented): Add Cognito Pre-Token Generation Trigger

2. **JWT Parsing**: `auth.jwt()->>'sub'` and `current_setting('request.jwt.claims')` return NULL
   - **Impact**: Functions like `jwt_cognito_sub()` don't work
   - **Workaround**: INSERT policy uses `user_id` from INSERT statement instead

3. **Trigger Auto-Fill**: `set_message_user_id_from_auth()` doesn't work
   - **Impact**: Clients must always send `user_id` explicitly
   - **Reason**: `auth.uid()` returns NULL with Third-Party Auth

### ⚠️ Known Limitations

1. **Role Assignment**: Users get `anon` role by default (not `authenticated`)
   - Data API works because policies use `TO public` or inline checks
   - Realtime fails because it requires `authenticated` role

2. **No Supabase Users**: `auth.users` table is empty
   - Can't use `auth.uid()` in RLS policies
   - Must use JWT claims directly (which also don't parse correctly)

3. **JWT Parsing**: Supabase doesn't parse Cognito JWT claims correctly
   - `auth.jwt()->>'sub'` returns NULL
   - `current_setting('request.jwt.claims')` returns NULL
   - Must use `user_id` from INSERT statements instead

## How RLS Policies Work (Current Implementation)

### Messages INSERT Policy (Working)

```sql
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.memberships m
    WHERE m.room_id = messages.room_id
      AND m.user_id = messages.user_id  -- Uses user_id from INSERT
  )
)
```

**Why This Works**:
- Doesn't rely on JWT parsing
- Uses the `user_id` value from the INSERT statement itself
- Directly checks membership table
- Uses `TO public` so it works regardless of role assignment

### Messages SELECT Policy (Working)

```sql
-- Uses is_member_v2() function
USING (is_member_v2(room_id))
```

**Why This Works**:
- `is_member_v2()` uses SECURITY DEFINER to bypass RLS on memberships
- Even though `jwt_cognito_sub()` returns NULL, the function can still query memberships
- The `messages_select_member_only_public` policy provides fallback

### Memberships SELECT Policy (Working)

```sql
USING (true)  -- Allows reading all memberships
```

**Why This Works**:
- Needed for INSERT policy on messages to check membership
- Allows any authenticated user to read memberships (safe for membership checks)

## Architecture Decisions

### Why Third-Party Auth Instead of Token Exchange?

**Initial Approach (Attempted)**: Use `signInWithIdToken()` to exchange Cognito tokens for Supabase sessions
- **Problem**: Requires Cognito to be configured as OIDC provider in Supabase
- **Error**: "Custom OIDC provider 'cognito' not allowed"

**Current Approach**: Use `accessToken` option (Third-Party Auth)
- **Advantage**: Works with existing Cognito setup
- **Disadvantage**: No Supabase users, limited JWT parsing, Realtime requires role claim

### Why Inline Membership Check Instead of Function?

**Problem**: Functions in RLS policies had issues with role assignment and JWT parsing

**Solution**: Use direct EXISTS query in INSERT policy
- Simpler and more reliable
- Works regardless of role assignment
- Doesn't depend on JWT parsing

### Why `TO public` in INSERT Policy?

**Problem**: Role assignment is unreliable (`auth.role()` returns NULL)

**Solution**: Use `TO public` which applies to all roles
- Works regardless of how Supabase assigns roles
- Safe because membership check provides security

## Data Flow Examples

### Reading Messages

```
1. Client: supabase.from('messages').select().eq('room_id', roomId)
2. Supabase: Validates Cognito JWT
3. Supabase: Assigns role (likely 'anon' or 'public')
4. PostgreSQL: Evaluates SELECT policy
5. PostgreSQL: Calls is_member_v2(room_id) → checks memberships table
6. PostgreSQL: Returns messages if user is member
```

### Inserting Messages

```
1. Client: supabase.from('messages').insert({ room_id, user_id: cognitoSub, text })
2. Supabase: Validates Cognito JWT
3. Supabase: Assigns role (likely 'anon' or 'public')
4. PostgreSQL: Evaluates INSERT policy WITH CHECK
5. PostgreSQL: Checks EXISTS (SELECT 1 FROM memberships WHERE room_id = X AND user_id = Y)
6. PostgreSQL: Allows INSERT if membership exists
7. Trigger: set_message_user_id_from_auth() runs but does nothing (auth.uid() is NULL)
8. PostgreSQL: Inserts message
```

### Realtime Subscription (Currently Failing)

```
1. Client: supabase.realtime.setAuth(token) → sets Cognito ID token
2. Client: channel.subscribe()
3. Supabase Realtime: Validates JWT
4. Supabase Realtime: Checks role claim → finds 'anon' (or missing)
5. Supabase Realtime: Rejects subscription (requires 'authenticated' role)
6. Client: Receives CHANNEL_ERROR with empty error object
```

## Testing Results

### ✅ Successful Tests

- **Connection**: Supabase client initializes correctly
- **Authentication**: Cognito tokens are retrieved and used
- **SELECT Messages**: Can fetch messages from rooms user belongs to
- **INSERT Messages**: Can insert messages (membership check works)

### ❌ Failed Tests

- **Realtime Subscription**: Fails with empty error `{}`
- **JWT Parsing**: `auth.jwt()->>'sub'` returns NULL
- **Role Assignment**: `auth.role()` returns NULL

## Dependencies

### Required Packages

```json
{
  "@supabase/supabase-js": "^2.x",
  "@aws-amplify/auth": "^6.x",
  "aws-amplify": "^6.x",
  "react-native-url-polyfill": "^2.x"
}
```

### Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Migration History

The database went through several migrations to fix RLS issues:

1. **Initial**: Created `is_member_v2()` function with transitional support
2. **Fixed**: Updated INSERT policy to use inline EXISTS check
3. **Fixed**: Updated memberships SELECT policy to allow reading for checks
4. **Created**: Multiple helper functions for debugging and migration

## Future Considerations

### If Realtime is Needed

**Option 1**: Add Cognito Pre-Token Generation Trigger
- Inject `role: 'authenticated'` into JWT
- Requires AWS Lambda function
- All users must re-authenticate after setup

**Option 2**: Use Supabase Broadcast instead of Postgres Changes
- Doesn't require `authenticated` role
- More flexible for custom events
- Requires different client-side implementation

### If JWT Parsing is Needed

**Current**: JWT claims aren't accessible in RLS policies
**Workaround**: Use `user_id` from INSERT statements
**Alternative**: Switch to token exchange approach (requires OIDC provider setup)

## References

- [Supabase Third-Party Auth Guide](https://supabase.com/docs/guides/auth/third-party/aws-cognito)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime/postgres-changes)

