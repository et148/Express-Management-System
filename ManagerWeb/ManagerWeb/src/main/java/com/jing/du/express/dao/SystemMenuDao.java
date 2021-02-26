package com.jing.du.express.dao;

import com.jing.du.express.entity.SystemMenu;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemMenuDao extends CrudRepository<SystemMenu, String> {

    @Query("select sm from SystemMenu sm where (sm.deleted = false or sm.deleted is null) and sm.parent is null")
    List<SystemMenu> findAll();
}
