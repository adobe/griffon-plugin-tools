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

const { IMS_ORG } = process.env;

const { ENVIRONMENTS } = require('./constants');
const fetchAccessToken = require('./fetch.access.token');

/* eslint-disable no-console */

module.exports = async (namespace, env = 'prod') => {
  if (!IMS_ORG) {
    throw new Error('You need to set IMS_ORG in your environment');
  }

  const { GRAFFIAS_SERVER } = ENVIRONMENTS[env];

  const tokenResponseJson = await fetchAccessToken(env);

  const queryPluginsResponse = await fetch(GRAFFIAS_SERVER, {
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
      query: `
        query queryPlugins($namespace: String){
          plugins (namespace:$namespace){
            uuid
            namespace
            version
          }
        }`,
      variables: { namespace }
    })
  });

  const plugins = await queryPluginsResponse.json();

  if (!plugins?.data?.plugins) {
    throw new Error('There was a problem fetching plugins from the server.');
  }

  const foundPlugin = plugins.data.plugins.find(plugin => plugin.namespace === namespace);
  return foundPlugin;
};
