import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Drawer} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DrawerContent({praysData, navigation}) {
  const {t, i18n} = useTranslation();
  let flexDir = praysData.RTL ? 'row-reverse' : 'row';
  return (
    <View style={{flex: 1, textColor: 'black'}}>
      <Drawer.Section>
        <View style={{margin: 20}}>
          <TouchableOpacity onPress={() => navigation.navigate('Mute')}>
            <View style={{flexDirection: flexDir}}>
              <Icon.Button
                name="volume-high-outline"
                color="#000"
                backgroundColor="white"></Icon.Button>
              <Text style={{fontSize: 20, color: 'black'}}>{t('Mute')}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{margin: 20}}>
          <TouchableOpacity onPress={() => navigation.navigate('Method')}>
            <View style={{flexDirection: flexDir}}>
              <Icon.Button
                name="planet-outline"
                color="#000"
                backgroundColor="white"></Icon.Button>
              <Text style={{fontSize: 20, color: 'black'}}>{t('Method')}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{margin: 20}}>
          <TouchableOpacity onPress={() => navigation.navigate('Languages')}>
            <View style={{flexDirection: flexDir}}>
              <Icon.Button
                name="language-outline"
                color="#000"
                backgroundColor="white"></Icon.Button>
              <Text style={{fontSize: 20, color: 'black'}}>
                {t('Languages')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Drawer.Section>
    </View>
  );
}
const mapStateToProps = state => {
  return {
    praysData: state,
  };
};

export default connect(mapStateToProps)(DrawerContent);
