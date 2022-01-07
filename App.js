import React, {useState, useEffect, useReducer} from 'react';
import Pray from './components/Pray';
import Hour from './components/Hour';
import nextPray from './logic/nextPray';
import {testSchedule} from './logic/notification';
import BackgroundTimer from 'react-native-background-timer';
import Icon from 'react-native-vector-icons/Ionicons';
import {StyleSheet, View, Text, AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Example from './Example';
import {connect} from 'react-redux';
import {MyHeadlessTask} from './index';
import {createTable} from './logic/database';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {MuteSettings} from './components/MuteSettings';
import {DrawerContent} from './components/DrawerContent';

const App = ({praysData, fetchPrays}) => {
  const [nextTime, setNextTime] = useState();
  const [nextTimeName, setNextTimeName] = useState('');
  const [seconds, setSeconds] = useState(0);

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

  const reducer = (state, action) => {
    const prayTime = action.payload;
    const pray = action.type;
    AsyncStorage.setItem(pray, JSON.stringify(!state[pray]));
    if (prayTime && !state[pray] && isPrayPassed(prayTime)) {
      testSchedule(
        new Date(Date.now() + getRemainSeconds(prayTime) * 1000),
        pray,
      );
    } else {
      // delete alarm;
    }
    return {...state, [pray]: !state[pray]};
  };

  useEffect(() => {
    createTable();
    startService();
    async function fetchData() {
      let pray;
      for (let i = 0; i < 6; i++) {
        pray = await AsyncStorage.getItem(praysNames[i]);
        if (pray == 'true') dispatch({type: praysNames[i]});
      }
    }
    fetchData();
  }, []);

  const startService = async () => {
    const dateOfDatabase = await AsyncStorage.getItem('database_month');
    const thisMonth = new Date().getMonth();
    if (thisMonth == dateOfDatabase) {
      Example.startService(1);
    } else {
      Example.startService(0);
    }
  };

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

  const defaultState = {
    Fajr: false,
    Sunrise: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  };

  const [state, dispatch] = useReducer(reducer, defaultState);

  const findNextPrayAndSetSeconds = () => {
    prop = nextPray({praysData});
    setNextTime(prop.nextTime);
    setNextTimeName(prop.nextTimeName);
    const remain = getRemainSeconds(prop.nextTime);
    setSeconds(remain);
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
              alarmValue={state[praysNames[index]]}
              onchangeAlarm={dispatch.bind(this, {
                type: praysNames[index],
                payload: element,
              })}
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
        <Drawer.Screen
          name="Mute Settings"
          component={MuteSettings}
          options={({navigation}) => ({
            headerLeft: () => (
              <Icon.Button
                name="arrow-back-outline"
                color="#000"
                backgroundColor="#fff"
                onPress={() => navigation.goBack()}></Icon.Button>
            ),
          })}
        />
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

export const startNotificationsFromBackground = (prays, alarmArray) => {
  const praysNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  if (AppState.currentState == 'background') {
    for (i = 0; i < 6; i++) {
      try {
        if (alarmArray[i] == 'true') {
          testSchedule(
            new Date(Date.now() + getRemain(prays[praysNames[i]]) * 1000),
            praysNames[i],
          );
        }
      } catch (error) {
        console.log(error.message);
      }
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
