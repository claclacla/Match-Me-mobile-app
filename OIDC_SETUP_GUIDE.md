# Cognito OIDC Provider Setup Guide

This guide explains how to configure Cognito as an OIDC provider in Supabase for token exchange.

## Prerequisites

- AWS Cognito User Pool ID
- Cognito User Pool Region
- Access to Supabase Dashboard

## Step 1: Get Cognito Configuration Details

You need:
1. **User Pool ID**: Found in AWS Cognito Console → User Pools → Your Pool → General settings
2. **User Pool Region**: e.g., `us-east-1`, `eu-west-1`, etc.
3. **Cognito Domain**: Your Cognito User Pool domain (optional, for custom domains)

## Step 2: Configure OIDC Provider in Supabase

**Important:** OIDC is different from "Third Party Auth". You may already have "Third Party Auth" configured (which uses the `accessToken` option), but for Token Exchange you need OIDC.

**Supabase doesn't have a UI for custom OIDC providers** - you must configure it programmatically via:
- **Management API** (recommended) ✅
- **CLI/config.toml** (for local dev)
- **Dashboard** (only if a generic OIDC option exists)

**Your Configuration Values:**
- Region: `eu-west-1`
- User Pool ID: `eu-west-1_lJhNFwbms`
- Issuer URL: `https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lJhNFwbms`
- Provider name: `cognito`

## Pre-Steps: Configure AWS Cognito

Before configuring Supabase, set up your Cognito App Client:

1. Go to **AWS Cognito Console** → **User Pools** → Your Pool → **App integration** → **App clients**
2. Create (or use existing) an App Client
3. Configure OAuth settings:
   - Enable **Authorization code grant** (for server-side) or **PKCE** (for native/web)
   - Enable scopes: `openid`, `email`, `profile`
   - Add `offline_access` if you need refresh tokens
4. In **App client settings** → **Callback URLs**, add:
   ```
   https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback
   ```
   Replace `<YOUR_PROJECT_REF>` with your Supabase project reference.
5. Note down:
   - **Client ID**
   - **Client Secret** (if using confidential client)

## Option A: Configure via Management API (Recommended)

This is the recommended approach for production.

### Step 1: Get Management API Access Token

1. Go to [Supabase Dashboard](https://app.supabase.com) → **Account** → **Tokens**
2. Click **Create a personal access token**
3. Save it as `SUPABASE_ACCESS_TOKEN`

### Step 2: Get Your Project Reference

Find your project reference:
- In Supabase Dashboard, it's in the URL: `https://app.supabase.com/project/<PROJECT_REF>`
- Or check your project settings

### Step 3: Run the Configuration Command

Replace these placeholders in the command below:
- `<PROJECT_REF>` - Your Supabase project reference
- `<SUPABASE_ACCESS_TOKEN>` - Your Management API token
- `<COGNITO_CLIENT_ID>` - Your Cognito App Client ID
- `<COGNITO_CLIENT_SECRET>` - Your Cognito App Client Secret (or empty string if not using secret)

```bash
curl -X PATCH "https://api.supabase.com/v1/projects/<PROJECT_REF>/config/auth" \
  -H "Authorization: Bearer <SUPABASE_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "external_cognito_enabled": true,
    "external_cognito_client_id": "<COGNITO_CLIENT_ID>",
    "external_cognito_client_secret": "<COGNITO_CLIENT_SECRET>",
    "external_cognito_issuer": "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lJhNFwbms",
    "external_cognito_scopes": "openid email profile",
    "external_cognito_name": "cognito"
  }'
```

**Note:** If the API returns an error about unknown keys, the field names might be slightly different. Share the error and we'll adjust the keys.

### Step 4: Verify Configuration

After the PATCH succeeds, test from your client:

```typescript
// Test with ID token (what we'll use)
const { tokens } = await fetchAuthSession();
const { data, error } = await supabase.auth.signInWithIdToken({
  provider: 'cognito',
  token: tokens?.idToken?.toString(),
});
```

## Option B: Configure via CLI/config.toml

For local development or infrastructure-as-code:

1. Create or edit `supabase/config.toml` in your project
2. Add this section:

```toml
[auth.external.cognito]
enabled = true
client_id = "<COGNITO_CLIENT_ID>"
secret = "<COGNITO_CLIENT_SECRET>"
issuer = "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lJhNFwbms"
scopes = "openid email profile"
name = "cognito"
```

3. Deploy using Supabase CLI:
```bash
supabase db push
```

## Option C: Dashboard (If Available)

Some Supabase projects may have a generic OIDC option in the dashboard:

1. Go to **Project** → **Authentication** → **Providers**
2. Look for "OpenID Connect" or "Custom OIDC" entry
3. If found, enable it and paste:
   - Issuer: `https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lJhNFwbms`
   - Client ID: Your Cognito App Client ID
   - Client Secret: Your Cognito App Client Secret
   - Scopes: `openid email profile`

## Step 3: Verify Configuration

After configuring via Management API, verify:

1. **Check issuer discovery works:**
   ```bash
   curl https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lJhNFwbms/.well-known/openid-configuration
   ```
   You should see JSON with `jwks_uri` and `token_endpoint`.

2. **Test from your client:**
   ```typescript
   const { tokens } = await fetchAuthSession();
   const { data, error } = await supabase.auth.signInWithIdToken({
     provider: 'cognito',
     token: tokens?.idToken?.toString(),
   });
   
   if (error) {
     console.error('Token exchange failed:', error);
   } else {
     console.log('✅ Success! Supabase user ID:', data.user.id);
   }
   ```

## Quick Setup Script

For convenience, use the provided script:

```bash
# Set your access token
export SUPABASE_ACCESS_TOKEN='your-token-here'

# Run the configuration script
./configure_oidc.sh <PROJECT_REF> <COGNITO_CLIENT_ID> [COGNITO_CLIENT_SECRET]
```

The script will:
- Validate your inputs
- Make the API call
- Show success or error messages

## Step 4: Test the Integration

Once configured, you can test using `signInWithIdToken`:

```typescript
const { tokens } = await fetchAuthSession();
const { data, error } = await supabase.auth.signInWithIdToken({
  provider: 'cognito',
  token: tokens?.idToken?.toString(),
});
```

## Troubleshooting

### Error: "Custom OIDC provider 'cognito' not allowed"

This means the OIDC provider isn't configured in Supabase. Make sure you:
1. ✅ Ran the Management API PATCH command successfully
2. ✅ Used the correct provider name `cognito`
3. ✅ Checked the API response for success

**Verify configuration:**
```bash
curl -X GET "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" | jq '.external_cognito_enabled'
```

Should return `true` if configured correctly.

### Error: "Invalid issuer"

Check that:
- Your issuer URL format is correct: `https://cognito-idp.<REGION>.amazonaws.com/<USER_POOL_ID>`
- Your User Pool ID doesn't include the region prefix twice
- The region matches your actual Cognito User Pool region

### Error: "Invalid client_id"

Verify:
- The Client ID matches your Cognito App Client ID exactly
- The App Client is enabled and allows OIDC flows
- The App Client is associated with the correct User Pool

### Error: Management API returns "unknown keys" or "invalid field"

Different Supabase projects may use slightly different field names. Try these variations:

**Option 1: Generic OIDC fields**
```json
{
  "external_custom_issuer": "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lJhNFwbms",
  "external_custom_client_id": "<COGNITO_CLIENT_ID>",
  "external_custom_client_secret": "<COGNITO_CLIENT_SECRET>",
  "external_custom_name": "cognito"
}
```

**Option 2: Check API response**
The Management API might return available fields. Get current config:
```bash
curl -X GET "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" | jq '.'
```

Look for fields related to external auth providers and adapt accordingly.

## Next Steps

After configuring OIDC:
1. Update your client code to use `signInWithIdToken`
2. Update RLS policies to use `auth.uid()` (Supabase UUID)
3. Migrate existing data from Cognito sub to Supabase UUID

