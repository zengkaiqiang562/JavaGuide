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
  
要想解剖一个类，必须先要获取到该类的字节码文件对象（即`Class`对象）。而解剖使用的就是`Class`类中的方法。所以先要获取到每一个字节码文件对应的`Class`类型对象。

综上，反射就是在运行状态下，通过字节码文件对象(即`Class`类的对象)去使用构造方法，成员变量，成员方法。

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

>一个类只有一个Class对象，即对某个类的所有对象，通过`getClass()`方法或`class`属性获取到的Class对象都是同一个，当然，通过`Class.forName`获取的`Class`对象也是同一个。

**开发中推荐使用第三种方式**，原因有两点:
1. 通过`getClass()`方法或`class`属性对某个类使用反射，需要先对这个类进行导包，如果此类不存在，则程序错误，无法编译；而通过`Class.forName(className)`方法，由于只是传入某个类的全路径名字符串，所以不需要导包，并且即使该类不存在，也只是在运行时执行到此处时报出`ClaaNotFoundException`异常，程序还是能编译通过的。

2. 通过`Class.forName`方法使用反射，可以结合配置文件实现软编码，即在配置文件中定义`className`字符串，然后在程序中解析出来，只需修改配置文件中的全路径类名，就可以使用同一套代码对不同的类实现反射。

## 使用反射获取并使用构造方法、成员变量、成员方法

在反射技术中，一个类的构造方法，成员变量，成员方法都被封装成了对应的对象
- 构造方法——Constructor对象
- 成员变量——Field对象
- 成员方法——Method

所以通过反射去获取并使用某个类的构造方法、成员变量、成员方法，就是通过他们相应的对象实现的。

### 通过反射获取构造方法并使用

**1. 获取所有公共构造方法的构造器对象:**
```java
public Constructor<?>[] getConstructors()
```

**2. 获取所有构造方法(包括私有的和protected)的构造器对象:** 
```java
public Constructor<?>[] getDeclaredConstructors()
```

**3. 获取某一个公共构造方法的构造器对象:**
```java
public Constructor<T> getConstructor(Class<?>... parameterTypes)
```
其中`parameterTypes`是可变参数, 实际上是一个`Class`类型的数组。表示构造方法的参数类型的字节码文件对象（`Class`对象）

**4. 通过构造器对象创建对象:**
```java
public T newInstance(Object... initargs)
```
其中`intitleargs`表示构造方法需要传入的具体参数

**代码示例：**
```java
// 获取字节码文件对象
Class c = null;
try {
	c = Class.forName("com.zengk.reflect.Person");
} catch (ClassNotFoundException e) {
	e.printStackTrace();
}

//Constructor[] cons1 = c.getConstructors();
//Constructor[] cons2 = c.getDeclaredConstructors();

Constructor con = null;
Object obj = null;

try {
	// 获取的是无参数构造方法的构造器对象
	con = c.getConstructor();

	//表示通过无参构造方法的构造器创建对象
	obj = con.newInstance();
} catch (Exception e) {
	e.printStackTrace();
}

try {
	// 获取的是带参构造方法的构造器对象
	con = c.getConstructor(String.class, int.class);

	//表示通过带参构造方法的构造器创建对象
	obj = con.newInstance("zengk", 26);
} catch (Exception e) {
	e.printStackTrace();
}
```
### 通过反射获取成员变量并使用

**Class**

获取所有公共的成员变量
```java
public Field[] getFields()
```

获取所有的成员变量(包括private和protected)
```java
public Field[] getDeclaredFields()
```

获取单个的公共成员变量
```java
public Field getField(String name)
```

获取单个的成员变量(包括private和protected)。通过`getField`获取不到私有的成员变量，会报`NoSuchFieldException`异常，要通过`getDeclaredField(String varName)`获取
```java
public Field getDeclaredField(String name)
```

**Field**

给obj对象的field字段表示的成员变量赋值 
```java
public void set(Object obj, Object value)
```

获取该Field对象表示的成员变量的值
```java
public Object get(Object obj)
```

对Field字段表示的成员变量赋值时，设置是否取消Java语言访问检查。其中参数`flag`为true表示取消Java语言访问检查，false表示实施Java语言访问检查。flag设置为true时也称为**暴力访问**。通过反射给私有成员变量赋值前，需要强制取消Java语言访问检查，否则在调`Field.set`方法赋值时会报`IllegalAccessException`异常
```java
public void setAccessible(boolean flag)
```
**代码示例：**
```java
// 获取字节码文件对象
Class c = Class.forName("com.zengk.reflect.Person");

//1. 获取所有公共的成员变量:  Field[] fields = c.getFields();
//2. 获取所有的成员变量:     Field[] fields = c.getDeclaredFields();

// 获取构造器对象
Constructor con = null;
Object obj = null;
try {
	con = c.getConstructor();
	obj = con.newInstance();
} catch (Exception e) {
	e.printStackTrace();
}

Field ageField = null;
try {
	//3. 获取单个的公共成员变量
	ageField = c.getField("age");

	//给obj对象的field字段表示的成员变量age赋值为20
	//public void set(Object obj, Object value)
	ageField.set(obj, 20);
} catch (Exception e) {
	e.printStackTrace();
}

Field nameField = null;
try {
	// 4. 获取单个的成员变量(包括private和protected)
	//    通过getField获取不到私有的成员变量，会报NoSuchFieldException异常，
	//    要通过getDeclaredField(String varName)获取
	nameField = c.getDeclaredField("name");

	//通过反射给私有成员变量赋值前，需要强制取消Java语言访问检查，
	//否则在调Field.set方法赋值时会报IllegalAccessException异常
	nameField.setAccessible(true);

	nameField.set(obj, "zengk");
} catch (Exception e) {
	e.printStackTrace();
}
```

### 通过反射获取成员方法并使用

获取所有公共方法，包括父类的
```java
public Method[] getMethods()
```

获取本类的所有方法
```java
public Method[] getDeclaredMethods()
```

获取单个的公共方法， 其中`name`表示方法名，`parameterTypes`表示所有形参的`Class`对象。如果方法没有形参，则`parameterTypes`为`null`。
```java
public Method getMethod(String name, Class<?>... parameterTypes)
```

获取单个的所有方法(包括私有的)
```java
public Method getDeclaredMethod(String name, Class<?>... parameterTypes)
```

通过`Method`对象调用方法，其中`obj`是方法所在类的对象(通过构造器对象得到的)， `args`表示该成员方法的具体参数值。如果方法没有形参，则`args`为`null`。
```java
public Object invoke(Object obj, Object... args)
```
>在通过`invoke`方法调用私有成员方法之前，需要调`setAccessible(true)`取消Java语言访问检查。

**代码示例：**
```java
// 获取字节码文件对象
Class c = Class.forName("com.zengk.reflect.Person");

// 创建对象
Constructor con = c.getConstructor();
Object obj = con.newInstance();

// Method[] methods = c.getMethods();// 所有公共方法，包括父类的
// Method[] methods = c.getDeclaredMethods();// 本类的所有方法

//第一种：无参数无返回值
Method m1 = c.getMethod("show", null);
m1.invoke(obj, null);

//第二种：带参数无返回值
Method m2 = c.getMethod("function", String.class);
m2.invoke(obj, "zengk");

//第三种：带多个参数有返回值 
Method m3 = c.getMethod("reutrnValue", String.class, int.class);
Object ooo = m3.invoke(obj, "zengk", 26);

//第四种：私有方法的调用
Method m4 = c.getDeclaredMethod("hello", null);
m4.setAccessible(true);
m4.invoke(obj, null);
```

## 通过反射越过泛型检查

举例： 在`ArrayList<Integer>`对象list中添加一个字符串数据

```java
ArrayList<Integer> array = new ArrayList<Integer>();
array.add(10); // right
array.add("hello"); // error
```

如果调`list.add`方法，只能添加泛型规定的`Integer`类型对象，添加其他类型对象编译时就会报错。通过反射，可以利用`list`的字节码文件对象(`Class`对象)，调用`getMethod("add", Object.class);`获取`Method`对象，再通过`invoke`方法就可以向`list`中`add`添加`Object`的对象。因为所有类型都继承了`Object`类，所以根据`Java`的多太特性，可以向`list`中添加`String`对象，甚至其他任意对象。

```java
// 获取字节码文件对象
Class c = array.getClass();
Method m = c.getMethod("add", Object.class);
m.invoke(array, "hello");
m.invoke(array, "world");
m.invoke(array, "java");
m.invoke(array, 23.45f);
m.invoke(array, new Person());

System.out.println(array);
```