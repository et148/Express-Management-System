package com.jing.du.expressscaner.util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by Charle on 2018-03-15.
 */
public class BeanMapConvertUtil {
    private static final String TYPE_SET = "set";
    private static final String TYPE_GET = "get";

    public static Map<String, Object> convert2Map(Object someBean) throws IllegalAccessException, IllegalArgumentException,
            InvocationTargetException, InstantiationException {
        Map<String, Object> ret = new HashMap<String, Object>();
        Class<? extends Object> clz = someBean.getClass();
        if(someBean==null){
            System.out.println("entity is null!");
            return ret;
        }
        for (Method method : clz.getDeclaredMethods()) {
            String methodName = method.getName();
            if (methodName.startsWith(TYPE_GET)) {
                methodName = methodName.substring(3, methodName.length());
                //首字母小写
                methodName = methodName.substring(0,1).toLowerCase()+methodName.substring(1);
                ret.put(methodName, method.invoke(someBean, new Object[0]));
            }
        }
        return ret;
    }
    @SuppressWarnings("rawtypes")
    public static Object conver2Bean(Map<String, Object> map, Class beanClass) throws IllegalAccessException, IllegalArgumentException,
            InvocationTargetException, InstantiationException {
        Iterator<String> iter = map.keySet().iterator();
        Object beanInstance = beanClass.newInstance();
        Map<String, Method> methodMapList = getMethodMap(TYPE_SET, beanClass);
        while (iter.hasNext()) {
            String key = iter.next();
            Object value = map.get(key);
            Method setMethod = methodMapList.get(key.toLowerCase());
            setMethod.invoke(beanInstance, value);
        }
        return beanClass.cast(beanInstance);
    }
    @SuppressWarnings("rawtypes")
    private static Map<String, Method> getMethodMap(String type, Class beanClass) {
        Map<String, Method> methodMap = new HashMap<String, Method>();
        for (Method method : beanClass.getDeclaredMethods()) {
            String methodName = method.getName();
            if (methodName.startsWith(type)) {
                methodName = methodName.substring(3, methodName.length()).toLowerCase();
                methodMap.put(methodName, method);
            }
        }
        return methodMap;
    }

    public static void copy(Object source, Object destination) {
        Class<?> sourceClass = source.getClass();
        Method[] sourceMethods = sourceClass.getMethods();
        for (Method method : sourceMethods) {
            String methodName = method.getName();
            if ((methodName.startsWith("get") || methodName.startsWith("is")) && !methodName.equals("getClass")) {
                try{
                    Class<?> returnType = method.getReturnType();
                    Object value = method.invoke(source);
                    if(value==null){
                        continue;
                    }
                    Class<? extends Object> br = destination.getClass();
                    Method destMethod;
                    if (methodName.startsWith("g")) {
                        destMethod = br.getMethod(methodName.replaceFirst("get", "set"),returnType);
                    } else {
                        destMethod = br.getMethod(methodName.replaceFirst("is", "set"),returnType);
                    }
                    destMethod.invoke(destination, value);
                } catch(Exception e){
                    System.out.println("warning : "+ methodName + " 不存在相对应的方法");
                }
            }
        }
    }
}
