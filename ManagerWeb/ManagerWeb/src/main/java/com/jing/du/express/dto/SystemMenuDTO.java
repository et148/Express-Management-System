package com.jing.du.express.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.jing.du.express.entity.SystemMenu;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(Include.NON_NULL)
public class SystemMenuDTO {
	private String id;
	private String pid;
	private String text;
	private String name;
	private String icon;
	private String iconCls;
	private String tabIcon;
	private String appUrl;
	private String url;
	private String orderNumber;
	private List<SystemMenuDTO> children = new ArrayList<SystemMenuDTO>();
	
	public SystemMenuDTO() {
		
	}
	
	public SystemMenuDTO(SystemMenu entity) {
		this.id = entity.getId();
		this.pid = entity.getPid();
		this.text = entity.getName();
		this.icon = entity.getIconCls();
		this.tabIcon = entity.getTabIcon();
		this.appUrl = entity.getAppUrl();
		this.url = entity.getAppUrl();
	}

	public String getId() {
		return id;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getTabIcon() {
		return tabIcon;
	}

	public void setTabIcon(String tabIcon) {
		this.tabIcon = tabIcon;
	}

	public List<SystemMenuDTO> getChildren() {
		return children;
	}

	public void setChildren(List<SystemMenuDTO> children) {
		this.children = children;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIconCls() {
		return iconCls;
	}

	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}

	public String getAppUrl() {
		return appUrl;
	}

	public void setAppUrl(String appUrl) {
		this.appUrl = appUrl;
	}

	public String getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
