package com.sessizat;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;

import androidx.work.BackoffPolicy;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import javax.annotation.Nonnull;

public class ExampleModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "Example";

    public static ReactApplicationContext reactContext;

    public ExampleModule(@Nonnull ReactApplicationContext reactContext) {

        super(reactContext);

        this.reactContext = reactContext;

    }

    @Nonnull

    @Override

    public String getName() {

        return REACT_CLASS;

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

        WorkManager.getInstance(this.reactContext).enqueue(oneTimeWorkRequest);

        WorkManager.getInstance(this.reactContext).enqueueUniquePeriodicWork(
                "periodicWork",
                ExistingPeriodicWorkPolicy.REPLACE,
                periodicWorkRequest
        );
    }

    @ReactMethod

    public void stopService() {

        this.reactContext.stopService(new Intent(this.reactContext, ExampleService.class));

    }

}