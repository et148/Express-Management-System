package com.jing.du.menu;

import com.jing.du.express.ExpressApplication;
import com.jing.du.express.dao.SystemMenuDao;
import com.jing.du.express.entity.SystemMenu;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.ArrayList;
import java.util.List;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = ExpressApplication.class)
@WebAppConfiguration
public class SystemMenuDaoTest {

    @Autowired
    private SystemMenuDao systemMenuDao;

    @Test
    public void testAdd() {
        List<SystemMenu> entities = new ArrayList<SystemMenu>();

        SystemMenu system = new SystemMenu();
        system.setName("系统");
        system.setType("nt_menu");

        SystemMenu manager = new SystemMenu();
        manager.setName("管理");
        manager.setType("nt_menu");
        manager.setIconCls("icon-home");
        manager.setOrderNumber(0);
        manager.setParent(system);

        SystemMenu user = new SystemMenu();
        user.setName("用户管理");
        user.setType("nt_menu");
        user.setIconCls("icon-user");
        user.setTabIcon("user");
        user.setOrderNumber(1);
        user.setAppUrl("/user/showList");
        user.setParent(manager);

        SystemMenu expressNo = new SystemMenu();
        expressNo.setName("快递单管理");
        expressNo.setType("nt_menu");
        expressNo.setIconCls("icon-umbrella");
        expressNo.setTabIcon("user");
        expressNo.setOrderNumber(2);
        expressNo.setAppUrl("/expressNo/showList");
        expressNo.setParent(manager);

        entities.add(system);

        systemMenuDao.save(entities);
    }

}
