import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import axios from 'axios';
import {select, deleteTable, getMonthPrayingTimes} from './logic/database';
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

export const MyHeadlessTask = async () => {
  try {
    const FajrAlarm = await AsyncStorage.getItem('Fajr');
    const SunriseAlarm = await AsyncStorage.getItem('Sunrise');
    const DhuhrAlarm = await AsyncStorage.getItem('Dhuhr');
    const AsrAlarm = await AsyncStorage.getItem('Asr');
    const MaghribAlarm = await AsyncStorage.getItem('Maghrib');
    const IshaAlarm = await AsyncStorage.getItem('Isha');

    const dateOfDatabase = await AsyncStorage.getItem('database_month');
    const thisMonth = new Date().getMonth();
    if (thisMonth == dateOfDatabase) {
      const day = new Date().getDate();
      let promise = select(day);
      promise.then(
        dayPray => {
          startNotificationsFromBackground(
            {...dayPray},
            FajrAlarm,
            SunriseAlarm,
            DhuhrAlarm,
            AsrAlarm,
            MaghribAlarm,
            IshaAlarm,
          );
          Example.stopService();
          store.dispatch(fetchPraysSuccess({...dayPray}));
        },
        // error => alert(`Error: ${error.message}`)
      );
    } else {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const url2 = `https://api.aladhan.com/v1/calendar?latitude=51.508515&longitude=-0.1254872&method=2&month=${month}&year=${year}`;
      store.dispatch(fetchPraysRequest());

      axios
        .get(url2)
        .then(response => {
          const json = response.data;
          const {data} = {...json};
          getMonthPrayingTimes(data);
          const day = new Date().getDate();
          let data2 = data[day - 1];
          let {timings} = {...data2};
          let {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha} = {...timings};
          const dayPray = {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha};
          startNotificationsFromBackground(
            {...dayPray},
            FajrAlarm,
            SunriseAlarm,
            DhuhrAlarm,
            AsrAlarm,
            MaghribAlarm,
            IshaAlarm,
          );

          AsyncStorage.setItem(
            'database_month',
            JSON.stringify(new Date().getMonth()),
          );

          store.dispatch(fetchPraysSuccess({...dayPray}));
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
// WARN  registerHeadlessTask or registerCancellableHeadlessTask called multiple times for same key 'Example'
//yarn start --reset-cache
