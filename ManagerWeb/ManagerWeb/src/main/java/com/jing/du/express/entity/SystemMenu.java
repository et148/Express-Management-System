package com.jing.du.express.entity;

import com.jing.du.express.entity.base.BaseEntity;
import com.jing.du.express.entity.base.BaseTree;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 系统菜单
 */
@Entity
@Table(name = "tb_system_menu")
public class SystemMenu  extends BaseTree<SystemMenu> {
    private String appUrl;

    public String getAppUrl() {
        return appUrl;
    }

    public void setAppUrl(String appUrl) {
        this.appUrl = appUrl;
    }

    public void setParent(SystemMenu parent) {
        this.parent = parent;
        if(this.parent != null) {
            this.parent.getChildren().add(this);
            this.parent.setLeaf(false);
        }
    }
}
