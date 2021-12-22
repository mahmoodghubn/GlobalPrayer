package com.sessizat;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Data;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.facebook.react.bridge.ReactApplicationContext;

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
        Log.d("Worker","startServiceMajmah");
        // Data inputData = getInputData();
        // String stringContext = inputData.getString("context");
        // Gson gson = new Gson();
        // ReactApplicationContext reactApplicationContext = gson.fromJson(stringContext, ReactApplicationContext.class);

        reactContext.startService(new Intent(reactContext, ExampleService.class));

        return Result.success();
    }
}
