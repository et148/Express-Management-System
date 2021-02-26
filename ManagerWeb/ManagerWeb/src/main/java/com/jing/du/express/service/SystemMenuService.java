package com.jing.du.express.service;

import com.jing.du.express.dao.SystemMenuDao;
import com.jing.du.express.entity.SystemMenu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemMenuService {

	@Autowired
	private SystemMenuDao systemMenuDao;

	public List<SystemMenu> getAllSystemMenu(){
		return systemMenuDao.findAll();
	}
}
