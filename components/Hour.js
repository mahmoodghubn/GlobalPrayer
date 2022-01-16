import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const Hour = props => {
  const {nextPray, nextPrayTime, timer} = {...props};
  return (
    <View style={styles.hourStyle}>
      <Text style={styles.text}>{nextPray}</Text>
      <Text style={styles.text}>{nextPrayTime}</Text>
      <Text style={styles.text}>{timer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  hourStyle: {
    fontSize: 40,
    color: 'red',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
export default Hour;
