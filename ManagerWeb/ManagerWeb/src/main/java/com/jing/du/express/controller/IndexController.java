package com.jing.du.express.controller;

import com.jing.du.express.utils.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/")
public class IndexController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @RequestMapping("/index")
    public String index(HttpServletRequest request, HttpServletResponse response) {
        String url = request.getParameter("url");
        if(!StringUtils.isEmpty(url) && url.indexOf("!") != -1) {
            url = url.replaceAll("!", "?");
        }
        String name = request.getParameter("name");
        request.setAttribute("name", name);
        request.setAttribute("url", url);
        return "index";
    }
}
