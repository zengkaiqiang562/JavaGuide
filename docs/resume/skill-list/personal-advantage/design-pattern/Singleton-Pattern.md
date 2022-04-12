---
title: 单例模式
category: 设计模式
tag:
  - 设计模式
---

## 定义
保证一个类仅有一个实例，并提供一个访问此实例的方法。

**单例模式的作用：**

节省内存和计算、保证结果正确、方便管理。

**实现一个单例类的关键点：**

1. 构造方法不对外开放，通过private访问修饰符修饰

2. 通过静态方法或枚举返回单例类对象

3. 确保单例类的对象有且只有一个，尤其在多线程环境下

4. 确保单例类对象在反序列化时不会重新构建对象


## 单例模式的使用场景

1. 整个项目需要一个共享访问点或共享数据（全局信息类）
     > 如在一个类上记录网站的访问次数，我们不希望有的访问被记录在对象A上，有的却记录在对象B上，此时就让这个类成为单例类。

2. 创建一个对象需要耗费的资源过多，如访问I/O或者数据库等资源

3. 无状态的工具类
     > 如日志工具类。不管是在哪里使用，只需它帮我们记录日志信息，并不需要在它的实例对象中通过任何成员变量存储任何状态，此时就只需要创建一个实例对象即可。

## 单例模式的缺点

单例对象如果持有`Context`，那么容器引发内存泄漏，此时需要注意传递给单例对象的`Context`最好是`Application Context`。

## 单例模式的8种写法

### 饿汉式（静态常量）【可用】

```java
/**
 * 描述： 饿汉式（静态常量）（可用）
 */
public class Singleton1 {

    private final static Singleton1 INSTANCE = new Singleton1();

    private Singleton1() {}

    public static Singleton1 getInstance() {
        return INSTANCE;
    }
}
```

### 饿汉式（静态代码块）【可用】

```java
/**
 * 描述： 饿汉式（静态代码块）（可用）
 */
public class Singleton2 {

    private final static Singleton2 INSTANCE;

    static {
        INSTANCE = new Singleton2();
    }

    private Singleton2() {}

    public static Singleton2 getInstance() {
        return INSTANCE;
    }
}

```
以上两种饿汉式本质上没有区别

### 懒汉式（线程不安全）【不可用】

```java
/**
 * 描述： 懒汉式（线程不安全）
 */
public class Singleton3 {

    private static Singleton3 instance;

    private Singleton3() {}

    public static Singleton3 getInstance() {
        if (instance == null) {
            instance = new Singleton3();
        }
        return instance;
    }
}
```

### 懒汉式（线程安全，同步方法）【不推荐用】

```java
/**
 * 描述： 懒汉式（线程安全）（不推荐）
 */
public class Singleton4 {

    private static Singleton4 instance;

    private Singleton4() {}

    /**
    * 虽然是线程安全的，但是存在效率问题，
    * 因为当 instance != null 时，是不需要加 synchronized 的
    */
    public synchronized static Singleton4 getInstance() {
        if (instance == null) {
            instance = new Singleton4();
        }
        return instance;
    }
}
```

### 懒汉式（线程不安全，同步代码块）【不可用】

```java
/**
 * 描述： 懒汉式（线程不安全）（不推荐）
 */
public class Singleton5 {

    private static Singleton5 instance;

    private Singleton5() {}

    /**
    * 当线程A执行完 if(instance==null) 进入if语句后，
    * 马上切到线程B，此时 instance==null 仍然成立，
    * 即线程A 和 线程B 都可以进入if语句，从而导致 new Singleton5() 执行多次
    * 因此是线程不安全的
    */
    public static Singleton5 getInstance() {
        if (instance == null) {
            synchronized (Singleton5.class) {
                instance = new Singleton5();
            }
        }
        return instance;
    }
}
```

### 双重检查【推荐用】

优点：线程安全；延迟加载；效率较高。

为什么要`double-check`？

1. 线程安全
2. 单`check`行不行？
3. 性能问题

为什么要用 `volatile`？

1. 新建对象实际上有 3 个步骤
2. 重排序会带来`NPE`
3. 防止重排序

```java
/**
 * 描述： 双重检查（推荐面试使用）
 */
public class Singleton6 {

    private volatile static Singleton6 instance;

    private Singleton6() {}

    /**
    * 外层if是为了提高效率，即当 instance != null 时，直接返回
    * 内层if是为了保证线程安全，即当多个线程都进入了外层if时，那么由于synchronized关键字的存在，保证了内层if语句的原子性
    */
    public static Singleton6 getInstance() {
        if (instance == null) {
            synchronized (Singleton6.class) {
                if (instance == null) {
                    instance = new Singleton6();
                }
            }
        }
        return instance;
    }
}
```

**使用`volatile`修饰`instance`的作用有2点：**
1. 禁止重排序，避免访问单例对象的成员变量时产生`NPE`
     ```
     对于 instant = new Singleton6(); 这条语句可以看成 3 步：
        step1. 分配内存空间存放 Singleton6 对象
        step2. 执行 Singleton6 的构造方法，对内存空间进行初始化
        step3. 将 Singleton6 对象所在内存空间的起始地址赋给变量 instance
     如果发生了重排序，那么执行顺序可能变成 step1 -> step3 -> step2
     于是，若当执行完 step3 后，切换到其他线程，那么其他线程中调用 getInstance() 方法就会取出一个未初始化完成的 Singleton6 对象，
     此时，如果在其他线程中访问这个 Singleton6 对象中未初始化的成员变量，就可能会产生空指针异常（NullPointerException，即 NPE）。
     为此，使用 volatile 修饰 instance，禁止重排序，从而避免这个问题的产生。
     ```

2. 保证可见性，达到提高效率的目的
     ```
     当线程A执行到 instance = new Singleton6(); 且在创建了 Singleton6 对象，并赋给了工作内存中的 instance 副本变量，
     但是，还没将工作内存中的 instance 副本变量的值同步到主内存的 instance 变量中的时候，切换到了线程B，
     （synchronized 关键字只能保证被同一个锁对象锁住的多个线程中的同步代码块之间的线程安全）
     此时，由于外层if不是同步代码块中的代码，所以线程B可以执行外层if，且在执行外层if的条件表达式 instance == null 时，
     由于主内存中的 instance 变量还是null，因此 instance == null 的结果为true，
     于是就进入了外层if，在遇到 synchronized 时，线程B进入 Blocked 状态，等待线程A释放同步锁。
     但是，如果使用 volatile 修饰 instance 变量，那么线程B是不会由于上述情况而进入 Blocked 状态的，而是直接能够返回 instance，
     所以使用 volatile 修饰 instance 变量，保证可见性，在此时就可以达到提高效率的目的。
     ```

### 静态内部类【推荐用】

```java
/**
 * 描述： 静态内部类方式，可用
 */
public class Singleton7 {

    private Singleton7() {}

    private static class SingletonInstance {

        private static final Singleton7 INSTANCE = new Singleton7();
    }

    public static Singleton7 getInstance() {
        return SingletonInstance.INSTANCE;
    }
}
```

### 枚举类【推荐用】

```java
/**
 * 描述： 枚举单例
 */
public enum Singleton8 {
    INSTANCE;

    public void whatever() {}
}
```

静态内部类单例 和 枚举单例 都算是懒加载（即：在类**首次使用时**才会创建单例对象）