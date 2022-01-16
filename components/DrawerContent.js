import React from 'react';
import {View} from 'react-native';
import {Text, Drawer} from 'react-native-paper';
import {DrawerItem} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';
export function DrawerContent(props) {
  const {t, i18n} = useTranslation();

  return (
    <View style={{flex: 1, textColor: 'black'}}>
      <Drawer.Section>
        <DrawerItem
          label={t('Mute')}
          onPress={() => {
            props.navigation.navigate(t('Mute'));
          }}
        />
        <DrawerItem
          label={t('Method')}
          onPress={() => {
            props.navigation.navigate(t('Method'));
          }}
        />
        <DrawerItem
          label="Languages"
          onPress={() => {
            props.navigation.navigate('Languages');
          }}
        />
      </Drawer.Section>
    </View>
  );
}
