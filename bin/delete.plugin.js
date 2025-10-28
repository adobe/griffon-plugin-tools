#!/usr/bin/env node

/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const fetch = require('node-fetch');

const { ENV_NAME, IMS_ORG } = process.env;

const args = process.argv.slice(2);

const { ENVIRONMENTS } = require('./constants');
const fetchAccessToken = require('./fetch.access.token');
const fetchPlugin = require('./fetch.plugin');

const DELETE_QUERY = `
  mutation deletePlugin($uuid: UUID!) {
    deletePlugin(uuid: $uuid)
  }
`;

/* eslint-disable no-console */

(async () => {
  if (!IMS_ORG) {
    throw new Error('You need to set IMS_ORG in your environment');
  }

  const environmentIndex = args.find(arg => arg.startsWith('--environment='));
  const env = environmentIndex
    ? environmentIndex.split('=')[1]
    : ENV_NAME || 'prod';
  const { GRAFFIAS_SERVER } = ENVIRONMENTS[env];

  // Support deletion by namespace OR uuid
  const namespaceArg = args.find(arg => arg.startsWith('--namespace='));
  const uuidArg = args.find(arg => arg.startsWith('--uuid='));
  const dryRunArg = args.find(arg => arg === '--dry-run');

  let uuid;
  let namespace;
  let pluginInfo;

  console.log('🔍 Delete Plugin Tool');
  console.log(`   Environment: ${env}`);
  console.log(`   Server: ${GRAFFIAS_SERVER}`);
  console.log('');

  if (uuidArg) {
    [, uuid] = uuidArg.split('=');
    console.log(`🎯 Target: UUID ${uuid}`);
  } else if (namespaceArg) {
    [, namespace] = namespaceArg.split('=');
    console.log(`🎯 Target: Namespace ${namespace}`);
    console.log('🔍 Looking up plugin...');

    const foundPlugin = await fetchPlugin(namespace, env);
    if (!foundPlugin) {
      throw new Error(`❌ Plugin not found with namespace: ${namespace}`);
    }

    ({ uuid } = foundPlugin);
    pluginInfo = foundPlugin;
    console.log('✅ Found plugin:');
    console.log(`   UUID: ${uuid}`);
    console.log(`   Version: ${foundPlugin.version}`);
    console.log(`   Namespace: ${foundPlugin.namespace}`);
  } else {
    throw new Error(
      'You must provide either --namespace=<name> or --uuid=<uuid>'
    );
  }

  console.log('');

  if (dryRunArg) {
    console.log('🧪 DRY RUN MODE - No actual deletion will occur');
    console.log('✅ Would delete plugin:');
    console.log(`   UUID: ${uuid}`);
    if (namespace) console.log(`   Namespace: ${namespace}`);
    if (pluginInfo) {
      console.log(`   Version: ${pluginInfo.version}`);
    }
    console.log('');
    console.log('💡 Remove --dry-run flag to perform actual deletion');
    process.exit(0);
  }

  // Confirmation for production
  if (env === 'prod' || env === 'stage') {
    console.log(
      '⚠️  WARNING: You are about to delete a plugin in PRODUCTION/STAGE'
    );
    console.log('   This action is IRREVERSIBLE!');
    console.log('');
    console.log('   Plugin to delete:');
    console.log(`   - UUID: ${uuid}`);
    if (namespace) console.log(`   - Namespace: ${namespace}`);
    console.log('');

    // In a real CLI, you'd use readline for confirmation
    // For now, require explicit --force flag for prod/stage
    const forceArg = args.find(arg => arg === '--force');
    if (!forceArg) {
      throw new Error(
        'Production/Stage deletion requires --force flag. Add --force to confirm.'
      );
    }
    console.log('🚨 --force flag detected. Proceeding with deletion...');
  }

  console.log('🔐 Authenticating...');
  const tokenResponseJson = await fetchAccessToken(env);
  console.log('✅ Authentication successful');
  console.log('');

  console.log('🗑️  Deleting plugin...');
  const deletePluginResponse = await fetch(GRAFFIAS_SERVER, {
    method: 'POST',
    headers: {
      'x-gw-ims-org-id': IMS_ORG,
      'x-gw-ims-user-id': tokenResponseJson.userId,
      'x-api-key': 'NovaTestToken',
      Authorization: `Bearer ${tokenResponseJson.access_token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      query: DELETE_QUERY,
      variables: { uuid }
    })
  });

  const deletedPlugin = await deletePluginResponse.json();

  if (deletedPlugin.errors) {
    console.error('❌ GraphQL Errors:');
    deletedPlugin.errors.forEach((error) => {
      console.error(`   - ${error.message}`);
    });
    throw new Error('Delete operation failed');
  }

  const success = deletedPlugin.data?.deletePlugin || false;

  if (success) {
    console.log('✅ Successfully deleted plugin!');
    console.log(`   UUID: ${uuid}`);
    if (namespace) {
      console.log(`   Namespace: ${namespace}`);
    }
    console.log('');
    console.log(
      '📝 Note: Plugin data and Azure blob storage have been permanently removed.'
    );
  } else {
    throw new Error(
      `Delete operation returned false. Response: ${JSON.stringify(
        deletedPlugin
      )}`
    );
  }
})().catch((error) => {
  console.error('');
  console.error('❌ Error:', error.message);
  console.error('');
  process.exit(1);
});
