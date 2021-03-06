import React, {useState, useEffect} from 'react';
import PushNotification, {Importance} from 'react-native-push-notification';

export const testSchedule = (date, pray, id) => {
  PushNotification.createChannel(
    {
      channelId: 'channel-id', // (required)
      channelName: 'My channel', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      playSound: true, // (optional) default: true
      soundName: 'azan.mp3', // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: false, // (optional) default: true. Creates the default vibration pattern if true.
    },
    created => console.log(`createChannel returned ${created}`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
  PushNotification.localNotificationSchedule({
    channelId: 'channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    title: `The azan of ${pray}`, // (optional)
    message: `Now is the time for the ${pray} prayer`, // (required)
    date: date, // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
    id: id,
  });
};
