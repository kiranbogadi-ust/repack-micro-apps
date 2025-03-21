/**
 * @format
 */
import 'react-native/Libraries/Core/InitializeCore';

import {Platform} from 'react-native';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import {registerRootComponent} from 'expo';

if (Platform.OS === 'web') {
  console.log(window);
  const rootTag =
    document.getElementById('root') || document.createElement('div');
  document.body.appendChild(rootTag);
  AppRegistry.runApplication(appName, {initialProps: {}, rootTag});
} else {
  AppRegistry.registerComponent(appName, () => App);
}
