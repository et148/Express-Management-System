package com.jing.du.express.dto;

import java.io.Serializable;

public class RetMsg implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 2360337615576417745L;

    public static Object success(Object jsonData) {
        return new Message(true, jsonData, null);
    }

    public static Object failure(String errorMsg) {
        return new Message(false, null, errorMsg);
    }

    public static Object msg(Boolean isOk, Object jsonData, String message) {
        return new Message(isOk, jsonData, message);
    }

    private RetMsg() {
        super();
    }

}

