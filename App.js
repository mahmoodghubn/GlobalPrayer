import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import Pray from './components/Pray';
import Hour from './components/Hour';
import nextPray from './logic/nextPray';
import {testSchedule, pushNotifications} from './logic/notification';
import BackgroundTimer from 'react-native-background-timer';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Example from './Example';
import {connect} from 'react-redux';
import {MyHeadlessTask} from './index';

const App = ({praysData, fetchPrays}) => {
  const [nextTime, setNextTime] = useState();
  const [nextTimeName, setNextTimeName] = useState('');
  const [seconds, setSeconds] = useState(0);

  let intervalId;
  useEffect(() => {
    startTimer();
    return () => {
      BackgroundTimer.clearInterval(intervalId); //only android
    };
  }, [seconds]);

  const startTimer = () => {
    intervalId = BackgroundTimer.setInterval(() => {
      setSeconds(secs => {
        if (secs > 0) {
          return secs - 1;
        } else if (Object.keys(praysData.prays).length) {
          calculateNextPray();
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    if (Object.keys(praysData.prays).length) {
      //sometime bug found
      console.log(Object.keys(praysData.prays).length);
      calculateNextPray();
    }
  }, [praysData]);

  const calculateNextPray = () => {
    prop = nextPray({praysData});
    setNextTime(prop.nextTime);
    setNextTimeName(prop.nextTimeName);
    const remain = getRemainSeconds(prop.nextTime);
    if (remain < 0) setSeconds(-remain);
    else setSeconds(remain);
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

  const calcualtePrayingTime = prayTime => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const time = minute + hour * 60;
    const prayHour = parseInt(prayTime.slice(0, 2));
    const prayMinute = parseInt(prayTime.slice(3, 5));
    const namazVakti = prayHour * 60 + prayMinute;
    return namazVakti > time;
  };

  useEffect(() => {
    pushNotifications();
    Example.startService();
    //taking alarm data from async storage and put it in usestate
    getPrayValue('Fajr', setFajrAlarm);
    getPrayValue('Sunrise', setSunriseAlarm);
    getPrayValue('Dhuhr', setDhuhrAlarm);
    getPrayValue('Asr', setAsrAlarm);
    getPrayValue('Maghrib', setMagribAlarm);
    getPrayValue('Isha', setIshaAlarm);
  }, []);

  const prayAlarm = key => {
    switch (key) {
      case 'Fajr':
        return fajrAlarm;
      case 'Sunrise':
        return sunriseAlarm;
      case 'Dhuhr':
        return dhuhrAlarm;
      case 'Asr':
        return asrAlarm;
      case 'Maghrib':
        return magribAlarm;
      case 'Isha':
        return ishaAlarm;
    }
  };

  const [asrAlarm, setAsrAlarm] = useState(false);
  const [magribAlarm, setMagribAlarm] = useState(false);
  const [ishaAlarm, setIshaAlarm] = useState(false);
  const [dhuhrAlarm, setDhuhrAlarm] = useState(false);
  const [sunriseAlarm, setSunriseAlarm] = useState(false);
  const [fajrAlarm, setFajrAlarm] = useState(false);

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

  const setAlarmOfPray = (pray, prayTime) => {
    let alarm;
    switch (pray) {
      case 'Fajr':
        AsyncStorage.setItem(pray, JSON.stringify(!fajrAlarm));
        setFajrAlarm(alarm => !alarm);
        alarm = fajrAlarm;
        break;
      case 'Sunrise':
        AsyncStorage.setItem(pray, JSON.stringify(!sunriseAlarm));
        setSunriseAlarm(alarm => !alarm);
        alarm = sunriseAlarm;
        break;
      case 'Dhuhr':
        AsyncStorage.setItem(pray, JSON.stringify(!dhuhrAlarm));
        setDhuhrAlarm(alarm => !alarm);
        alarm = dhuhrAlarm;
        break;
      case 'Asr':
        AsyncStorage.setItem(pray, JSON.stringify(!asrAlarm));
        setAsrAlarm(alarm => !alarm);
        alarm = asrAlarm;
        break;
      case 'Maghrib':
        AsyncStorage.setItem(pray, JSON.stringify(!magribAlarm));
        setMagribAlarm(alarm => !alarm);
        alarm = magribAlarm;
        break;
      case 'Isha':
        AsyncStorage.setItem(pray, JSON.stringify(!ishaAlarm));
        setIshaAlarm(alarm => !alarm);
        alarm = ishaAlarm;
    }

    if (!alarm && calcualtePrayingTime(prayTime)) {
      // save alarm values in shared perferences or database
      testSchedule(
        // add seconds to calculations for the exact time
        // this will not work for the current time if the current time is passed
        //customize notification
        new Date(Date.now() + getRemainSeconds(prayTime) * 1000),
        pray,
      );
    } else {
      // delete alarm;
    }
  };

  return praysData.loading ? (
    <Text>loading</Text>
  ) : praysData.error ? (
    <Text>{praysData.error}</Text>
  ) : (
    <View>
      <View style={styles.meanScreen}>
        <Hour nextPray={nextTimeName} nextPrayTime={nextTime} timer={seconds} />
      </View>
      {praysData &&
        praysData.prays &&
        Object.entries(praysData.prays).map(([key, val]) => (
          <Pray
            key={key}
            pray={key}
            time={val}
            alarmValue={prayAlarm(key)}
            onchangeAlarm={setAlarmOfPray.bind(this, key, val)}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
