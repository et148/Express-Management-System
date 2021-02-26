package com.jing.du.express.dto;

import com.jing.du.express.entity.ExpressNo;
import com.jing.du.express.service.UserService;
import com.jing.du.express.utils.BeanCopyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by Charle on 2019-01-14.
 */
@Component
public class ExpressNoDTO extends ExpressNo {

    @Autowired
    private UserService userService;

    private String messagerName;
    private String buyerName;

    public ExpressNo toEntity(){
        ExpressNo expressNo = new ExpressNo();
        BeanCopyUtils.copyProperties(this,expressNo);
        return expressNo;
    }

    public String getMessagerName() {
        if(getMessager()!=null){
            return getMessager().getName();
        }else{
            return "";
        }
    }

    public void setMessagerName(String messagerName) {
        this.messagerName = messagerName;
    }

    public String getBuyerName() {
        if(getBuyer()!=null){
            return getBuyer().getName();
        }else{
            return "";
        }
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public void fromEntity(ExpressNo expressNo){
        BeanCopyUtils.copyProperties(expressNo,this);
    }

}
