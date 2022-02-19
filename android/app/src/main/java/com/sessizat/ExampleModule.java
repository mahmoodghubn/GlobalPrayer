package com.sessizat;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableNativeMap;

import androidx.work.BackoffPolicy;
import androidx.work.Data;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import java.util.Calendar;
import java.util.Date;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

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
        Date date = new Date();   // given date
        Calendar calendar = Calendar.getInstance(); // creates a new calendar instance
        calendar.setTime(date);   // assigns calendar to given date
        int hour = calendar.get(Calendar.HOUR_OF_DAY); // gets hour in 24h format
        int minute = calendar.get(Calendar.MINUTE);
        int delay = (24 * 60) - (minute + hour * 60);

        //setBackoffCriteria should depend on the country if the country is likely to not have internet connection for long time this means we will not depend on the internet connection to be set up
        OneTimeWorkRequest oneTimeWorkRequest = new OneTimeWorkRequest.Builder(WorkerExample.class)
                .setBackoffCriteria(
                        BackoffPolicy.LINEAR,
                        15,
                        TimeUnit.MINUTES)
                .build();


        PeriodicWorkRequest periodicWorkRequest = new PeriodicWorkRequest.Builder(WorkerExample.class, 1, TimeUnit.DAYS)
                .setBackoffCriteria(
                        BackoffPolicy.LINEAR,
                        15,
                        TimeUnit.MINUTES)
                .setInitialDelay(delay, TimeUnit.MINUTES)
                .build();

        WorkManager.getInstance(reactContext).enqueue(oneTimeWorkRequest);

        WorkManager.getInstance(reactContext).enqueueUniquePeriodicWork(
                "periodicWork",
                ExistingPeriodicWorkPolicy.REPLACE,
                periodicWorkRequest
        );
    }

    @ReactMethod

    public void stopService() {

        reactContext.stopService(new Intent(reactContext, ExampleService.class));

    }

    @ReactMethod

    public void exitApp() {

        Objects.requireNonNull(getCurrentActivity()).finishAndRemoveTask();

    }
}