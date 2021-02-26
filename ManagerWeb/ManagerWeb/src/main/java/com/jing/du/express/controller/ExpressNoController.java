package com.jing.du.express.controller;

import com.alibaba.fastjson.JSONObject;
import com.jing.du.express.dto.ExpressNoDTO;
import com.jing.du.express.dto.RetMsg;
import com.jing.du.express.entity.ExpressNo;
import com.jing.du.express.entity.User;
import com.jing.du.express.model.DataTable;
import com.jing.du.express.model.Kav;
import com.jing.du.express.model.PageModel;
import com.jing.du.express.model.RoleEnum;
import com.jing.du.express.service.ExpressNoService;
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
@RequestMapping("/expressNo")
public class ExpressNoController {
    private Logger logger = LoggerFactory.getLogger(ExpressNoController.class);
    @Autowired
    private ExpressNoService expressNoService;
    @Autowired
    private UserService userService;

    @RequestMapping("/showList")
    public String showList(HttpServletRequest request, HttpServletResponse response) {
        return "expressNo/expressNoList";
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<ExpressNo> getAll() {
        return expressNoService.getAll();
    }

    /*
    * 查询
    * */
    @RequestMapping("/searchExpressList")
    @ResponseBody
    public Object searchExpressList(HttpServletRequest request, @ModelAttribute PageModel pageParam) {
        try {
            Map<String, Object> params = new HashMap<String, Object>();
            Object name = request.getParameter("name");
            if (name != null) {
                params.put("name", name);
            }
            Page<ExpressNo> page = expressNoService.searchExpressNoPage(pageParam.getPage(), pageParam.getSize(), params);
            List<ExpressNo> expressNos = page.getContent();
            List<ExpressNoDTO> list = new ArrayList<ExpressNoDTO>();
            if(expressNos!=null && expressNos.size()>0){
                for(ExpressNo expressNo : expressNos){
                    ExpressNoDTO expressNoDTO = new ExpressNoDTO();
                    expressNoDTO.fromEntity(expressNo);
                    list.add(expressNoDTO);
                }
            }
            DataTable dt = new DataTable(pageParam.getsEcho(), page.getTotalElements(), list);
            return dt;
        } catch (Exception e) {
            logger.error(e.getMessage());
            return RetMsg.failure(e.getMessage());
        }
    }

    /*
    * 删除
    * */
    @RequestMapping("/deleteExpressNo")
    @ResponseBody
    public Object deleteExpressNo(@RequestParam String ids) {
        try {
            if(StringUtils.isNullOrEmpty(ids)) {
                return RetMsg.failure("参数为空！");
            } else {
                expressNoService.deleteExpress(Arrays.asList(ids.split(",")));
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
    @RequestMapping("/saveOrUpdateExpressNo")
    @ResponseBody
    public Object saveOrUpdateExpressNo(HttpServletRequest request, @Valid ExpressNoDTO dto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return RetMsg.failure(bindingResult.getFieldError().getDefaultMessage());
        } else {
            try {
                expressNoService.saveOrUpdateExpressNo(dto);
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
    @RequestMapping("/getExpressNo")
    @ResponseBody
    public Object getExpressNo(HttpServletRequest request,@RequestParam String id) {
        try {
            ExpressNo entity = expressNoService.getExpressNo(id);
            return entity;
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e.getMessage());
            return RetMsg.failure(e.getMessage());
        }
    }
}
