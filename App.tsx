import React, {FC, useEffect} from 'react';
import './src/utils/Firebase';
import MainNavigation from './src/Navigation/MainNavigation';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LogBox} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
LogBox.ignoreLogs(['EventEmitter.removeListener']);

export type hide = (config?: {fade?: boolean}) => Promise<void>;

const App: FC<hide> = () => {
  useEffect(() => {
    RNBootSplash.hide({fade: true});
    GoogleSignin.configure({
      webClientId:
        '175882279475-vk7bnn02e4dsia0u974gsjejk8vf2cjn.apps.googleusercontent.com',
    });
  }, []);
  return <MainNavigation />;
};

export default App;
