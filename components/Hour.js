import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

const Hour = props => {
  const fromSecondsToHour = seconds => {
    let parameter = seconds % 3600;
    let second = parameter % 60;
    let hour = (seconds - parameter) / 3600;
    let min = (parameter - second) / 60;
    second = second < 10 ? `0${second}` : second;
    min = min < 10 ? `0${min}` : min;
    hour = hour < 10 ? `0${hour}` : hour;
    setClock(`${hour}:${min}:${second}`);
  };
  const [clock, setClock] = useState();
  const [seconds, setSeconds] = useState();
  const {direction, nextPray, nextPrayTime, timer, onTimeUp} = {...props};
  let align = direction ? 'flex-end' : 'flex-start';
  let intervalId;

  useEffect(() => {
    setSeconds(timer);
    fromSecondsToHour(timer);
  }, []);
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
        } else {
          onTimeUp();
          return 0;
        }
      });
      fromSecondsToHour(seconds);
    }, 1000);
  };
  return (
    <View style={{...styles.hourStyle, alignItems: align}}>
      <Text style={styles.text}>{nextPray}</Text>
      <Text style={styles.text}>{nextPrayTime}</Text>
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
export default Hour;
