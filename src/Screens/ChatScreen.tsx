import React, {useState, useEffect, useCallback, FC} from 'react';
import {View, ScrollView, Text, Button, StyleSheet} from 'react-native';
import {Bubble, GiftedChat, Send, User} from 'react-native-gifted-chat';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '../Navigation/AppStack';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
const ChatScreen: FC<GiftedProps> = () => {
  const [messages, setMessages] = useState<Props[] | []>([]);
  const db = firestore();
  const chatsRef = db.collection('chats');

  useEffect(() => {
    firestore()
      .collection('chats')
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
    const {_id, createdAt, text, user} = messages[0];
    firestore()
      .collection('chat')
      .add({
        _id,
        createdAt,
        text,
        user,
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
            style={{marginBottom: 5, marginRight: 5}}
            size={32}
            color="#2e64e5"
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
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={messages => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: '#fff',
      }}
      renderSend={renderSend}
      renderBubble={renderBubble}
    />
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
function readUser() {
  throw new Error('Function not implemented.');
}
