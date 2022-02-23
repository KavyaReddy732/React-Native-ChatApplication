import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Screens/Login';
import SignUp from '../Screens/SignUp';
import Home from '../Screens/Home';
const {Navigator, Screen} = createNativeStackNavigator();

export type AuthStackParamList = {
  signup: undefined;
  login: undefined;
};

const AuthStack: FC = () => {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="login" component={Login} />
      <Screen name="signup" component={SignUp} />
    </Navigator>
  );
};

export default AuthStack;
