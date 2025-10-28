#!/bin/bash

# Quick Test Script - List and Delete Plugins
# Usage: ./TEST.sh

set -e

cd /Users/mashraf/Desktop/adobe-codes/griffon-plugin-tools

echo "================================"
echo "Griffon Plugin Management Test"
echo "================================"
echo ""

# Check if environment is set up
if [ -z "$IMS_ORG" ]; then
    echo "⚠️  Environment not set up. Running setup..."
    echo ""
    ./setup-qa.sh
    echo ""
fi

# Test 1: List plugins
echo "================================"
echo "TEST 1: List All Plugins in QA"
echo "================================"
echo ""
node list-plugins.js qa
echo ""

# Test 2: Create and delete a test plugin
echo "================================"
echo "TEST 2: Create & Delete Test Plugin"
echo "================================"
echo ""

# Create temp directory
TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

# Create simple test plugin
TIMESTAMP=$(date +%s)
NAMESPACE="com.adobe.test.quicktest.$TIMESTAMP"

echo "Creating test plugin: $NAMESPACE"
echo ""

cat > plugin.json << EOF
{
  "namespace": "$NAMESPACE",
  "displayName": "Quick Test Plugin",
  "version": "1.0.0",
  "type": "view",
  "src": "index.html"
}
EOF

cat > index.html << EOF
<!DOCTYPE html>
<html><body><h1>Test Plugin</h1></body></html>
EOF

# Package
npx @adobe/griffon-packager > /dev/null 2>&1
PLUGIN_ZIP=$(ls plugin-*.zip)

# Upload
echo "Uploading plugin..."
UPLOAD_OUT=$(node ../bin/uploader.js "$PLUGIN_ZIP" --environment=qa 2>&1)
echo "$UPLOAD_OUT" | grep -E "(Uploaded|UUID|existing)"
echo ""

# Wait
sleep 2

# Delete with dry-run
echo "Testing dry-run..."
node ../bin/delete.plugin.js --namespace="$NAMESPACE" --environment=qa --dry-run
echo ""

# Delete for real
echo "Deleting plugin..."
node ../bin/delete.plugin.js --namespace="$NAMESPACE" --environment=qa
echo ""

# Cleanup
cd ..
rm -rf "$TEST_DIR"

echo "================================"
echo "✅ ALL TESTS PASSED"
echo "================================"
echo ""
echo "You can now:"
echo "  1. List plugins: node list-plugins.js qa"
echo "  2. Delete plugin: node bin/delete.plugin.js --namespace=PLUGIN-NAME --environment=qa"
echo ""

