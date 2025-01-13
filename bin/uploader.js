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

const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const semver = require('semver');

const { ENV_NAME, IMS_ORG } = process.env;

const args = process.argv.slice(2);

const { ENVIRONMENTS } = require('./constants');
const fetchAccessToken = require('./fetch.access.token');
const fetchPlugin = require('./fetch.plugin');
const readPluginJsonFromPackage = require('./read.plugin.json.from.package');

const CREATE_QUERY = `
  mutation createPlugin($file: Upload!) {
    createPlugin(file: $file) {
      uuid
    }
  }
`;

const UPDATE_QUERY = `
  mutation updatePlugin($uuid: UUID!, $file: Upload!) {
    updatePlugin(uuid: $uuid, file: $file) {
      uuid
    }
  }
`;

/* eslint-disable no-console */

(async () => {
  if (!IMS_ORG) {
    throw new Error('You need to set IMS_ORG in your environment');
  }

  const environmentIndex = args.find(arg => arg.startsWith('--environment='));
  const env = environmentIndex ? environmentIndex.split('=')[1] : ENV_NAME || 'prod';
  console.log('env', env);
  const { GRAFFIAS_SERVER } = ENVIRONMENTS[env];

  const zipFile = args[args.length - 1];
  if (!zipFile) {
    throw new Error('You must provide the zip plugin package as an argument.');
  }
  const zipPath = path.resolve(zipFile);
  if (!/.*\.zip$/.test(zipFile) || !fs.existsSync(zipPath)) {
    throw new Error(`No zip file found at ${zipPath}`);
  }

  const descriptor = await readPluginJsonFromPackage(zipPath);

  const { namespace, version } = descriptor;

  const tokenResponseJson = await fetchAccessToken(env);

  const foundPlugin = await fetchPlugin(namespace, env);
  console.log(foundPlugin);

  if (foundPlugin) {
    if (semver.lt(version, foundPlugin.version)) {
      throw new Error(`Plugin version: ${version} cannot be lower than version: ${foundPlugin.version} on the server`);
    }
    console.log(`Found an existing plugin with the namesapce: ${namespace}. The plugin will be updated.`);
  }

  const field = foundPlugin ? 'updatePlugin' : 'createPlugin';
  const query = foundPlugin ? UPDATE_QUERY : CREATE_QUERY;
  const variables = foundPlugin ? { uuid: foundPlugin.uuid, file: null } : { file: null };

  const file = await fs.createReadStream(zipPath);

  const formData = new FormData();
  formData.append('operations', JSON.stringify({ query, variables }));
  formData.append('map', JSON.stringify({ 0: ['variables.file'] }));
  formData.append('0', file);

  const uploadPluginResponse = await fetch(GRAFFIAS_SERVER, {
    method: 'POST',
    headers: {
      'x-gw-ims-org-id': IMS_ORG,
      'x-gw-ims-user-id': tokenResponseJson.userId,
      'x-api-key': 'NovaTestToken',
      Authorization: `Bearer ${tokenResponseJson.access_token}`,
      ...formData.getHeaders()
    },
    body: formData
  });

  const uploadedPlugin = await uploadPluginResponse.json();
  const uuid = uploadedPlugin.data?.[field]?.uuid || null;

  if (uuid) {
    console.log(`Uploaded plugin uuid: ${uuid}`);
  } else {
    throw new Error(`There was a problem uploading the plugin: ${JSON.stringify(uploadedPlugin)}`);
  }
})().catch((error) => {
  console.log(error);
  process.exit(1);
});
