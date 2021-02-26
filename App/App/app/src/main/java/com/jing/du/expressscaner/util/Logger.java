package com.jing.du.expressscaner.util;

import android.util.Log;

/**
 * Created by Charle on 2018-03-14.
 */

public class Logger {
    public static boolean LOGGER_SWITCH = true;
    public static void i(String tag, String msg) {
        if (LOGGER_SWITCH)
            Log.i(tag, msg);
    }

    public static void e(String tag, String msg) {
        if (LOGGER_SWITCH)
            Log.e(tag, msg);
    }

    public static void d(String tag, String msg) {
        if (LOGGER_SWITCH)
            Log.d(tag, msg);
    }

    public static void w(String tag, String msg) {
        if (LOGGER_SWITCH)
            if (StringUtils.isEmpty(msg)) {
                return;
            }
        Log.w(tag, msg);
    }

    public static void v(String tag, String msg) {
        if (LOGGER_SWITCH)
            Log.v(tag, msg);
    }
}
