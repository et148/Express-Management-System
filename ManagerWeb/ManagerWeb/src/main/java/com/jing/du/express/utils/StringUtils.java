package com.jing.du.express.utils;

/**
 * Created by Administrator on 2017/9/18 018.
 */

public class StringUtils {

    public static boolean isEmpty(String str){
        return str==null||str.length()==0?true:false;
    }

    public static boolean isNotEmpty(String str){
        return !isEmpty(str);
    }
}
