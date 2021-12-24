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

const database = monthData => {
  useEffect(() => {
    createTable();
    if (monthData) {
      getMonthPrayingTimes(monthData);
    }
  }, [monthData]);
  const createTable = () => {
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

  const getMonthPrayingTimes = data => {
    let mon = new Date().getMonth();
    for (let i = 0; i < 30; i++) {
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
        (tx, result) => {
          // console.log('data inserted successfully');
        },
        error => {
          console.log('error in inserting' + error.message);
        },
      );
    });
  };
};

export const select = day => {
  return new Promise(function (resolve, reject) {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha FROM PrayTable WHERE ID = ${day}`,
        [],
        (sqlTxn: SQLTransaction, res: SQLResultSet) => {
          const dayPray = res.rows.item(0);
          console.log('getting data from select');
          console.log(dayPray);
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

export default database;
