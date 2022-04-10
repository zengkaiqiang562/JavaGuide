---
title: 反射机制
category: Java
tag:
  - Java基础
---

## 反射机制的概念
Java反射机制就是在运行状态中：
- 对于任意一个类（即包括不同包名下的类），都能够知道这个类的所有属性和方法（即包括protected和private修饰的）；
- 对于任意一个对象，都能够调用它的任意一个方法和属性。
  
这种动态获取的信息以及动态调用对象的方法的功能称为java语言的反射机制。
  
要想解剖一个类，必须先要获取到该类的字节码文件对象（即Class对象）。而解剖使用的就是Class类中的方法。所以先要获取到每一个字节码文件对应的Class类型对象。

综上，反射就是在运行状态下，通过class文件对象(即Class类的对象)去使用构造方法，成员变量，成员方法。

## 获取Class对象的方法

**1. Object类的`getClass()`方法。**
   
**2. 数据类型的静态的class属性。** 数据类型是指所有的数据类型（包括基本数据类型，如`int.class`）。
   
**3. 通过Class类的静态方法`forName(String className)`。** 其中className为全路径名，会抛出`ClassNotFoundException`异常

```java
// 方式1
Person p = new Person();
Class c = p.getClass();

Person p2 = new Person();
Class c2 = p2.getClass();

System.out.println(p == p2);// false
System.out.println(c == c2);// true

// 方式2
Class c3 = Person.class;
System.out.println(c == c3);// true

try {
	// 方式3
	Class c4 = Class.forName("com.zengk.reflect.Person");
	System.out.println(c == c4); //true
} catch (ClassNotFoundException e) {
}
```

>一个类只有一个Class对象，即对某个类的所有对象，通过`getClass()`方法或`class`属性获取到的Class对象都是同一个，当然，通过`Class.forName`获取的Class对象也是同一个。

**开发中推荐使用第三种方式**，原因有两点:
1. 通过`getClass()`方法或`class`属性对某个类使用反射，需要先对这个类进行导包，如果此类不存在，则程序错误，无法编译；而通过`Class.forName(className)`方法，由于只是传入某个类的全路径名字符串，所以不需要导包，并且即使该类不存在，也只是在运行时执行到此处时报出`ClaaNotFoundException`异常，程序还是能编译通过的。

2. 通过`Class.forName`方法使用反射，可以结合配置文件实现软编码，即在配置文件中定义className字符串，然后在程序中解析出来，只需修改配置文件中的全路径类名，就可以使用同一套代码对不同的类实现反射。

## 使用反射获取并使用构造方法、成员变量、成员方法