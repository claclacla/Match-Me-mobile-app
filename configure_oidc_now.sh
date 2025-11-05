#!/bin/bash

# Quick configuration script with your token pre-filled
# You just need to provide: COGNITO_CLIENT_ID and optionally COGNITO_CLIENT_SECRET

set -e

PROJECT_REF="lqiwlmhoykdnrxvvwcuw"
SUPABASE_ACCESS_TOKEN="sbp_c31dbf765de1eb1b465becc50774642e6f755fee"
ISSUER_URL="https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lJhNFwbms"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Configuring Cognito OIDC provider...${NC}"
echo ""

# Check if Client ID is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Cognito Client ID is required${NC}"
    echo ""
    echo "Usage: $0 <COGNITO_CLIENT_ID> [COGNITO_CLIENT_SECRET]"
    echo ""
    echo "To find your Cognito Client ID:"
    echo "1. Go to AWS Cognito Console"
    echo "2. Select your User Pool (eu-west-1_lJhNFwbms)"
    echo "3. Go to App integration → App clients"
    echo "4. Copy the Client ID"
    echo ""
    exit 1
fi

COGNITO_CLIENT_ID=$1
COGNITO_CLIENT_SECRET=${2:-""}

echo "Project Reference: $PROJECT_REF"
echo "Cognito Client ID: $COGNITO_CLIENT_ID"
echo "Cognito Client Secret: ${COGNITO_CLIENT_SECRET:-'(not provided)'}"
echo "Issuer URL: $ISSUER_URL"
echo ""

# Prepare JSON payload
if [ -z "$COGNITO_CLIENT_SECRET" ]; then
    JSON_PAYLOAD=$(cat <<EOF
{
  "external_cognito_enabled": true,
  "external_cognito_client_id": "$COGNITO_CLIENT_ID",
  "external_cognito_issuer": "$ISSUER_URL",
  "external_cognito_scopes": "openid email profile",
  "external_cognito_name": "cognito"
}
EOF
)
else
    JSON_PAYLOAD=$(cat <<EOF
{
  "external_cognito_enabled": true,
  "external_cognito_client_id": "$COGNITO_CLIENT_ID",
  "external_cognito_client_secret": "$COGNITO_CLIENT_SECRET",
  "external_cognito_issuer": "$ISSUER_URL",
  "external_cognito_scopes": "openid email profile",
  "external_cognito_name": "cognito"
}
EOF
)
fi

echo "Making API request..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 204 ]; then
    echo -e "${GREEN}✅ Successfully configured Cognito OIDC provider!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test the integration by signing in to your app"
    echo "2. Check console logs for '✅ Supabase token exchange successful'"
    echo "3. Verify Realtime subscriptions work"
    echo ""
else
    echo -e "${RED}❌ Error: HTTP $HTTP_CODE${NC}"
    echo ""
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "If you see 'unknown keys' error, the field names might be different."
    echo "Try the alternative fields mentioned in OIDC_SETUP_GUIDE.md"
    exit 1
fi

