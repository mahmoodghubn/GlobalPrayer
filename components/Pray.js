import React from 'react';
import {View, StyleSheet, TextStyle, Text, Switch} from 'react-native';

const Pray = props => {
  const {pray, time, alarmValue, onchangeAlarm} = {...props};
  return (
    <View style={styles.prayStyle}>
      <Text style={styles.text}>{pray}</Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.text}>{time}</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={alarmValue ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onchangeAlarm}
          value={alarmValue}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  prayStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'space-between',
    backgroundColor: '#aaa',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
});

export default Pray;
