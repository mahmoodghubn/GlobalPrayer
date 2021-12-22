import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const Hour = props => {
  const {nextPray, nextPrayTime, timer} = {...props};
  return (
    <View style={styles.hourStyle}>
      <Text>{nextPray}</Text>
      <Text>{nextPrayTime}</Text>
      <Text>{timer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  hourStyle: {
    fontSize: 40,
    color: 'red',
  },
});
export default Hour;
