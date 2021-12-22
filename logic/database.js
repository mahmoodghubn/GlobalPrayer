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
          '(ID INTEGER PRIMARY KEY AUTOINCREMENT, FAJR INTEGER , SUNRISE INTEGER, DHUHUR INTEGER, ASR INTEGER, MAGRIB INTEGER, ISHA INTEGER)',
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

  const insert = async (FAJR, SUNRISE, DHUHUR, ASR, MAGRIB, ISHA) => {
    await db.transaction(async tx => {
      tx.executeSql(
        'INSERT INTO PrayTable (FAJR,SUNRISE,DHUHUR,ASR,MAGRIB,ISHA) VALUES (?,?,?,?,?,?)',
        [FAJR, SUNRISE, DHUHUR, ASR, MAGRIB, ISHA],
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
export function select(day, setDayPray): void {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT FAJR, SUNRISE, DHUHUR, ASR, MAGRIB, ISHA FROM PrayTable WHERE ID = ${day}`,
      [],
      (sqlTxn: SQLTransaction, res: SQLResultSet) => {
        const x = res.rows.item(0);
        setDayPray(x);
        console.log('getting data from select');
        console.log(res.rows.item(0));
      },
      error => {
        console.log('error message' + error.message);
      },
    );
  });
  //   } catch (error) {
  //     console.log('new werrororo');
  //     console.log(error);
  //   }
}
export default database;

//   db.transaction(tx => {
//     tx.executeSql(
//       'DELETE FROM PrayTable',
//       [],
//       () => {
//         /*some code*/
//       },
//       error => {
//         console.log(error);
//       },
//     );
//   });
