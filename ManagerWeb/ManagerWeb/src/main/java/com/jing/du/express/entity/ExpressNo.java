package com.jing.du.express.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jing.du.express.entity.base.BaseEntity;

import javax.persistence.*;

/*
* 快递单号
* */
@Entity
@Table(name = "tb_express_no")
public class ExpressNo extends BaseEntity {

    /*
    * 快递单号
    * */
    private String num;
    @Column(insertable=false,updatable=false)
    private String buyerId;

    /**
     * 收货人
     */
    @ManyToOne(cascade = CascadeType.MERGE,fetch = FetchType.LAZY)
    @JoinColumn(name="buyerId")
    @JsonIgnore
    private User buyer;

    @Column(insertable=false,updatable=false)
    private String messagerId;

    /**
     * 快递员
     */
    @ManyToOne(cascade = CascadeType.MERGE,fetch = FetchType.LAZY)
    @JoinColumn(name="messagerId")
    @JsonIgnore
    private User messager;

    /*
    * 快递相关信息
    * */
    private String info;

    public String getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(String buyerId) {
        this.buyerId = buyerId;
    }

    public User getBuyer() {
        return buyer;
    }

    public void setBuyer(User buyer) {
        this.buyer = buyer;
    }

    public String getMessagerId() {
        return messagerId;
    }

    public void setMessagerId(String messagerId) {
        this.messagerId = messagerId;
    }

    public User getMessager() {
        return messager;
    }

    public void setMessager(User messager) {
        this.messager = messager;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getNum() {
        return num;
    }

    public void setNum(String num) {
        this.num = num;
    }
}
