import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import axios from 'axios';

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
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const url2 = `https://api.aladhan.com/v1/calendar?latitude=51.508515&longitude=-0.1254872&method=2&month=${month}&year=${year}`;
  store.dispatch(fetchPraysRequest()); //{

  axios
    .get(url2)
    .then(response => {
      const json = response.data;
      const {data} = {...json};
      const day = new Date().getDate();
      let data2 = data[day];
      let {timings} = {...data2};
      let {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha} = {...timings};
      const x = {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha};
      Example.stopService();
      store.dispatch(fetchPraysSuccess(x));
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

// export const MyHeadlessTask = async () => {
//   return (dispatch = {
//     dispatch(fetchPraysRequest) {
//       axios
//         .get('https://jsonplaceholder.typicode.com/users')
//         .then(response => {
//           const users = response.data;
//           dispatch(fetchPraysSuccess(users));
//         })
//         .catch(error => {
//           const errorMsg = error.message;
//           dispatch(fetchPraysFailure(errorMsg));
//         });
//     },
//   });
// };

// dispatch(fetchPraysRequest);
// axios
//   .get('')
//   .then(response => {
//     const users = response.data;
//     dispatch(fetchPraysSuccess(users));
//   })
//   .catch(error => {
//     const errorMsg = error.message;
//     dispatch(fetchPraysFailure(errorMsg));
//   });
