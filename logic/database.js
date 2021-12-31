import SQLite from 'react-native-sqlite-storage';
import React, {useEffect} from 'react';

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

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ' +
        'PrayTable ' +
        '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Fajr INTEGER , Sunrise INTEGER, Dhuhr INTEGER, Asr INTEGER, Maghrib INTEGER, Isha INTEGER)',
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

export const getMonthPrayingTimes = data => {
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
    let {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha} = {...timings};
    insert(Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha);
  }
};

const insert = async (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) => {
  await db.transaction(async tx => {
    tx.executeSql(
      'INSERT INTO PrayTable (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) VALUES (?,?,?,?,?,?)',
      [Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha],
      (tx, result) => {},
      error => {
        console.log('error in inserting' + error.message);
      },
    );
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

export const deleteTable = async () => {
  try {
    db.transaction(tx => {
      tx.executeSql(
        'DROP TABLE IF EXISTS PrayTable',
        [],
        () => {},
        error => console.log(error),
      );
    });
  } catch (error) {
    console.log(error);
  }
};
