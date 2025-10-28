#!/bin/bash

# Production Environment Setup Script
# This script automates the setup of environment variables for testing plugin operations in PRODUCTION

set -e  # Exit on any error

echo "🚀 Setting up Production Environment"
echo "======================================"
echo ""
echo "⚠️  WARNING: You are setting up PRODUCTION environment"
echo "    Use with extreme caution!"
echo ""

# Check if vault CLI is installed
if ! command -v vault &> /dev/null; then
    echo "❌ Error: Vault CLI is not installed"
    echo "   Please install it first: https://www.vaultproject.io/downloads"
    exit 1
fi

# Set Vault address
export VAULT_ADDR=https://vault-amer.adobe.net
echo "✓ Vault address set: $VAULT_ADDR"

# Authenticate with Vault
echo ""
echo "🔐 Authenticating with Vault..."
echo "   (This will open your browser for OIDC authentication)"
vault login -method=oidc

if [ $? -ne 0 ]; then
    echo "❌ Vault authentication failed"
    exit 1
fi

echo ""
echo "✓ Vault authentication successful"
echo ""

# Fetch secrets from Vault
echo "📥 Fetching Production secrets from Vault..."

export CLIENT_SECRET=$(vault read -field value secret/ethos/tenants/mobile_services/nova/shared/ims/clients/novatesttoken/prod/secret)
if [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Failed to fetch CLIENT_SECRET"
    exit 1
fi
echo "✓ CLIENT_SECRET fetched"

export IMS_PASSWORD=$(vault read -field value secret/ethos/tenants/mobile_services/nova/shared/ims/users/ctobin+ims/prod/password)
if [ -z "$IMS_PASSWORD" ]; then
    echo "❌ Failed to fetch IMS_PASSWORD"
    exit 1
fi
echo "✓ IMS_PASSWORD fetched"

# Set environment-specific variables for PRODUCTION
export ENV_NAME="prod"
export IMS_USER_EMAIL="ctobin+ims@adobe.com"
export IMS_USER_ID="870D1FD4631C10860A495FF3@7fb91f4b631c0cbc495cd6.e"
export IMS_ORG="972C898555E9F7BC7F000101@AdobeOrg"

echo ""
echo "✅ Production Environment setup complete!"
echo ""
echo "📋 Configuration:"
echo "   Environment: $ENV_NAME"
echo "   Organization: $IMS_ORG"
echo "   User: $IMS_USER_EMAIL"
echo "   Server: https://graffias.adobe.io/graffias/graphql"
echo ""
echo "⚠️  PRODUCTION REMINDER:"
echo "   - Always use --dry-run first"
echo "   - Deletions require --force flag"
echo "   - All operations are PERMANENT"
echo ""
echo "🎯 Ready to run commands!"
echo ""
echo "Examples:"
echo "  node list-plugins.js prod"
echo "  node bin/delete.plugin.js --namespace=<name> --environment=prod --dry-run --force"
echo ""

