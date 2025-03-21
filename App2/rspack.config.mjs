import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as Repack from '@callstack/repack';
import pkj from './package.json' with { type: 'json' };
import { ExpoModulesPlugin } from "@callstack/repack-plugin-expo-modules";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default {
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
        App1: 'App1@http://127.0.0.1:9002/android/app1.container.js.bundle',
      },
      shared: Object.fromEntries(
        Object.entries(pkj.dependencies).map(([dep, {version}]) => {
          return [
            dep,
            {singleton: true, eager: true, requiredVersion: version},
          ];
        }),
      ),
    }),
  ],
};
