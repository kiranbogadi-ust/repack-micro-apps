import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as Repack from '@callstack/repack';
import {ExpoModulesPlugin} from '@callstack/repack-plugin-expo-modules';
import fetch from 'node-fetch';

import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getRemoteConfig() {
  try {
    const response = await fetch('http://127.0.0.1:3000/config'); // Replace with your API URL
    const data = await response.json();

    return data || {};
  } catch (error) {
    console.error('Failed to fetch remote config:', error);
    return {};
  }
}

export default getRemoteConfig().then(remoteModules => ({
  context: __dirname,
  entry: './index.js',
  resolve: {
    ...Repack.getResolveOptions(),
  },
  module: {
    rules: [
      ...Repack.getJsTransformRules(),
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [
    new Repack.RepackPlugin(),
    new ExpoModulesPlugin(),
    new Repack.plugins.ModuleFederationPluginV2({
      name: 'App2',
      filename: 'app2.container.js.bundle',
      dts: false,
      remotes: {
        App1: remoteModules.url,
      }, // Dynamically loaded remotes
      shared: Object.fromEntries(
        Object.entries(pkg.dependencies).map(([dep, {version}]) => {
          return [
            dep,
            {singleton: true, eager: true, requiredVersion: version},
          ];
        }),
      ),
    }),
  ],
}));
