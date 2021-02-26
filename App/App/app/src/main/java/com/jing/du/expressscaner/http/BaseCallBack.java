package com.jing.du.expressscaner.http;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

/**
 * Created by Charle on 2018-03-14.
 */

public abstract class BaseCallBack<T> {
    /*
    * 请求之前调用
    * */
    abstract public void onRequestBefore();

    /*
    * 请求成功调用
    * */
    abstract public void onSuccess(Response response,T t);

    /*
    * 请求失败调用
    * */
    abstract public void onError(Response response,int errorCode,Exception e);

    abstract public void onFailure(Request request,Exception e);
}
