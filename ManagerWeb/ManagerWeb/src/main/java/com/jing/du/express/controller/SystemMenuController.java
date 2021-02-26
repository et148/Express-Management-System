package com.jing.du.express.controller;

import com.jing.du.express.dto.SystemMenuDTO;
import com.jing.du.express.entity.SystemMenu;
import com.jing.du.express.service.SystemMenuService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/menu")
public class SystemMenuController {
    private Logger logger = LoggerFactory.getLogger(SystemMenuController.class);

    @Autowired
    public SystemMenuService systemMenuService;

    @RequestMapping("/usermenu")
    @ResponseBody
    public List<SystemMenuDTO> getUserMenu() {
        List<SystemMenuDTO> list = null;
        try {
            List<SystemMenu> nodes = systemMenuService.getAllSystemMenu();
            if(nodes != null && nodes.size() > 0) {
                list = new ArrayList<SystemMenuDTO>();
                for(SystemMenu n : nodes) {
                    list.add(convertMenuDTO(n));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e.getMessage());
        }
        return list;
    }

    private SystemMenuDTO convertMenuDTO(SystemMenu menu) {
        if(menu == null) return null;
        SystemMenuDTO menuDTO = new SystemMenuDTO(menu);
        Set<SystemMenu> children = menu.getChildren();
        if(children.size() > 0) {
            List<SystemMenuDTO> dtoChildren = menuDTO.getChildren();
            for(SystemMenu m : children) {
                dtoChildren.add(convertMenuDTO(m));
            }
        } else {
            menuDTO.setChildren(null);
        }
        return menuDTO;
    }
}
