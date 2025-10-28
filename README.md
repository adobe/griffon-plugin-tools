# Project Griffon Plugin Tools

Tools for packaging and uploading Project Griffon plugins, with additional utilities for plugin management.

## Usage

### Packaging

Run the packager by executing the following command from the command line within your project's directory:

```bash
npx @adobe/griffon-packager
```

### Uploading

Run the uploader by executing the following command and passing in the package zip created above as an argument:

```bash
npx @adobe/griffon-uploader plugin-XXXXX.zip
```

#### Configuration

In order to upload, you need to have an IMS account and set the following environment variables:

IMS User Email `export IMS_USER_EMAIL=XXXXX`

IMS User ID `export IMS_USER_ID=XXXXX`  
_for Type2E accounts_

IMS Password `export IMS_PASSWORD=XXXXX`

Client Secret `export CLIENT_SECRET=XXXXX`

IMS Organization ID `export IMS_ORG=XXXXX`

_for Adobe internal use only_

ENV_NAME `export ENV_NAME=prod`

---

## Additional Tools

This repository includes additional tools for plugin management:

### Delete Plugin

Delete a plugin from any environment by namespace or UUID.

```bash
# Delete by namespace (recommended)
node bin/delete.plugin.js --namespace=<plugin-namespace> --environment=<env>

# Delete by UUID
node bin/delete.plugin.js --uuid=<plugin-uuid> --environment=<env>

# Dry run (preview without deleting)
node bin/delete.plugin.js --namespace=<plugin-namespace> --environment=<env> --dry-run

# Stage/Production require --force flag
node bin/delete.plugin.js --namespace=<plugin-namespace> --environment=stage --force
```

**Environments:** `dev`, `qa`, `stage`, `prod`

**⚠️ Warning:** Deletion is permanent and irreversible. The plugin record and all associated files in Azure Blob Storage will be permanently removed.

### List Plugins

View all plugins in an environment:

```bash
node list-plugins.js <environment>
```

Example:
```bash
node list-plugins.js qa
```

### Setup Script

For quick environment setup with Vault authentication:

```bash
./setup-qa.sh
```

This script handles:
- Vault OIDC authentication
- Fetching CLIENT_SECRET and IMS_PASSWORD from Vault
- Setting all required environment variables

---

## Plugin UUID Behavior

**Important:** Each plugin has a single UUID that persists across all version updates. When you upload a new version of a plugin:

- The same UUID is reused
- Only the current version is stored (no version history)
- The plugin container in Azure is replaced
- Old versions are not retained

Therefore, deleting a plugin removes the entire plugin regardless of how many versions have been uploaded.

---

## GraphQL API

These tools interact with the Graffias GraphQL API:

### Queries
- `plugins(namespace, uuid, ...)` - Query plugins with filters

### Mutations
- `createPlugin(file)` - Upload a new plugin
- `updatePlugin(uuid, file)` - Update an existing plugin
- `deletePlugin(uuid)` - Delete a plugin (returns Boolean)

**Note:** The `deletePlugin` mutation is intended for internal integration testing only. Use with caution.

---

## Environment Configuration

| Environment | Server | IMS Host |
|------------|--------|----------|
| dev | graffias-dev.adobe.io | ims-na1-stg1.adobelogin.com |
| qa | graffias-qa.adobe.io | ims-na1-stg1.adobelogin.com |
| stage | graffias-preprod.adobe.io | ims-na1.adobelogin.com |
| prod | graffias.adobe.io | ims-na1.adobelogin.com |

---

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE.md) for more information.
