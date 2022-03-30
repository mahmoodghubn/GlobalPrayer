import React, {useEffect, useReducer} from 'react';
import {View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {useTranslation} from 'react-i18next';
import {Appbar} from 'react-native-paper';
import {connect} from 'react-redux';
import {changeStylesSides, store, fetchPraysRequest} from '../store';
import CircularProgress from './CircularProgress';
import Hour from './Hour';
import Pray from './Pray';
import {testSchedule} from '../logic/notification';

const praysNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const getRemainSeconds = pray => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const time = minute * 60 + hour * 3600;
  const prayHour = parseInt(pray.slice(0, 2));
  const prayMinute = parseInt(pray.slice(3, 5));
  const prayTime = prayHour * 3600 + prayMinute * 60;
  if (time < prayTime) {
    return prayTime - time;
  } else {
    return 24 * 3600 - time + prayTime;
  }
};

export const isPrayWaiting = prayTime => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const time = minute + hour * 60;
  const prayHour = parseInt(prayTime.slice(0, 2));
  const prayMinute = parseInt(prayTime.slice(3, 5));
  const namazVakti = prayHour * 60 + prayMinute;
  return namazVakti > time;
};

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
const reducer = (state, action) => {
  const pray = action.type;
  return {...state, [pray]: !state[pray]};
};
function HomeScreen({praysData, navigation}) {
  const {t, i18n} = useTranslation();

  useEffect(() => {
    async function fetchData() {
      let pray;
      for (let i = 0; i < 6; i++) {
        pray = await AsyncStorage.getItem(praysNames[i]);
        if (pray == 'true') {
          send({type: praysNames[i]});
        }
      }
    }
    fetchData();
    return () => {
      store.dispatch(fetchPraysRequest());
    };
  }, []);

  const defaultState = {
    Fajr: false,
    Sunrise: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  };
  const [state, send] = useReducer(reducer, defaultState);

  const praysTranslation = [
    t('Fajr'),
    t('Sunrise'),
    t('Dhuhr'),
    t('Asr'),
    t('Maghrib'),
    t('Isha'),
  ];

  const dispatcher = (type, payload) => {
    const prayTime = payload;
    const pray = type;
    const bool = !state[pray];
    send({
      type: type,
    });
    AsyncStorage.setItem(pray, JSON.stringify(bool));
    if (prayTime && isPrayWaiting(prayTime)) {
      let id = 0;
      for (let i = 0; i < 6; i++) {
        if (pray == praysNames[i]) {
          id = i;
        }
      }
      if (bool) {
        testSchedule(
          new Date(Date.now() + getRemainSeconds(prayTime) * 1000),
          pray,
          id,
        );
      } else {
        PushNotification.cancelLocalNotification(id);
      }
    }
  };
  return (
    <View key={0}>
      <Appbar>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Global Prayer" />
      </Appbar>
      <View
        key={1}
        style={{
          ...styles.meanScreen,
          flexDirection: praysData.RTL ? 'row-reverse' : 'row',
        }}>
        <CircularProgress
          key={3}
          direction={praysData.RTL}
          prays={giveOrderedPrays(praysData.prays)}
        />
        <Hour
          key={2}
          style={{
            ...styles.hour,
          }}
        />
      </View>
      {praysData &&
        praysData.prays &&
        giveOrderedPrays(praysData.prays).map((element, index) => (
          <Pray
            direction={praysData.RTL}
            index={index}
            key={index}
            pray={praysTranslation[index]}
            time={element}
            alarmValue={state[praysNames[index]]}
            onchangeAlarm={() => dispatcher(praysNames[index], element)}
          />
        ))}
    </View>
  );
}
const styles = StyleSheet.create({
  meanScreen: {
    margin: 20,
    alignItems: 'flex-start',
  },
  hour: {
    marginStart: 20,
  },
});
const mapStateToProps = state => {
  return {
    praysData: state,
  };
};

export default connect(mapStateToProps)(HomeScreen);
