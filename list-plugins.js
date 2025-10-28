#!/usr/bin/env node

/*
List all plugins in an environment
Usage: node list-plugins.js [environment]
*/

const fetch = require('node-fetch');
const fetchAccessToken = require('./bin/fetch.access.token');
const { ENVIRONMENTS } = require('./bin/constants');

const { ENV_NAME, IMS_ORG } = process.env;

/* eslint-disable no-console */

(async () => {
  if (!IMS_ORG) {
    throw new Error('You need to set IMS_ORG in your environment');
  }

  const env = process.argv[2] || ENV_NAME || 'qa';
  const { GRAFFIAS_SERVER } = ENVIRONMENTS[env];

  console.log(`📋 Listing all plugins in ${env.toUpperCase()} environment`);
  console.log(`   Server: ${GRAFFIAS_SERVER}`);
  console.log('');

  console.log('🔐 Authenticating...');
  const tokenResponseJson = await fetchAccessToken(env);
  console.log('✅ Authentication successful');
  console.log('');

  const QUERY = `
    query {
      plugins {
        uuid
        namespace
        version
        displayName
        type
        updatedTs
      }
    }
  `;

  const response = await fetch(GRAFFIAS_SERVER, {
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
      query: QUERY
    })
  });

  const result = await response.json();

  if (result.errors) {
    console.error('❌ GraphQL Errors:');
    result.errors.forEach((error) => {
      console.error(`   - ${error.message}`);
    });
    throw new Error('Query failed');
  }

  const plugins = result.data?.plugins || [];

  if (plugins.length === 0) {
    console.log('📭 No plugins found in this environment');
    return;
  }

  console.log(`📦 Found ${plugins.length} plugin(s):\n`);

  // Sort by namespace
  plugins.sort((a, b) => a.namespace.localeCompare(b.namespace));

  plugins.forEach((plugin, index) => {
    const updatedDate = new Date(plugin.updatedTs).toISOString();
    console.log(`${index + 1}. ${plugin.displayName || plugin.namespace}`);
    console.log(`   Namespace: ${plugin.namespace}`);
    console.log(`   UUID: ${plugin.uuid}`);
    console.log(`   Version: ${plugin.version}`);
    console.log(`   Type: ${plugin.type}`);
    console.log(`   Last Updated: ${updatedDate}`);
    console.log('');
  });

  console.log('💡 To delete a plugin, run:');
  console.log(
    `   node bin/delete.plugin.js --namespace=<namespace> --environment=${env}`
  );
})().catch((error) => {
  console.error('');
  console.error('❌ Error:', error.message);
  console.error('');
  process.exit(1);
});
