---
title: JavaScript基础
category:
  - web
tag:
  - web
---

## 1. 初识 `JavaScript`

### 1.1 `JavaScript` 是什么

- `JavaScript` 是世界上最流行的语言之一，是一种运行在客户端的脚本语言（`Script` 是脚本的意思）；

- 脚本语言：不需要编译，运行过程中由 `js` 解释器（`js` 引擎）逐行来进行解释并执行；

- 现在也可以基于 `Node.js` 技术进行服务器端编程。

> 布兰登·艾奇（`Brendan Eich`，1961年～）。用10天完成 `JavaScript` 设计。最初命名为 `LiveScript`，后来在与 `Sun` 合作之后将其改名为 `JavaScript`。

### 1.2 `JavaScript` 的作用

```:no-line-numbers
- 表单动态校验（密码强度检测）（JS 产生最初的目的） 
- 网页特效
- 服务端开发（Node.js）
- 桌面程序（Electron）
- App（Cordova） 
- 控制硬件-物联网（Ruff）
- 游戏开发（cocos2d-js）
```

### 1.3 `HTML`/`CSS`/`JS` 的关系

**`HTML`/`CSS` 标记语言--描述类语言**

```:no-line-numbers
- HTML 决定网页结构和内容（决定看到什么），相当于人的身体
- CSS 决定网页呈现给用户的模样（决定好不好看），相当于给人穿衣服、化妆
```

**`JS` 脚本语言--编程类语言**

```:no-line-numbers
实现业务逻辑和页面控制（决定功能），相当于人的各种动作
```

### 1.4 浏览器执行 `JS` 简介

**浏览器分成两部分：渲染引擎和 `JS` 引擎**

```:no-line-numbers
渲染引擎：用来解析 HTML 与 CSS，俗称内核，比如 chrome 浏览器的 blink ，老版本的 webkit
```

```:no-line-numbers
JS 引擎：也称为 JS 解释器。用来读取网页中的 JavaScript 代码，对其处理后运行，比如 chrome 浏览器的 V8
```

> 浏览器本身并不会执行 `JS` 代码，而是通过内置 `JavaScript` 引擎（解释器）来执行 `JS` 代码。`JS` 引擎执行代码时逐行解释每一句源码（转换为机器语言），然后由计算机去执行，所以 `JavaScript` 语言归为脚本语言，会逐行解释执行。

### 1.5 `JS` 的组成

![](./images/_1_javascript_basic/01.png)

#### 1.5.1 `ECMAScript`

`ECMAScript` 是由 `ECMA` 国际（原欧洲计算机制造商协会）进行标准化的一门编程语言，这种语言在万维网上应用广泛，它往往被称为 `JavaScript` 或 `JScript`，但实际上后两者是 `ECMAScript` 语言的实现和扩展。

![](./images/_1_javascript_basic/02.png)

> `ECMAScript`：`ECMAScript` 规定了 `JS` 的编程语法和基础核心知识，是所有浏览器厂商共同遵守的一套 `JS` 语法工业标准。
>
> 更多参看 `MDN`: [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/JavaScript_technologies_overview](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/JavaScript_technologies_overview)

#### 1.5.2 `DOM` —— 文档对象模型

文档对象模型（`Document Object Model`，简称 `DOM`），是 `W3C` 组织推荐的处理可扩展标记语言的 **标准编程接口**。通过 `DOM` 提供的接口可以对页面上的各种元素进行操作（大小、位置、颜色等）。

#### 1.5.3 `BOM` —— 浏览器对象模型

`BOM` (`Browser Object Model`，简称 `BOM`) 是指浏览器对象模型，它提供了独立于内容的、可以与浏览器窗口进行互动的对象结构。通过 `BOM` 可以操作浏览器窗口，比如弹出框、控制浏览器跳转、获取分辨率等。

### 1.6 `JS` 的三种书写位置

`JS` 有3种书写位置，分别为行内、内嵌和外部。

#### 1.6.1 行内式 `JS`

```html:no-line-numbers
<input type="button" value="点我试试" onclick="alert('Hello World')" />
```

```:no-line-numbers
- 可以将单行或少量 JS 代码写在 HTML 标签的事件属性中（以 on 开头的属性），如：onclick
- 注意单双引号的使用：在 HTML 中我们推荐使用双引号, JS 中我们推荐使用单引号
- 可读性差， 在 html 中编写 JS 大量代码时，不方便阅读；
- 引号易错，引号多层嵌套匹配时，非常容易弄混；
- 特殊情况下使用
```

#### 1.6.2 内嵌 `JS`

```html:no-line-numbers
<script>
 alert('Hello World~!');
</script>
```

```:no-line-numbers
- 可以将多行 JS 代码写到 <script> 标签中
- 内嵌 JS 是学习时常用的方式
```

#### 1.6.3  外部 `JS` 文件

```html:no-line-numbers
<script src="my.js"></script>
```

```:no-line-numbers
- 利于 HTML 页面代码结构化，把大段 JS 代码独立到 HTML 页面之外，既美观，也方便文件级别的复用
- 引用外部 JS 文件的 script 标签中间不可以写代码
- 适合于 JS 代码量比较大的情况
```

### 1.7 `JavaScript` 注释

为了提高代码的可读性，`JS` 与 `CSS` 一样，也提供了注释功能。`JS` 中的注释主要有两种，分别是单行注释和多行注释。

#### 1.7.1 单行注释

```:no-line-numbers
// 用来注释单行文字（快捷键 ctrl + /）
```

#### 1.7.2 多行注释

```:no-line-numbers
/* */ 用来注释多行文字（ 默认快捷键 alt + shift + a ）
```

```:no-line-numbers
快捷键修改为 ctrl + shift + / 的方式如下：
vscode -> 首选项按钮 -> 键盘快捷方式 -> 查找 原来的快捷键 -> 修改为新的快捷键 -> 回车确认
```

### 1.8. `JavaScript` 输入输出语句：`alert`、`console.log`、`prompt`

为了方便信息的输入输出，`JS` 中提供了一些输入输出语句，其常用的语句如下：

|**方法**|**说明**|**归属**|
|:-|:-|:-|
|`alert(msg)`|浏览器弹出警示框|浏览器|
|`console.log(msg)`|浏览器控制台打印输出信息|浏览器|
|`prompt(msg)`|浏览器弹出输入框，用户可以输入|浏览器|

> 注意：`alert()` 主要用来显示消息给用户，`console.log()` 用来给程序员自己看运行时的消息。

## 2. 变量

### 2.1 什么是变量

变量是用于存放数据的容器。我们通过变量名获取数据，以及修改数据。

### 2.2 变量在内存中的存储

本质：变量是程序在内存中申请的一块用来存放数据的空间。

### 2.3 变量的使用

变量在使用时分为两步：1. 声明变量；2. 赋值。

#### 2.3.1 声明变量

```js:no-line-numbers
var age; // 声明一个 名称为age 的变量
```

```:no-line-numbers
- var 是一个 JS 关键字，用来声明变量（variable 变量的意思）。使用该关键字声明变量后，计算机会自动为变量分配内存空间。
- age 是程序员定义的变量名，我们要通过变量名来访问内存中分配的空间。
```

#### 2.3.2 赋值

```js:no-line-numbers
age = 10; // 给 age 这个变量赋值为 10
```

```:no-line-numbers
- = 用来把右边的值赋给左边的变量空间中，此处代表赋值的意思
- 变量值是程序员保存到变量空间里的值
```

#### 2.3.3 变量的初始化（声明一个变量并赋值）

```js:no-line-numbers
var age = 18; // 声明变量同时赋值为 18
```

```:no-line-numbers
声明一个变量并赋值， 我们称之为变量的初始化。
```

### 2.4 变量语法扩展

#### 2.4.1 更新变量

一个变量被重新复赋值后，它原有的值就会被覆盖，变量值将以最后一次赋的值为准。

```js:no-line-numbers
var age = 18;
age = 81; // 最后的结果就是 81，因为 18 被覆盖掉了
```

#### 2.4.2 同时声明多个变量

同时声明多个变量时，只需要写一个 `var`，多个变量名之间使用英文逗号隔开。

```js:no-line-numbers
var age = 10, name = 'zs', sex = 2;
```

#### 2.4.3 声明变量特殊情况

|**情况**|**说明**|**结果**|
|:-|:-|:-|
|`var age; console.log(age)`| 只声明不赋值|`undefined`|
|`console.log(age)`| 不声明不赋值，直接使用|报错|
|`age = 10; console.log(age)`| 不声明只赋值|`10`|

### 2.5 变量命名规范

```:no-line-numbers
- 由字母(A-Za-z)、数字(0-9)、下划线(_)、美元符号($)组成，如：usrAge, num01, _name
- 严格区分大小写。var app; 和 var App; 是两个变量
- 不能以数字开头。 18age 是错误的
- 不能是关键字、保留字。例如：var、for、while
- 变量名必须有意义。 MMD BBD nl → age 
- 遵守驼峰命名法。首字母小写，后面单词的首字母需要大写。 myFirstName
```

## 3. 数据类型

### 3.1 为什么需要数据类型

在计算机中，不同的数据所需占用的存储空间是不同的，为了便于把数据分成所需内存大小不同的数据，充分利用存储空间，于是定义了不同的数据类型。

### 3.2 变量的数据类型

变量是用来存储值的所在处，它们有名字和数据类型。变量的数据类型决定了如何将代表这些值的位存储到计算机的内存中。

**`JavaScript` 是一种弱类型或者说动态语言**。这意味着不用提前声明变量的类型，在程序运行过程中，类型会被自动确定。

```js:no-line-numbers
var age = 10; // 这是一个数字型
var areYouOk = '是的'; // 这是一个字符串
```

在代码运行时，变量的数据类型是由 `JS` 引擎根据 "= 右边变量值的数据类型" 来判断的，运行完毕之后，变量就确定了数据类型。

`JavaScript` 拥有动态类型，同时也意味着**相同的变量可用作不同的类型**：

```js:no-line-numbers
var x = 6; // x 为数字
var x = "Bill"; // x 为字符串
```

### 3.3 数据类型的分类：简单数据类型 & 复杂数据类型

`JS` 把数据类型分为两类： 

- 简单数据类型

    ```:no-line-numbers
    Number, String, Boolean, Undefined, Null
    ```

- 复杂数据类型

    ```:no-line-numbers
    object
    ```

### 3.4 简单数据类型（又称基本数据类型）

`JavaScript` 中的简单数据类型及其说明如下：

|**简单数据类型**|**说明**|**默认值**|
|:-|:-|:-|
|`Number`|数字型，包含整数和浮点数|`0`|
|`Boolean`|布尔值类型，如 `true`、`false`，等价于 `1` 和 `0`|`false`|
|`String`|字符串类型，如”张三“，注意：`js` 里面字符串都带引号|`""`|
|`Undefined`|`var a;` 声明了变量 `a` 但没有赋值，此时 `a = undefined`|`undefined`|
|`Null`|`var a = null;` 声明了变量 `a` 为空值|`null`|

#### 3.4.1 数字型：`Number`

##### 3.4.1.1 整数和浮点数都可以保存在数字型变量中

`JavaScript` 数字类型既可以用来保存整数值，也可以保存小数(浮点数）。

```js:no-line-numbers
var age = 21; // 整数
var Age = 21.3747; // 小数
```

##### 3.4.1.2 数字型进制

最常见的进制有二进制、八进制、十进制、十六进制。

```js:no-line-numbers
// 1.八进制数字序列范围：0~7
var num1 = 07; // 对应十进制的7
var num2 = 019; // 对应十进制的19
var num3 = 08; // 对应十进制的8
// 2.十六进制数字序列范围：0~9以及A~F
var num = 0xA;
```

> 在 `JS` 中八进制前面加 `0`，十六进制前面加 `0x`

##### 3.4.1.3 数字型范围：`Number.MAX_VALUE` & `Number.MIN_VALUE`

`JavaScript` 中数值的最大和最小值：

```js:no-line-numbers
alert(Number.MAX_VALUE); // 1.7976931348623157e+308
alert(Number.MIN_VALUE); // 5e-324
```

```:no-line-numbers
- 最大值：Number.MAX_VALUE，这个值为：1.7976931348623157e+308
- 最小值：Number.MIN_VALUE，这个值为：5e-32
```

##### 3.4.1.4 数字型三个特殊值：`Infinity` & -`Infinity` & `NaN`

```js:no-line-numbers
alert(Infinity); // Infinity
alert(-Infinity); // -Infinity
alert(NaN); // NaN
```

```:no-line-numbers
- Infinity，代表无穷大，大于任何数值
- -Infinity，代表无穷小，小于任何数值
- NaN，Not a number，代表一个非数值
```

##### 3.4.1.5 判断变量是否为非数字型：`isNaN()`

```:no-line-numbers
对于 isNaN(x)，返回 true 表示变量 x 是一个非数字类型；返回 false 表示变量 x 是一个数字类型。
```

```js:no-line-numbers
var usrAge = 21;
var isOk = isNaN(userAge);
console.log(isNum); // false ，21 不是一个非数字
var usrName = "andy";
console.log(isNaN(userName)); // true ，"andy"是一个非数字
```

#### 3.4.2 字符串型：`String`

既可以用双引号表示字符串，也可以用单引号表示字符串。

> 因为 `HTML` 标签里面的属性使用的是双引号，`JS` 这里我们更推荐使用单引号。

```js:no-line-numbers
var strMsg = "我爱北京天安门~"; // 使用双引号表示字符串
var strMsg2 = '我爱吃猪蹄~'; // 使用单引号表示字符串
var strMsg3 = 我爱大肘子; // 报错，没使用引号，会被认为是 js 代码，但 js 没有这些语法
```

##### 3.4.2.1 字符串引号嵌套：外双内单 & 外单内双

`JS` 可以用单引号嵌套双引号，或者用双引号嵌套单引号（外双内单，外单内双）

```js:no-line-numbers
var strMsg = '我是"高帅富"程序猿'; // 可以用''包含""
var strMsg2 = "我是'高帅富'程序猿"; // 也可以用"" 包含''
var badQuotes = 'What on earth?"; // 报错，不能单双引号搭配
```

##### 3.4.2.2 字符串转义符

类似 `HTML` 里面的特殊字符，字符串中也有特殊字符，我们称之为转义符。

转义符都是 `\` 开头的，常用的转义符及其说明如下：

|**转义符**|**解释说明**|
|:-|:-|
|`\n`|换行符，`n` 是 `newline` 的意思|
|`\\`|斜杠 `\`|
|`\'`|单引号 `'`|
|`\"`|双引号 `"`|
|`\t`|`tab` 缩进|
|`\b`|空格，`b` 是 `blank` 的意思|

##### 3.4.2.3 字符串长度

字符串是由若干字符组成的，这些字符的数量就是字符串的长度。通过字符串的 `length` 属性可以获取整个字符串的长度。

```js:no-line-numbers
var strMsg = "我是帅气多金的程序猿！";
alert(strMsg.length); // 显示 11
```

##### 3.4.2.4 字符串拼接

多个字符串之间可以使用 `+` 进行拼接，其拼接方式为：

```:no-line-numbers
字符串 + 任何类型 = 拼接之后的新字符串
```

> 拼接前会把与字符串相加的任何类型转成字符串，再拼接成一个新的字符串。

**示例1：**

```js:no-line-numbers
// 1.1 字符串 "相加"
alert('hello' + ' ' + 'world'); // hello world
// 1.2 数值字符串 "相加"
alert('100' + '100'); // 100100
// 1.3 数值字符串 + 数值
alert('11' + 12); // 1112
```

**示例2：**

```js:no-line-numbers
console.log('pink老师' + 18); // 只要有字符就会相连
var age = 18;
// console.log('pink老师age岁啦'); // 这样不行哦
console.log('pink老师' + age); // pink老师18
console.log('pink老师' + age + '岁啦'); // pink老师18岁啦
```

**示例3：**

```js:no-line-numbers
// 弹出一个输入框（prompt)，让用户输入年龄（用户输入）
// 把用户输入的值用变量保存起来,把刚才输入的年龄与所要输出的字符串拼接 （程序内部处理）
// 使用alert语句弹出警示框（输出结果）
var age = prompt('请输入您的年龄');
var str = '您今年已经' + age + '岁了';
alert(str);
```

#### 3.4.3 布尔型：`Boolean`

布尔类型有两个值：`true` 和 `false`，其中 `true` 表示真（对），而 `false` 表示假（错）。

布尔型和数字型相加的时候，`true` 的值为 `1`，`false` 的值为 `0`。

```js:no-line-numbers
console.log(true + 1); // 2
console.log(false + 1); // 1
```

#### 3.4.4 `Undefined` 和 `Null`

一个声明后没有被赋值的变量会有一个默认值 `undefined` ( 如果进行相连或者相加时，注意结果）

```js:no-line-numbers
var variable;
console.log(variable); // undefined
console.log('你好' + variable); // 你好undefined
console.log(11 + variable); // NaN
console.log(true + variable); // NaN
```

一个声明变量给 `null` 值，里面存的值为空（学习对象时，我们继续研究 `null`)

```js:no-line-numbers
var vari = null;
console.log('你好' + vari); // 你好 null
console.log(11 + vari); // 11
console.log(true + vari); // 1
```

### 3.5 获取变量的数据类型：`typeof`

`typeof` 可用来获取检测变量的数据类型

```js:no-line-numbers
var num = 18;
console.log(typeof num) // 结果 number
```

不同类型时，`typeof` 的返回值如下：

|**类型**|**例**|**结果**|
|:-|:-|:-|
|`String`|`typeof "小白"`|`"String"`|
|`Number`|`typeof 18`|`"number"`|
|`Boolean`|`typeof true`|`"boolean"`|
|`Undefined`|`typeof undefined`|`"undefined"`|
|`Null`|`typeof null`|`"object"`|

### 3.6 字面量

字面量就是用来表示一个固定值，如：

- 数字字面量：`8`, `9`, `10`
  
- 字符串字面量：`'黑马程序员'`, `"大前端"`
  
- 布尔字面量：`true`，`false`

### 3.7 数据类型转换

使用表单、`prompt` 获取过来的数据默认是字符串类型的，此时就不能直接简单的进行加法运算，而需要转换变量的数据类型。

我们通常会实现 `3` 种方式的转换： 

- 转换为字符串类型
  
- 转换为数字型
  
- 转换为布尔型

#### 3.7.1 转换为字符串类型

|**方式**|**说明**|**案例**|
|:-|:-|:-|
|`toString()`|转成字符串|`var num = 1; alert(num.toString());`|
|`String()` 强制转换|转成字符串|`var num = 1; alert(String(num));`|
|加号拼接字符串|和字符串拼接的结果都是字符串|`var num = 1; alert(num + "我是字符串");`|

```:no-line-numbers
- toString() 和 String() 使用方式不一样。
- 三种转换方式，我们更喜欢用第三种加号拼接字符串转换方式，这一种方式也称之为隐式转换。
```

#### 3.7.2 转换为数字型

|**方式**|**说明**|**案例**|
|:-|:-|:-|
|`parseInt(string)` 函数|将 `string` 类型转成整数数值型|`parseInt('78')`|
|`parseFloat(string)` 函数|将 `string` 类型转成浮点数数值型|`parseFloat('78.21')`|
|`Number()` 强制转换函数|将 `string` 类型转换为数值型|`Number(12)`|
|`js` 隐式转换（`-`、`*`、`/`）|利用算术运算隐式转换为数值型|`'12' - 0`|

```:no-line-numbers
- 注意 parseInt 和 parseFloat 单词的大小写，这2个是重点
- 隐式转换是我们在进行算数运算的时候，JS 自动转换了数据类型
```

**示例1：**

```js:no-line-numbers
// 1. 弹出输入框，输入出生年份，并存储在变量中
var year = prompt('请输入您的出生年份：'); // 用户输入
// 2. 用今年减去刚才输入的年份 
var result = 2019 - year; // 程序内部处理
// 3. 弹出提示框 
alert('您的年龄是:' + result + '岁'); // 输出结果
```

**示例2：简单加法器**

```js:no-line-numbers
// 1. 先弹出第一个输入框，提示用户输入第一个值
var num1 = prompt('请输入第一个值：');
// 2. 再弹出第二个框，提示用户输入第二个值
var num2 = prompt('请输入第二个值：');
// 3. 将输入的值转换为数字型后，把这两个值相加，并将结果赋给新的变量 
var result = parseFloat(num1) + parseFloat(num2);
// 4. 弹出结果
alert('结果是:' + result);
```

#### 3.7.3 转换为布尔型

|**方式**|**说明**|**案例**|
|:-|:-|:-|
|`Boolean()` 函数|其他类型转成布尔值|`Boolean('true')`|

```:no-line-numbers
- 代表空、否定的值会被转换为 false ，如 ''、0、NaN、null、undefined 
- 其余值都会被转换为 true
```

```js:no-line-numbers
console.log(Boolean('')); // false
console.log(Boolean(0)); // false
console.log(Boolean(NaN)); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean('小白')); // true
console.log(Boolean(12)); // true
```

## 4. 扩展阅读

### 4.1 解释型语言和编译型语言

计算机不能直接理解任何除机器语言以外的语言，所以必须要把程序员所写的程序语言翻译成机器语言才能执行程序。程序语言翻译成机器语言的工具，被称为翻译器。

![](./images/_1_javascript_basic/03.png)

翻译器翻译的方式有两种：一个是 **编译**，另外一个是 **解释**。两种方式之间的区别在于 **翻译的时间点不同**：

- 编译器是在代码执行之前进行编译，生成中间代码文件。
  
- 解释器是在运行时进行及时解释，并立即执行(当编译器以解释方式运行的时候，也称之为解释器)。

![](./images/_1_javascript_basic/04.png)

### 4.2 标识符、关键字、保留字

#### 4.2.1  标识符

标识(`zhi`)符：就是指开发人员为变量、属性、函数、参数取的名字。

**标识符不能是关键字或保留字**。

#### 4.2.2  关键字

关键字：是指 `JS` 本身已经使用了的字，不能再用它们充当变量名、方法名。

```:no-line-numbers
包括：break、case、catch、continue、default、delete、do、else、finally、for、function、if、in、
instanceof、new、return、switch、this、throw、try、typeof、var、void、while、with 等。
```

#### 4.2.3  保留字

保留字：实际上就是预留的“关键字”，意思是现在虽然还不是关键字，但是未来可能会成为关键字，同样不能使用它们当变量名或方法名。

```:no-line-numbers
包括：boolean、byte、char、class、const、debugger、double、enum、export、extends、
fimal、float、goto、implements、import、int、interface、long、mative、package、
private、protected、public、short、static、super、synchronized、throws、transient、
volatile 等。
```

> 注意：如果将保留字用作变量名或函数名，那么除非将来的浏览器实现了该保留字，否则很可能收不到任何错误消息。当浏览器将其实现后，该单词将被看做关键字，如此将出现关键字错误。