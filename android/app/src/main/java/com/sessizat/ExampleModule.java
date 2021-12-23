package com.sessizat;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;

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
        int minute =calendar.get(Calendar.HOUR_OF_DAY); // gets hour in 24h format
        int hour = calendar.get(Calendar.MINUTE);
        int delay = (24*60)-(minute + hour *60);
        
        OneTimeWorkRequest oneTimeWorkRequest = new OneTimeWorkRequest.Builder(WorkerExample.class)
                .build();
        PeriodicWorkRequest periodicWorkRequest = new PeriodicWorkRequest.Builder(WorkerExample.class,1, TimeUnit.DAYS)
                .setInitialDelay(delay,TimeUnit.MINUTES)
                .build();

        WorkManager.getInstance(this.reactContext).enqueue(oneTimeWorkRequest);
        WorkManager.getInstance(this.reactContext).enqueue(periodicWorkRequest);

    }

    @ReactMethod

    public void stopService() {

        this.reactContext.stopService(new Intent(this.reactContext, ExampleService.class));

    }

}