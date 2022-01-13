import React, {Component, useState, useEffect, useReducer} from 'react';
import {ScrollView, View, Text, StyleSheet, Switch} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RadioButton} from 'react-native-paper';
import {fetchNewData} from '../index';
import Example from '../Example';
const method = () => {
  const [checked, setChecked] = React.useState('');
  const changeUrl = value => {
    setChecked(value);
    AsyncStorage.setItem('method', value);
    fetchNewData();
  };
  useEffect(() => {
    async function fetchData() {
      value = await AsyncStorage.getItem('method');
      if (value) {
        setChecked(value);
      } else {
        setChecked(13);
      }
    }
    fetchData();
  }, [checked]);

  return (
    <ScrollView>
      <View style={styles.prayStyle}>
        <RadioButton
          value="0"
          status={checked === '0' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('0')}
        />
        <Text style={styles.text}>Shia Ithna-Ansari</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="1"
          status={checked === '1' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('1')}
        />
        <Text style={styles.text}>University of Islamic Sciences, Karachi</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="2"
          status={checked === '2' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('2')}
        />
        <Text style={styles.text}>Islamic Society of North America</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="3"
          status={checked === '3' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('3')}
        />
        <Text style={styles.text}>Muslim World League</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="4"
          status={checked === '4' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('4')}
        />
        <Text style={styles.text}>Umm Al-Qura University, Makkah</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="5"
          status={checked === '5' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('5')}
        />
        <Text style={styles.text}>Egyptian General Authority of Survey</Text>
      </View>

      <View style={styles.prayStyle}>
        <RadioButton
          value="7"
          status={checked === '7' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('7')}
        />
        <Text style={styles.text}>
          Institute of Geophysics, University of Tehran
        </Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="8"
          status={checked === '8' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('8')}
        />
        <Text style={styles.text}>Gulf Region</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="9"
          status={checked === '9' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('9')}
        />
        <Text style={styles.text}>Kuwait</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="10"
          status={checked === '10' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('10')}
        />
        <Text style={styles.text}>Qatar</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="11"
          status={checked === '11' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('11')}
        />
        <Text style={styles.text}>Majlis Ugama Islam Singapura, Singapore</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="12"
          status={checked === '12' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('12')}
        />
        <Text style={styles.text}>Union Organization islamic de France</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="13"
          status={checked === '13' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('13')}
        />
        <Text style={styles.text}>Diyanet İşleri Başkanlığı, Turkey</Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="14"
          status={checked === '14' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('14')}
        />
        <Text style={styles.text}>
          Spiritual Administration of Muslims of Russia
        </Text>
      </View>
      <View style={styles.prayStyle}>
        <RadioButton
          value="15"
          status={checked === '15' ? 'checked' : 'unchecked'}
          onPress={() => changeUrl('15')}
        />
        <Text style={styles.text}>Moonsighting Committee Worldwide</Text>
      </View>
    </ScrollView>
  );
};

export default method;
const styles = StyleSheet.create({
  prayStyle: {
    flexDirection: 'row',
    backgroundColor: '#aaa',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

// let x;
// return (
//   // <View style={styles.prayStyle}>
//   <View style={styles.prayStyle}>
//     {methods.map((text, key) => {
//       x = JSON.stringify(key);
//       return (
//         <RadioButton
//           value={x}
//           status={checked == x ? 'checked' : 'unchecked'}
//           onPress={() => changeUrl(x)}
//         />
//       );
//     })}
//   </View>
// );
