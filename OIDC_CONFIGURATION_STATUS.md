# OIDC Configuration Status

## Current Situation

The Management API approach may not support custom OIDC providers directly. The API returns the full config but doesn't show custom OIDC fields, suggesting this feature might need to be configured via:

1. **Supabase CLI** (recommended for custom OIDC)
2. **Contact Supabase Support** to enable custom OIDC via Management API
3. **Test if `signInWithIdToken` works anyway** (some providers work without explicit config)

## What We've Tried

1. ✅ Management API with `external_cognito_*` fields - No error, but fields not saved
2. ✅ Management API with `external_custom_*` fields - No error, but fields not saved

## Next Steps

### Option 1: Use Supabase CLI (Recommended)

If you have Supabase CLI installed:

```bash
# 1. Initialize Supabase in your project (if not already done)
supabase init

# 2. Create/edit supabase/config.toml
# Add the configuration from supabase/config.toml.example

# 3. Link to your project
supabase link --project-ref lqiwlmhoykdnrxvvwcuw

# 4. Apply the configuration
supabase db push
```

### Option 2: Contact Supabase Support

Since Supabase support told you this is possible via Management API, they may need to:
- Enable custom OIDC support for your project
- Provide the correct field names
- Or guide you through a different endpoint

### Option 3: Test Anyway

Try testing `signInWithIdToken` - it might work even without explicit configuration:

```typescript
const { tokens } = await fetchAuthSession();
const { data, error } = await supabase.auth.signInWithIdToken({
  provider: 'cognito',
  token: tokens?.idToken?.toString(),
});
```

If you get "Custom OIDC provider 'cognito' not allowed", then we definitely need to configure it.

## Your Configuration Values

- **Project Reference**: `lqiwlmhoykdnrxvvwcuw`
- **Cognito Client ID**: `2ukcg8blkn535slkr2q23krrd1`
- **Issuer URL**: `https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lJhNFwbms`
- **Provider Name**: `cognito`

## Recommendation

Try **Option 3 first** (test `signInWithIdToken`) to see if it works without explicit config. If it fails, proceed with **Option 1** (CLI) or **Option 2** (contact support).

