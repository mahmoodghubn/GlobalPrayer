import React from 'react';
import {View} from 'react-native';
import {Text, Drawer} from 'react-native-paper';
import {DrawerItem} from '@react-navigation/drawer';
export function DrawerContent(props) {
  return (
    <View style={{flex: 1, textColor: 'black'}}>
      <Drawer.Section>
        <DrawerItem
          label="Mute Settings"
          onPress={() => {
            props.navigation.navigate('Mute Settings');
          }}
        />
        <DrawerItem
          label="Change Method"
          onPress={() => {
            props.navigation.navigate('Change Method');
          }}
        />
      </Drawer.Section>
    </View>
  );
}
