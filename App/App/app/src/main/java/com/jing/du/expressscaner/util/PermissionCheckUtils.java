package com.jing.du.expressscaner.util;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;

import java.util.ArrayList;
import java.util.List;

/*
* 检查权限工具
* */
public class PermissionCheckUtils {
    private static List<String> missingPermission = new ArrayList<>();
    private static final int REQUEST_PERMISSION_CODE = 12345;

    /*
     * 检查权限
     * */
    public static void checkAndRequestPermissions(Context context,String[] permissions) {
        // Check for permissions
        for (String eachPermission : permissions) {
            if (ContextCompat.checkSelfPermission(context, eachPermission) != PackageManager.PERMISSION_GRANTED) {
                missingPermission.add(eachPermission);
            }
        }
        // Request for missing permissions
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !missingPermission.isEmpty()) {
            ActivityCompat.requestPermissions((Activity) context,
                    missingPermission.toArray(new String[missingPermission.size()]),
                    REQUEST_PERMISSION_CODE);
        }

    }
}
