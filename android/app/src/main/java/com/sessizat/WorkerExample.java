package com.sessizat;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.ExecutionException;

import org.jetbrains.annotations.NotNull;

public class WorkerExample extends Worker {

    Context context;
    boolean foreground;

    public WorkerExample(@NonNull @NotNull Context context, @NonNull @NotNull WorkerParameters workerParams) {
        super(context, workerParams);
        this.context = context;
        try {
            this.foreground = new ForegroundCheckTask().execute(context).get();
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }

    }

    @NonNull
    @NotNull
    @Override
    public Result doWork() {
        Date date = new Date();   // given date
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int day = cal.get(Calendar.DAY_OF_MONTH);

        ConnectivityManager cm =
                (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        boolean isConnected = activeNetwork != null &&
                activeNetwork.isConnectedOrConnecting();

        if (!foreground) {

            if ((day == 1) && (!isConnected)) {//also the app must be in the background or the alarm will not be set
                return Result.retry();
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(new Intent(context, ExampleService.class));
                return Result.success();
            }
        }
        context.startService(new Intent(context, ExampleService.class));
        return Result.success();
    }
}
