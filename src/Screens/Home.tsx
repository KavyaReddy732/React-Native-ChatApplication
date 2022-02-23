import React, {FC, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '../Navigation/AppStack';
import firebase from '../store/Firebase';
import firestore from '@react-native-firebase/firestore';
import {Button} from '../Components/Button';
import useAuthStore from '../store/AuthStore';

type homeScreenProp = StackNavigationProp<HomeStackParamList, 'home'>;

export type Props = {
  email: string;
  name: string;
  id?: number;
};

const {width} = Dimensions.get('screen');

const Home: FC<Props> = ({email, name, id}) => {
  const navigation = useNavigation<homeScreenProp>();
  const {auth} = firebase();
  // const [userData, setUserData] = useState<Provider[]>([]);
  const [userData, setUserData] = useState({email, name, id});
  const [allUsers, setAllUsers] = useState<any>();
  const {setIsAuth} = useAuthStore();

  console.log(allUsers);

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        setIsAuth(false);
      });
  };

  const fetchCurrentUser = async () => {
    const uid = auth().currentUser?.uid;
    const user: {data(): any; id: string} = await firestore()
      .collection('users')
      .doc(uid)
      .get();
    setUserData({id: user.id, ...user.data()});
  };

  const data: any = [];
  const allUser = async () => {
    await firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          data.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setAllUsers(data);
      });
  };

  useEffect(() => {
    fetchCurrentUser();
    allUser();
  }, []);

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <View style={styles.container}>
        <FlatList
          data={allUsers}
          renderItem={({item}: ListRenderItemInfo<Props>) => (
            <Pressable style={styles.card}>
              <View style={styles.UserInfo}>
                <View style={styles.TextSection}>
                  <Text style={styles.UserName}>{item.name}</Text>
                  <Text style={styles.UserName}>{item.email}</Text>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item: Props) => item.id}
        />
        {/* <Text>Home</Text>
      <Text>{userData.email}</Text>
      <Text>{userData.id}</Text>
      <Button title="Sign Out" onPress={signOut} /> */}
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  card: {
    width: width,
  },
  UserInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  UserImgWrapper: {
    paddingVertical: 30,
  },
  UserImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  TextSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  UserInfoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  UserName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  PostTime: {
    fontSize: 12,
    color: '#666',
  },
  MessageText: {
    fontSize: 14,
    color: '#333333',
  },
});
