package com.sessizat;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;

import android.util.Log;

import androidx.work.Data;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

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
                       Log.d("ExampleModule","getName");


       return REACT_CLASS;

   }

   @ReactMethod

   public void startService() 
   {
       Log.d("ExampleModule","startServiceFuMajmah");
//       Gson gson = new Gson();
    //    String stringContext = gson.toJson(this.reactContext);
    //    Data data = new Data.Builder()
    //            .putString("stringContext",stringContext)
    //            .build();
    //             Log.d("ExampleModule","startService");

      OneTimeWorkRequest oneTimeWorkRequest = new OneTimeWorkRequest.Builder(WorkerExample.class)
              .build();

      WorkManager.getInstance(this.reactContext).enqueue(oneTimeWorkRequest);
    //    this.reactContext.startService(new Intent(this.reactContext, ExampleService.class));

   }

   @ReactMethod

   public void stopService() {
                Log.d("ExampleModule","stopServiceFuMajmah");

       this.reactContext.stopService(new Intent(this.reactContext, ExampleService.class));

   }

}