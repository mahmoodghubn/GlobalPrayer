import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Drawer} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
export function DrawerContent(props) {
  const {t, i18n} = useTranslation();

  return (
    <View style={{flex: 1, textColor: 'black'}}>
      <Drawer.Section>
        <View style={{margin: 20}}>
          <TouchableOpacity onPress={() => props.navigation.navigate('Mute')}>
            <Text style={{fontSize: 20, color: 'black'}}>{t('Mute')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{margin: 20}}>
          <TouchableOpacity onPress={() => props.navigation.navigate('Method')}>
            <Text style={{fontSize: 20, color: 'black'}}>{t('Method')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{margin: 20}}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Languages')}>
            <Text style={{fontSize: 20, color: 'black'}}>{t('Languages')}</Text>
          </TouchableOpacity>
        </View>
      </Drawer.Section>
    </View>
  );
}
