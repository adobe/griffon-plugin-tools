# Griffon Plugin Management Guide

Simple guide to list and delete plugins across environments.

---

## Setup (One Time)

Run this script - it handles everything:

```bash
cd /Users/mashraf/Desktop/adobe-codes/griffon-plugin-tools
./setup-qa.sh
```

What it does:
1. Logs you into Vault (opens browser)
2. Gets your credentials
3. Sets up environment

**Note:** Token expires after 1 hour. Just run the script again.

---

## List Plugins

See all plugins in an environment:

```bash
# QA environment
node list-plugins.js qa

# Dev environment  
node list-plugins.js dev

# Stage environment
node list-plugins.js stage

# Production
node list-plugins.js prod
```

**Output shows:**
- Plugin name
- Namespace
- UUID
- Current version
- Last updated

---

## Delete a Plugin

### Step 1: Dry Run (Safe Preview)

```bash
node bin/delete.plugin.js \
  --namespace=YOUR-PLUGIN-NAMESPACE \
  --environment=qa \
  --dry-run
```

Shows what will be deleted WITHOUT actually deleting.

### Step 2: Actual Deletion

```bash
node bin/delete.plugin.js \
  --namespace=YOUR-PLUGIN-NAMESPACE \
  --environment=qa
```

**Important:** Deletion is permanent - cannot be undone!

---

## Real Example

From your logs, you have `aep-live-activities-plugin`:

```bash
# 1. Check if it exists
node list-plugins.js qa | grep "aep-live-activities"

# 2. Preview deletion
node bin/delete.plugin.js \
  --namespace=aep-live-activities-plugin \
  --environment=qa \
  --dry-run

# 3. Delete it
node bin/delete.plugin.js \
  --namespace=aep-live-activities-plugin \
  --environment=qa

# 4. Verify it's gone
node list-plugins.js qa | grep "aep-live-activities"
```

---

## Quick Reference

### List all plugins in QA
```bash
node list-plugins.js qa
```

### Delete with dry-run
```bash
node bin/delete.plugin.js --namespace=PLUGIN-NAME --environment=qa --dry-run
```

### Delete for real
```bash
node bin/delete.plugin.js --namespace=PLUGIN-NAME --environment=qa
```

### Delete from stage/prod (needs --force)
```bash
node bin/delete.plugin.js --namespace=PLUGIN-NAME --environment=stage --force
```

---

## Environments

| Name | ENV_NAME | Use For |
|------|----------|---------|
| Dev | `dev` | Development testing |
| QA | `qa` | Testing (called "stage" in upload-dev.yml) |
| Stage | `stage` | Pre-production |
| Prod | `prod` | Production (⚠️ requires --force) |

---

## Troubleshooting

### Token expired error
**Fix:** Run `./setup-qa.sh` again

### Plugin not found
**Fix:** Run `node list-plugins.js qa` to see available plugins

### Missing environment variables
**Fix:** Run `./setup-qa.sh`

---

## Important Notes

- Each plugin has ONE UUID (never changes across versions)
- Deletion removes everything (database + files)
- Cannot be undone
- Always use `--dry-run` first on stage/prod

