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
import {startNotifications} from './App';
import buildUrl from './logic/buildUrl';
import './RTL_support/index';
import {getDistance, getPreciseDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';
import {AppState} from 'react-native';

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
const SilentList = [
  'FajrSilent',
  'DhuhrSilent',
  'AsrSilent',
  'MaghribSilent',
  'IshaSilent',
];
const getSilentPrays = async () => {
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
  if (AppState.currentState != 'background') {
    Example.stopService();
  }
  try {
    const dateOfDatabase = await AsyncStorage.getItem('database_month');
    const thisMonth = new Date().getMonth();
    const disBool = await getLocationDifference();
    if (thisMonth == dateOfDatabase && disBool) {
      getSilentPrays();

      const day = new Date().getDate();
      let promise = select(day);
      promise.then(
        dayPray => {
          startNotifications({...dayPray}, true);
          store.dispatch(fetchPraysSuccess({...dayPray}));
        },
        // error => alert(`Error: ${error.message}`)
      );
    } else {
      fetchNewData();
    }
  } catch (error) {
    Example.stopService();
    const errorMsg = error.message;
    store.dispatch(fetchPraysFailure(errorMsg));
  }
};

export const fetchNewData = async () => {
  let silentPray;
  let MutePrays = [];
  for (let i = 0; i < 5; i++) {
    silentPray = await AsyncStorage.getItem(SilentList[i]);
    MutePrays.push(silentPray);
  }
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
      let Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha;
      let prayDay = {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha};
      let prayer = {};
      let SilentPrays = {};
      let index = 0;
      for (key in prayDay) {
        prayer[key] = timings[key].slice(0, 5);
        if (key != 'Sunrise') {
          if (MutePrays[index] == 'true') {
            SilentPrays[key] = timings[key].slice(0, 5);
          }
          index++;
        }
      }
      startNotifications({...prayer}, false);
      Example.setDailyMute(SilentPrays);

      AsyncStorage.setItem(
        'database_month',
        JSON.stringify(new Date().getMonth()),
      );

      store.dispatch(fetchPraysSuccess({...prayer}));
    })
    .catch(error => {
      Example.stopService();
      const errorMsg = error.message;
      store.dispatch(fetchPraysFailure(errorMsg));
    });
};
const getLocationDifference = async () => {
  if (AppState.currentState == 'background') {
    return true;
  } else {
    const currentLongitude = await AsyncStorage.getItem('longitude');
    const currentLatitude = await AsyncStorage.getItem('latitude');
    return new Promise(function (resolve, reject) {
      Geolocation.getCurrentPosition(
        position => {
          const currentLongitude2 = JSON.stringify(position.coords.longitude);
          const currentLatitude2 = JSON.stringify(position.coords.latitude);
          let dis;
          if (currentLatitude && currentLongitude) {
            dis = getDistance(
              {latitude: currentLatitude, longitude: currentLongitude},
              {latitude: currentLatitude2, longitude: currentLongitude2},
            );
            if (dis > 25000) {
              resolve(false);
            } else {
              resolve(true);
            }
          } else {
            resolve(true);
          }
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
  }
};

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerHeadlessTask('Example', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);
//    "react-native-log-to-file": "^1.0.3",
