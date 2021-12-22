import React, {useState, useEffect} from 'react';
import BackgroundTimer from 'react-native-background-timer';

const nextPray = props => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const time = minute + hour * 60;
  const getTime = stringTime => {
    const prayHour = parseInt(stringTime.slice(0, 2));
    const prayMinute = parseInt(stringTime.slice(3, 5));
    const x = prayHour * 60 + prayMinute;
    return prayHour * 60 + prayMinute;
  };
  const {dayPray} = {...props};

  let nextTime = dayPray.ISHA;
  let nextTimeName = 'Isha';

  switch (true) {
    case time >= getTime(dayPray.ISHA) || time < getTime(dayPray.FAJR): {
      nextTime = dayPray.FAJR;
      nextTimeName = 'FAJR';
      break;
    }

    case time >= getTime(dayPray.MAGRIB): {
      nextTime = dayPray.ISHA;
      nextTimeName = 'ISHA';
      break;
    }
    case time >= getTime(dayPray.ASR): {
      nextTime = dayPray.MAGRIB;
      nextTimeName = 'MAGRIB';
      break;
    }

    case time >= getTime(dayPray.DHUHUR): {
      nextTime = dayPray.ASR;
      nextTimeName = 'ASR';
      break;
    }
    case time >= getTime(dayPray.SUNRISE): {
      nextTime = dayPray.DHUHUR;
      nextTimeName = 'DHUHUR';
      break;
    }
    default: {
      nextTime = dayPray.SUNRISE;
      nextTimeName = 'SUNRISE';
    }
  }
  return {nextTimeName, nextTime};
};
export default nextPray;

//calculate the taime remaining
