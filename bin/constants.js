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

module.exports = {
  DESCRIPTOR_NAME: 'plugin.json',
  ENVIRONMENTS: {
    // for Adobe internal use only
    dev: {
      GRAFFIAS_SERVER: 'https://graffias-dev.adobe.io/graffias/graphql',
      IMS_HOST: 'https://ims-na1-stg1.adobelogin.com'
    },
    // for Adobe internal use only
    qa: {
      GRAFFIAS_SERVER: 'https://graffias-qa.adobe.io/graffias/graphql',
      IMS_HOST: 'https://ims-na1-stg1.adobelogin.com'
    },
    // for Adobe internal use only
    stage: {
      GRAFFIAS_SERVER: 'https://graffias-preprod.adobe.io/graffias/graphql',
      IMS_HOST: 'https://ims-na1.adobelogin.com'
    },
    prod: {
      GRAFFIAS_SERVER: 'https://graffias.adobe.io/graffias/graphql',
      IMS_HOST: 'https://ims-na1.adobelogin.com'
    }
  }
};
