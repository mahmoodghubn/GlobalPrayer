import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, AppState} from 'react-native';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import axios from 'axios';
import {getDistance, getPreciseDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {select, getMonthPrayingTimes, selectPrays} from './logic/database';
import {testSchedule} from './logic/notification';
import buildUrl from './logic/buildUrl';
import {isPrayWaiting, getRemainSeconds} from './components/HomeScreen';
import './RTL_support/index';
import {
  fetchPraysRequest,
  fetchPraysSuccess,
  fetchPraysFailure,
  store,
} from './store';
import Example from './Example';
import App from './App';

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

const startNotifications = async (prays, bool) => {
  let alarm;
  let prayTime;
  for (let i = 0; i < 6; i++) {
    try {
      alarm = await AsyncStorage.getItem(praysNames[i]);
      prayTime = prays[praysNames[i]];
      if (alarm == 'true' && isPrayWaiting(prayTime)) {
        testSchedule(
          new Date(Date.now() + getRemainSeconds(prayTime) * 1000),
          praysNames[i],
          i,
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  if (bool) {
    Example.stopService();
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
//@babel/preset-typescript
//react-native-cli
