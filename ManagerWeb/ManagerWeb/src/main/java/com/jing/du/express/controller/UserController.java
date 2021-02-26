package com.jing.du.express.controller;

import com.alibaba.fastjson.JSONObject;
import com.jing.du.express.dto.RetMsg;
import com.jing.du.express.dto.UserDTO;
import com.jing.du.express.entity.User;
import com.jing.du.express.model.DataTable;
import com.jing.du.express.model.Kav;
import com.jing.du.express.model.PageModel;
import com.jing.du.express.service.UserService;
import com.mysql.cj.core.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.*;

@Controller
@RequestMapping("/user")
public class UserController {
    private Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    @RequestMapping("/showList")
    public String showList(HttpServletRequest request, HttpServletResponse response) {
        return "user/userList";
    }

    @RequestMapping("/searchUserList")
    @ResponseBody
    public Object searchUserList(HttpServletRequest request, @ModelAttribute PageModel pageParam) {
        try {
            Map<String, Object> params = new HashMap<String, Object>();
            Object name = request.getParameter("name");
            if (name != null) {
                params.put("name", name);
            }
            Page<User> page = userService.searchUserPage(pageParam.getPage(), pageParam.getSize(), params);
            List<User> users = page.getContent();
            if(users != null && users.size() > 0) {
                List<UserDTO> dtoList = new ArrayList<UserDTO>();
                for(User user : users) {
                    UserDTO dto = new UserDTO();
                    dto.fromEntity(user);
                    dtoList.add(dto);
                }
                DataTable dt = new DataTable(pageParam.getsEcho(), page.getTotalElements(), dtoList);
                return dt;
            }
            return null;
        } catch (Exception e) {
            logger.error(e.getMessage());
            return RetMsg.failure(e.getMessage());
        }
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<User> getAll() {
        return userService.getAll();
    }

    /*
    * 删除
    * */
    @RequestMapping("/deleteUser")
    @ResponseBody
    public Object deleteUser(@RequestParam String ids) {
        try {
            if(StringUtils.isNullOrEmpty(ids)) {
                return RetMsg.failure("参数为空！");
            } else {
                userService.deleteUser(Arrays.asList(ids.split(",")));
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
            return RetMsg.failure(e.getMessage());
        }
        return RetMsg.success(null);
    }

    /*
    * 新增或者更新
    * */
    @RequestMapping("/saveOrUpdateUser")
    @ResponseBody
    public Object saveOrUpdateUser(HttpServletRequest request, @Valid UserDTO dto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return RetMsg.failure(bindingResult.getFieldError().getDefaultMessage());
        } else {
            try {
                userService.saveOrUpdateUser(dto);
                return RetMsg.success(null);
            } catch (Exception e) {
                logger.error(e.getMessage());
                return RetMsg.failure(e.getMessage());
            }
        }
    }

    /*
    * 获取信息
    * */
    @RequestMapping("/getUser")
    @ResponseBody
    public Object getUser(@RequestParam String id) {
        try {
            User entity = userService.getUser(id);
            return entity;
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e.getMessage());
            return RetMsg.failure(e.getMessage());
        }
    }

    /*
* 获取人员信息
* */
    @RequestMapping("/getUserListByRoleCode")
    @ResponseBody
    public Object getUserListByRoleCode(@RequestParam String roleCode) {
        try {
            List<Kav> list = new ArrayList<Kav>();
            list.add(new Kav("---请选择---",""));
            if(!StringUtils.isNullOrEmpty(roleCode)){
                List<User> users = userService.getUsersByRoleCode(roleCode);
                if(users != null && users.size() > 0) {
                    for(User user : users) {
                        Kav k = new Kav(user.getName(),user.getId());
                        if(!StringUtils.isNullOrEmpty(user.getRoleCode())){
                            list.add(k);
                        }
                    }
                }
            }
            return RetMsg.success(JSONObject.toJSONString(list));
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e.getMessage());
            return RetMsg.failure(e.getMessage());
        }
    }

}

