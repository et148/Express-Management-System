package com.jing.du.express.dao;


import com.jing.du.express.entity.ExpressNo;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpressNoDao extends CrudRepository<ExpressNo, String>, JpaSpecificationExecutor<ExpressNo> {

    @Query("select en from ExpressNo en where en.deleted = false or en.deleted is null")
    List<ExpressNo> findAll();

    @Modifying
    @Query("update ExpressNo en set en.deleted = true where en.id in :ids")
    void deleteByIds(@Param(value = "ids")List<String> ids);
}
