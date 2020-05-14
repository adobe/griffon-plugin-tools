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
const { URLSearchParams } = require('url');

module.exports = async ({
  CLIENT_SECRET,
  IMS_HOST,
  IMS_PASSWORD,
  IMS_USERNAME
}) => {
  if (!IMS_USERNAME) {
    throw new Error('You need to set IMS_USERNAME in your environment');
  }

  if (!IMS_PASSWORD) {
    throw new Error('You need to set IMS_PASSWORD in your environment');
  }

  if (!CLIENT_SECRET) {
    throw new Error('You need to set CLIENT_SECRET in your environment');
  }

  const tokenParams = new URLSearchParams();
  tokenParams.append('client_id', 'NovaTestToken');
  tokenParams.append('client_secret', CLIENT_SECRET);
  tokenParams.append('grant_type', 'password');
  tokenParams.append('username', IMS_USERNAME);
  tokenParams.append('password', IMS_PASSWORD);
  tokenParams.append('scope', 'openid,AdobeID,session,read_organizations,additional_info.projectedProductContext,additional_info.job_function,additional_info.user_image_url');

  const tokenResponse = await fetch(`${IMS_HOST}/ims/token/v1`, {
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: tokenParams
  });

  const json = await tokenResponse.json();

  if (json.error) {
    throw new Error(`There was a problem requesting an access token: ${json.error_description}`);
  }

  return json;
};
