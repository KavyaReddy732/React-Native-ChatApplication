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
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '../Navigation/AppStack';
import firebase from '../utils/Firebase';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useAuthStore from '../utils/AuthStore';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from '../Components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

type homeScreenProp = StackNavigationProp<HomeStackParamList, 'home'>;

export type Props = {
  email: string;
  name: string;
  id: string | number;
};

export type messageProps = {
  sendTo: string | number;
  text: string;
  createdAt: Date | number;
};

const {width} = Dimensions.get('screen');

const Home: FC<Props> = () => {
  const navigation = useNavigation<homeScreenProp>();
  const {auth} = firebase();
  const [allUsers, setAllUsers] = useState<any>();
  const {setIsAuth, setUserData, userData} = useAuthStore();
  const [loading, setLoading] = useState(true);

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        AsyncStorage.removeItem('Authentication');
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
          if (documentSnapshot.id !== userData.id) {
            data.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          }
        });
        setAllUsers(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCurrentUser();
    allUser();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <View style={styles.container}>
        <FlatList
          data={allUsers}
          renderItem={({item}: ListRenderItemInfo<Props>) => (
            <Pressable style={styles.card}>
              <View style={styles.UserInfo}>
                <View style={styles.UserImgWrapper}>
                  <AntDesign name="user" size={30} color="black" />
                </View>
                <View style={styles.TextSection}>
                  <Text style={styles.UserName}>{item.name}</Text>
                  <Text style={styles.UserName}>{item.email}</Text>
                </View>
                <View style={{marginRight: 180, alignSelf: 'center'}}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="black"
                    onPress={() =>
                      navigation.navigate('chat', {
                        userId: item.id,
                      })
                    }
                  />
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item: Props) => item.id}
        />
        {/* <Text>Home</Text>
      <Text>{userData.email}</Text>
      <Text>{userData.id}</Text> */}
        <Button title="Sign Out" onPress={signOut} />
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
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  UserInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  UserImgWrapper: {
    paddingVertical: 30,
  },
  TextSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: 280,
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
