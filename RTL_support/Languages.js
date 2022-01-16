import React, {useState, useEffect} from 'react';
// import RNRestart from 'react-native-restart';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {changeStylesSides, store} from '../store';
export function Languages({navigation}) {
  const {i18n} = useTranslation();
  const languagesNames = ['English', 'العربية', 'Türkçe'];
  const abbreviatedLanguages = ['en', 'ar', 'tr'];

  const onPress = lan => {
    const language = i18n.language;
    if (lan !== language) {
      AsyncStorage.setItem('I18N_LANGUAGE', lan);
      i18n.changeLanguage(lan).then(() => {
        if (lan === 'ar') {
          store.dispatch(changeStylesSides(true));
        } else {
          store.dispatch(changeStylesSides(false));
        }
      });
    }
    navigation.goBack();
  };

  return (
    <View>
      {languagesNames.map((language, index) => (
        <View key={index} style={styles.view}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onPress(abbreviatedLanguages[index])}>
            <Text style={styles.text}>{language}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'stretch',
    margin: 20,
    borderColor: ' black',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
  },
});
