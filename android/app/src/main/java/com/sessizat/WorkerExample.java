package com.sessizat;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Data;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import java.util.Calendar;
import java.util.Date;

import org.jetbrains.annotations.NotNull;

import static com.sessizat.ExampleModule.reactContext;

public class WorkerExample extends Worker {
    public WorkerExample(@NonNull @NotNull Context context, @NonNull @NotNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @NotNull
    @Override
    public Result doWork() {
        Date date = new Date();   // given date
        Log.d("aftercalling","mahmoodghubn");
        Log.d("mahmoodghubn",date.toString());
        reactContext.startService(new Intent(reactContext, ExampleService.class));

//        Date date = new Date();   // given date
//        Calendar calendar = Calendar.getInstance(); // creates a new calendar instance
//        calendar.setTime(date);   // assigns calendar to given date
//        int minute =calendar.get(Calendar.HOUR_OF_DAY); // gets hour in 24h format
//        int hour = calendar.get(Calendar.MINUTE);
//        int sleepingTime = (24*60)-(minute + hour *60);
//        int milli = (sleepingTime) * 60 *1000;
//        try {
//            Thread.sleep(milli);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }


        return Result.success();
    }
}
