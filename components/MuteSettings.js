import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import {render} from 'react-dom';

// export function MuteSettings() {
//   const praysNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
//   const [fajrAlarm, setFajrAlarm] = useState(false);
//   const setAlarm = () => {
//     setFajrAlarm(alarm => !alarm);
//   };
//   return praysNames.map(pray => (
//     <View style={styles.prayStyle}>
//       <Text style={styles.text}>{pray}</Text>
//       <Switch
//         trackColor={{false: '#767577', true: '#81b0ff'}}
//         thumbColor={fajrAlarm ? '#f5dd4b' : '#f4f3f4'}
//         ios_backgroundColor="#3e3e3e"
//         onValueChange={setAlarm}
//         value={fajrAlarm}
//       />
//     </View>
//   ));
// }

export class MuteSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      count: false,
    };
  }
  // const [fajrAlarm, setFajrAlarm] = useState(false);
  render() {
    const praysNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    return praysNames.map(pray => (
      <View style={styles.prayStyle}>
        <Text style={styles.text}>{pray}</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={this.state.count ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => this.setState({count: !this.state.count})}
          value={this.state.count}
        />
      </View>
    ));
  }
}
const styles = StyleSheet.create({
  prayStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'space-between',
    backgroundColor: '#aaa',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
});
