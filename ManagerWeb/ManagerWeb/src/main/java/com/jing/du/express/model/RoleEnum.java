package com.jing.du.express.model;

import java.util.ArrayList;
import java.util.List;

public enum  RoleEnum {
    MESSAGER("messager","快递员"),
    BUYER("buyer","收货人");

    RoleEnum(String value,String name) {
        this.value = value;
        this.name = name;
    }

    private String value;
    private String name;

    public String getValue() {
        return value;
    }

    public String getName(){
        return name;
    }

    public static RoleEnum getEnumByValue(String value){
        RoleEnum[] enumList = RoleEnum.values();
        for(RoleEnum typeEnum : enumList){
            if(typeEnum.getValue().equals(value)){
                return typeEnum;
            }
        }
        return null;
    }


    /**
     * 转换为kav列表
     * @return
     */
    public static List<Kav> toKavs() {
        List<Kav> list = new ArrayList<Kav>();
        RoleEnum[] enums = RoleEnum.values();
        for(int i = 0; i < enums.length; i++) {
            Kav kav = new Kav();
            kav.setValue(enums[i].getValue());
            kav.setText(enums[i].getName());
            list.add(kav);
        }
        return list;
    }

}
