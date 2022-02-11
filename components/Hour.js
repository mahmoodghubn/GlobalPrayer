import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import nextPray from '../logic/nextPray';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';

const getRemainSeconds = pray => {
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

const fromSecondsToHour = seconds => {
  let parameter = seconds % 3600;
  let second = parameter % 60;
  let hour = (seconds - parameter) / 3600;
  let min = (parameter - second) / 60;
  second = second < 10 ? `0${second}` : second;
  min = min < 10 ? `0${min}` : min;
  hour = hour < 10 ? `0${hour}` : hour;
  return `${hour}:${min}:${second}`;
};

const Hour = ({praysData}) => {
  const {t, i18n} = useTranslation();
  const [nextTime, setNextTime] = useState();
  const [nextTimeName, setNextTimeName] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [clock, setClock] = useState();
  const [align, setAlign] = useState('flex-end');

  const findNextPrayAndSetSeconds = () => {
    if (Object.keys(praysData.prays).length) {
      prop = nextPray({praysData});
      setNextTime(prop.nextTime);
      setNextTimeName(prop.nextTimeName);
      const remain = getRemainSeconds(prop.nextTime);
      setSeconds(remain);
      setClock(fromSecondsToHour(remain));
    }
  };
  let intervalId;
  useEffect(() => {
    setAlign(praysData.RTL ? 'flex-end' : 'flex-start');
    findNextPrayAndSetSeconds();
  }, [praysData]);

  useEffect(() => {
    startTimer();
    return () => {
      BackgroundTimer.clearInterval(intervalId); //only android
    };
  }, [seconds]);
  const startTimer = () => {
    intervalId = BackgroundTimer.setInterval(() => {
      setSeconds(seconds => {
        if (seconds > 0) {
          return seconds - 1;
        } else {
          findNextPrayAndSetSeconds();
          return 0;
        }
      });
      setClock(fromSecondsToHour(seconds));
    }, 1000);
  };
  return (
    <View style={{...styles.hourStyle, alignItems: align}}>
      <Text style={styles.text}>{t([nextTimeName])}</Text>
      <Text style={styles.text}>{nextTime}</Text>
      <Text style={styles.text}>{clock}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  hourStyle: {
    fontSize: 40,
    color: 'red',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

const mapStateToProps = state => {
  return {
    praysData: state,
  };
};

export default connect(mapStateToProps)(Hour);
