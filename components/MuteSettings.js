import React, {Component, useState, useEffect, useReducer} from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {selectPray} from '../logic/database';
const reducer = (state, action) => {
  const callSelectPray = action.payload;
  const pray = action.type;
  const key = pray + 'Silent';
  AsyncStorage.setItem(key, JSON.stringify(!state[pray]));
  if (!state[pray] && callSelectPray) {
    selectPray(pray);
  } else {
  }
  return {...state, [pray]: !state[pray]};
};

export function MuteSettings() {
  const praysNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  useEffect(() => {
    async function fetchData() {
      let key;
      let pray;
      for (let i = 0; i < 5; i++) {
        key = praysNames[i] + 'Silent';
        pray = await AsyncStorage.getItem(key);
        if (pray == 'true') dispatch({type: praysNames[i], payload: false});
      }
    }
    fetchData();
  }, []);

  const defaultState = {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  };
  const [state, dispatch] = useReducer(reducer, defaultState);

  return praysNames.map((pray, index) => (
    <View style={styles.prayStyle} key={index}>
      <Text style={styles.text}>{pray}</Text>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={state[pray] ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => dispatch({type: pray, payload: true})}
        value={state[pray]}
      />
    </View>
  ));
}

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
