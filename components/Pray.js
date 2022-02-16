import React from 'react';
import {View, StyleSheet, TextStyle, Text, Switch} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Pray = props => {
  const {direction, index, pray, time, alarmValue, onchangeAlarm} = {...props};
  let flexDir = direction ? 'row-reverse' : 'row';
  const colors = [
    '#5D4037',
    '#00796B',
    '#F2F201',
    '#455A64',
    '#F57C00',
    '#0243F1',
  ];
  const getIcon = () => {
    return alarmValue ? (
      <Icon.Button
        name="volume-high-outline"
        color="#000"
        backgroundColor={colors[index]}
        onPress={onchangeAlarm}></Icon.Button>
    ) : (
      <Icon.Button
        name="volume-mute-outline"
        color="#000"
        backgroundColor={colors[index]}
        onPress={onchangeAlarm}></Icon.Button>
    );
  };

  return (
    <View
      style={{
        ...styles.prayStyle,
        flexDirection: flexDir,
        backgroundColor: colors[index],
      }}>
      <Text style={styles.text}>{pray}</Text>
      <View style={{flexDirection: flexDir}}>
        <Text style={styles.text}>{time}</Text>
        {getIcon()}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  prayStyle: {
    justifyContent: 'space-between',
    alignItems: 'space-between',
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
