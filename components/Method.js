import React, {Component, useState, useEffect, useReducer} from 'react';
import {ScrollView, View, Text, StyleSheet, Switch, Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RadioButton} from 'react-native-paper';
import {fetchNewData} from '../index';
import Example from '../Example';
import LinearGradient from 'react-native-linear-gradient';
import {fetchPraysRequest, store} from '../store';

const method = () => {
  const checkInternetStatus = value => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        changeUrl(value);
      } else {
        Alert.alert('Internet Error', 'there is no internet connection', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
    });
  };

  const [checked, setChecked] = React.useState('');
  const changeUrl = value => {
    setChecked(value);
    AsyncStorage.setItem('method', value);
    store.dispatch(fetchPraysRequest());

    fetchNewData();
  };

  useEffect(() => {
    async function fetchData() {
      const value = await AsyncStorage.getItem('method');

      if (value) {
        setChecked(value);
      } else {
        setChecked('13');
      }
    }
    fetchData();
  }, []);
  let methods = [
    'Shia Ithna-Ansari',
    'University of Islamic Sciences, Karachi',
    'Islamic Society of North America',
    'Muslim World League',
    'Umm Al-Qura University, Makkah',
    'Egyptian General Authority of Survey',
    '',
    'Institute of Geophysics, University of Tehran',
    'Gulf Region',
    'Kuwait',
    'Qatar',
    'Majlis Ugama Islam Singapura, Singapore',
    'Union Organization islamic de France',
    'Diyanet İşleri Başkanlığı, Turkey',
    'Spiritual Administration of Muslims of Russia',
    'Moonsighting Committee Worldwide',
  ];

  return (
    <ScrollView>
      {methods.map((element, index) =>
        index != 6 ? (
          <LinearGradient
            colors={['#455A64', '#455A64']}
            style={{...styles.prayStyle}}
            key={index}>
            <RadioButton
              uncheckedColor="white"
              color="#ffa500"
              value={`${index}`}
              status={checked === `${index}` ? 'checked' : 'unchecked'}
              onPress={() => checkInternetStatus(`${index}`)}
            />
            <Text style={styles.text}>{element}</Text>
          </LinearGradient>
        ) : null,
      )}
    </ScrollView>
  );
};

export default method;
const styles = StyleSheet.create({
  prayStyle: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  text: {
    paddingTop: 5,
    marginRight: 10,
    fontSize: 18,
    color: 'white',
  },
});
