#!/bin/bash

# Dev Environment Setup Script
# This script automates the setup of environment variables for testing plugin operations in DEV

set -e  # Exit on any error

echo "🚀 Setting up Dev Environment"
echo "=============================="
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
echo "📥 Fetching Dev secrets from Vault..."

export CLIENT_SECRET=$(vault read -field value secret/ethos/tenants/mobile_services/nova/shared/ims/clients/novatesttoken/stage/secret)
if [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Failed to fetch CLIENT_SECRET"
    exit 1
fi
echo "✓ CLIENT_SECRET fetched"

export IMS_PASSWORD=$(vault read -field value secret/ethos/tenants/mobile_services/nova/shared/ims/users/ctobin+ims/stage/password)
if [ -z "$IMS_PASSWORD" ]; then
    echo "❌ Failed to fetch IMS_PASSWORD"
    exit 1
fi
echo "✓ IMS_PASSWORD fetched"

# Set environment-specific variables for DEV
export ENV_NAME="dev"
export IMS_USER_EMAIL="ctobin+ims@adobe.com"
export IMS_USER_ID="5D0335065EA3BE0E0A494017@297a06ca5e976e8d0a494204"
export IMS_ORG="056F3DD059CB22060A494021@AdobeOrg"

echo ""
echo "✅ Dev Environment setup complete!"
echo ""
echo "📋 Configuration:"
echo "   Environment: $ENV_NAME"
echo "   Organization: $IMS_ORG"
echo "   User: $IMS_USER_EMAIL"
echo "   Server: https://graffias-dev.adobe.io/graffias/graphql"
echo ""
echo "🎯 Ready to run commands!"
echo ""
echo "Examples:"
echo "  node list-plugins.js dev"
echo "  node bin/delete.plugin.js --namespace=<name> --environment=dev --dry-run"
echo ""

