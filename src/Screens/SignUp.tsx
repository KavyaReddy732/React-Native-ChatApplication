import React from 'react';
import {FC, useState} from 'react';
import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import Input from '../Components/Input';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../Navigation/AuthStack';
import firebase from '../utils/Firebase';
import {Button} from '../Components/Button';
import firestore from '@react-native-firebase/firestore';
import useAuthStore from '../utils/AuthStore';

type authScreenProp = StackNavigationProp<AuthStackParamList, 'signup'>;

const SignUp: FC = props => {
  const navigation = useNavigation<authScreenProp>();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const {auth} = firebase();
  const {isAuth, setIsAuth} = useAuthStore();

  const signup = async () => {
    if (name && email && password) {
      try {
        const {user} = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        setIsAuth(true);
        if (user) {
          await firestore()
            .collection('users')
            .doc(user.uid)
            .set({name, email, password});
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    } else {
      Alert.alert(`Error`, `Missing Fields`);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Sign Up Screen</Text>
      <Input placeholder="Name" onChangeText={text => setName(text)} />
      <Input placeholder="Email" onChangeText={text => setEmail(text)} />
      <Input
        placeholder="Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      <Button title="Sign Up" onPress={signup} />
      <View style={{flexDirection: 'row', marginVertical: 20}}>
        <Text style={{marginHorizontal: 5}}>Already Have an Account?</Text>
        <Pressable
          onPress={() => navigation.navigate('login')}
          style={{marginHorizontal: 5}}>
          <Text style={{color: 'rgba(81,135,200,1)'}}>Login Here</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
