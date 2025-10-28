#!/bin/bash

# Complete QA Environment Setup Script
# This script handles Vault authentication and environment setup

set -e  # Exit on error

echo "=========================================="
echo "🚀 QA Environment Setup"
echo "=========================================="
echo ""

cd /Users/mashraf/Desktop/adobe-codes/griffon-plugin-tools

# Step 1: Vault Authentication
echo "🔐 Step 1: Vault Authentication"
echo "----------------------------------------"
export VAULT_ADDR=https://vault-amer.adobe.net
echo "Vault address set to: $VAULT_ADDR"
echo ""
echo "Logging in via OIDC (browser will open)..."
vault login -method=oidc

if [ $? -ne 0 ]; then
    echo "❌ Vault authentication failed"
    exit 1
fi

echo ""
echo "✅ Vault authentication successful"
echo ""

# Step 2: Fetch Secrets
echo "🔑 Step 2: Fetching Secrets from Vault"
echo "----------------------------------------"

echo "Fetching CLIENT_SECRET..."
export CLIENT_SECRET=$(vault read -field value secret/ethos/tenants/mobile_services/nova/shared/ims/clients/novatesttoken/stage/secret)

if [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Failed to fetch CLIENT_SECRET"
    exit 1
fi

echo "✅ CLIENT_SECRET fetched (${#CLIENT_SECRET} characters)"

echo "Fetching IMS_PASSWORD..."
export IMS_PASSWORD=$(vault read -field value secret/ethos/tenants/mobile_services/nova/shared/ims/users/ctobin+ims/stage/password)

if [ -z "$IMS_PASSWORD" ]; then
    echo "❌ Failed to fetch IMS_PASSWORD"
    exit 1
fi

echo "✅ IMS_PASSWORD fetched (${#IMS_PASSWORD} characters)"
echo ""

# Step 3: Set Environment Variables
echo "⚙️  Step 3: Setting Environment Variables"
echo "----------------------------------------"
export ENV_NAME="qa"
export IMS_USER_EMAIL="ctobin+ims@adobe.com"
export IMS_USER_ID="5D0335065EA3BE0E0A494017@297a06ca5e976e8d0a494204"
export IMS_ORG="056F3DD059CB22060A494021@AdobeOrg"

echo "ENV_NAME: $ENV_NAME"
echo "IMS_USER_EMAIL: $IMS_USER_EMAIL"
echo "IMS_USER_ID: $IMS_USER_ID"
echo "IMS_ORG: $IMS_ORG"
echo ""

# Step 4: Verify Setup
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Configuration Summary:"
echo "   Environment: $ENV_NAME"
echo "   Server: https://graffias-qa.adobe.io/graffias/graphql"
echo "   Organization: $IMS_ORG"
echo "   User: $IMS_USER_EMAIL"
echo ""
echo "🎯 Available Commands:"
echo ""
echo "1. List all plugins in QA:"
echo "   node list-plugins.js qa"
echo ""
echo "2. Delete a plugin (dry-run):"
echo "   node bin/delete.plugin.js --namespace=<plugin-namespace> --environment=qa --dry-run"
echo ""
echo "3. Delete a plugin (actual):"
echo "   node bin/delete.plugin.js --namespace=<plugin-namespace> --environment=qa"
echo ""
echo "4. Run full automated test:"
echo "   ./test-stage.sh"
echo ""
echo "📝 Example - Delete aep-live-activities-plugin:"
echo "   node bin/delete.plugin.js --namespace=aep-live-activities-plugin --environment=qa --dry-run"
echo "   node bin/delete.plugin.js --namespace=aep-live-activities-plugin --environment=qa"
echo ""
echo "⏰ Note: Vault token expires in 1 hour. Re-run this script if needed."
echo ""

