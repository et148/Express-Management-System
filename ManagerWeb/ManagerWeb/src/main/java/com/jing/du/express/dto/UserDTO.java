package com.jing.du.express.dto;

import com.jing.du.express.entity.User;
import com.jing.du.express.model.RoleEnum;
import com.jing.du.express.utils.BeanCopyUtils;
import com.jing.du.express.utils.StringUtils;

public class UserDTO extends User {
    private String roleName;

    public User toEntity(){
        User user = new User();
        BeanCopyUtils.copyProperties(this,user);
        return user;
    }

    public void fromEntity(User user){
       BeanCopyUtils.copyProperties(user,this);
    }

    public String getRoleName() {
        if(StringUtils.isNotEmpty(getRoleCode())){
            return RoleEnum.getEnumByValue(getRoleCode()).getName();
        }
        return "";
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
