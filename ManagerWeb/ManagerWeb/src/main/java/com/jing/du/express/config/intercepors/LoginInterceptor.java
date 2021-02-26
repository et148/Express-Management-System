package com.jing.du.express.config.intercepors;

import com.jing.du.express.business.ConstantBusiness;
import com.jing.du.express.entity.User;
import com.sun.istack.internal.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Component
public class LoginInterceptor implements HandlerInterceptor {
    private Logger logger = LoggerFactory.getLogger(LoggerFactory.class);

    //这个方法是在访问接口之前执行的，我们只需要在这里写验证登陆状态的业务逻辑，就可以在用户调用指定接口之前验证登陆状态了
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        logger.info("---------------------开始进入请求地址拦截----------------------------");
        //每一个项目对于登陆的实现逻辑都有所区别，我这里使用最简单的Session提取User来验证登陆。
        HttpSession session = request.getSession();
        //这里的User是登陆时放入session的
        User user = (User) session.getAttribute("user");
        //如果session中没有user，表示没登陆
        if (user == null) {
            response.sendRedirect(request.getContextPath() + "/slogin");
            return false;
        } else {
            return true;    //如果session里有user，表示该用户已经登陆，放行，用户即可继续调用自己需要的接口
        }
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
        logger.info("--------------处理请求完成后视图渲染之前的处理操作---------------");
        if (response.getStatus() == 500) {
            modelAndView.setViewName(ConstantBusiness.ERROR_PAGE);
        } else if (response.getStatus() == 404) {
            modelAndView.setViewName(ConstantBusiness.NOT_FIND_PAGE);
        }
    }

    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
        logger.info("--------------处理请求完成后视图渲染之前的处理操作---------------");
    }
}
