// import React, {FC} from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// //import Login from './Screens/LoginScreen';
// import Home from '../Screens/Home';
// import SignUp from '../Screens/SignUp';

// export type RootStackParamList = {
//   Home: undefined;
//   //Login: undefined;
//   SignUp: undefined;
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const Navigation = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={Home} />
//         {/* <Stack.Screen name="Login" component={Login} /> */}
//         <Stack.Screen name="SignUp" component={SignUp} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default Navigation;

// const styles = StyleSheet.create({});

import React, {FC, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import firebase from '../utils/Firebase';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import useAuthStore from '../utils/AuthStore';

const MainNavigation: FC = () => {
  const {isAuth} = useAuthStore();

  return (
    <NavigationContainer>
      {isAuth ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default MainNavigation;
