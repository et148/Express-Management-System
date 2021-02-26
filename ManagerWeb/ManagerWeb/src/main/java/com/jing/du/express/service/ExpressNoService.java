package com.jing.du.express.service;

import com.jing.du.express.dao.ExpressNoDao;
import com.jing.du.express.dto.ExpressNoDTO;
import com.jing.du.express.entity.ExpressNo;
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
public class ExpressNoService {
    @Autowired
    private ExpressNoDao expressNoDao;

    public List<ExpressNo> getAll() {
        return expressNoDao.findAll();
    }

    @Transactional(readOnly = true)
    public Page<ExpressNo> searchExpressNoPage(int page, int size, Map<String, Object> params) {
        final String num = (String) params.get("num");
        Pageable pageable = new PageRequest(page, size);
        Page<ExpressNo> jhxxPage = expressNoDao.findAll(new Specification<ExpressNo>() {
            @Override
            public Predicate toPredicate(Root<ExpressNo> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> list = new ArrayList<Predicate>();
                list.add(criteriaBuilder.isFalse(root.get("deleted").as(Boolean.class)));
                if (StringUtils.isNotEmpty(num)) {
                    list.add(criteriaBuilder.like(root.get("num").as(String.class), "%" + num + "%"));
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
    public void deleteExpress(List<String> ids){
        expressNoDao.deleteByIds(ids);
    }

    /*
    * 新增或更新
    * */
    @Transactional
    public void saveOrUpdateExpressNo(ExpressNoDTO dto){
        expressNoDao.save(dto.toEntity());
    }

    /*
    * 获取信息
    * */
    @Transactional(readOnly = true)
    public ExpressNo getExpressNo(String id){
        return expressNoDao.findOne(id);
    }

}
