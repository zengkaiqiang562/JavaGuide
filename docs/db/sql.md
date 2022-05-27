---
title: SQL 语句（TODO）
category: 
  - 数据库-SQL语句
tag:
  - 数据库-SQL语句
---

## 1. 概述 

### 1.1 `Windows` 系统中 `SQL` 语句不区分大小写

### 1.2  `SQL` 语句后要加分号 "`;`"

## 2. `SQL` 语句的分类

### 2.1 `DDL` 语句（`Data Definition Language` 数据定义语言）

主要有如下 4 个语句：
1. `CREATE`
2. `DROP`
3. `ALTER`
4. `TRUNCATE`

### 2.2 `DML` 语句（`Data Manipulation Language` 数据操作语言）

主要有如下 3 个语句：
1. `INSERT`（插入）
2. `UPDATE`（修改）
3. `DELETE`（删除）

### 2.3 `DQL` 语句（`Data Query Language` 数据查询语言）

只有一个 `SELECT` 语句。

### 2.4 `DCL` 语句（`Data Control Language` 数据控制语言）

主要有如下 2 个语句：
1. `GRANT`
2. `REVOKE`

### 2.5 `TCL` 语句（`Transaction control Language` 事务控制语句）

主要有如下 3 个语句：
1. `COMMIT`
2. `ROLLBACK`
3. `SAVEPOINT`

## 3. `DDL` 语句

### 3.1 对数据库的操作

#### 3.1.1 创建数据库

```sql:no-line-numbers
# 字符集名称和校验规则名称可省略不写
create database 数据库名称 [character set 字符集名称] [collate 校验规则名称];
```

示例：

```sql:no-line-numbers
create database mydb3 character set utf8 collate utf8_general_ci;
```

#### 3.1.2 删除数据库

```sql:no-line-numbers
drop database [if exists] db_name;
```

#### 3.1.3 显示数据库的创建信息

```sql:no-line-numbers
show create database db_name;
```

#### 3.1.4 显示所有已创建的数据库

```sql:no-line-numbers
show databases;
```

#### 3.1.5 修改数据库

```sql:no-line-numbers
alter database 数据库的名称 要更新的值;
```

示例：

```sql:no-line-numbers
# 将数据库mydb2的字符集改为gbk
alter database mydb2 character set gbk;
```

#### 3.1.6 切换数据库

```sql:no-line-numbers
use db_name;
```

#### 3.1.7 查看当前的数据库

```sql:no-line-numbers
select database();
```

### 3.2 对表的操作

表存在数据库中，所以在操作表时 **要先切换到表所在的数据库**。

#### 3.2.1 创建表

##### 3.2.1.1 基本语法

```sql:no-line-numbers
create table 表名(
   字段1的名称 字段1的类型,
   字段2的名称 字段2的类型,
   字段3的名称 字段3的类型,
   ...
   字段n的名称 字段n的类型
);
```

##### 3.2.1.2 字段类型

##### 3.2.1.2.1 字符串型：`VARCHAR`、`CHAR` 

示例：`varchar(30)`，`char(30)`

##### 3.2.1.2.2 大数据类型：`BLOB`、`TEXT` 

字节流用 `BLOB`，字符流用 `TEXT`

##### 3.2.1.2.3 数值型：`TINYINT`、`SMALLINT`、`INT`、`BIGINT`、`FLOAT`、`DOUBLE`

##### 3.2.1.2.4 逻辑型：`BIT`

##### 3.2.1.2.5 日期型：`DATE`、`TIME`、`DATETIME`、`TIMESTAMP`

```:no-line-numbers
DATE：只有日期
TIME：只有时间
DATETIME：日期和时间
TIMESTAMP：时间戳
```

##### 3.2.1.3 示例：创建一个员工表

创建一个员工表 `employee`，字段名和字段类型如下：

|字段名|字段类型|
|:-|:-|
|`id`|整型：`int`|
|`name`|字符型：`varchar(30)`|
|`gender`|字符型：`varchar(10)`|
|`birthday`|日期型：`date`|
|`entry_date`|日期型：`date`|
|`job`|字符型：`varchar(50)`|
|`salary`|小数型：`double`|
|`resume`|大文本型：`varchar(225)`|

`SQL` 语句如下：

```sql:no-line-numbers
create table employee(
   id int,
   name varchar(30),
   gender varchar(10),
   birthday date,
   entry_date date,
   job varchar(50),
   salary double,
   resume varchar(255)
);
```

##### 3.2.1.4 定义字段的约束

通过定义字段的约束，可以保证数据的有效性和完整性。

###### 3.2.1.4.1 主键约束（唯一，非空）：primary key

如果字段类型是数值型，并且声明为主键，那么通常会加上 `auto_increment`，表示自动增长。

###### 3.2.1.4.2 唯一约束（唯一，可空）：unique

###### 3.2.1.4.3 非空约束（不唯一，非空）：not null

###### 3.2.1.4.4 示例：员工表优化

```sql:no-line-numbers
create table employee2(
   id int primary key auto_increment,
   name varchar(30) not null,
   gender varchar(10) not null,
   birthday date,
   entry_date date,
   job varchar(50),
   salary double not null,
   resume varchar(255) unique
);
```

#### 3.2.2 查看已创建的表的结构

```sql:no-line-numbers
desc 表名;
```

#### 3.2.3 查看当前数据库已创建的所有表的名称

```sql:no-line-numbers
show tables; 
```

#### 3.2.4 修改表

##### 3.2.4.1 语法

```sql:no-line-numbers
alter table 表名 修改子语句;
```

##### 3.2.4.2 新增字段

示例：

```sql:no-line-numbers
# 在员工表 employee2 中，增加一个 image 列。
alter table employee2 add image blob;
```

##### 3.2.4.3 修改字段属性（如修改 `varchar` 类型字段的长度）

示例：

```sql:no-line-numbers
# 修改 job 列，使其长度为 60
alter table employee2 modify job varchar(60);
```

##### 3.2.4.4 修改字符名

示例：

```sql:no-line-numbers
# 字段名 name 修改为 username
alter table employee2 change name username varchar(40);
```

##### 3.2.4.5 删除字段

示例：

```sql:no-line-numbers
# 删除 gender 列
alter table employee2 drop gender;
```

##### 3.2.4.6 修改表名

示例：

```sql:no-line-numbers
# 表名改为 employee3
rename table employee2 to employee3;
```

##### 3.2.4.7 修改表的字符集

示例：

```sql:no-line-numbers
# 修改表的字符集为 utf8
alter table employee3 character set utf8;
```

## 4. `DML` 语句

### 4.1 `INSERT` 增加语句

### 4.2 `UPDATE` 更新语句

### 4.3 `DELETE` 删除语句

## 5. `DQL` 语句（即 `SELECT` 语句）