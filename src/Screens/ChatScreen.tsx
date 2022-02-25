import React, {useState, useEffect, useCallback, FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {Bubble, GiftedChat, Send, User} from 'react-native-gifted-chat';
import {useNavigation, RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '../Navigation/AppStack';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useAuthStore from '../utils/AuthStore';
import ImagePicker from 'react-native-image-picker';

export type Props = {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
};
export interface GiftedProps {
  renderBubble: (props: any) => JSX.Element;
  renderSend: (props: any) => JSX.Element;
}

type homeScreenProp = StackNavigationProp<HomeStackParamList, 'chat'>;
type homeScreenRouteProp = RouteProp<HomeStackParamList, 'chat'>;

const ChatScreen: FC<GiftedProps> = () => {
  const navigation = useNavigation<homeScreenProp>();
  const route = useRoute<homeScreenRouteProp>();
  const [messages, setMessages] = useState<Props[] | []>([]);
  const [selectedPicture, setSelectedPictute] = useState<String>('');
  const db = firestore();
  const {userData} = useAuthStore();
  const {userId} = route.params;
  console.log(messages);

  useEffect(() => {
    const docid =
      userId > userData.id
        ? userData.id + '-' + userId
        : userId + '-' + userData.id;
    firestore()
      .collection('chat')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get()
      .then(querySnapshot => {
        return setMessages(
          querySnapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          })),
        );
      });
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, text, user} = messages[0];
    const docid =
      userId > userData.id
        ? userData.id + '-' + userId
        : userId + '-' + userData.id;
    firestore()
      .collection('chat')
      .doc(docid)
      .collection('messages')
      .add({
        _id,
        createdAt: firestore.FieldValue.serverTimestamp(),
        text,
        user,
        sentTo: userId,
      })
      .then(() => {
        console.log('chat added!');
      });
  }, []);

  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            size={32}
            color="#2e64e5"
            style={{marginBottom: 5, marginRight: 5}}
          />
        </View>
      </Send>
    );
  };
  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <GiftedChat
        messages={messages}
        user={{
          _id: userData.id,
        }}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={messages => onSend(messages)}
        messagesContainerStyle={{
          backgroundColor: '#fff',
        }}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        renderBubble={renderBubble}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

