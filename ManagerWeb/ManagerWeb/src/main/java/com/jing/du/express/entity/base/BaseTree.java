package com.jing.du.express.entity.base;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Created by Charle on 2018/1/2.
 */
@MappedSuperclass
public class BaseTree<T extends BaseTree> extends BaseEntity {
	
    /**
	 * 
	 */
	private static final long serialVersionUID = 6127600143616968900L;

	/**
     * 菜单名称
     */
    @Column(name = "name",length=256)
    protected String name;

    /**
     * 图片地址
     */
    @Column(name = "icon",length=32)
    protected String icon;
    
    /**
     * 图片样式
     */
    @Column(name = "icon_cls",length=32)
    protected String iconCls;

    /**
     * 菜单弹出tabIcon
     */
    @Column(name = "tab_icon",length=32)
    protected String tabIcon;

    /**
     * 节点类型
     */
    @Column(name = "type",length=32)
    protected String type;

    /*
    * 菜单是否选中
    * */
    @Column(name = "checked",nullable=false)
    protected Boolean checked = false;

    /*
    * 是否叶子节点
    * */
    @Column(name = "leaf",nullable=false)
    protected Boolean leaf = true;

    /*
    * 是否展开
    * */
    @Column(name = "expand",nullable=false)
    protected Boolean expand = true;
    
    @Column(name="p_id",insertable=false,updatable=false)
    protected String pid;

    @ManyToOne(cascade = CascadeType.MERGE,fetch = FetchType.EAGER)
	@JoinColumn(name="p_id")
    @Where(clause="deleted = false")
	@JsonIgnore
	protected T parent;
	
	@OneToMany(cascade = CascadeType.PERSIST, mappedBy = "parent", fetch = FetchType.EAGER)
	@Where(clause="deleted = false")
	@OrderBy("orderNumber ASC")
	protected Set<T> children = new LinkedHashSet<T>();

	private int orderNumber;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getIconCls() {
		return iconCls;
	}

	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}

	public String getTabIcon() {
        return tabIcon;
    }

    public void setTabIcon(String tabIcon) {
        this.tabIcon = tabIcon;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }

    public Boolean getLeaf() {
        return leaf;
    }

    public void setLeaf(Boolean leaf) {
        this.leaf = leaf;
    }

    public Boolean getExpand() {
        return expand;
    }

    public void setExpand(Boolean expand) {
        this.expand = expand;
    }

	public T getParent() {
		return parent;
	}

	public void setParent(T parent) {
		this.parent = parent;
	}

	public Set<T> getChildren() {
		return children;
	}

	public void setChildren(Set<T> children) {
		this.children = children;
	}
	
	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}
	public Set<T> findAll() {
		Set<T> r=new HashSet<T>();
		findAllHelper((T) this,r);
		return r;
	}
	private void findAllHelper(T t,Set<T> result) {
		result.add(t);
		Set<T> children=t.getChildren();
		for(T c:children) {
			findAllHelper(c,result);
		}
	}
	@Override
	public void setDeleted(Boolean deleted) {
		super.setDeleted(deleted);
		if(this.children.size() > 0) {
			for(T child : children) {
				child.setDeleted(deleted);
			}
		}
	}

    public int getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(int orderNumber) {
        this.orderNumber = orderNumber;
    }
}
