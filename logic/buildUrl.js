import React, {useState, useEffect} from 'react';
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
    const url = await getOneTimeLocation(method);
    return url;
  } catch (error) {
    console.log(error.message);
  }
};

const getOneTimeLocation = method => {
  return new Promise(function (resolve, reject) {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const url = `https://api.aladhan.com/v1/calendar?latitude=${currentLatitude}&longitude=${currentLongitude}&method=${method}&month=${month}&year=${year}`;
        console.log(url);
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
