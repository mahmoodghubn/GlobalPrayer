import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import axios from 'axios';
import {
  select,
  deleteTable,
  createTable,
  getMonthPrayingTimes,
} from './logic/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import React from 'react';
import {Provider} from 'react-redux';

import {
  fetchPraysRequest,
  fetchPraysSuccess,
  fetchPraysFailure,
  store,
} from './store';
import Example from './Example';

export const MyHeadlessTask = async () => {
  try {
    const dateOfDatabase = await AsyncStorage.getItem('database_month');
    const thisMonth = new Date().getMonth();
    if (thisMonth == dateOfDatabase) {
      const day = new Date().getDate();
      let promise = select(day);

      promise.then(
        dayPray => {
          // let {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha} = {...dayPray};
          // const x = {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha};
          Example.stopService();
          store.dispatch(fetchPraysSuccess({...dayPray}));
        },
        // error => alert(`Error: ${error.message}`)
      );
    } else {
      deleteTable();
      //need a way to reapeat this functionality if there is no internet
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const url2 = `https://api.aladhan.com/v1/calendar?latitude=51.508515&longitude=-0.1254872&method=2&month=${month}&year=${year}`;
      store.dispatch(fetchPraysRequest()); //{

      axios
        .get(url2)
        .then(response => {
          const json = response.data;
          const {data} = {...json};
          createTable();
          getMonthPrayingTimes(data);

          const day = new Date().getDate();
          let data2 = data[day];
          let {timings} = {...data2};
          let {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha} = {...timings};
          const x = {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha};
          Example.stopService();
          AsyncStorage.setItem(
            'database_month',
            JSON.stringify(new Date().getMonth()),
          );

          store.dispatch(fetchPraysSuccess(x));
        })
        .catch(error => {
          const errorMsg = error.message;
          store.dispatch(fetchPraysFailure(errorMsg));
        });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerHeadlessTask('Example', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);
