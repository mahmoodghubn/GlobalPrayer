package com.sessizat;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.util.Calendar;
import java.util.Date;
import java.util.Objects;
import java.util.concurrent.ExecutionException;

import javax.annotation.Nonnull;

import static android.content.Context.ALARM_SERVICE;

public class ExampleModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "Example";
    public static ReactApplicationContext reactContext;
    private Calendar calendar;
    private AlarmManager alarmManager;
    private PendingIntent pendingIntent;
    private final String[] array = {"Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"};

    public ExampleModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        ExampleModule.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    private void cancelQuietAlarm(int requestCode) {
        Intent intent = new Intent(reactContext, QuietAlarmReceiver.class);
        pendingIntent = PendingIntent.getBroadcast(reactContext, requestCode, intent, PendingIntent.FLAG_ONE_SHOT);
        if (alarmManager == null) {
            alarmManager = (AlarmManager) reactContext.getSystemService(ALARM_SERVICE);
        }
        alarmManager.cancel(pendingIntent);
    }

    private void cancelSoundAlarm(int requestCode) {
        Intent intent = new Intent(reactContext, SoundAlarmReceiver.class);
        pendingIntent = PendingIntent.getBroadcast(reactContext, requestCode, intent, PendingIntent.FLAG_ONE_SHOT);
        if (alarmManager == null) {
            alarmManager = (AlarmManager) reactContext.getSystemService(ALARM_SERVICE);
        }
        alarmManager.cancel(pendingIntent);
    }

    private void setQuietAlarm(int hour, int minute, int requestCode) {
        calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        if (calendar.getTimeInMillis() > new Date().getTime()) {
            alarmManager = (AlarmManager) reactContext.getSystemService(ALARM_SERVICE);
            Intent intent = new Intent(reactContext, QuietAlarmReceiver.class);
            pendingIntent = PendingIntent.getBroadcast(reactContext, requestCode, intent, PendingIntent.FLAG_ONE_SHOT);
            alarmManager.setExact(AlarmManager.RTC, calendar.getTimeInMillis(), pendingIntent);
        }
    }

    private void setSoundAlarm(int hour, int minute, int requestCode) {
        calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        if (calendar.getTimeInMillis() > new Date().getTime()) {
            alarmManager = (AlarmManager) reactContext.getSystemService(ALARM_SERVICE);
            Intent intent = new Intent(reactContext, SoundAlarmReceiver.class);
            pendingIntent = PendingIntent.getBroadcast(reactContext, requestCode, intent, PendingIntent.FLAG_ONE_SHOT);
            alarmManager.setExact(AlarmManager.RTC, calendar.getTimeInMillis(), pendingIntent);
        }
    }

    @ReactMethod
    public void setMuteOnPray(String pray, String prayTime, boolean bool) {
        int requestCodeQuietAlarm = 0;
        for (int i = 0; i < array.length; i++) {
            if (pray.contentEquals(array[i])) {
                requestCodeQuietAlarm = i;
            }
        }
        int requestCodeSoundAlarm = requestCodeQuietAlarm + 5;
        if (bool) {
            int quietHour = Integer.parseInt(prayTime.substring(0, 2));
            int quietMinute = Integer.parseInt(prayTime.substring(3, 5)) + 2;
            if (quietMinute > 59) {
                quietMinute = quietMinute - 60;
                quietHour++;
            }
            int soundMinute = quietMinute + 15;
            int soundHour = quietHour;
            if (soundMinute > 59) {
                soundMinute = soundMinute - 60;
                soundHour++;
            }
            setQuietAlarm(quietHour, quietMinute, requestCodeQuietAlarm);
            setSoundAlarm(soundHour, soundMinute, requestCodeSoundAlarm);
        } else {
            cancelQuietAlarm(requestCodeQuietAlarm);
            cancelSoundAlarm(requestCodeSoundAlarm);
        }
    }

    @ReactMethod
    public void setDailyMute(ReadableMap prayTimes) {
        int requestCodeQuietAlarm = 0;
        int requestCodeSoundAlarm;
        int quietHour;
        int quietMinute;
        int soundHour;
        int soundMinute;
        String pray;
        String prayTime;
        ReadableMapKeySetIterator mapIterator = prayTimes.keySetIterator();
        while (mapIterator.hasNextKey()) {
            pray = mapIterator.nextKey();
            prayTime = prayTimes.getString(pray);
            for (int j = 0; j < array.length; j++) {
                if (pray.contentEquals(array[j])) {
                    requestCodeQuietAlarm = j;
                }
            }
            requestCodeSoundAlarm = requestCodeQuietAlarm + 5;
            assert prayTime != null;
            quietHour = Integer.parseInt(prayTime.substring(0, 2));
            quietMinute = Integer.parseInt(prayTime.substring(3, 5)) + 2;
            soundMinute = quietMinute + 15;
            soundHour = quietHour;
            if (quietMinute > 59) {
                quietMinute = quietMinute - 60;
                quietHour++;
            }
            if (soundMinute > 59) {
                soundMinute = soundMinute - 60;
                soundHour++;
            }
            setQuietAlarm(quietHour, quietMinute, requestCodeQuietAlarm);
            setSoundAlarm(soundHour, soundMinute, requestCodeSoundAlarm);
        }
        reactContext.stopService(new Intent(reactContext, ExampleService.class));
    }

    @ReactMethod
    public void startService() {
        boolean foreground = false;
        try {
            foreground = new ForegroundCheckTask().execute(reactContext).get();
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }
        if (foreground) {
            reactContext.startService(new Intent(reactContext, ExampleService.class));
        }
        calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 10);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        alarmManager = (AlarmManager) reactContext.getSystemService(ALARM_SERVICE);
        Intent intent = new Intent(reactContext, RepeatingAlarmReceiver.class);
        pendingIntent = PendingIntent.getBroadcast(reactContext, 100, intent, PendingIntent.FLAG_ONE_SHOT);
        alarmManager.setWindow(AlarmManager.RTC, calendar.getTimeInMillis(), 60 * 60 * 1000, pendingIntent);

    }

    @ReactMethod
    public void stopService() {
        reactContext.stopService(new Intent(reactContext, ExampleService.class));
    }

    @ReactMethod
    public void exitApp() {
        Objects.requireNonNull(getCurrentActivity()).finishAndRemoveTask();
    }

//    public void writeToFile(String data) {
//        Date date = new Date();
//        try {
//            File firstFile = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "Global Prayer/");
//            File file = new File(firstFile, "Global Prayer_log.log");
//            File out = new File(String.valueOf(file));
//            FileOutputStream outStream = new FileOutputStream(out, true);
//            OutputStreamWriter outStreamWriter = new OutputStreamWriter(outStream);
//            outStreamWriter.append(String.valueOf(date)).append(data).append("\n");
//            outStreamWriter.flush();
//
//        } catch (IOException e) {
//            Log.e("Exception", "File write failed: " + e.toString());
//        }
//    }
}