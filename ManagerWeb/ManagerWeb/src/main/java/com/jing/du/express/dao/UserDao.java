package com.jing.du.express.dao;

import com.jing.du.express.entity.ExpressNo;
import com.jing.du.express.entity.User;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDao extends CrudRepository<User, String>,JpaSpecificationExecutor<User> {

    @Query("select u from User u where u.deleted = false or u.deleted is null")
    List<User> findAll();

    User findById(String id);

    @Query("select u from User u where u.name = :name")
    User findUserByName(@Param("name") String name);

    @Query("select u from User u where u.name = :name and u.password = :password")
    User findUserByNameAndPassword(@Param("name") String name ,@Param("password") String password);

    @Modifying
    @Query("update User us set us.deleted = true where us.id in :ids")
    void deleteByIds(@Param(value = "ids")List<String> ids);

    @Query("select u from User u where (u.deleted = false or u.deleted is null) and u.roleCode = :relCode")
    List<User> getUsersByRoleCode(@Param(value = "relCode")String relCode);
}
