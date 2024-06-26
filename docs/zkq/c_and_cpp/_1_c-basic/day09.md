---
title: 第09天（结构体&共用体&枚举）
category:
  - C语言基础
tag:
  - C语言基础
---

## 1. 结构体的定义和使用

**定义结构体类型：**

```:no-line-numbers
struct 结构体名称
{
   结构体成员列表
};
```

**定义结构体变量：**

```:no-line-numbers
struct 结构体名称 结构体变量名
```

**为结构体成员变量赋值：**

```:no-line-numbers
结构体变量名.结构体成员变量 = 值
```

> 如果结构体成员变量是字符串类型，那么需要使用 `strcpy` 进行赋值。

**注意：定义结构体类型的时候不能为成员变量赋值**

```c:no-line-numbers
struct student
{
    // int age = 18; //错误
    ...
}
```

**示例1：定义结构体变量的同时，按照结构体顺序赋值**

![](./images/day09/01.png)

**示例2：定义结构体变量的同时，为指定的结构体成员赋值**

![](./images/day09/02.png)

**示例3：先定义结构体变量，再为结构体成员赋值**

![](./images/day09/03.png)

**示例4：定义结构体类型的同时，声明结构体变量**

![](./images/day09/04.png)

**示例5：定义结构体类型的同时，声明结构体变量，并初始化赋值**

![](./images/day09/05.png)

**示例6：定义结构体类型的同时，声明多个结构体变量，并初始化赋值**

![](./images/day09/06.png)

## 2. 结构体大小和在内存中的存储结构

```:no-line-numbers
结构体需要根据数据类型进行内存对齐，
因此，以所占内存最大的成员变量数据类型的所占字节数，作为结构体变量进行内存对齐时的内存单元。
```

**示例1：**

![](./images/day09/07.png)

**示例2：**

![](./images/day09/08.png)

```:no-line-numbers
对比如上两个示例可以看出：通过调整结构体的成员列表，可以减少结构体所占的内存大小。
一般地，按照成员变量所占内存从大到小的顺序定义成员列表，可以节省结构体所占的内存空间。但是，这样排列成员列表，可能不方便代码阅读。
实际开发中，应该按照既方便代码阅读，又能节省内存空间的方式排列成员列表（即：二者之间取其平衡点）
```

### 2.1 求结构体所占内存空间大小

```:no-line-numbers
1. 通过结构体变量求： sizeof(stu)
2. 通过结构体类型求： sizeof(struct stus1)
```

## 3. 结构体数组

![](./images/day09/09.png)

## 4. 结构体数组排序

![](./images/day09/10.png)

## 5. 结构体中包含指针类型的成员变量

![](./images/day09/11.png)

## 6. 指向结构体类型的指针（即结构体指针）

![](./images/day09/12.png)

## 7. 在堆空间中创建结构体

![](./images/day09/13.png)

## 8. 结构体案例

![](./images/day09/14.png)

## 9. 结构体和函数

### 9.1 结构体变量作形参（值传递）

![](./images/day09/15.png)

### 9.2 结构体指针作形参（地址传递）

![](./images/day09/16.png)

### 9.3 函数返回值类型为结构体类型

![](./images/day09/17.png)

### 9.4 函数返回值类型为结构体指针类型

![](./images/day09/18.png)

## 10. 结构体嵌套

![](./images/day09/19.png)

## 11. 共用体（联合体）

```:no-line-numbers
1. 共用体就是在同一个存储空间存储不同类型数据的类型；
2. 共用体所占的内存长度，等于其最长成员的长度倍数；
3. 同一内存段可以用来存放几种不同类型的成员，但每一瞬时只有一种起作用；
4. 共用体变量中起作用的成员是最后一次存放的成员，在存入一个新的成员后原有的成员的值会被覆盖；
5. 共用体变量的地址和它的各成员的地址都是同一地址。
```

**示例1：**

![](./images/day09/20.png)

**示例2：**

![](./images/day09/21.png)

**示例3：**

![](./images/day09/22.png)

## 12. 枚举

```:no-line-numbers
1. 在枚举值表中应列出所有可用值，也称为枚举元素 or 枚举常量。
    enum color { 枚举常量 };  =>  enum color { red, green, blue, black, pink, yellow };

2. 枚举值是常量，不能在程序中用赋值语句再对它赋值。

3. 枚举常量是整型常量。不能是浮点数。可以是负值。 
   默认初值从 0 开始，后续常量较前一个常量 +1。
   可以给任意一个常量赋任意初值。后续常量较前一个常量 +1
```

**示例1：**

![](./images/day09/23.png)

**示例2：**

![](./images/day09/24.png)

## 13. `typedef` 关键字（为数据类型起别名）

```:no-line-numbers
1. typedef 为C语言的关键字，作用是为一种数据类型（基本类型或自定义数据类型）定义一个新名字，不能创建新类型。
2. 与 #define 不同，typedef 仅限于数据类型，而不是能是表达式或具体的值
3. #define 发生在预处理，typedef 发生在编译阶段
```

**示例1：**

![](./images/day09/25.png)

**示例2：**

![](./images/day09/26.png)