import React, {useState, useEffect, useReducer, useMemo, memo} from 'react';
import {testSchedule} from './logic/notification';
import Icon from 'react-native-vector-icons/Ionicons';
import {PermissionsAndroid, View, Text, AppState, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Example from './Example';
import {connect} from 'react-redux';
import {MyHeadlessTask} from './index';
import {createTable} from './logic/database';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MuteSettings from './components/MuteSettings';
import DrawerContent from './components/DrawerContent';
import {fetchPraysRequest, store} from './store';
import Method from './components/Method';
import {LogBox} from 'react-native';
import {Languages} from './RTL_support/Languages';
import {Provider} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import HomeScreen from './components/HomeScreen';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

const praysNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const getRemainSeconds = pray => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const time = minute * 60 + hour * 3600;
  const prayHour = parseInt(pray.slice(0, 2));
  const prayMinute = parseInt(pray.slice(3, 5));
  const prayTime = prayHour * 3600 + prayMinute * 60;
  if (time < prayTime) {
    return prayTime - time;
  } else {
    return 24 * 3600 - time + prayTime;
  }
};

const isPrayPassed = prayTime => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const time = minute + hour * 60;
  const prayHour = parseInt(prayTime.slice(0, 2));
  const prayMinute = parseInt(prayTime.slice(3, 5));
  const namazVakti = prayHour * 60 + prayMinute;
  return namazVakti > time;
};

const App = ({praysData, fetchPrays}) => {
  useEffect(() => {
    const requestLocationPermission = async () => {
      //   if (Platform.OS === 'ios') {
      //     getOneTimeLocation();
      //     subscribeLocationLocation();
      //   } else
      // {

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          store.dispatch(fetchPraysRequest());
          createTable();
          Example.startService();
        } else {
          // setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestLocationPermission();
  }, []);
  const Drawer = createDrawerNavigator();

  return praysData.loading ? (
    <View>
      <Image source={require('./assets/aksa.jpg')} />
    </View>
  ) : praysData.error ? (
    <Text>{praysData.error}</Text>
  ) : (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="Global Prayer" component={HomeScreen} />
          <Drawer.Screen
            name="Mute"
            component={MuteSettings}
            options={({navigation}) => ({
              headerLeft: () => (
                <Icon.Button
                  name="arrow-back-outline"
                  color="#000"
                  backgroundColor="#fff"
                  onPress={() => navigation.goBack()}></Icon.Button>
              ),
            })}
          />
          <Drawer.Screen
            name="Method"
            component={Method}
            options={({navigation}) => ({
              headerLeft: () => (
                <Icon.Button
                  name="arrow-back-outline"
                  color="#000"
                  backgroundColor="#fff"
                  onPress={() => navigation.goBack()}></Icon.Button>
              ),
            })}
          />
          <Drawer.Screen
            name="Languages"
            component={Languages}
            options={({navigation}) => ({
              headerLeft: () => (
                <Icon.Button
                  name="arrow-back-outline"
                  color="#000"
                  backgroundColor="#fff"
                  onPress={() => navigation.goBack()}></Icon.Button>
              ),
            })}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const mapStateToProps = state => {
  return {
    praysData: state,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPrays: () => dispatch(MyHeadlessTask()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

export const startNotificationsFromBackground = async (prays, bool) => {
  //bool means user has changed the method
  let alarm;
  let prayTime;
  if (AppState.currentState == 'background' || bool) {
    for (let i = 0; i < 6; i++) {
      try {
        alarm = await AsyncStorage.getItem(praysNames[i]);
        prayTime = prays[praysNames[i]];
        if (alarm == 'true' && isPrayPassed(prayTime)) {
          testSchedule(
            new Date(Date.now() + getRemainSeconds(prayTime) * 1000),
            //do the notification override the old one
            praysNames[i],
            i,
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }
};
