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
