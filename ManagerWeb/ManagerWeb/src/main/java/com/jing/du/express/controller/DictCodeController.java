package com.jing.du.express.controller;

import com.alibaba.fastjson.JSONObject;
import com.jing.du.express.dto.RetMsg;
import com.jing.du.express.utils.PackageScannerUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;
import java.util.List;

/**
 * Created by Charle on 2018-03-09.
 */
@Controller
@RequestMapping("/dictCode")
public class DictCodeController {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    public static final String PACKAGE_NAME = "com.jing.du.express.model";

    @RequestMapping("/getEnumByCategory")
    @ResponseBody
    public Object getEnumByCategory(HttpServletRequest request, HttpServletResponse response) {
        String category = request.getParameter("category");
        try {
            List<String> clses = PackageScannerUtils.getFullyQualifiedClassNameList(PACKAGE_NAME);
            String enumName = "";
            if(clses==null){
                return null;
            }
            for(String name : clses){
                if(name.lastIndexOf(".")!=-1){
                    String clsName = name.substring(name.lastIndexOf(".")+1);
                    if (clsName.equals(category)){
                        enumName = name;
                        break;
                    }
                }
            }
            Class cls = Class.forName(enumName);
            Method enumMethod = cls.getMethod("toKavs",new Class[]{});
            return RetMsg.success(JSONObject.toJSONString(enumMethod.invoke(cls)));
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e.getMessage());
            return RetMsg.failure(e.getMessage());
        }
    }
}
