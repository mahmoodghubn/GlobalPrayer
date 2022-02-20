import React, {useState, useEffect, useReducer, useRef} from 'react';
import {testSchedule} from './logic/notification';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  PermissionsAndroid,
  View,
  Text,
  AppState,
  Image,
  Platform,
  Alert,
  ToastAndroid,
  AlertIOS,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Example from './Example';
import {connect} from 'react-redux';
import {MyHeadlessTask} from './index';
import {createTable} from './logic/database';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MuteSettings from './components/MuteSettings';
import DrawerContent from './components/DrawerContent';
import {fetchPraysRequest, store, changeStylesSides} from './store';
import Method from './components/Method';
import {LogBox} from 'react-native';
import {Languages} from './RTL_support/Languages';
import {Provider} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import HomeScreen from './components/HomeScreen';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreLogs(['[react-native-gesture-handler]']); // Ignore log notification by message
import {useTranslation} from 'react-i18next';
import {getBundleId} from 'react-native-device-info';
import IntentLauncher, {IntentConstant} from 'react-native-intent-launcher';
const praysNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const pack = getBundleId();
const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    IntentLauncher.startActivity({
      action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
      data: 'package:' + pack,
    });
  }
};
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

const backFromSettings = appState => {
  openAppSettings();
  const subscription = AppState.addEventListener(
    'change',
    async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        subscription.remove();
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          store.dispatch(fetchPraysRequest());
          createTable();
          Example.startService();
        } else {
          const msg = "Access didn't permitted";
          if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
          } else {
            AlertIOS.alert(msg);
          }
          Example.exitApp();
        }
      }

      appState.current = nextAppState;
    },
  );
};

const fetchData = () => {
  store.dispatch(fetchPraysRequest());
  Example.startService();
};
const App = ({praysData, fetchPrays}) => {
  const {t, i18n} = useTranslation();
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    async function fetchData() {
      let lan = await AsyncStorage.getItem('I18N_LANGUAGE');
      if (!lan) {
        lan = 'en';
      }
      i18n.changeLanguage(lan).then(() => {
        if (lan === 'ar') {
          store.dispatch(changeStylesSides(true));
        } else {
          store.dispatch(changeStylesSides(false));
        }
      });
    }
    const requestLocationPermission = async () => {
      //   if (Platform.OS === 'ios') {
      //     getOneTimeLocation();
      //     subscribeLocationLocation();
      //   } else
      // {

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          store.dispatch(fetchPraysRequest());
          createTable();
          Example.startService();
        } else {
          Alert.alert(
            'Permission Error',
            'press settings button and grant access to location',
            [
              {text: 'Settings', onPress: () => backFromSettings(appState)},
              {text: 'Close app', onPress: () => Example.exitApp()},
            ],
          );
        }
      } catch (err) {
        console.warn(err);
      }
    };

    fetchData();
    requestLocationPermission();
  }, []);
  const Drawer = createDrawerNavigator();

  return praysData.loading ? (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}>
      <Image
        source={require('./assets/aksa.png')}
        style={{
          resizeMode: 'cover',
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  ) : praysData.error ? (
    <View style={style.error}>
      <Text style={style.text1}>OOPS!</Text>
      <Text style={style.text2}>{praysData.error}</Text>
      <TouchableOpacity style={style.button} onPress={() => fetchData()}>
        <Text style={style.text2}>retry</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen
            name="Global Prayer"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="Mute Settings"
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
            name="Methods"
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
const style = StyleSheet.create({
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontSize: 40,
    color: 'red',
  },
  text2: {
    fontSize: 25,
    color: 'red',
  },
  button: {
    backgroundColor: 'white',
    margin: 20,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
