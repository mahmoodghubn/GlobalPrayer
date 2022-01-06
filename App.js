import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import Pray from './components/Pray';
import Hour from './components/Hour';
import nextPray from './logic/nextPray';
import {testSchedule} from './logic/notification';
import BackgroundTimer from 'react-native-background-timer';
import {StyleSheet, View, TouchableOpacity, Text, AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Example from './Example';
import {connect} from 'react-redux';
import {MyHeadlessTask} from './index';
import {createTable} from './logic/database';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {MuteSettings} from './components/MuteSettings';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// const Stack = createNativeStackNavigator();
import {DrawerContent} from './components/DrawerContent';
const App = ({praysData, fetchPrays}) => {
  const [nextTime, setNextTime] = useState();
  const [nextTimeName, setNextTimeName] = useState('');
  const [seconds, setSeconds] = useState(0);

  const startService = async () => {
    const dateOfDatabase = await AsyncStorage.getItem('database_month');
    const thisMonth = new Date().getMonth();
    if (thisMonth == dateOfDatabase) {
      Example.startService(1);
    } else {
      Example.startService(0);
    }
  };

  useEffect(() => {
    createTable();
    startService();
    getPrayAlarm('Fajr', setFajrAlarm);
    getPrayAlarm('Sunrise', setSunriseAlarm);
    getPrayAlarm('Dhuhr', setDhuhrAlarm);
    getPrayAlarm('Asr', setAsrAlarm);
    getPrayAlarm('Maghrib', setMagribAlarm);
    getPrayAlarm('Isha', setIshaAlarm);
  }, []);

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
          findNextPrayAndSetSeconds();
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    if (Object.keys(praysData.prays).length) {
      findNextPrayAndSetSeconds();
    }
  }, [praysData]);

  const [asrAlarm, setAsrAlarm] = useState(false);
  const [maghribAlarm, setMagribAlarm] = useState(false);
  const [ishaAlarm, setIshaAlarm] = useState(false);
  const [dhuhrAlarm, setDhuhrAlarm] = useState(false);
  const [sunriseAlarm, setSunriseAlarm] = useState(false);
  const [fajrAlarm, setFajrAlarm] = useState(false);

  const getPrayAlarm = async (pray, setPrayAlarm) => {
    try {
      const alarm = await AsyncStorage.getItem(pray);
      if (alarm == 'true') {
        setPrayAlarm(true);
      } else setPrayAlarm(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const setPrayAlarm = (pray, prayTime) => {
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
        AsyncStorage.setItem(pray, JSON.stringify(!maghribAlarm));
        setMagribAlarm(alarm => !alarm);
        alarm = maghribAlarm;
        break;
      case 'Isha':
        AsyncStorage.setItem(pray, JSON.stringify(!ishaAlarm));
        setIshaAlarm(alarm => !alarm);
        alarm = ishaAlarm;
    }

    if (!alarm && isPrayPassed(prayTime)) {
      testSchedule(
        new Date(Date.now() + getRemainSeconds(prayTime) * 1000),
        pray,
      );
    } else {
      // delete alarm;
    }
  };

  const findNextPrayAndSetSeconds = () => {
    prop = nextPray({praysData});
    setNextTime(prop.nextTime);
    setNextTimeName(prop.nextTimeName);
    const remain = getRemainSeconds(prop.nextTime);
    setSeconds(remain);
  };

  const getRemainSeconds = pray => {
    let remain;
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const time = minute * 60 + hour * 3600;
    const prayHour = parseInt(pray.slice(0, 2));
    const prayMinute = parseInt(pray.slice(3, 5));
    const prayTime = prayHour * 3600 + prayMinute * 60;
    if (nextTimeName != 'Fajr') {
      remain = prayTime - time;
    } else {
      if (time < prayTime) {
        remain = prayTime - time;
      } else {
        remain = 24 * 3600 - time + prayTime;
      }
    }
    return remain;
  };

  const isPrayPassed = prayTime => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const time = minute + hour * 60;
    const prayHour = parseInt(prayTime.slice(0, 2));
    const prayMinute = parseInt(prayTime.slice(3, 5));
    const namazVakti = prayHour * 60 + prayMinute;
    return namazVakti > time;
  };

  const detectPrayAlarm = key => {
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
        return maghribAlarm;
      case 'Isha':
        return ishaAlarm;
    }
  };

  const praysNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const giveOrderedPrays = praysData => {
    return [
      praysData.Fajr,
      praysData.Sunrise,
      praysData.Dhuhr,
      praysData.Asr,
      praysData.Maghrib,
      praysData.Isha,
    ];
  };

  function HomeScreen({navigation}) {
    return (
      <View>
        <View style={styles.meanScreen}>
          <Hour
            nextPray={nextTimeName}
            nextPrayTime={nextTime}
            timer={seconds}
          />
        </View>
        {praysData &&
          praysData.prays &&
          giveOrderedPrays(praysData.prays).map((element, index) => (
            <Pray
              key={index}
              pray={praysNames[index]}
              time={element}
              alarmValue={detectPrayAlarm(praysNames[index])}
              onchangeAlarm={setPrayAlarm.bind(
                this,
                praysNames[index],
                element,
              )}
            />
          ))}
      </View>
    );
  }
  const Drawer = createDrawerNavigator();

  return praysData.loading ? (
    <Text>loading</Text>
  ) : praysData.error ? (
    <Text>{praysData.error}</Text>
  ) : (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Silent Pray" component={HomeScreen} />
        <Drawer.Screen name="Mute Settings" component={MuteSettings} />
      </Drawer.Navigator>
    </NavigationContainer>
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

export const startNotificationsFromBackground = (
  prays,
  FajrAlarm,
  SunriseAlarm,
  DhuhrAlarm,
  AsrAlarm,
  MaghribAlarm,
  IshaAlarm,
) => {
  if (AppState.currentState == 'background') {
    try {
      if (FajrAlarm == 'true') {
        testSchedule(
          new Date(Date.now() + getRemain(prays.Fajr) * 1000),
          'Fajr',
        );
      }

      if (SunriseAlarm == 'true')
        testSchedule(
          new Date(Date.now() + getRemain(prays.Sunrise) * 1000),
          'Sunrise',
        );

      if (DhuhrAlarm == 'true')
        testSchedule(
          new Date(Date.now() + getRemain(prays.Dhuhr) * 1000),
          'Dhuhr',
        );

      if (AsrAlarm == 'true')
        testSchedule(new Date(Date.now() + getRemain(prays.Asr) * 1000), 'Asr');

      if (MaghribAlarm == 'true')
        testSchedule(
          new Date(Date.now() + getRemain(prays.Maghrib) * 1000),
          'Maghrib',
        );

      if (IshaAlarm == 'true')
        testSchedule(
          new Date(Date.now() + getRemain(prays.Isha) * 1000),
          'Isha',
        );
    } catch (error) {
      console.log(error.message);
    }
  }
};
const getRemain = pray => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const time = minute * 60 + hour * 3600;
  const prayHour = parseInt(pray.slice(0, 2));
  const prayMinute = parseInt(pray.slice(3, 5));
  const prayTime = prayHour * 3600 + prayMinute * 60;
  return prayTime - time;
};
