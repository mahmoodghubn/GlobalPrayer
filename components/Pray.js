import React from 'react';
import {View, StyleSheet, TextStyle, Text, Switch} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const Pray = props => {
  const {direction, index, pray, time, alarmValue, onchangeAlarm} = {...props};
  let flexDir = direction ? 'row-reverse' : 'row';
  let color_index = index * 2;
  const colors = [
    '#9E3C44',
    '#9E1C44',
    '#ECa31C',
    '#EC931C',
    '#F2e201',
    '#F2F201',
    '#02d302',
    '#02C302',
    '#0253F1',
    '#0243F1',
    '#608d8b',
    '#607d8b',
  ];
  const getIcon = () => {
    return alarmValue ? (
      <Icon.Button
        name="volume-high-outline"
        color="#000"
        backgroundColor={colors[color_index]}
        onPress={onchangeAlarm}></Icon.Button>
    ) : (
      <Icon.Button
        name="volume-mute-outline"
        color="#000"
        backgroundColor={colors[color_index]}
        onPress={onchangeAlarm}></Icon.Button>
    );
  };

  return (
    <LinearGradient
      colors={[colors[color_index], colors[color_index + 1]]}
      style={{...styles.prayStyle, flexDirection: flexDir}}>
      <Text style={styles.text}>{pray}</Text>
      <View style={{flexDirection: flexDir}}>
        <Text style={styles.text}>{time}</Text>
        {getIcon()}
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  prayStyle: {
    justifyContent: 'space-between',
    alignItems: 'space-between',
    backgroundColor: '#aaa',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

export default Pray;
