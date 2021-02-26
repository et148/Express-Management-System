package com.jing.du.express.controller.mobile;

import com.jing.du.express.dto.RetMsg;
import com.jing.du.express.dto.UserDTO;
import com.jing.du.express.entity.User;
import com.jing.du.express.service.UserService;
import com.jing.du.express.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@Controller
@RequestMapping("/")
public class LoginController {

    @Autowired
    private UserService userService;

    @RequestMapping("/login")
    @ResponseBody
    public Object login(HttpServletRequest request, @Valid UserDTO userDTO) {
        if (StringUtils.isNotEmpty(userDTO.getName()) && StringUtils.isNotEmpty(userDTO.getPassword())) {
            User realUser = userService.findByNameAndPassword(userDTO.getName(), userDTO.getPassword());
            if (realUser != null) {
                return RetMsg.success(realUser);
            } else {
                return RetMsg.failure("用户名或密码错误");
            }
        }
        return RetMsg.failure("参数绑定错误");
    }

    @RequestMapping("/login2index")
    public Object login2index(HttpServletRequest request, @Valid UserDTO userDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "/system/login";
        } else {
            if (StringUtils.isNotEmpty(userDTO.getName()) && StringUtils.isNotEmpty(userDTO.getPassword())) {
                User realUser = userService.findByNameAndPassword(userDTO.getName(), userDTO.getPassword());
                if (realUser != null) {
                    request.getSession().setAttribute("user", realUser);
                    return "index";
                }
            }
            request.setAttribute("msg", "用户名或密码错误");
            return "system/login";
        }
    }

    @RequestMapping("/register")
    @ResponseBody
    public Object register(HttpServletRequest request, @Valid UserDTO userDTO, BindingResult bindingResult) {
        if (userDTO != null && StringUtils.isNotEmpty(userDTO.getName()) &&
                StringUtils.isNotEmpty(userDTO.getPassword())) {
            User user = userService.findByName(userDTO.getName());
            if (user != null) {
                return RetMsg.failure("该用户已注册");
            } else {
                userService.saveOrUpdate(userDTO.toEntity());
                return RetMsg.success("注册成功");
            }
        }
        return RetMsg.failure("参数绑定错误");
    }

    @RequestMapping("/slogin")
    public String login(HttpServletRequest request, HttpServletResponse response) {
        if (request.getSession().getAttribute("user") != null) {
            return "index";
        }
        return "/system/login";
    }

    @RequestMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        session.removeAttribute("user");
        return "/system/login";
    }
}
