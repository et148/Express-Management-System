package com.jing.du.expressscaner.activity;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.text.TextUtils;
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

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import butterknife.BindView;
import butterknife.OnClick;

public class LoginActivity extends BaseActivity {

    @BindView(R.id.username_et)
    EditText usernameEt;
    @BindView(R.id.password_et)
    EditText passwordEt;
    ExecutorService poolThread = Executors.newCachedThreadPool();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
    }

    @OnClick({R.id.login_bt, R.id.register_tv})
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.login_bt:
                String name = usernameEt.getText().toString();
                String password = passwordEt.getText().toString();
                if (TextUtils.isEmpty(name)) {
                    Toast.makeText(this, context.getText(R.string.username_empty_warning), Toast.LENGTH_SHORT).show();
                    return;
                } else if (TextUtils.isEmpty(password)) {
                    Toast.makeText(this, context.getText(R.string.password_empty_warning), Toast.LENGTH_SHORT).show();
                    return;
                } else {
                    User user = new User(name, password);
                    loginOnline(user);
                }
                break;
            case R.id.register_tv:
                Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
                startActivity(intent);
                break;
        }
    }

    /*
     * 网络注册账号
     * */
    private void loginOnline(final User user) {
        poolThread.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Map<String,Object> data = new HashMap<>();
                    data.put("name",user.getName());
                    data.put("password",user.getPassword());
                    HttpRequest.getInstance().post(BusinessConstant.LOGIN_URL, data, new BaseCallBack() {
                        @Override
                        public void onRequestBefore() {
                        }

                        @Override
                        public void onSuccess(Response response, Object o) {
                            if (o != null) {
                                try {
                                    Message message = JSONObject.parseObject(o.toString(), Message.class);
                                    if (message.getIsOk()) {
                                        User relUser = JSONObject.parseObject(message.getJsonData().toString(), User.class);
                                        ((AppContext) context.getApplicationContext()).setLoginUser(relUser);
                                        Toast.makeText(context, getText(R.string.login_success), Toast.LENGTH_SHORT).show();
                                        Intent intent = new Intent(LoginActivity.this, ScanerActivity.class);
                                        startActivity(intent);
                                        finish();
                                    } else {
                                        Toast.makeText(context, message.getMessage(), Toast.LENGTH_SHORT).show();
                                        return;
                                    }
                                } catch (Exception e) {
                                    Toast.makeText(context, getText(R.string.login_fail), Toast.LENGTH_SHORT).show();
                                    e.printStackTrace();
                                }
                            } else {
                                Toast.makeText(context, getText(R.string.login_fail), Toast.LENGTH_SHORT).show();
                                return;
                            }
                        }

                        @Override
                        public void onError(Response response, int errorCode, Exception e) {
                            Toast.makeText(context, getText(R.string.login_fail), Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onFailure(Request request, Exception e) {
                            Toast.makeText(context, getText(R.string.login_fail), Toast.LENGTH_SHORT).show();
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    public void onBackPressed() {
        final AlertDialog.Builder dialog = new AlertDialog.Builder(this, R.style.MyAlertDialog);

        dialog.setMessage("确定退出?");
        dialog.setPositiveButton("是", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                finish();
            }
        });
        dialog.setNegativeButton("否", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
            }
        });
        dialog.show();
    }

}
