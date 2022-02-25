import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Screens/Home';
import ChatScreen from '../Screens/ChatScreen';
const {Navigator, Screen} = createNativeStackNavigator();

export type HomeStackParamList = {
  home: undefined;
  chat: {userId: string | number};
};

const AppStack: FC = () => {
  return (
    <Navigator>
      <Screen name="home" component={Home} />
      <Screen name="chat" component={ChatScreen} />
    </Navigator>
  );
};

export default AppStack;
