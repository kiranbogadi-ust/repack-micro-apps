import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const appDirectory = path.resolve(import.meta.dirname);
const {presets, plugins} = require(`${appDirectory}/babel.config.js`);
const {ModuleFederationPlugin} = require('webpack').container;
import fetch from 'node-fetch';

const compileNodeModules = [
  // Add every react-native package that needs compiling
  // 'react-native-gesture-handler',
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/, // Updated to include .jsx
  include: [
    path.resolve(appDirectory, 'index.web.js'), // Entry to your application
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'component'),
    ...compileNodeModules,
  ],
  exclude: [path.join(appDirectory, './rspack.web.mjs')],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets,
      plugins,
    },
  },
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [{loader: '@svgr/webpack'}],
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {name: '[name].[ext]'},
  },
};

const tsLoaderConfiguration = {
  test: /\.(ts)x?$/,
  exclude: [
    /node_modules|\.d\.ts$/,
    path.join(appDirectory, './rspack.web.mjs'),
  ], // this line as well
  use: {
    loader: 'ts-loader',
    options: {
      compilerOptions: {
        noEmit: false, // this option will solve the issue
      },
    },
  },
};

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
  entry: {
    app: path.join(appDirectory, 'index.web.js'),
  },
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: 'rnw.bundle.js',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
      tsLoaderConfiguration,
      {
        test: /\.js$/,
        exclude:
          /node_modules\/(?!(react-native-vector-icons|react-native-paper|react-native)\/)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              {
                plugins: [
                  ['@babel/plugin-transform-class-properties', {loose: true}],
                  ['@babel/plugin-transform-private-methods', {loose: true}],
                  [
                    '@babel/plugin-transform-private-property-in-object',
                    {loose: true},
                  ],
                ],
              },
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({template: path.join(appDirectory, 'index.html')}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({__DEV__: JSON.stringify(true)}),
    new ModuleFederationPlugin({
      name: 'App2',
      filename: 'app2.container.bundle',
      remotes: {
        App1: remoteModules.webUrl,
      },
      shared: Object.fromEntries(
        Object.entries(pkg.dependencies).map(([dep, {version}]) => [
          dep,
          {singleton: true, eager: true, requiredVersion: version},
        ]),
      ),
    }),
  ],
}));
