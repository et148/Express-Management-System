package com.jing.du.expressscaner.http;

import android.app.Dialog;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;

import com.jing.du.expressscaner.constant.BusinessConstant;
import com.jing.du.expressscaner.util.Logger;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.FormEncodingBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Created by Charle on 2018-03-14.
 */

public class HttpRequest {
    private static HttpRequest httpRequest;
    private OkHttpClient okHttpClient;
    private Handler handler;
    private Context context;
    private Boolean hasLoadingDialog;
    private Dialog loadingDialog;
    private int loadingColor;
    private String loadingMeg;

    public static final String TAG = "HttpRequest";

    private HttpRequest() {
        okHttpClient = new OkHttpClient();
        okHttpClient.setConnectTimeout(BusinessConstant.CONNECT_TIME_OUT, TimeUnit.SECONDS);
        handler = new Handler(Looper.getMainLooper());
    }

    public static HttpRequest getInstance() {
        if (httpRequest == null) {
            synchronized (HttpRequest.class) {
                if (httpRequest == null) {
                    httpRequest = new HttpRequest();
                }
            }
        }
        return httpRequest;
    }

    public void request(final Request request, final BaseCallBack callBack) {
        callBack.onRequestBefore();
        okHttpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Request request, IOException e) {
                callBackFailure(request, callBack, e);
            }

            @Override
            public void onResponse(Response response) throws IOException {
                if (response.isSuccessful()) {
                    String resString = response.body().string();
                    Logger.d(TAG, resString);
                    callBackSuccess(response, resString, callBack);
                } else {
                    callBackError(response, callBack, new Exception("错误"));
                }
            }
        });
    }

    private void callBackFailure(final Request request, final BaseCallBack callBack, final Exception e) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                callBack.onFailure(request, e);
            }
        });
    }

    private void callBackError(final Response response, final BaseCallBack callBack, final Exception e) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                callBack.onError(response, response.code(), e);
            }
        });
    }

    private void callBackSuccess(final Response response, final Object o, final BaseCallBack baseCallBack) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                baseCallBack.onSuccess(response, o);
            }
        });
    }

    public void get(String url, Map<String, Object> params, BaseCallBack baseCallBack) {
        Request request = buildRequest(url, params, "GET");
        request(request, baseCallBack);
    }

    public void post(String url, Map<String, Object> params, BaseCallBack baseCallBack) {
        Request request = buildRequest(url, params, "POST");
        request(request, baseCallBack);
    }

    private Request buildRequest(String url, Map<String, Object> params, String type) {
        Request.Builder builder = new Request.Builder();
        builder.url(url);
        if (type.equals("GET")) {
            builder.get();
        } else if (type.equals("POST")) {
            builder.post(buildRequestBody(params));
        }
        return builder.build();
    }

    private RequestBody buildRequestBody(Map<String, Object> params) {
        FormEncodingBuilder builder = new FormEncodingBuilder();
        if (params != null) {
            for (Map.Entry<String, Object> entity : params.entrySet()) {
                if (entity.getValue() != null) {
                    builder.add(entity.getKey(), entity.getValue().toString());
                } else {
                    builder.add(entity.getKey(), "");
                }
            }
        }else{
            builder.add("1", "1");
        }
        return builder.build();
    }
}
