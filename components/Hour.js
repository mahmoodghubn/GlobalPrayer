import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import nextPray from '../logic/nextPray';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {getRemainSeconds} from './HomeScreen';

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
  const [color, setColor] = useState('#0243F1');

  const findNextPrayAndSetSeconds = () => {
    if (Object.keys(praysData.prays).length) {
      prop = nextPray({praysData});
      setNextTime(prop.nextTime);
      setNextTimeName(prop.nextTimeName);
      setColor(prop.color);
      const remain = getRemainSeconds(prop.nextTime);
      setSeconds(remain);
      setClock(fromSecondsToHour(remain));
    }
  };
  let intervalId;
  useEffect(() => {
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
    <View style={styles.hourStyle}>
      <Text
        style={
          praysData.RTL
            ? {...styles.text, color: color}
            : {...styles.text2, color: color}
        }>
        {t([nextTimeName])}
      </Text>
      <Text
        style={
          praysData.RTL
            ? {...styles.text, color: color}
            : {...styles.text2, color: color}
        }>
        {nextTime}
      </Text>
      <Text
        style={
          praysData.RTL
            ? {...styles.text, color: color}
            : {...styles.text2, color: color}
        }>
        {clock}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  hourStyle: {
    margin: 20,
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: 25,
    color: 'black',
    alignSelf: 'flex-end',
  },
  text2: {
    fontSize: 25,
    color: 'black',
    alignSelf: 'flex-start',
  },
});

const mapStateToProps = state => {
  return {
    praysData: state,
  };
};

export default connect(mapStateToProps)(Hour);
