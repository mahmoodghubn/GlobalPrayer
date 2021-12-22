import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import Pray from './components/Pray';
import Hour from './components/Hour';
import useFetch from './logic/useFetch';
import buildUrl from './logic/buildUrl';
import nextPray from './logic/nextPray';
import notification from './logic/notification';
import BackgroundTimer from 'react-native-background-timer';
import database, {select} from './logic/database';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import PushNotification, {Importance} from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Example from './Example';
import {connect} from 'react-redux';
import {MyHeadlessTask} from './index';

const App = ({praysData, fetchPrays}) => {
  useEffect(() => {
    // MyHeadlessTask();
    Example.startService();
  }, []);

  useEffect(() => {
    //taking alarm data from async storage and put it in usestate
    getPrayValue('FAJR', setFajrAlarm);
    getPrayValue('SUNRISE', setSunriseAlarm);
    getPrayValue('DHUHR', setDhuhrAlarm);
    getPrayValue('ASR', setAsrAlarm);
    getPrayValue('MAGRIB', setMagribAlarm);
    getPrayValue('ISHA', setIshaAlarm);
  }, []);
  const getPrayValue = async (pray, setPrayAlarm) => {
    try {
      const alarm = await AsyncStorage.getItem(pray);
      if (alarm == 'true') {
        setPrayAlarm(true);
      } else setPrayAlarm(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const setAlarmOfPray = (pray, prayTime, setAlarm, alarm) => {
    AsyncStorage.setItem(pray, JSON.stringify(!alarm));
    setAlarm(alarm => !alarm);
    if (!alarm) {
      // save alarm values in shared perferences or database
      testSchedule(
        // add seconds to calculations for the exact time
        // this will not work for the current time if the current time is passed
        //customize notification
        new Date(Date.now() + getRemainSeconds(prayTime) * 1000), //seconds - getRemainSeconds()) * 1000),
        pray,
      );
    } else {
      // delete alarm;
    }
  };
  //problem in first installion
  const url = buildUrl(); //this every month
  const [dayPray, setDayPray] = useState('');
  const {loading, monthData} = useFetch(url); //add loading functionality
  database(monthData);

  const {FAJR, SUNRISE, DHUHUR, ASR, MAGRIB, ISHA} = {...dayPray};
  const [asrAlarm, setAsrAlarm] = useState(false);
  const [magribAlarm, setMagribAlarm] = useState(false);
  const [ishaAlarm, setIshaAlarm] = useState(false);
  const [dhuhrAlarm, setDhuhrAlarm] = useState(false);
  const [sunriseAlarm, setSunriseAlarm] = useState(false);
  const [fajrAlarm, setFajrAlarm] = useState(false);
  const [nextTime, setNextTime] = useState();
  const [nextTimeName, setNextTimeName] = useState('');
  const [seconds, setSeconds] = useState();
  useEffect(() => {
    const day = new Date().getDate();
    if (!dayPray) {
      select(day, setDayPray);
    } //make sure this functions
    else if (nextTimeName === 'FAJR') {
      select(day + 1, setDayPray);
    }
  }, [nextTimeName]);
  let prop;
  useEffect(() => {
    if (dayPray) {
      calculateNextPray();
    }
  }, [dayPray]);

  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setSeconds(secs => {
        if (secs > 0) return secs - 1;
        else if (dayPray) {
          calculateNextPray();
          return 0;
        }
      });
    }, 1000);
  };
  const getRemainSeconds = pray => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const time = minute * 60 + hour * 3600;
    const prayHour = parseInt(pray.slice(0, 2));
    const prayMinute = parseInt(pray.slice(3, 5));
    const remain = prayHour * 3600 + prayMinute * 60 - time;
    return remain;
  };
  const calculateNextPray = () => {
    prop = nextPray({dayPray});
    setNextTime(prop.nextTime);
    setNextTimeName(prop.nextTimeName);
    const remain = getRemainSeconds(prop.nextTime);
    if (remain < 0) setSeconds(-remain);
    else setSeconds(remain);
  };
  useEffect(() => {
    startTimer();
    return () => {
      BackgroundTimer.stopBackgroundTimer(); //make sure we need background timer
    };
  }, [seconds]);
  return praysData.requestActionReducer.loading ? (
    <Text>loading</Text>
  ) : praysData.error ? (
    <Text>{praysData.requestActionReducer.error}</Text>
  ) : (
    <View>
      {praysData &&
        praysData.requestActionReducer &&
        praysData.requestActionReducer.prays &&
        praysData.requestActionReducer.prays.map(pray => (
          <Text>{pray.name}</Text>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  meanScreen: {
    margin: 20,
  },
});
const mapStateToProps = state => {
  return {
    praysData: state,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetchPrays: () => dispatch(MyHeadlessTask()),
  };
};

{
  /* <View>
      <TouchableOpacity onPress={() => Example.startService()}>
        <Text>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Example.stopService()}>
        <Text>Stop</Text>
      </TouchableOpacity>
    </View> */
}
//there are many calls for MyHeadlessTask
export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default App;

// const test = () => {
//   PushNotification.createChannel(
//     {
//       channelId: 'channel-id', // (required)
//       channelName: 'My channel', // (required)
//       channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
//       playSound: false, // (optional) default: true
//       soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
//       importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
//       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
//     },
//     created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
//   );
//   PushNotification.localNotification({
//     channelId: 'channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
//     title: 'My Notification Title', // (optional)
//     message: 'My Notification Message', // (required)
//   });
// };

// <View style={styles.meanScreen}>
//   <Hour nextPray={nextTimeName} nextPrayTime={nextTime} timer={seconds} />
//   <Pray
//     pray="fajr"
//     time={FAJR}
//     alarmValue={fajrAlarm}
//     onchangeAlarm={setAlarmOfPray.bind(
//       this,
//       'FAJR',
//       FAJR,
//       setFajrAlarm,
//       fajrAlarm,
//     )}
//   />
//   <Pray
//     pray="sunrise"
//     time={SUNRISE}
//     alarmValue={sunriseAlarm}
//     onchangeAlarm={setAlarmOfPray.bind(
//       this,
//       'SUNRISE',
//       SUNRISE,
//       setSunriseAlarm,
//       sunriseAlarm,
//     )}
//   />
//   <Pray
//     pray="dhuhr"
//     time={DHUHUR}
//     alarmValue={dhuhrAlarm}
//     onchangeAlarm={setAlarmOfPray.bind(
//       this,
//       'DHUHR',
//       DHUHUR,
//       setDhuhrAlarm,
//       dhuhrAlarm,
//     )}
//   />
//   <Pray
//     pray="asr"
//     time={ASR}
//     alarmValue={asrAlarm}
//     onchangeAlarm={setAlarmOfPray.bind(
//       this,
//       'ASR',
//       ASR,
//       setAsrAlarm,
//       asrAlarm,
//     )}
//   />
//   <Pray
//     pray="maghrib"
//     time={MAGRIB}
//     alarmValue={magribAlarm}
//     onchangeAlarm={setAlarmOfPray.bind(
//       this,
//       'MAGRIB',
//       MAGRIB,
//       setMagribAlarm,
//       magribAlarm,
//     )}
//   />
//   <Pray
//     pray="isha"
//     time={ISHA}
//     alarmValue={ishaAlarm}
//     onchangeAlarm={setAlarmOfPray.bind(
//       this,
//       'ISHA',
//       ISHA,
//       setIshaAlarm,
//       ishaAlarm,
//     )}
//   />

// <Pray
//               pray="fajr"
//               time={pray}
//               alarmValue={fajrAlarm}
//               onchangeAlarm={setAlarmOfPray.bind(
//                 this,
//                 'FAJR',
//                 pray,
//                 setFajrAlarm,
//                 fajrAlarm,
//               )}
//             />

//  praysData.loading ? (
//    <Text>loading</Text>
//  ) : praysData.error ? (
//    <Text>{praysData.error}</Text>
//  ) : (
//    <View>
//      {praysData &&
//        praysData.prays &&
//        praysData.prays.map(pray => <Text>{pray.date}</Text>)}
//    </View>
//  );
