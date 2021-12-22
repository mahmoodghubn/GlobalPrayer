package com.sessizat;

import com.facebook.react.ReactPackage;

import com.facebook.react.bridge.NativeModule;

import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;

import java.util.Collections;

import java.util.List;
import android.util.Log;

public class ExamplePackage implements ReactPackage {

   @Override

   public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {

                Log.d("ExamplePackage","createNativeModules");

       return Arrays.<NativeModule>asList(

               new ExampleModule(reactContext)

       );

   }

   @Override

   public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
            Log.d("ExamplePackage","createViewManager");

       return Collections.emptyList();

   }

}