package com.sessizat;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;

import com.facebook.react.HeadlessJsTaskService;

public class ExampleService extends Service {

    private final Handler handler = new Handler();
    private final Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            Context context = getApplicationContext();
            Intent myIntent = new Intent(context, ExampleEventService.class);
            context.startService(myIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
            handler.postDelayed(this, 3000); // 5 Min
        }
    };

    @Override
    public IBinder onBind(Intent intent) {
        this.handler.post(this.runnableCode);
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        this.handler.post(this.runnableCode);

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode);

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY_COMPATIBILITY;

    }

}
