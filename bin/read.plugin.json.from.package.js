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

const yauzl = require('yauzl');

const { DESCRIPTOR_NAME } = require('./constants');

module.exports = zipPath =>
  new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (error, zipFile) => {
      if (error) {
        reject(new Error(`Error inspecting zip file for plugin: ${error}`));
      }

      zipFile.readEntry();
      zipFile.on('entry', (entry) => {
        if (entry.fileName === DESCRIPTOR_NAME) {
          zipFile.openReadStream(entry, (err, readStream) => {
            const chunks = [];

            readStream.on('data', chunk => chunks.push(chunk));
            readStream.on('end', () => {
              const descriptor = JSON.parse(Buffer.concat(chunks).toString());
              zipFile.close();
              resolve(descriptor);
            });
          });
        } else {
          zipFile.readEntry();
        }
      });
      zipFile.on('end', () => {
        reject(new Error('Couldn\'t find plugin.json within the plugin zip file.'));
      });
      zipFile.on('error', (zipFileError) => {
        reject(new Error(`Error inspecting zip file for plugin: ${zipFileError}`));
      });
    });
  });
