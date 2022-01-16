import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const Hour = props => {
  const {direction, nextPray, nextPrayTime, timer} = {...props};
  let align = direction ? 'flex-end' : 'flex-start';

  return (
    <View style={{...styles.hourStyle, alignItems: align}}>
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
