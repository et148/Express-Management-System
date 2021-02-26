package com.jing.du.expressscaner.activity;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.ActivityOptionsCompat;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.alibaba.fastjson.JSONObject;
import com.jing.du.expressscaner.R;
import com.jing.du.expressscaner.app.AppContext;
import com.jing.du.expressscaner.constant.BusinessConstant;
import com.jing.du.expressscaner.dto.Message;
import com.jing.du.expressscaner.http.BaseCallBack;
import com.jing.du.expressscaner.http.HttpRequest;
import com.jing.du.expressscaner.model.User;
import com.jing.du.expressscaner.util.PermissionCheckUtils;
import com.jing.du.expressscaner.util.StringUtils;
import com.king.zxing.CaptureActivity;
import com.king.zxing.Intents;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import butterknife.BindView;
import butterknife.OnClick;

public class ScanerActivity extends BaseActivity {
    public static final String KEY_TITLE = "key_title";
    public static final int REQUEST_CODE_SCAN = 0X01;
    ExecutorService poolThread = Executors.newCachedThreadPool();

    @BindView(R.id.user_info_tv)
    TextView userInfoTv;

    //申请相关权限
    private static final String[] REQUIRED_PERMISSION_LIST = new String[]{
            Manifest.permission.INTERNET,
            Manifest.permission.ACCESS_WIFI_STATE,
            Manifest.permission.ACCESS_NETWORK_STATE,
            Manifest.permission.CAMERA
    };

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        PermissionCheckUtils.checkAndRequestPermissions(context,REQUIRED_PERMISSION_LIST);
        setContentView(R.layout.activity_scaner);
    }

    @OnClick({R.id.scaner_btn})
    public void onClick(View view){
        switch (view.getId()){
            case R.id.scaner_btn:
                startScan();
                break;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(resultCode == RESULT_OK && data!=null){
            switch (requestCode){
                case REQUEST_CODE_SCAN:
                    String result = data.getStringExtra(Intents.Scan.RESULT);
                    if(StringUtils.isNotEmpty(result)){
                        getUserInfo(result);
                    }
                    break;
            }

        }
    }

    /*
     * 获取快递相关用户信息
     * */
    private void getUserInfo(final String expressNoId) {
        poolThread.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Map<String,Object> data = new HashMap<>();
                    data.put("expressNoId",expressNoId);
                    data.put("messagerId",((AppContext)context.getApplicationContext()).getLoginUser().getId());
                    HttpRequest.getInstance().post(BusinessConstant.GET_BUYER_INFO, data, new BaseCallBack() {
                        @Override
                        public void onRequestBefore() {
                        }

                        @Override
                        public void onSuccess(Response response, Object o) {
                            if (o != null) {
                                try {
                                    Message message = JSONObject.parseObject(o.toString(), Message.class);
                                    if (message.getIsOk()) {
                                        User buyer = JSONObject.parseObject(message.getJsonData().toString(), User.class);
                                        userInfoTv.setText(buyer.toString());
                                    } else {
                                        Toast.makeText(context, message.getMessage(), Toast.LENGTH_SHORT).show();
                                        return;
                                    }
                                } catch (Exception e) {
                                    Toast.makeText(context, getText(R.string.get_info_fail), Toast.LENGTH_SHORT).show();
                                    e.printStackTrace();
                                }
                            } else {
                                Toast.makeText(context, getText(R.string.get_info_fail), Toast.LENGTH_SHORT).show();
                                return;
                            }
                        }

                        @Override
                        public void onError(Response response, int errorCode, Exception e) {
                            Toast.makeText(context, getText(R.string.get_info_fail), Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onFailure(Request request, Exception e) {
                            Toast.makeText(context, getText(R.string.get_info_fail), Toast.LENGTH_SHORT).show();
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void startScan(){
        ActivityOptionsCompat optionsCompat = ActivityOptionsCompat.makeCustomAnimation(this,R.anim.in,R.anim.out);
        Intent intent = new Intent(context, CaptureActivity.class);
        intent.putExtra(KEY_TITLE,getText(R.string.login_fail));
        ActivityCompat.startActivityForResult(this,intent,REQUEST_CODE_SCAN,optionsCompat.toBundle());
    }
}
