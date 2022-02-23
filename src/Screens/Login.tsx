import React, {FC, useState, useEffect} from 'react';
import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import Input from '../Components/Input';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../Navigation/AuthStack';
import {Button} from '../Components/Button';
import firebase from '../store/Firebase';
import Home from './Home';
import useAuthStore from '../store/AuthStore';
import {onGoogleButtonPress} from '../store/GoogleSignin';
import {onFacebookButtonPress} from '../store/FacebookSignIn';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

type authScreenProp = StackNavigationProp<AuthStackParamList, 'login'>;

const Login: FC = () => {
  const navigation = useNavigation<authScreenProp>();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const {isAuth, setIsAuth} = useAuthStore();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const {auth} = firebase();

  function onAuthStateChanged(userState: any) {
    setUser(userState);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  const login = async () => {
    if (email && password) {
      try {
        const loginUser = await auth().signInWithEmailAndPassword(
          email,
          password,
        );
        setIsAuth(true);
      } catch (error) {
        Alert.alert('login error', error.message);
      }
    } else {
      Alert.alert(`Missing Fields`);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Login Screen</Text>
      <Input placeholder="Email" onChangeText={text => setEmail(text)} />
      <Input
        placeholder="Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      <Button title="login" onPress={login} />
      <View style={{flexDirection: 'row', marginVertical: 20}}>
        <Text style={{marginHorizontal: 5}}>Don't Have an Account?</Text>
        <Pressable
          onPress={() => navigation.navigate('signup')}
          style={{marginHorizontal: 5}}>
          <Text style={{color: 'rgba(81,135,200,1)'}}>Sign Up Here</Text>
        </Pressable>
      </View>
      <Button
        title="Sign-In with Google"
        onPress={() =>
          onGoogleButtonPress().then(() => {
            if ('Cancel') {
              // user cancelled the login flow
              Alert.alert('The user canceled the sign in request.');
            } else if ('Signin in progress') {
              Alert.alert('Signin in progress');
              // operation (f.e. sign in) is in progress already
            } else if ('PLAY_SERVICES_NOT_AVAILABLE') {
              Alert.alert('PLAY_SERVICES_NOT_AVAILABLE');
              // play services not available or outdated
            } else {
              setIsAuth(true);
              console.log('Signed in with Google!');
            }
          })
        }
      />

      <Button
        title="Sign-In with Facebook"
        onPress={() =>
          onFacebookButtonPress().then(() => {
            if ('User cancelled the login process') {
              Alert.alert('User cancelled the login process');
            } else if ('Something went wrong obtaining access token') {
              Alert.alert('Something went wrong try again');
            } else {
              setIsAuth(true);
              console.log('Signed in with Facebook!');
            }
          })
        }
      />
    </View>
  );
};

export default Login;
