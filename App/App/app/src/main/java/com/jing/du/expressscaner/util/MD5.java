package com.jing.du.expressscaner.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Created by Charle on 2018-03-15.
 */
public class MD5 {

    /**
     * 获取特定字符串的MD5码
     * eg:md5("YEN") 输出：0d9962cb9239354e6da0ca55ebd0b93c
     * @param str
     * @return
     */
    public static String md5(String str){
        try {
            MessageDigest md=MessageDigest.getInstance("MD5");
            md.update(str.getBytes());
            byte[] b=md.digest();
            int temp;
            StringBuffer sb=new StringBuffer("");
            for ( int offset = 0; offset <b.length ; offset++ ) {
                temp=b[offset];
                if(temp<0) temp+=256;
                if(temp<16) sb.append("0");
                sb.append(Integer.toHexString(temp));
            }
            str=sb.toString();
        } catch ( NoSuchAlgorithmException e ) {
            e.printStackTrace();
        }
        return str;
    }
}
