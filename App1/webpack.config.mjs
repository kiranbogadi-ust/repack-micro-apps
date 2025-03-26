import path from 'path';
import webpack from 'webpack';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const appDirectory = path.resolve(import.meta.dirname);
const {presets, plugins} = require(`${appDirectory}/babel.config.js`);
const {ModuleFederationPlugin} = require('webpack').container;

const compileNodeModules = [
  // Add every react-native package that needs compiling
  // 'react-native-gesture-handler',
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/, // Updated to include .jsx
  include: [
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

export default {
  entry: {
    app: path.join(appDirectory, 'index.js'),
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
    alias: {
      'react-native$': 'react-native-web',
      '@expo/vector-icons': 'react-native-vector-icons',
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
        exclude: /node_modules\/(?!@callstack\/repack)/, // Process Re.Pack files too
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-class-properties', {loose: true}],
              ['@babel/plugin-transform-private-methods', {loose: true}],
              [
                '@babel/plugin-transform-private-property-in-object',
                {loose: true},
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({__DEV__: JSON.stringify(true)}),
    new ModuleFederationPlugin({
      name: 'App1',
      filename: 'app1.container.bundle',
      exposes: {
        './CounterApp': './CounterApp',
        './MemberCard': '/src/components/MemberCard',
      },
      shared: Object.fromEntries(
        Object.entries(pkg.dependencies).map(([dep, {version}]) => [
          dep,
          {singleton: true, eager: true, requiredVersion: version},
        ]),
      ),
    }),
  ],
};
