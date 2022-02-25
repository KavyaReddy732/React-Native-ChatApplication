import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCX7t-sZJHqBR4_UJeg_jHMW1rKXrwjFUA',
  authDomain: 'chattie-mobile-app.firebaseapp.com',
  projectId: 'chattie-mobile-app',
  storageBucket: 'chattie-mobile-app.appspot.com',
  messagingSenderId: '175882279475',
  appId: '1:175882279475:web:9ca9fad1dbb8480b60e146',
  measurementId: 'G-509HFX2QCJ',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); 
}

export default () => {
  return {firebase, auth};
};
export const database = firestore;
