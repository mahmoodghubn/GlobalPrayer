import React, {useState, useEffect} from 'react';
import BackgroundTimer from 'react-native-background-timer';
const colors = [
  '#5D4037',
  '#00796B',
  '#F2F201',
  '#455A64',
  '#F57C00',
  '#0243F1',
];
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
  let color = colors[5];

  switch (true) {
    case time >= getTime(prays.Isha) || time < getTime(prays.Fajr): {
      nextTime = prays.Fajr;
      nextTimeName = 'Fajr';
      color = colors[0];
      break;
    }
    case time >= getTime(prays.Maghrib): {
      nextTime = prays.Isha;
      nextTimeName = 'Isha';
      color = colors[5];
      break;
    }
    case time >= getTime(prays.Asr): {
      nextTime = prays.Maghrib;
      nextTimeName = 'Maghrib';
      color = colors[4];
      break;
    }
    case time >= getTime(prays.Dhuhr): {
      nextTime = prays.Asr;
      nextTimeName = 'Asr';
      color = colors[3];
      break;
    }
    case time >= getTime(prays.Sunrise): {
      nextTime = prays.Dhuhr;
      nextTimeName = 'Dhuhr';
      color = colors[2];
      break;
    }
    default: {
      nextTime = prays.Sunrise;
      nextTimeName = 'Sunrise';
      color = colors[1];
    }
  }
  return {color, nextTime, nextTimeName};
};
export default nextPray;
