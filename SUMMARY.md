# Plugin Deletion Tool - Quick Summary

## What We Built

Extended `@adobe/griffon-plugin-tools` with **delete functionality** for Griffon plugins across all environments.

## New Tools Added

1. **`bin/delete.plugin.js`** - CLI tool to delete plugins by namespace or UUID
2. **`list-plugins.js`** - List all plugins in any environment
3. **`setup-dev.sh`** - Automated environment setup for Dev
4. **`setup-qa.sh`** - Automated environment setup for QA
5. **`setup-stage.sh`** - Automated environment setup for Stage
6. **`setup-prod.sh`** - Automated environment setup for Production
7. **`TEST.sh`** - Automated test suite for all functionality (local only)

## Key Features

- ✅ Delete by namespace or UUID
- ✅ Dry-run mode for safety
- ✅ Force flag for production/stage
- ✅ Full authentication (IMS Type 1 → Type 2E)
- ✅ Works across all environments (dev, qa, stage, prod)

## Usage

### Quick Start - Setup Environment

Choose your target environment and run the corresponding setup script:

```bash
# Dev Environment
source setup-dev.sh

# QA Environment
source setup-qa.sh

# Stage Environment
source setup-stage.sh

# Production Environment (USE WITH CAUTION!)
source setup-prod.sh
```

These scripts will:
- Authenticate with Vault (OIDC)
- Fetch required secrets (CLIENT_SECRET, IMS_PASSWORD)
- Set environment variables (ENV_NAME, IMS_USER_EMAIL, IMS_USER_ID, IMS_ORG)

### List Plugins
```bash
node list-plugins.js <environment>

# Examples:
node list-plugins.js dev
node list-plugins.js qa
node list-plugins.js stage
node list-plugins.js prod
```

### Delete Plugin (Standard Environments)
```bash
# Always dry-run first!
node bin/delete.plugin.js --namespace=plugin-name --environment=dev --dry-run

# Delete for real
node bin/delete.plugin.js --namespace=plugin-name --environment=dev
```

### Delete Plugin (Production/Stage)
```bash
# REQUIRES --force flag
node bin/delete.plugin.js --namespace=plugin-name --environment=prod --dry-run --force
node bin/delete.plugin.js --namespace=plugin-name --environment=prod --force
```

## What We Tested

Successfully deleted `aep-live-activities-plugin` from:
- ✅ **QA** (UUID: `09b1eea1...`)
- ✅ **Stage** (UUID: `aa74fa43...`)
- ✅ **Production** (UUID: `3dcc2ebd...`)

## Important Notes

1. **Each environment has separate plugin databases** - same plugin = different UUIDs
2. **Deletion is permanent** - removes plugin metadata + Azure blob storage
3. **Use `--dry-run` first** - always preview before deleting
4. **Production requires `--force`** - extra safety for prod/stage

## Architecture

```
griffon-plugin-tools (intermediary)
├── bin/fetch.plugin.js       ← Query plugins
├── bin/delete.plugin.js      ← NEW: Delete plugins
├── bin/uploader.js            ← Create/Update plugins
└── bin/fetch.access.token.js ← IMS authentication
         ↓
    graffias-node (GraphQL backend)
    ├── query: plugins
    ├── mutation: createPlugin
    ├── mutation: updatePlugin
    └── mutation: deletePlugin  ← Already existed!
```

## Documentation

- **`GUIDE.md`** - Detailed local testing guide (not committed)
- **`SESSION_LOG.md`** - Complete session log with all commands/outputs
- **`README.md`** - Updated with new tools

## Files Changed

### New Files (Committed to Branch)
- `bin/delete.plugin.js` - Delete plugin CLI tool
- `list-plugins.js` - List plugins CLI tool
- `setup-dev.sh` - Dev environment setup script
- `setup-qa.sh` - QA environment setup script
- `setup-stage.sh` - Stage environment setup script
- `setup-prod.sh` - Production environment setup script
- `GUIDE.md` - Detailed local testing guide with step-by-step instructions
- `TEST.sh` - Automated test script for validating all functionality
- `SESSION_LOG.md` - Complete session log with all commands/outputs
- `SUMMARY.md` - This summary document

### Modified Files
- `README.md` - Updated with new tools documentation
- `.gitignore` - Cleaned up (no exclusions for reference branch)
- `package.json` - Added new bin entries for delete/list tools

---

**Total Time:** ~45 minutes  
**Lines of Code Added:** ~400  
**Plugins Deleted:** 3 (across 3 environments)  
**Success Rate:** 100%

---

## Reference Branch

**Branch Name:** `reference/plugin-delete-DO-NOT-MERGE`  
**Purpose:** Reference implementation for plugin deletion functionality  
**Status:** ✅ Pushed to remote  
**⚠️ DO NOT MERGE THIS BRANCH** - It's for reference and learning only

**To view this branch:**
```bash
git fetch origin
git checkout reference/plugin-delete-DO-NOT-MERGE
```

