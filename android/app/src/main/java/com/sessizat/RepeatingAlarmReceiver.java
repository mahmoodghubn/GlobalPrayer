package com.sessizat;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;

import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.ExecutionException;

import static android.content.Context.ALARM_SERVICE;

public class RepeatingAlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        boolean foreground = false;
        try {
            foreground = new ForegroundCheckTask().execute(context).get();
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }

        if (!foreground) {
            ConnectivityManager cm =
                    (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            boolean isConnected = activeNetwork != null &&
                    activeNetwork.isConnectedOrConnecting();
            Date date = new Date();   // given date
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            int day = cal.get(Calendar.DAY_OF_MONTH);
            if ((day == 1) && (!isConnected)) {//also the app must be in the background or the alarm will not be set
                AlarmManager alarmManager = (AlarmManager) context.getSystemService(ALARM_SERVICE);
                Intent intent1 = new Intent(context, RepeatingAlarmReceiver.class);
                PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 100, intent1, PendingIntent.FLAG_ONE_SHOT);
                alarmManager.setExact(AlarmManager.RTC, cal.getTimeInMillis() + 15 * 60 * 1000, pendingIntent);
                return;
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(new Intent(context, ExampleService.class));
                return;
            }
        }

        context.startService(new Intent(context, ExampleService.class));

        AlarmManager everydayAlarmManager;
        PendingIntent everydayPendingIntent;
        everydayAlarmManager = (AlarmManager) context.getSystemService(ALARM_SERVICE);
        Intent everydayIntent = new Intent(context, RepeatingAlarmReceiver.class);
        everydayPendingIntent = PendingIntent.getBroadcast(context, 100, everydayIntent, PendingIntent.FLAG_ONE_SHOT);
        everydayAlarmManager.set(AlarmManager.RTC, getNextDay().getTimeInMillis(), everydayPendingIntent);

    }

    private Calendar getNextDay(){

        Date date = new Date();   // given date
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int day = cal.get(Calendar.DAY_OF_MONTH);
        int mon = cal.get(Calendar.MONTH);
        int year = cal.get(Calendar.YEAR);
        int[] daysList = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        int days = daysList[mon];
        if (year % 4 == 0 && mon == 1) {
            days = 29;
        }
        int nextYear = year;
        int nextMonth = mon;
        int nextDay = day+1;
        if(day == days){
            nextDay = 1;
            nextMonth = mon +1;
        }
        if (nextMonth == 12){
            nextMonth =0;
            nextYear = year+1;
        }
        Calendar everydayCalendar;
        everydayCalendar = Calendar.getInstance();
        everydayCalendar.set(Calendar.YEAR, nextYear);
        everydayCalendar.set(Calendar.MONTH, nextMonth);
        everydayCalendar.set(Calendar.DAY_OF_MONTH, nextDay);
        everydayCalendar.set(Calendar.HOUR_OF_DAY, 0);
        everydayCalendar.set(Calendar.MINUTE, 10);
        everydayCalendar.set(Calendar.SECOND, 0);
        everydayCalendar.set(Calendar.MILLISECOND, 0);
        return everydayCalendar;

    }
}

