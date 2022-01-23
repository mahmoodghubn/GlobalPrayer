import React, {useState, useEffect} from 'react';
import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

const buildUrl = async () => {
  try {
    let method;
    const value = await AsyncStorage.getItem('method');
    if (value) {
      method = value;
    } else {
      method = '13';
    }
    let url;
    if (AppState.currentState != 'background') {
      url = await getOneTimeLocation(method);
    } else {
      const currentLongitude = await AsyncStorage.getItem('longitude');
      const currentLatitude = await AsyncStorage.getItem('latitude');
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      url = `https://api.aladhan.com/v1/calendar?latitude=${currentLatitude}&longitude=${currentLongitude}&method=${method}&month=${month}&year=${year}`;
    }
    return url;
  } catch (error) {
    console.log(error.message);
  }
};

const getOneTimeLocation = method => {
  return new Promise(function (resolve, reject) {
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        AsyncStorage.setItem('longitude', currentLongitude);
        AsyncStorage.setItem('latitude', currentLatitude);
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const url = `https://api.aladhan.com/v1/calendar?latitude=${currentLatitude}&longitude=${currentLongitude}&method=${method}&month=${month}&year=${year}`;
        resolve(url);
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  });
};
export default buildUrl;
