---
title: 第02天
category:
  - C语言基础
tag:
  - C语言基础
---

## 1. 常量（不会变化的数据，不能被修改）

**三种类型的常量：**

```:no-line-numbers
1. "hello"、'A'、-10、3.1415926（浮点常量）

2. #define PI 3.1415
    【推荐】
    【强调】：没有分号结束标记。 
    【定义宏】：#define 宏名 宏值 

3. const int a = 10;
    定义语法：const 类型名 变量名 = 变量值。【不推荐，通过指针可修改】
    const 关键字：被该关键字修饰的变量，表示为只读变量。
```

## 2. 变量（会变化的数据，能被修改）

**定义语法：**

```:no-line-numbers
类型名 变量名 = 变量值。（一般方法）
```

**变量三要素：**

```:no-line-numbers
类型名、变量名、变量值。

示例：
int r = 3;    
float s = PI*r*r;（变量值是一个表达式）
```

**变量的定义 & 变量的声明**

```:no-line-numbers
变量的定义： 
    int a = 40;

变量的声明： 
    1）int a; // 没有变量值的变量定义叫做声明。
    2）extern int a; // 添加了关键字 extern。

1. 变量定义会开辟内存空间。变量声明不会开辟内存空间。
2. 变量要想使用必须有定义。
    当编译器编译程序时，在变量使用之前，必须要看到变量定义。如果没有看到变量定义，编译器会自动找寻一个变量声明提升成为定义。
    如果该变量的声明前有 extern 关键字，无法提升。
```

> 【建议】：定义变量时。尽量不要重名。

## 3. 标识符（变量和常量的统称）

**命名规则：**

```:no-line-numbers
1. 通常常量使用大写、变量使用小写。大小写严格区分。

2. 只能使用字母、数字、下划线（"_"）命名标识符。且数字不能开头。 a-z/A-Z/0-9/_
    int a5ir = 10; // ok 
    int _34F = 6; // ok
    float s2_i85c = 5.4;  // ok
    int 98ti_54 = 4;  // error

3. 禁止使用关键字和系统函数作为标识符名称。 main/system/printf/sleep ...
```

## 4. `sizeof` 关键字（`sizeof` 不是函数，只是一个关键字）

`sizeof` 不是函数，只是一个关键字，所以不需要依赖任何头文件。

`sizeof` 用来求一个变量、类型的大小。

`sizeof` 的返回值为 `size_t`，`size_t` 类型在 32 位操作系统下是 `unsigned int`，是一个无符号的整数，使用 `%u` 接收返回值。

**使用方式：**

```:no-line-numbers
方式1：sizeof(类型名) -- sizeof(int)

方式2：sizeof(变量名) -- int a = 20； sizeof(a)

【了解】：sizeof 变量名/类型名  （这种去掉括号的方式不推荐使用，因为不方便阅读）
    举例1： sizeof int 
    举例2： sizeof a
```

## 5. 数据类型

### 5.1 有符号整型（`signed`）

类型前缀 `signed` 表示有符号（类型默认为有符号，所以通常省略前缀 `signed`）

|**整型类型**|**格式符**|**所占字节**|**使用示例**|
|:-|:-|:-|:-|
|`int`|`%d`|`4` 字节|`int 名 = 值;`|
|`short`|`%hd`|`2` 字节|`short 名 = 值;` `short s1 = 3;`|
|`long`|`%ld`|`4` 字节（windows 32/64：`4B` ； Linux 32位：`4B` ，64位：`8B` )）|`long 名 = 值;` `long len = 6;`|
|`long long`|`%lld`|`8` 字节|`long long 名= 值;` `long long llen = 70;`|


### 5.2 无符号整型（`unsigned`）

类型前缀 `unsigned` 表示无符号。无符号意味着只关心数据量，不关心方向（没有正负）  

|**整型类型**|**格式符**|**所占字节**|**使用示例**|
|:-|:-|:-|:-|
|`unsigned int`|`%u`|`4` 字节|`unsigned int 名 = 值;`|
|`unsigned short`|`%hu`|`2` 字节|`unsigned short 名 = 值;`|
|`unsigned long`|`%lu`|`4` 字节（windows 32/64：`4B` ； Linux 32位：`4B` ，64位：`8B` )）|`unsigned long 名 = 值;`|
|`unsigned long long`|`%llu`|`8` 字节|`unsigned long long 名 = 值;`|

**示例：**

```c:no-line-numbers
unsigned int a = 10u;  // 简写成 unsigned int a = 10;
unsigned short b = 20u;// 简写成 unsigned short b = 20;
unsigned long c = 30Lu;
unsigned long long d = 40LLu;
printf("unsigned int 型数据值：%u\n", a);
printf("unsigned short 型数据值：%hu\n", b);
printf("unsigned long 型数据值：%lu\n", c);
printf("unsigned long long 型数据值：%llu\n", d);
```

```c:no-line-numbers
int a = 3;
short b = 4;
long c = 5;                // 5L  5l
long long d = 6;  // 6LL  6ll
printf("sizeof(int) = %d\n", sizeof(int));
printf("sizeof(short) = %d\n", sizeof(short));
printf("sizeof(long) = %d\n", sizeof(long));
printf("sizeof(long long) = %d\n", sizeof(long long));

printf("--------------------------------------\n");

unsigned int aun = 3;             // 3u
unsigned short bun = 4;           // 4u
unsigned long cun = 5;            // 5lu
unsigned long long dun = 6;// 6llu
printf("sizeof(unsigned int) = %d\n", sizeof(unsigned int)); // aun
printf("sizeof(unsigned short) = %d\n", sizeof(unsigned short));
printf("sizeof(unsigned long) = %d\n", sizeof(unsigned long));
printf("sizeof(unsigned long long) = %d\n", sizeof(unsigned long long));
```

### 5.3 `char` 字符类型（`1` 字节）

格式匹配符： `%c`。

存储一个字符，如 `'A'`、`'a'`、`'%'`、`'#'`、`'0'`。本质是 `ASCII` 码，即：

|**字符**|**对应的 `ASCII` 码**|
|:-|:-|
|`'A'`|`65`|
|`'a'`|`97`|
|`'0'`|`48`|
|`'\n'` （转义字符）|`10`|
|`'\0'` （转义字符）|`0`|

> 转义字符：`'\'` 将普通字符转为特殊意。将特殊字符转为本身意。

### 5.4 浮点型（`float`、`double`）

**`float`（单精度浮点型，`4` 字节）**

```:no-line-numbers
使用示例：float v1 = 4.345;
格式匹配符：%f 
默认保留 6 位小数。
```

**`double`（双精度浮点型，`8` 字节）**

```:no-line-numbers
使用示例：double v2 = 5.678;
格式匹配符：%lf 
```

**无符号的浮点型**

```c:no-line-numbers
unsigned float v1 = 4.345; // 无符号的 float 数据
unsigned double v2 = 5.678; // 无符号的 float 数据
```

**格式化输出浮点型**

```c:no-line-numbers
// 输出的含义为：显示 8 位数（包含小数点），不足 8 位用 0 填充。并且保留 3 位小数。对第4 位做四舍五入。
printf("n = %08.3f\n", n);
// 不足 8 位用空格填充。
printf("n = %8.3f\n", n);  
```

## 6. 进制

### 6.1 八进制

**定义八进制数语法：** 零开头，每位数 `0~7` 之间。

**八进制转十进制：**

```:no-line-numbers
056 -- 46
    5x8+6=46
    
0124 -- 84
    0x8x8x8+1x8x8+2x8+4=64+16+4=84
```

**八进制转二进制：**

> 原理：按 `421` 码将每个八进制位展开。

```:no-line-numbers
056 -- 101110
    5 -- 101
    6 -- 110

05326 -- 101011010110
    5 -- 101
    3 -- 011 
    2 -- 010
    6 -- 110
```

**二进制转八进制：**

> 原理：自右向左，每 `3` 位一组，按 `421` 码转换。高位不足三位补 `0`

```:no-line-numbers
1 010 111 010 110 -- 012726
```

### 6.2 十六进制

**语法：**

```:no-line-numbers
以 0x 开头，每位取 0-9/A-F/a-f

A -- 10
B -- 11
C -- 12
D -- 13
E -- 14
F -- 15
```

**十六进制转十进制：**

```:no-line-numbers
0x1A： 16+10 = 26
0x13F：15+3x16+256
```

**十六进制转二进制：**

```:no-line-numbers
0x1A： 00011010
0x13F：000100111111
```

**二进制转十六进制：**

> 原理：自右向左，每 `4` 位一组，按 `8421` 码转换。高位不足三位补 `0`

```:no-line-numbers
0001 0011 1111 -- 13F
```

### 6.3 进制转换技巧（凑数法）

```:no-line-numbers
321:    256 128 64 32 16 8 4 2 1
        1   0   1  0  0  0 0 0 1

以上表示十进制数 321 转二进制数 1 0100 0001 的过程。

凑数法：即列举出不超过 321 的所有 2 的幂指数，然后从大到小怼出 321 来
```

```:no-line-numbers
321:    256 16 1
        1   4  1

以上表示十进制数 321 转十六进制数 141 的过程。

凑数法：即列举出不超过 321 的所有 16 的幂指数，然后从大到小怼出 321 来
```

```:no-line-numbers
321:    64 8 1
        5  0 1

以上表示十进制数 321 转八进制数 501 的过程。

凑数法：即列举出不超过 321 的所有 8 的幂指数，然后从大到小怼出 321 来
```

### 6.4 注意：不能给变量直接复制二进制数据

```c:no-line-numbers
int m = 0x15F4;
int n = 345;
int var = 010011; // 不允许。
```

### 6.5 八进制 & 十六进制的格式化打印

```c:no-line-numbers
int a = 0x2C;  // 等价 0x2c
printf("10进制显示 a = %d\n", a);
printf("8进制显示 a = %o\n", a);
printf("16进制显示 a = %x\n", a);
```

## 7. 原码 & 反码 & 补码

**原码：**

```:no-line-numbers
 43 -> 00101011
-43 -> 10101011
```

**反码：**

```:no-line-numbers
 43 -> 00101011
-43 -> 10101011  
       11010100  反码：符号位不变，其它部分取反
```

**补码（现今计算机采用的存储形式）：**

```:no-line-numbers
 43 -> 00101011 ： 正数不变
-43 -> 11010101 ： 负数，最高位表符号位不变，其余取反+1
```

**总结：**

```:no-line-numbers
对于正数，三码合一
对于负数，补码 = 原码取反（符号位不变）再加 1
```

```:no-line-numbers
两数相减 等价于 正负数相加
43 - 27 <=> 43 + -27
```

```:no-line-numbers
人为规定： 10000000 => -128 （即 -0 = -128）
```