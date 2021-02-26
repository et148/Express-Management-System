package com.jing.du.expressscaner.app;

import android.app.Application;

import com.jing.du.expressscaner.model.User;

public class AppContext extends Application {

//记录用户的登录状态
    private User loginUser;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    public User getLoginUser() {
        return loginUser;
    }

    public void setLoginUser(User loginUser) {
        this.loginUser = loginUser;
    }
}
