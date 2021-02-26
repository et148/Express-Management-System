package com.jing.du.express.dto;

import com.alibaba.fastjson.JSONObject;

public class Message {

    private Boolean isOk;

    private Object jsonData;

    private String message;

    public Message(Boolean isOk, Object jsonData, String message) {
        super();
        this.isOk = isOk;
        this.jsonData = JSONObject.toJSON(jsonData);
        this.message = message;
    }

    public Boolean getIsOk() {
        return isOk;
    }

    public void setIsOk(Boolean isOk) {
        this.isOk = isOk;
    }

    public Object getJsonData() {
        return jsonData;
    }

    public void setJsonData(Object jsonData) {
        this.jsonData = jsonData;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
