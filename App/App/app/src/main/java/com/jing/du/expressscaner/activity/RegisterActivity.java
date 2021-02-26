package com.jing.du.expressscaner.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.alibaba.fastjson.JSONObject;
import com.jing.du.expressscaner.R;
import com.jing.du.expressscaner.app.AppContext;
import com.jing.du.expressscaner.constant.BusinessConstant;
import com.jing.du.expressscaner.dto.Message;
import com.jing.du.expressscaner.http.BaseCallBack;
import com.jing.du.expressscaner.http.HttpRequest;
import com.jing.du.expressscaner.model.User;
import com.jing.du.expressscaner.util.BeanMapConvertUtil;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import butterknife.BindView;
import butterknife.OnClick;

public class RegisterActivity extends BaseActivity {

    private User user;
    @BindView(R.id.activity_register_username)
    EditText activityRegisterUsername;
    @BindView(R.id.activity_register_password)
    EditText activityRegisterPassword;
    @BindView(R.id.activity_confirm_password)
    EditText activityConfirmPassword;
    @BindView(R.id.activity_register_phone)
    EditText activityRegisterPhone;
    @BindView(R.id.activity_register_address)
    EditText activityRegisterAddress;

    ExecutorService poolThread = Executors.newCachedThreadPool();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
    }

    @OnClick({R.id.activity_register_back, R.id.activity_register_register})
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.activity_register_back:
                finish();
                break;
            case R.id.activity_register_register:
                String name = activityRegisterUsername.getText().toString();
                if (TextUtils.isEmpty(name)) {
                    Toast.makeText(this, getText(R.string.username_empty_warning), Toast.LENGTH_SHORT).show();
                    return;
                }
                String password = activityRegisterPassword.getText().toString();
                if (TextUtils.isEmpty(password)) {
                    Toast.makeText(this, getText(R.string.password_empty_warning), Toast.LENGTH_SHORT).show();
                    return;
                }
                String rePassword = activityConfirmPassword.getText().toString();
                if (!rePassword.equals(password)) {
                    Toast.makeText(this, getText(R.string.confirm_password_not_same_warning), Toast.LENGTH_SHORT).show();
                    return;
                }

                String phone = activityRegisterPhone.getText().toString();
                if (!TextUtils.isEmpty(phone) && phone.length() < 11) {
                    Toast.makeText(this, getText(R.string.phone_warning), Toast.LENGTH_SHORT).show();
                    return;
                }

                String address = activityRegisterAddress.getText().toString();

                user = new User(name, password);
                user.setPhoneNumber(phone);
                user.setAddress(address);

                registerOnline(user);
                break;
        }
    }

    /*
     * 网络注册账号
     * */
    private void registerOnline(final User user) {
        poolThread.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    HttpRequest.getInstance().post(BusinessConstant.REGISTER_URL, BeanMapConvertUtil.convert2Map(user), new BaseCallBack() {
                        @Override
                        public void onRequestBefore() {
                        }

                        @Override
                        public void onSuccess(Response response, Object o) {
                            if(o!=null){
                                try{
                                    Message message = JSONObject.parseObject(o.toString(),Message.class);
                                    Log.d(message.getIsOk()+"","aaaaaaaaaaaaa");
                                    if(message.getIsOk()){
                                        Toast.makeText(context, getText(R.string.register_success), Toast.LENGTH_SHORT).show();
                                        finish();
                                    }else{
                                        Toast.makeText(context, getText(R.string.register_fail), Toast.LENGTH_SHORT).show();
                                    }
                                }catch (Exception e){
                                    Toast.makeText(context, getText(R.string.register_fail), Toast.LENGTH_SHORT).show();
                                    e.printStackTrace();
                                }
                            }else{
                                Log.d("111111111111","aaaaaaaaaaaaaaa");
                                Toast.makeText(context, getText(R.string.register_fail), Toast.LENGTH_SHORT).show();
                            }

                        }

                        @Override
                        public void onError(Response response, int errorCode, Exception e) {
                            Log.d(e.getMessage(),"aaaaaaaaaaaaaaaa");
                            Toast.makeText(context, getText(R.string.register_fail), Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onFailure(Request request, Exception e) {
                            Log.d(e.getMessage(),"aaaaaaaaaaaaaaaa");
                            Toast.makeText(context, getText(R.string.register_fail), Toast.LENGTH_SHORT).show();
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
}