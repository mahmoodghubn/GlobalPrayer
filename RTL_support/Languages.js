import React, {useState, useEffect} from 'react';
// import RNRestart from 'react-native-restart';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
export function Languages({navigation}) {
  const {i18n} = useTranslation();
  const languagesNames = ['English', 'العربية', 'Türkçe'];
  const abbreviatedLanguages = ['en', 'ar', 'tr'];

  const onPress = lan => {
    AsyncStorage.setItem('I18N_LANGUAGE', lan);
    i18n.changeLanguage(lan).then(() => {});
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
