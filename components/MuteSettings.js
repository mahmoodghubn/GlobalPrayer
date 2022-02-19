import React, {Component, useState, useEffect, useReducer} from 'react';
import {View, Text, StyleSheet, Switch, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {selectPray} from '../logic/database';
import {checkDndAccess, requestDndAccess} from 'react-native-ringer-mode';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
const colors = [
  '#5D4037',
  '#6D5047',
  '#F2e201',
  '#F2F201',
  '#455A64',
  '#455A64',
  '#F57C00',
  '#F57C00',
  '#0253F1',
  '#0243F1',
];
const reducer = (state, action) => {
  const callSelectPray = action.payload;
  const pray = action.type;
  const key = pray + 'Silent';
  AsyncStorage.setItem(key, JSON.stringify(!state[pray]));
  if (callSelectPray) {
    if (!state[pray]) {
      selectPray(pray, true);
    } else {
      selectPray(pray, false);
    }
  }

  return {...state, [pray]: !state[pray]};
};

function MuteSettings(props) {
  const {t, i18n} = useTranslation();

  const praysNames = [t('Fajr'), t('Dhuhr'), t('Asr'), t('Maghrib'), t('Isha')];
  const praysKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  let direction;
  useEffect(() => {
    async function fetchData() {
      let key;
      let pray;
      for (let i = 0; i < 5; i++) {
        key = praysKeys[i] + 'Silent';
        pray = await AsyncStorage.getItem(key);
        if (pray == 'true') dispatch({type: praysKeys[i], payload: false});
      }
    }
    fetchData();
  }, []);
  direction = props.RTL ? 'row-reverse' : 'row';

  const defaultState = {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  };
  const [state, dispatch] = useReducer(reducer, defaultState);

  const checkAccess = async pray => {
    const hasDndAccess = await checkDndAccess();

    if (hasDndAccess === false) {
      Alert.alert(
        'Need Ringer Access Permissions',
        'press Ok to navigate to ringer mode settings',
        [
          {text: 'Ok', onPress: () => requestDndAccess()},
          {text: 'Cancel', onPress: () => console.log('')},
        ],
      );
    } else {
      dispatch({type: pray, payload: true});
    }
  };
  return praysKeys.map((pray, index) => (
    <LinearGradient
      colors={[colors[index * 2], colors[index * 2 + 1]]}
      style={{...styles.prayStyle, flexDirection: direction}}
      key={index}>
      <Text style={styles.text}>{praysNames[index]}</Text>
      <Switch
        trackColor={{false: '#767577', true: '#388E3C'}}
        thumbColor={state[pray] ? '#7B1FA2' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => checkAccess(pray)}
        value={state[pray]}
      />
    </LinearGradient>
  ));
}

function mapStateToProps(state) {
  return {
    RTL: state.RTL,
  };
}

export default connect(mapStateToProps)(MuteSettings);
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
    color: 'white',
  },
});
