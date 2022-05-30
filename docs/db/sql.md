---
title: SQL 语句
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

#### 4.1.1 语法

```sql:no-line-numbers
insert into 表名(字段名集合) values(字段值集合);
insert into 表名 values(所有字段值集合);
```

#### 4.1.2 举例

##### 4.1.2.1 新建员工表

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

##### 4.1.2.1 以全写字段的方式插入一条记录

```sql:no-line-numbers
insert into employee2(id, name, gender, birthday, entry_date, job, salary, resume) values(1, 'zs', 'female', '1995-09-09', '2015-12-09', 'developer', 15000, 'a good developer');
```

##### 4.1.2.2 以只写部分字段的方式插入一条记录

```sql:no-line-numbers
insert into employee2(id, name, gender, salary, resume) values(null, 'chenhaojie', 'male', 17000, 'a hansome boy');
```

##### 4.1.2.3 以只写字段值的方式插入一条记录（所有的字段值都要写）

```sql:no-line-numbers
# 不写字段名称，只写字段值，但是所有的字段值都要写
insert into employee2 values(null, 'linpeng', 'male', '1994-09-09', '2015-12-22', 'programmer', 16000, 'a lady killer');
```
  
#### 4.1.3 注意事项

1. 字符和日期型数据应包含在单引号中。

2. 插入空值的方式为：不指定，或 `insert into table value(null)`

### 4.2 `UPDATE` 更新语句

#### 4.2.1 语法

```sql:no-line-numbers
update 表名 set 列名=列名值,列名=列名值 [where 从句];
```

#### 4.2.2 举例

##### 4.2.2.1 将所有员工薪水修改为 `5000` 元

```sql:no-line-numbers
update employee2 set salary=5000;
```

##### 4.2.2.2 将姓名为 `zs` 的员工薪水修改为 `3000` 元

```sql:no-line-numbers
update employee2 set salary=3000 where name='zs';
```

##### 4.2.2.3 将姓名为 `zhangsan` 的员工薪水修改为 `6000` 元，`job` 改为 `ccc`

```sql:no-line-numbers
update employee2 set salary=6000, job='ccc' where name='zhangsan';
```

##### 4.2.2.4 将 `lisi` 的薪水在原有基础上增加 `1000` 元

```sql:no-line-numbers
update employee2 set salary=salary+1000 where name='lisi';
```

#### 4.2.3 注意事项

`WHERE` 子句指定应更新哪些行（记录）。如没有 `WHERE` 子句，则更新所有的行（记录）。

### 4.3 `DELETE` 删除语句

#### 4.3.1 语法

```sql:no-line-numbers
delete from 表名 [where从句];
```

#### 4.3.2 举例：删除表中名称为 zs 的记录

```sql:no-line-numbers
# 删除表中名称为 zs 的记录。
delete from employee2 where name='zs';
```

#### 4.3.3 注意事项

1. 如果不使用 `where` 子句，将删除表中所有数据。

2. `delete` 语句不能删除某一列的值（可使用 `update`）

3. 使用 `delete` 语句仅删除记录，不删除表本身。如要删除表，使用 `drop table` 语句。

4. 同 `insert` 和 `update` 一样，从一个表中删除记录将引起其它表的参照完整性问题，在修改数据库数据时，头脑中应该始终不要忘记这个潜在的问题：**外键约束**。

#### 4.3.4 删除表中所有记录（delete & truncate 的区别）

```sql:no-line-numbers
# 删除表中所有记录（DML 语句）。
delete from employee2;

# 使用 truncate 删除表中记录。(先将表摧毁，然后再创建，属于 DDL 语句)
truncate employee2;
```

## 5. `DQL` 语句（即 `SELECT` 语句）

### 5.1 准备一张学生成绩表

```sql:no-line-numbers
create table exams(
    id int primary key auto_increment,
    name varchar(20),
    chinese double,
    math double,
    english double
);

insert into exams values(null, '张三', 84, 93, 82);
insert into exams values(null, '李四', 84, 97, 78);
insert into exams values(null, '王五', 85, 92, 90);
insert into exams values(null, 'John', 81, 77, 95);
insert into exams values(null, 'Sam', 92, 95, 95);
```

### 5.2 基本用法

#### 5.2.1 查询表中所有学生的信息

```sql:no-line-numbers
select * from exams;
```

#### 5.2.2 查询表中所有学生的姓名和对应的英语成绩

```sql:no-line-numbers
select name, english from exams;
```

#### 5.2.3 过滤表中重复数据（`distinct`）

```sql:no-line-numbers
# distinct 指显示结果时，是否剔除重复数据
select distinct chinese from exams; 
```

### 5.3 通过 `as` 起别名

#### 5.3.1 在所有学生分数上加5分特长分

```sql:no-line-numbers
select chinese+5, math+5, english+5 from exams;
```

#### 5.3.2 统计每个学生的总分

```sql:no-line-numbers
select name, chinese+math+english from exams;
select name, chinese+math+english as 总分 from exams;
```

#### 5.3.3 使用别名表示学生分数

```sql:no-line-numbers
select name as 姓名, chinese as 语文, math as 数学, english as 英语 from exams;
select name 姓名, chinese 语文, math 数学, english 英语 from exams;
```

### 5.4 使用 `where` 子句，进行过滤查询

#### 5.4.1 查询姓名为张三的学生成绩

```sql:no-line-numbers
select * from exams where name='张三';
```

#### 5.4.2 查询英语成绩大于90分的同学

```sql:no-line-numbers
select * from exams where english>90;
```

#### 5.4.3 查询总分大于265分的所有同学

```sql:no-line-numbers
select * from exams where chinese+math+english>265;
```

### 5.5 `between-and`、`and`、`or`、`in`、`like` 在 `where` 子句中的使用

#### 5.5.1 查询英语分数在 `80－90` 之间的同学

```sql:no-line-numbers
select * from exams where english>=80 and english<=90;
select * from exams where english between 80 and 90;
```

#### 5.5.2 查询数学分数为 `92`、`93`、`95` 的同学

```sql:no-line-numbers
select * from exams where math in(92, 93, 95);
```

#### 5.5.3 查询所有姓张的学生成绩

```sql:no-line-numbers
select * from exams where name like '张%';
select * from exams where name like '张_';
```

#### 5.5.4 查询数学分 `>90`，语文分 `>90` 的同学

```sql:no-line-numbers
select * from exams where math>90 and chinese>90;
```

#### 5.5.5 注意事项

1. `and` 多个条件同时成立；`or` 多个条件任一成立；

2. `and` 先执行，`or` 后执行；

3. `%` 代表零个或多个任意字符； `_` 代表一个字符。

### 5.6 使用 `order by` 关键字对查询的结果进行排序输出

使用 `order by` 关键字对查询的结果进行排序输出时，其中 `desc` 表示降序，`asc` 表示升序。

#### 5.6.1 对数学成绩降序排序后输出

```sql:no-line-numbers
select math from exams order by math desc;
```

#### 5.6.2 对总分排序按从高到低的顺序输出

```sql:no-line-numbers
select * from exams order by chinese+math+english desc;
```

#### 5.6.3 对姓张的学生成绩排序输出

```sql:no-line-numbers
select * from exams where name like '张%' order by chinese+math+english desc;
```

#### 5.6.4 注意事项

`order by` 子句总是位于 `select` 语句的结尾。

### 5.7 使用聚合函数

#### 5.7.1 统计行数（记录个数）：`count`

##### 5.7.1.1 统计一个班级共有多少学生

```sql:no-line-numbers
select count(*) from exams;
```

##### 5.7.1.2 统计数学成绩大于 `90` 的学生有多少个

```sql:no-line-numbers
select count(math) from exams where math>90;
```

##### 5.7.1.3 统计总分大于 `275` 的人数有多少

```sql:no-line-numbers
select count(*) from exams where chinese+math+english>275;
```

#### 5.7.2 求和运算：`sum`

##### 5.7.2.1 统计一个班级数学总成绩

```sql:no-line-numbers
select sum(math) 数学总分 from exams;
```

##### 5.7.2.2 统计一个班级语文、英语、数学各科的总成绩

```sql:no-line-numbers
select sum(chinese) as 语文总分, sum(english) as 英语总分, sum(math) as 数学总分 from exams;
```

##### 5.7.2.3 统计一个班级语文、英语、数学的成绩总和

```sql:no-line-numbers
select sum(chinese)+sum(math)+sum(english) from exams;
```

##### 5.7.2.4 统计一个班级语文成绩平均分

```sql:no-line-numbers
select sum(chinese)/count(*) from exams;
```

##### 5.7.2.5 没有 `sum(*) `这种语法！

#### 5.7.3 求平均值：`avg`

##### 5.7.3.1 求一个班级数学平均分

```sql:no-line-numbers
select avg(math) from exams;
```

##### 5.7.3.2 求一个班级总分平均分

```sql:no-line-numbers
select sum(chinese+math+english)/count(*) from exams;
	
select avg(chinese+math+english) from exams;
```

#### 5.7.4 求最大值/最小值：`max`/`min`

##### 5.7.4.1 求班级最高分和最低分

```sql:no-line-numbers
select max(chinese+math+english) 最高分, min(chinese+math+english) 最低分 from exams;
```

### 5.8 使用 group by 进行分组 & 使用 having 对分组结果进行筛选

`group by` 用于对查询到的记录结果进行分组。

可以通过 `having` 对分组后的记录结果进行过滤。

#### 5.8.1 准备一张订单表

```sql:no-line-numbers
create table orders(
	id int,
	product varchar(20),
	price float
);

insert into orders(id,product,price) values(1, '电视', 900);
insert into orders(id,product,price) values(2, '洗衣机', 100);
insert into orders(id,product,price) values(3, '洗衣粉', 90);
insert into orders(id,product,price) values(4, '桔子', 9);
insert into orders(id,product,price) values(5, '洗衣粉', 90);
```

#### 5.8.2 对订单表中商品归类后，显示每一类商品的总价

```sql:no-line-numbers
select product, sum(price) from orders group by product;
```

#### 5.8.3 查询购买了几类商品，并且每类总价大于100的商品

```sql:no-line-numbers
select product, sum(price) from orders group by product having sum(price)>100;
```

### 5.9 `SELECT` 语句的注意事项

#### 5.9.1 `where` 筛选与 `having` 筛选的区别

1. `where` 是在分组前筛选，`having` 是在分组后进行筛选。
2. `having` 筛选的时候可以接聚合函数，而 `where` 后面不行。 

#### 5.9.2 `SELECT` 语句的书写顺序 & 解析顺序

书写顺序：

```sql:no-line-numbers
select...from....where....group by....having....order by
```

解析顺序：

```sql:no-line-numbers
# 将 select 移至倒数第 2 位
from...where....group by....having....select....order by
```

## 6. 多表设计

### 6.1 多表设计的原则

多表表设计时为了保证数据的有效性和完整性，根据现实生活中实体之间的关系，建表原则如下：

1. **一对多**：为了准确描述这种关系，会在建表时，在多方建一个外键约束字段，这个外键约束字段的值来自于一方的主键字段的值。

2. **多对多**：需要引入第三张关系表，将两张表的主键拿过来当作外键约束，这样关系表就有了多个外键了。

3. **一对一**：通常完全可以将两张表的数据合并到一起。

### 6.2 多表设计的方式：添加外键约束

#### 6.2.1 准备一张员工表和部门表

员工表：

```sql:no-line-numbers
create table employee(
    id int primary key auto_increment,
    name varchar(30),
    job varchar(30),
    salary double
);

insert into employee values(null,'张三','程序猿',15000);
insert into employee values(null,'李四','项目经理',20000);
insert into employee values(null,'王五','人力资源师',5000);
insert into employee values(null,'John','财务经理',20000);
insert into employee values(null,'Sam','HR经理',12000);
```

部门表：

```sql:no-line-numbers
create table department(
    id int primary key auto_increment,
    name varchar(30)
);

insert into department values(null,'研发部');
insert into department values(null,'人力资源部');
insert into department values(null,'财务部');	
```

#### 6.2.2 在多方表中增加外键约束字段

```sql:no-line-numbers
alter table employee add department_id int;	
	
update employee set department_id=1 where name='张三';
update employee set department_id=1 where name='李四';
update employee set department_id=2 where name='王五';
update employee set department_id=3 where name='John';
update employee set department_id=2 where name='Sam';
```

#### 6.2.3 在两个表之间建立外键约束关系（`foreign key`）

```sql:no-line-numbers
alter table employee add foreign key(department_id) references department(id);
```

#### 6.2.4 存在外键约束关系时删除记录的注意事项

在建立了外键约束关系后，如果想删除部门表 `department` 中 “研发部” 对应的记录，则需要先删除员工表 `employee` 中跟部门表 `department` 的 “研发部” 记录有约束关系的记录，否则无法删除部门表 `department` 中的 “研发部” 对应的记录。

### 6.3 多表查询：笛卡尔积(多表查询时组合的乘积)

注意：笛卡尔积数据不都是有效的数据，此时，要从笛卡尔积中筛选出有效的数据。

举例：

```sql:no-line-numbers
# 准备两张表
create table A(A_ID int primary key auto_increment,A_NAME varchar(20) not null);
insert into A values(1,'Apple');
insert into A values(2,'Orange');
insert into A values(3,'Peach');

create table B(A_ID int primary key auto_increment,B_PRICE double);
insert into B values(1,2.30);
insert into B values(2,3.50);
insert into B values(4,null);

# 筛选出有效的数据
select * from a,b where a.a_id=b.a_id;

# 筛选出价格大于 2.5 元的有哪些
select * from a,b where a.a_id=b.a_id and b.b_price>2.5;
	
# 筛选出价格大于 2.5 元的有几个
select count(*) from a,b where a.a_id=b.a_id and b.b_price>2.5;
```