package com.sessizat;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */

    @Override
    protected String getMainComponentName() {
        return "sessizat";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
    }

}
//     public static final int ON_DO_NOT_DISTURB_CALLBACK_CODE = 1;


//     @RequiresApi(api = Build.VERSION_CODES.M)
//     public void requestForDoNotDisturbPermissionOrSetDoNotDisturbForApi23AndUp() {

// //        NotificationManager notificationManager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
//         // if user granted access else ask for permission
//         Handler mainHandler = new Handler(Looper.getMainLooper());

//         Runnable myRunnable = new Runnable() {
//             @Override
//             public void run() {
//                 Intent intent = new Intent(android.provider.Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
//                 startActivityForResult(intent, ON_DO_NOT_DISTURB_CALLBACK_CODE);
//             } // This is your code
//         };
//         mainHandler.post(myRunnable);

// //        if (notificationManager.isNotificationPolicyAccessGranted()) {
// //            AudioManager audioManager = (AudioManager) getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
// //            audioManager.setRingerMode(AudioManager.RINGER_MODE_SILENT);
// //        }
//             // Open Setting screen to ask for permisssion
//     }

// @RequiresApi(api = Build.VERSION_CODES.M)
// @Override
// public void onActivityResult(int requestCode, int resultCode, Intent data) {


//     // Check which request we're responding to
//     if (requestCode == ON_DO_NOT_DISTURB_CALLBACK_CODE) {
//         NotificationManager notificationManager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
//         // if user granted access else ask for permission
//         if (notificationManager.isNotificationPolicyAccessGranted()) {
//             AlarmManager alarmManager = (AlarmManager) getApplicationContext().getSystemService(ALARM_SERVICE);
//             Intent intent = new Intent(getApplicationContext(), QuietAlarmReceiver.class);
//             PendingIntent pendingIntent = PendingIntent.getBroadcast(getApplicationContext(), 0, intent, PendingIntent.FLAG_ONE_SHOT);
//             alarmManager.setExact(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + (60 * 1000), pendingIntent);
//         }

//     }
// }