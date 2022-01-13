import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const buildUrl = async () => {
  try {
    let method;
    const value = await AsyncStorage.getItem('method');
    if (value) {
      method = value;
    } else {
      method = '13';
    }
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const url = `https://api.aladhan.com/v1/calendar?latitude=51.508515&longitude=-0.1254872&method=${method}&month=${month}&year=${year}`;
    console.log(url);
    return url;
  } catch (error) {
    console.log(error.message);
  }
};
export default buildUrl;
