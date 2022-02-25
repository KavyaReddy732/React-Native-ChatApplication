import React from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Firebase from './Firebase';

export const onGoogleButtonPress = async () => {
  const {auth} = Firebase();
  try {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log(googleCredential);
    const token = auth().signInWithCredential(googleCredential);
    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};
