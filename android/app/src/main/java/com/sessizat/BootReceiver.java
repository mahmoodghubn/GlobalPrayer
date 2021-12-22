package com.sessizat;

import android.content.BroadcastReceiver;

import android.content.Context;

import android.content.Intent;

import android.os.Build;
import android.util.Log;


public class BootReceiver extends BroadcastReceiver {
    
    @Override
    
    public void onReceive(Context context, Intent intent) {
       Log.d("sessizatBroadcastReceiver","before receiving ");

   if(intent.getAction() == Intent.ACTION_BOOT_COMPLETED){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Log.d("sessizatBroadcastReceiver","Starting the service in >=26 ");
            context.startForegroundService(new Intent(context, ExampleService.class));
            return;
        }
        Log.d("sessizatBroadcastReceiver","Starting the service in < 26 ");
        context.startService(new Intent(context, ExampleService.class));
    }
   }

}