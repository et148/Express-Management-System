package com.jing.du.express.config;

import org.hibernate.dialect.MySQL5InnoDBDialect;
import org.hibernate.dialect.MySQLDialect;

public class MysqlConfig extends MySQL5InnoDBDialect {
    @Override
    public String getTableTypeString() {
        return " ENGINE=InnoDB DEFAULT CHARSET=utf8";
    }
}
