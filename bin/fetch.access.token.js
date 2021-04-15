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

/* eslint-disable no-console */

const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

module.exports = async ({
  CLIENT_SECRET,
  IMS_HOST,
  IMS_PASSWORD,
  IMS_USER_EMAIL,
  IMS_USER_ID
}) => {
  if (!IMS_USER_EMAIL) {
    throw new Error('You need to set IMS_USER_EMAIL in your environment');
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
  tokenParams.append('username', IMS_USER_EMAIL);
  tokenParams.append('password', IMS_PASSWORD);
  tokenParams.append('scope', 'openid,AdobeID,session,read_organizations,additional_info.projectedProductContext,additional_info.job_function,additional_info.user_image_url');

  console.log('Getting Type 1 Access Token');
  const tokenResponse = await fetch(`${IMS_HOST}/ims/token/v1`, {
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    body: tokenParams
  });

  const json = await tokenResponse.json();

  if (json.error) {
    throw new Error(`There was a problem requesting an access token: ${json.error_description}`);
  }

  let accessToken = json.access_token;
  let userId = IMS_USER_EMAIL;

  if (IMS_USER_ID) {
    const token2Params = new URLSearchParams();
    token2Params.append('client_id', 'NovaTestToken');
    token2Params.append('client_secret', CLIENT_SECRET);
    token2Params.append('grant_type', 'cluster_at_exchange');
    token2Params.append('user_id', IMS_USER_ID);
    token2Params.append('user_token', accessToken);
    token2Params.append('scope', 'openid,AdobeID,create_session,read_organizations,additional_info.projectedProductContext,additional_info.job_function,additional_info.user_image_url');

    console.log('Exchanging Type 1 User token for T2E');
    const token2Response = await fetch(`${IMS_HOST}/ims/token/v2`, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: token2Params
    });

    const json2 = await token2Response.json();

    if (json2.error) {
      throw new Error(`There was a problem requesting an access token: ${json2.error_description}`);
    }

    accessToken = json2.access_token;
    userId = IMS_USER_ID;
  }

  return { access_token: accessToken, userId };
};
