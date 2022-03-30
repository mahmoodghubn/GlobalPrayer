import React, {useState, useEffect, useReducer, useRef} from 'react';
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
  LogBox,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {getBundleId} from 'react-native-device-info';
import {Provider} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import IntentLauncher from 'react-native-intent-launcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Example from './Example';
import {createTable} from './logic/database';
import MuteSettings from './components/MuteSettings';
import DrawerContent from './components/DrawerContent';
import {fetchPraysRequest, store, changeStylesSides} from './store';
import Method from './components/Method';
import {Languages} from './RTL_support/Languages';
import HomeScreen from './components/HomeScreen';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreLogs(['[react-native-gesture-handler]']); // Ignore log notification by message
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

const App = ({praysData}) => {
  const {t, i18n} = useTranslation();
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    async function fetch() {
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

    fetch();
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

export default connect(mapStateToProps)(App);

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
