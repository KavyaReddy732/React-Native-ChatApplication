import React, {FC} from 'react';
import {Dimensions, Text, StyleSheet, Pressable} from 'react-native';

const {height, width} = Dimensions.get('screen');

interface Props {
  title: string;
  onPress: () => void;
}

export const Button: FC<Props> = props => {
  return (
    <Pressable style={styles.container} onPress={props.onPress}>
      <Text style={styles.text}>{props.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  text: {
    color: '#fff',
  },
});
