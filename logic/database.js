import SQLite from 'react-native-sqlite-storage';
import React, {useEffect} from 'react';
import Example from '../Example';

const db = SQLite.openDatabase(
  {
    name: 'meanDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

export const createTable = async () => {
  await db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ' +
        'PrayTable ' +
        '(ID INTEGER PRIMARY KEY, Fajr INTEGER , Sunrise INTEGER, Dhuhr INTEGER, Asr INTEGER, Maghrib INTEGER, Isha INTEGER)',
      [],
      (tx, results) => {
        console.log('data base created succuessfully');
      },
      error => {
        console.log('error' + error.message);
      },
    );
  });
};

export const getMonthPrayingTimes = async data => {
  let mon = new Date().getMonth();
  let year = new Date().getFullYear();
  const daysList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let days = daysList[mon];
  if (year % 4 == 0 && mon == 1) {
    days = 29;
  }
  for (let i = 0; i < days; i++) {
    let data2 = data[i];
    let {timings} = {...data2};
    for (key in timings) {
      timings[key] = timings[key].slice(0, 5);
    }
    let {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha} = {...timings};
    await insert(i + 1, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha);
  }
  Example.stopService();
};

const insert = async (ID, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) => {
  return new Promise(function (resolve, reject) {
    db.transaction(async tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO PrayTable (ID, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) VALUES (?,?,?,?,?,?,?)',
        [ID, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha],
        (tx, result) => {
          resolve(result);
        },
        error => {
          console.log('error in inserting' + error.message);
          reject(error);
        },
      );
    });
  });
};

export const select = day => {
  return new Promise(function (resolve, reject) {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha FROM PrayTable WHERE ID = ${day}`,
        [],
        (sqlTxn: SQLTransaction, res: SQLResultSet) => {
          const dayPray = res.rows.item(0);
          resolve(dayPray);
        },
        error => {
          reject(error);
          console.log('error message' + error.message);
        },
      );
    });
  });
};

export const selectPray = (pray, bool) => {
  const day = new Date().getDate();
  db.transaction(tx => {
    tx.executeSql(
      `SELECT ${pray} FROM PrayTable WHERE ID = ${day}`,
      [],
      (sqlTxn: SQLTransaction, res: SQLResultSet) => {
        const prayTime = res.rows.item(0);
        Example.setMuteOnPray(pray, prayTime[pray], bool);
      },
      error => {
        console.log('error message' + error.message);
      },
    );
  });
};

export const selectPrays = pray => {
  const day = new Date().getDate();
  db.transaction(tx => {
    tx.executeSql(
      `SELECT ${pray} FROM PrayTable WHERE ID = ${day}`,
      [],
      (sqlTxn: SQLTransaction, res: SQLResultSet) => {
        const prayTime = res.rows.item(0);
        Example.setDailyMute(prayTime);
      },
      error => {
        console.log('error message' + error.message);
      },
    );
  });
};
