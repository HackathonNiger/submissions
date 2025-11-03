// index.js (root of project)
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { backgroundMessageHandler } from './src/Services/Notification';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  await backgroundMessageHandler(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
