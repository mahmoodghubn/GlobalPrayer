import React, {useState, useEffect} from 'react';
import BackgroundTimer from 'react-native-background-timer';

const nextPray = ({praysData}) => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const time = minute + hour * 60;
  const getTime = stringTime => {
    const prayHour = parseInt(stringTime.slice(0, 2));
    const prayMinute = parseInt(stringTime.slice(3, 5));
    const x = prayHour * 60 + prayMinute;
    return prayHour * 60 + prayMinute;
  };
  const prays = praysData.prays;
  let nextTime = prays.Isha;
  let nextTimeName = 'Isha';

  switch (true) {
    case time >= getTime(prays.Isha) || time < getTime(prays.Fajr): {
      nextTime = prays.Fajr;
      nextTimeName = 'Fajr';
      break;
    }
    case time >= getTime(prays.Maghrib): {
      nextTime = prays.Isha;
      nextTimeName = 'Isha';
      break;
    }
    case time >= getTime(prays.Asr): {
      nextTime = prays.Maghrib;
      nextTimeName = 'Maghrib';
      break;
    }
    case time >= getTime(prays.Dhuhr): {
      nextTime = prays.Asr;
      nextTimeName = 'Asr';
      break;
    }
    case time >= getTime(prays.Sunrise): {
      nextTime = prays.Dhuhr;
      nextTimeName = 'Dhuhr';
      break;
    }
    default: {
      nextTime = prays.Sunrise;
      nextTimeName = 'Sunrise';
    }
  }
  return {nextTime, nextTimeName};
};
export default nextPray;
