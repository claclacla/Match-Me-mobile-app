#!/bin/bash

# Script to configure Cognito OIDC provider in Supabase via Management API
# Usage: ./configure_oidc.sh <PROJECT_REF> <COGNITO_CLIENT_ID> <COGNITO_CLIENT_SECRET>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required arguments are provided
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo "Usage: $0 <PROJECT_REF> <COGNITO_CLIENT_ID> [COGNITO_CLIENT_SECRET]"
    echo ""
    echo "Example:"
    echo "  $0 lqiwlmhoykdnrxvvwcuw abc123xyz secret123"
    exit 1
fi

PROJECT_REF=$1
COGNITO_CLIENT_ID=$2
COGNITO_CLIENT_SECRET=${3:-""}  # Optional, defaults to empty string

# Check if SUPABASE_ACCESS_TOKEN is set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo -e "${YELLOW}Warning: SUPABASE_ACCESS_TOKEN environment variable is not set${NC}"
    echo ""
    echo "To get your access token:"
    echo "1. Go to https://app.supabase.com → Account → Tokens"
    echo "2. Click 'Create a personal access token'"
    echo "3. Set it as an environment variable:"
    echo "   export SUPABASE_ACCESS_TOKEN='your-token-here'"
    echo ""
    read -p "Enter your Supabase Management API access token: " SUPABASE_ACCESS_TOKEN
fi

# Issuer URL (using your Cognito config)
ISSUER_URL="https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lJhNFwbms"

echo -e "${GREEN}Configuring Cognito OIDC provider in Supabase...${NC}"
echo ""
echo "Project Reference: $PROJECT_REF"
echo "Cognito Client ID: $COGNITO_CLIENT_ID"
echo "Cognito Client Secret: ${COGNITO_CLIENT_SECRET:-'(not provided)'}"
echo "Issuer URL: $ISSUER_URL"
echo ""

# Prepare the JSON payload
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

# Make the API call
echo "Making API request..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

# Extract HTTP status code (last line) and body (all but last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

# Check if request was successful
if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 204 ]; then
    echo -e "${GREEN}✅ Successfully configured Cognito OIDC provider!${NC}"
    echo ""
    echo "You can now test the integration:"
    echo ""
    echo "  const { tokens } = await fetchAuthSession();"
    echo "  const { data, error } = await supabase.auth.signInWithIdToken({"
    echo "    provider: 'cognito',"
    echo "    token: tokens?.idToken?.toString(),"
    echo "  });"
    echo ""
else
    echo -e "${RED}❌ Error: HTTP $HTTP_CODE${NC}"
    echo ""
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "1. Check that your SUPABASE_ACCESS_TOKEN is valid"
    echo "2. Verify your PROJECT_REF is correct"
    echo "3. If the error mentions unknown keys, the field names might be different"
    echo "   Share the error and we'll adjust the configuration"
    exit 1
fi

