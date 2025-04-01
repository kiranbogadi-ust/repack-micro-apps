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
    const response = await fetch('http://192.168.0.102:3000/config'); // Replace with your API URL
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
        App1: `promise new Promise(resolve => {
          fetch('http://192.168.0.102:3000/config')
            .then(res => res.json())
            .then(data => {
              const { remoteName, url } = data;
              console.log(data);
        
              if (!remoteName || !url) {
                throw new Error('Invalid remote config');
              }
        
              fetch(url)
                .then(response => response.text())
                .then(code => {
                    const script = new Function(code); // Equivalent to eval but safer in React Native
                    script(); // Execute the script
                    setTimeout(() =>{
                      resolve(globalThis[data.remoteName]); // Ensure this is executed only when remote exists
                    }, 1000)
                    
                })
                .catch(error => console.error('Error loading remote:', error));
            })
            .catch(error => console.error('Error fetching config:', error));
        })`,
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
