import { ExpoModulesPlugin } from '@callstack/repack-plugin-expo-modules';
import * as Repack from '@callstack/repack';
import pkj from './package.json' with { type: 'json' };


export default {
  mode:  'development',
  entry: './index.js',
  devServer: {
    hot: true,
    port: 8082,
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  plugins: [
     new Repack.RepackPlugin({
      platform: 'web',
      output: {
        publicPath: '/',
      },
    }),
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
