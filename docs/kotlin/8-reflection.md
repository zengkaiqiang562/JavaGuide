---
title: Kotlin反射（TODO）
category: 
  - kotlin
tag:
  - kotlin
---

## 1. 什么是反射

## 2. 反射的依赖库

## 3. `@MetaData` 注解

## 4. 反射的常见用途

## 5. 反射常用的数据结构

### 5.1 `KType`

### 5.2 `KClass`

### 5.3 `KProperty`

### 5.4 `KFunction`

### 5.5 `Kotlin` 与 `Java` 的数据结构对比

## 6. `Java` 反射与 `Kotlin` 反射的优缺点

## 7. 反射的使用举例

### 7.1 通过 "`ClassName::class`" 获取 `KClass` 实例

### 7.2 通过全局函数 `typeOf` 获取泛型类型的信息

### 7.3 获取类方法的返回值类型上的泛型实参

### 7.4 获取父类类型上的泛型实参

### 7.5 通过反射获取泛型实参的原理

### 7.6 保留泛型签名信息的混淆配置

## 8. 案例

### 8.1 数据类的深拷贝

#### 8.1.1 反射获取类的主构造器

#### 8.1.2 反射获取函数的形参列表

#### 8.1.3 反射调用函数

#### 8.1.4 反射获取对象中属性的属性值

### 8.2 `Model` 映射

#### 8.2.1 判断类型是否为可空类型

### 8.3 通过属性代理实现对不可空类型属性的资源释放

#### 8.3.1  获取属性代理（`KProperty.getDelegate()`）

#### 8.3.2 阻止属性的访问权限检查（`isAccessible = true`）