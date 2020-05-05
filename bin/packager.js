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

const archiver = require('archiver');
const fs = require('fs');
const semver = require('semver');

const { DESCRIPTOR_NAME } = require('./constants');

(() => {
  let descriptor;
  try {
    descriptor = fs.readFileSync(DESCRIPTOR_NAME, 'utf8');
    descriptor = JSON.parse(descriptor);
  } catch (err) {
    throw new Error('Couldn\'t read plugin.json descriptor file');
  }

  const { displayName, namespace, src, version } = descriptor;

  if (!displayName) {
    throw new Error('You need to provide a displayName in plugin.json');
  }
  if (!namespace) {
    throw new Error('You need to provide a unique namespace in plugin.json');
  }
  if (!src) {
    throw new Error('You need to provide a src in plugin.json');
  }
  if (!version) {
    throw new Error('You need to provide a version in plugin.json');
  }
  if (!semver.valid(version)) {
    throw new Error(`The plugin version provided is not a valid semantic version: ${version}`);
  }

  const output = fs.createWriteStream(
    `plugin-${namespace}.zip`
  );
  const zipArchive = archiver('zip');

  zipArchive.pipe(output);

  zipArchive.glob('*.js');
  zipArchive.file('plugin.json');

  zipArchive.finalize();
})();
