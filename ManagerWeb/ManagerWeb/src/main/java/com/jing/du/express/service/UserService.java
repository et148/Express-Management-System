package com.jing.du.express.service;

import com.jing.du.express.dao.UserDao;
import com.jing.du.express.dto.UserDTO;
import com.jing.du.express.entity.User;
import com.jing.du.express.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    public List<User> getAll() {
        return userDao.findAll();
    }

    public List<User> getUsersByRoleCode(String roleCode){
        return userDao.getUsersByRoleCode(roleCode);
    }

    public User getById(String id) {
        return userDao.findById(id);
    }

    public String saveOrUpdate(User user) {
        try {
            userDao.save(user);
        } catch (Exception e) {
            return e.getMessage();
        }
        return "user created successfully!";
    }

    public User update(User person) {
        return userDao.save(person);
    }

    public String delete(String id) {
        try {
            userDao.delete(id);
        } catch (Exception e) {
            return e.getMessage();
        }
        return "user deleted!";
    }

    public User findByName(String name) {
        return userDao.findUserByName(name);
    }

    public User findByNameAndPassword(String name,String password){
        return userDao.findUserByNameAndPassword(name,password);
    }

    @Transactional(readOnly = true)
    public Page<User> searchUserPage(int page, int size, Map<String, Object> params) {
        final String name = (String) params.get("name");
        Pageable pageable = new PageRequest(page, size);
        Page<User> jhxxPage = userDao.findAll(new Specification<User>() {
            @Override
            public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> list = new ArrayList<Predicate>();
                list.add(criteriaBuilder.isFalse(root.get("deleted").as(Boolean.class)));
                if (null != name && !"".equals(name)) {
                    list.add(criteriaBuilder.like(root.get("name").as(String.class), "%" + name + "%"));
                }
                Predicate[] p = new Predicate[list.size()];
                return criteriaBuilder.and(list.toArray(p));
            }
        }, pageable);
        return jhxxPage;
    }

    /*
* 删除
* */
    @Transactional
    public void deleteUser(List<String> ids){
        userDao.deleteByIds(ids);
    }

    /*
    * 新增或更新
    * */
    @Transactional
    public void saveOrUpdateUser(UserDTO dto){
        if(StringUtils.isNotEmpty(dto.getId())){
            User user = this.getById(dto.getId());
            if(user!=null){
                dto.setPassword(user.getPassword());
            }
        }
        userDao.save(dto.toEntity());
    }

    /*
    * 获取信息
    * */
    @Transactional(readOnly = true)
    public User getUser(String id){
        return userDao.findOne(id);
    }
}
