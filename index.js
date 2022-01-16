import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import axios from 'axios';
import {
  select,
  deleteTable,
  getMonthPrayingTimes,
  selectPrays,
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
import PushNotification, {Importance} from 'react-native-push-notification';
import {startNotificationsFromBackground} from './App';
import buildUrl from './logic/buildUrl';
import './RTL_support/index';

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

const getSilentPrays = async () => {
  const SilentList = [
    'FajrSilent',
    'DhuhrSilent',
    'AsrSilent',
    'MaghribSilent',
    'IshaSilent',
  ];
  const praysNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  let silentPray;
  let SilentPrays = [];
  for (let i = 0; i < 5; i++) {
    silentPray = await AsyncStorage.getItem(SilentList[i]);
    if (silentPray == 'true') {
      SilentPrays.push(praysNames[i]);
    }
  }
  if (SilentPrays.length) {
    selectPrays(SilentPrays);
  }
};

export const MyHeadlessTask = async () => {
  try {
    const dateOfDatabase = await AsyncStorage.getItem('database_month');
    const thisMonth = new Date().getMonth();
    if (thisMonth == dateOfDatabase) {
      getSilentPrays();

      const day = new Date().getDate();
      let promise = select(day);
      promise.then(
        dayPray => {
          startNotificationsFromBackground({...dayPray}, false);
          Example.stopService();
          store.dispatch(fetchPraysSuccess({...dayPray}));
        },
        // error => alert(`Error: ${error.message}`)
      );
    } else {
      fetchNewData();
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const fetchNewData = async () => {
  const url = await buildUrl();
  axios
    .get(url)
    .then(response => {
      const json = response.data;
      const {data} = {...json};
      getMonthPrayingTimes(data);
      const day = new Date().getDate();
      let data2 = data[day - 1];
      let {timings} = {...data2};
      let date = new Date();
      let offsetInHours = date.getTimezoneOffset() / 60;
      let Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha;
      let prayDay = {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha};
      let prayer = {};
      let prayHour;
      for (key in timings) {
        if (prayDay.hasOwnProperty(key)) {
          prayHour = parseInt(timings[key].slice(0, 2)) - offsetInHours;
          if (prayHour < 10) {
            prayer[key] = '0' + prayHour + timings[key].slice(2, 5);
          } else {
            prayer[key] = prayHour + timings[key].slice(2, 5);
          }
        }
      }
      startNotificationsFromBackground({...prayer}, true);
      getSilentPrays();

      AsyncStorage.setItem(
        'database_month',
        JSON.stringify(new Date().getMonth()),
      );

      store.dispatch(fetchPraysSuccess({...prayer}));
    })
    .catch(error => {
      const errorMsg = error.message;
      store.dispatch(fetchPraysFailure(errorMsg));
    });
};

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerHeadlessTask('Example', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);
// WARN  registerHeadlessTask or registerCancellableHeadlessTask called multiple times for same key 'Example'
//yarn start --reset-cache
//error messagenear "FROM": syntax error (code 1 SQLITE_ERROR[1]): , while compiling: SELECT  FROM PrayTable WHERE ID = 13
