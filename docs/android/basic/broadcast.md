---
title: BroadcastReceiver
category: 
  - android-基础
tag:
  - android-基础
---

> 参考：[17 个必须掌握的 BroadcastReceiver 知识点「建议收藏」](https://hornhuang.blog.csdn.net/article/details/102845752)
> 
> 参考：《`Android` 开发艺术探索》 第 `9.4` 节（`BroadcastReceiver` 的工作过程）
> 
> 参考：[广播概览](https://developer.android.google.cn/guide/components/broadcasts#receiving-broadcasts)
> 
> 参考：[`<receiver>`](https://developer.android.google.cn/guide/topics/manifest/receiver-element)

## 1. `BroadcastReceiver`（广播接收者）概述

`BroadcastReceiver` 组件为系统与 `App` 之间，或 `App` 与 `App` 之间，或 `App` 内部的组件与组件之间，提供了一种数据交互的方式。

> `App` 内部的组件可以是系统组件，也可以是普通组件。
> 
> 系统组件指的是：`Activity`/`Fragment`、`Service` 和 `Application`。
> 
> 普通组件指的是：为了让代码更容易管理和维护，我们通常会将代码按照功能或作用封装成组件。（也可以称之为自定义组件）

`BroadcastReceiver` 的原理类似于发布订阅模式。发送广播时所在的组件可以称为发布者，接收广播的 `BroadcastReceiver` 组件可以称为订阅者。

> 发布订阅模式与观察者模式的区别参考：[观察者模式（`Observer Pattern`）](/resume/skill-list/personal-advantage/design-pattern/Observer-Pattern.html#_1-观察者模式-发布订阅模式-publish–subscribe-pattern-的区别)

## 2. `BroadcastReceiver` 的工作过程

`BroadcastReceiver` 的工作过程，主要包含两方面的内容：一个是广播的注册过程，另一个是广播的发送和接收过程。

### 2.1 `BroadcastReceiver` 的注册过程

#### 2.1.1 静态注册

```xml:no-line-numbers
<receiver android:name="string"
          android:exported="true|false"
          android:permission="string"
          android:directBootAware=["true" | "false"]>
    <intent-filter>
        <!-- 指定该 BroadcastReceiver 所响应的 Intent 的 Action -->
        <action android:name="android.intent.action.BOOT_COMPLETED"/>
        <action android:name="com.ryg.receiver.LAUNCH"/>
    </intent-filter>
</receiver>
```

其中：

1. `android:name`：

    ```:no-line-numbers
    BroadcastReceiver 子类的全路径名称。开头的包名可以用 "." 表示。
    ```

2. `android:exported`：

    ```:no-line-numbers
    true 表示广播接收者可以接收其他 App 中发送过来的广播。
    false 表示广播接收者只能接收由系统，或当前 App，或与当前 App 具有相同 userId 其他进程中发送过来的广播。

    注意：
    1. 此属性的作用就是用来限制广播接收者可接收的广播来源。
    2. 当未指定此属性时，若 <receiver> 中包含 <intent-filter> 过滤器，则此属性默认为 true，否则默认为 false。
    ```

3. `android:permission`：

    ```:no-line-numbers
    当在不同的 App 之间发送/接收广播时，除了可以通过 android:exported 属性限制广播接收者可接收的广播来源之外，
    还可以通过 android:permission 属性来限制广播接收者可接收的广播来源。

    当设置了 android:permission 属性时，
    如果广播接收者要想接收到 <intent-filter> 中通过 <action> 声明的广播，那么对于发送这些广播的其它 App，
    必须先在 AndroidManifest.xml 中通过 <uses-permission> 请求 android:permission 属性所声明的权限，
    否则当前 App 中的这个广播接收者不会接收到其它 App 在没有请求到权限的情况下所发送的这些广播。

    注意：
    如果 <receiver> 中没有指定 android:permission 属性，则继承自 <application> 中的 android:permission 属性。
    当 <application> 中也没有指定 android:permission 属性的情况下，此广播接收者在接收广播时不受权限的限制。
    ```

4. `android:directBootAware`

    ```:no-line-numbers
    广播接收者是否可以监听到直接启动；即，它是否可以在用户解锁设备之前运行。默认为 false，不可以。
    ```

    > [直接启动](https://developer.android.google.cn/training/articles/direct-boot)：当设备已开机但用户尚未解锁设备时，`Android 7.0` 将在安全的 **直接启动** 模式下运行。
    >
    > 在静态注册时为 `<receiver>` 设置属性 `android:directBootAware = true`，并声明监听系统广播 `ACTION_LOCKED_BOOT_COMPLETED`。于是，注册的广播接收者就可以在开机后的锁屏状态下接收到此系统广播。
    >
    > 注意：为了接收到此广播，接收者所在的 `App` 还需要申请权限 `Manifest.permission.RECEIVE_BOOT_COMPLETED`

5. `<intent-filter>` & `<action>`

    ```:no-line-numbers
    在 <receiver> 中，通过声明 <intent-filter> 过滤器，并在过滤器中添加 <action> 来声明广播接收者可接收的广播。
    注意：
        1. 可以添加多个 <action>，即一个广播接收者可以接收多个不同的广播；
        2. <action> 声明的广播可以是系统广播，也可以是自定义广播。
        3. 虽然一个 BroadcastReceiver 可以接收多个不同的广播，但基于面向对象的单一职责原则，
           一个 BroadcastReceiver 建议只接收同一类的广播。
    ```

#### 2.1.2 动态注册

```java::no-line-numbers
/* Context.java */
public abstract Intent registerReceiver(
            BroadcastReceiver receiver, 
            IntentFilter filter); // registerReceiver(receiver, filter, null, null)

public abstract Intent registerReceiver(
            BroadcastReceiver receiver,
            IntentFilter filter, 
            String broadcastPermission, // 相当于静态注册时指定 android:permission 属性
            Handler scheduler)

public abstract void unregisterReceiver(BroadcastReceiver receiver);
```

```java::no-line-numbers
/* IntentFilter.java */
public IntentFilter()

public IntentFilter(String action) // 内部调用了 addAction(action)

public final void addAction(String action)
```

示例：

```java::no-line-numbers
BroadcastReceiver br;

/* 注册广播接收器 */
br = new MyBroadcastReceiver();
IntentFilter filter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
filter.addAction(Intent.ACTION_AIRPLANE_MODE_CHANGED);
this.registerReceiver(br, filter);

/* 注销广播接收器 */
this.unregisterReceiver(br);
br = null;
```

注意：

1. 可以在 `Activity`、`Service`、`Application` 这些 `Context` 中注册/注销广播接收器。

2. 若在 `onCreate` 中注册，则在 `onDestroy` 中注销；若在 `onResume` 中注册，则在 `onPause` 中注销。

    > 即当不再需要广播接收器或 `Context` 销毁时，务必注销广播接收器。

3. 避免在注销前，对同一个广播接收器对象进行多次注册。

4. 只有在注册后、注销前，且所在的 `Context` 有效（未被销毁），广播接收器才能接收到广播。

#### 2.1.3 静态注册 & 动态注册的区别

静态注册与动态注册的主要区别在于注册的时机不同：

1. 静态注册是在 `App` 安装时由系统自动完成对 `BroadcastReceiver` 组件的注册的。具体来说是由 `PMS`（`PackageManagerService`）来完成整个注册过程的。
   
    > 除了静态注册的 `BroadcastReceiver` 组件以外，其他三大组件也都是在 `App` 安装时由 `PMS` 解析并注册的。

2. 动态注册是在 `Context` 中调用 `registerReceiver` 方法后才完成对 `BroadcastReceiver` 组件的注册的。

> 因此，如果想将广播发送给一个已停止的 `App`，那么该 `App` 中的广播接收者应该采用静态注册的方式。

### 2.2 `BroadcastReceiver` 的发送过程

不同类型的广播，发送过程不同，调用的 `API` 方法也不同：

1. 发送无序广播：

    ```java:no-line-numbers
    /* Context.java */
    public abstract void sendBroadcast(Intent intent);

    public abstract void sendBroadcast(Intent intent, String receiverPermission);
    ```

2. 发送有序广播：

    ```java:no-line-numbers
    /* Context.java */
    public abstract void sendOrderedBroadcast(Intent intent, String receiverPermission);

    public abstract void sendOrderedBroadcast(
                Intent intent,
                String receiverPermission, 
                BroadcastReceiver resultReceiver,
                Handler scheduler, 
                int initialCode, 
                String initialData,
                Bundle initialExtras);
    ```

3. 发送本地广播：

    ```java:no-line-numbers
    /* LocalBroadcastManager.java */
    public boolean sendBroadcast(Intent intent)
    ```

广播发送时，通过 `Intent` 声明所发送的广播，以及添加要携带的数据

```java:no-line-numbers
/* Intent.java */
public Intent()

public Intent(String action) // 内部调用了 setAction(action)

/*
    声明要发送的广播
*/
public Intent setAction(String action)

/*
    添加要携带的数据
    注意：
        除此方法外，Intent 还提供了一系列重载的 putExtra 方法来逐个添加要携带的数据。
*/
Intent putExtras(Bundle extras)

/*
    发送广播时添加标记。这里主要记住以下两种标记的作用：
        1. FLAG_INCLUDE_STOPPED_PACKAGES：表示广播会发送给已经停止的应用。
        2. FLAG_EXCLUDE_STOPPED_PACKAGES：表示广播不会发送给已经停止的应用。

    注意：
        1. 系统默认添加了 FLAG_EXCLUDE_STOPPED_PACKAGES。
        2. 当既添加 FLAG_EXCLUDE_STOPPED_PACKAGES，又添加 FLAG_INCLUDE_STOPPED_PACKAGES 时，
           已 FLAG_INCLUDE_STOPPED_PACKAGES 为准。
*/
Intent addFlags(int flags)
```

> 注意：
> 
> 1. 一个 `Intent` 只能声明一个要发送的广播。即：发送广播时，一次只能发送一个广播。
> 
> 2. 广播默认不会发送给已停止的应用，除非添加了 `FLAG_INCLUDE_STOPPED_PACKAGES` 标记。
> 
> 3. 发送广播时可以通过参数 `receiverPermission` 指定广播接收者所在的 `App` 应具备的权限，否则无法接收此广播。

示例：

```java:no-line-numbers
/* 发送无序广播 */
Intent intent = new Intent();
intent.setAction("com.example.broadcast.MY_NOTIFICATION");
intent.putExtra("data","Notice me senpai!");
context.sendBroadcast(intent);
```

### 2.3 `BroadcastReceiver` 的接收过程

```java:no-line-numbers
/* BroadcastReceiver.java */
/*
    当广播接收者接收到广播时，回调 onReceive 方法，注意：
        1. 每回调一次 onReceive 方法，表示接收到一个广播，
        2. 通过 intent.getAction() 方法可判断当前接收到的是什么广播
        3. 通过 intent.getExtras() 或 intent.getXxxExtra 方法可获取广播所携带的数据
*/
public abstract void onReceive(Context context, Intent intent);

/*
    在 onReceive 方法执行期间，调用此方法判断当前所接收到的广播是否为有序广播。
*/
public final boolean isOrderedBroadcast()

/*
    在发送有序广播的情况下，当前广播接收者在接收到广播时，可调用此方法，中止广播的继续发送。
*/
public final void abortBroadcast()
```

```java:no-line-numbers
/* Intent.java */
/*
    获取接收到的广播
*/
public String getAction()

/*
    获取接收到的广播所携带的数据
    注意：
        此外还提供了一系列 getXxxExtra 方法获取某个具体的携带数据
*/
public Bundle getExtras() 
```

## 3. `BroadcastReceiver` 的分类

### 3.1 根据发送/接收时的特性进行分类

#### 3.1.1 无序广播（默认）

广播的发送/接收过程涉及到进程间通信，即：在发送/接收广播时，`App` 进程与 `AMS` 进程之间通过 `binder` 进行交互：

1. `AMS` 进程中记录着注册了的广播接收者；
2. `App` 进程发送的广播先传到 `AMS` 进程；
3. `AMS` 进程收到 `App` 进程传过来的广播后，去查询匹配的广播接收者，并将所有匹配的广播接收者保存在一个容器中；
4. `AMS` 进程遍历保存着匹配的广播接收者的容器，并将收到的广播传递给广播接收者所在的 `App` 进程；
5. 广播接收者所在的 `App` 进程收到 `AMS` 进程传过来的广播后，在主线程中执行广播接收者的 `onReceive` 方法。

无序广播的 “无序” 体现在：`AMS` 进程在一次遍历匹配的广播接收者的容器的过程中，就将广播发送给了所有匹配的广播接收者所在的 `App` 进程。而不会考虑哪个广播接收者所在的 `App` 进程先收到广播；也不会等到一个广播接收者所在的 `App` 进程接收并处理完广播后，才接着将广播发送给下一个匹配的广播接收者所在的 `App` 进程。

无序广播的优点是：发送广播的效率高。

无序广播的缺点是：先接收到广播的广播接收者无法阻止广播继续发送给那些还未接收到的广播接收者。即：无法中止广播的发送。

#### 3.1.2 有序广播（`OrderedBroadcast`）

相比于无序广播，有序广播的 “有序” 体现在：`AMS` 进程在将广播发送给一个广播接收者所在的 `App` 进程，且等到 `App` 进程执行完广播接收者的 `onReceive` 方法，并向 `AMS` 进程返回响应后，`AMS` 进程才接着将广播发送给下一个广播接收者所在的 `App` 进程。 

有序广播的特点有：

1. 按照广播接收者在注册时通过 `Intent-Filter` 指定的优先级顺序来接收广播，优先级越高越先接收到广播。

2. 优先级高的广播接收者可以调用 `abortBroadcast()` 方法阻止广播继续发送给优先级低的广播接收者。

3. 优先级高的广播接收者可以通过 `setResultExtras(Bundle)` 方法添加或修改数据并携带给优先级低的广播接收者。

4. 如果在调用 `sendOrderedBroadcast` 方法发送有序广播时，通过参数 `resultReceiver` 设置了最终广播接收者，那么即使优先级高的广播接收者中止了广播的发送，最终广播接收者也还是会接收到已中止了的广播。

##### 3.1.2.1 指定广播接收者的优先级

静态注册时通过 `android:priority` 属性指定优先级：

```xml:no-line-numbers
<receiver android:name="string"
          android:exported="true|false"
          android:permission="string">
    <intent-filter android:priority="integer">
        <action android:name="string" />
    </intent-filter>
</receiver>
```

动态注册时通过 `IntentFilter.setPriority(priority)` 方法指定优先级：

```java:no-line-numbers
/* IntentFilter.java */
public final void setPriority(int priority)
```

> `priority` 的值必须是一个整数。数值越高，优先级也就越高。默认值为 `0`。
> 
> 查看 `setPriority` 方法的文档注释可知，`priority` 的范围是：
>
> [`IntentFilter.SYSTEM_LOW_PRIORITY`, `IntentFilter.SYSTEM_HIGH_PRIORITY`]，即 [`-1000`, `1000`]

##### 3.1.2.2 中止广播（`abortBroadcast`）& 最终广播接收者

```java:no-line-numbers
/* BroadcastReceiver.java */
/*
    在发送有序广播的情况下，当前广播接收者在接收到广播时，可调用此方法，中止广播的继续发送。
*/
public final void abortBroadcast()
```

```java:no-line-numbers
/* Context.java */
public abstract void sendOrderedBroadcast(Intent intent, String receiverPermission);

/*
    调用重载的 sendOrderedBroadcast 方法发送有序广播时，通过参数 resultReceiver 设置最终广播接收者
*/
public abstract void sendOrderedBroadcast(
            Intent intent,
            String receiverPermission, 
            BroadcastReceiver resultReceiver, // 最终广播接收者
            Handler scheduler, 
            int initialCode, 
            String initialData,
            Bundle initialExtras);
```

> 1. 如果广播没有中止，那么最终广播接收者的 `onReceive` 会回调两次：第一次是正常的接收；第二次是最终的接收。
> 
> 2. 如果优先级比最终广播接收者高的其他广播接收者中止了广播，那么最终广播接收者的 `onReceive` 只回调一次：表示最终接收的广播。

##### 3.1.2.3 如何判断接收到的是有序广播：`isOrderedBroadcast()`

```java:no-line-numbers
/* BroadcastReceiver.java */
/*
    在 onReceive 方法执行期间，调用此方法判断当前所接收到的广播是否为有序广播。
*/
public final boolean isOrderedBroadcast()
```

##### 3.1.2.4 中途添加/修改传递的参数（`setResultExtras`/`getResultExtras`）

```java:no-line-numbers
/* BroadcastReceiver.java */
/*
    在广播接收者接收到广播时，在 onReceive(Context, Intent) 方法的执行期间，
    当前广播接收者可以调用 setResultExtras(Bundle) 方法添加数据并传递给下一个广播接收者，
    setResultExtras(Bundle) 方法会覆盖掉上一个广播接收者所传过来的数据，
    如果只是想修改部分数据，可以调用 getResultExtras 方法先返回上一个广播接收者传过来的 Bundle，
    然后在调用 Bundle.putXxx(key, value) 方法修改部分 key 所对应的 value 数据
*/
public final void setResultExtras(Bundle extras)

/*
    当中途没有添加过参数时（没有调用过 setResultExtras 方法）时：
    1. 若参数 makeup 为 false，则返回 null；
    2. 若参数 makeup 为 true，则返回空的 Bundle 对象。
*/
public final Bundle getResultExtras(boolean makeMap) 
```

#### 3.1.3 粘性广播（`StickyBroadcast`）

```java:no-line-numbers
/* Context.java */
@Deprecated
@RequiresPermission(android.Manifest.permission.BROADCAST_STICKY)
public abstract void sendStickyBroadcast(@RequiresPermission Intent intent);
```

对于动态注册的广播接收者，如果在调用 `registerReceiver` 方法注册之前广播就已经发送出来了，那么这些广播发出之后才注册的广播接收者是无法接收到已发出的广播的（即 `onReceive` 方法不会回调）。

为了解决这个问题，在发送广播时，可以选择调用 `sendStickyBroadcast` 方法发送广播，此时发送的广播就称为 **粘性广播**。

粘性广播的作用就是使得在广播发出之后才调用 `registerReceiver` 方法注册的广播接收者，同样能够接收到注册之前就已发出的广播（即 `onReceive` 方法会回调）。

此时，`onReceive(Context, Intent)` 方法回调时传入的参数 `Intent` 就是注册之前已发出的广播。

注意：

1. `registerReceiver` 方法的返回值 `Intent` 也表示注册之前已发出的广播。如果返回值 `Intent` 不为 `null`，就说明监听的粘性广播已经发出去了，非空的返回值 `Intent` 就表示这个已发出去的粘性广播。

2. 如果广播接收者注册前发送了多条相同的粘性广播，那么注册后也只会收到一条此粘性广播，且传给 `onReceive(Context, Intent)` 方法的参数 `Intent` 是最后一次发送粘性广播时所传递的 `Intent`。

3. 系统网络状态的改变所发送的广播就是粘性广播。

### 3.2 根据广播的范围进行分类

#### 3.2.1 全局广播

广播默认就是全局广播，即上面介绍的无序广播，有序广播，粘性广播都属于全局广播。

全局广播就是可以在不同的进程之间（不管是 `App` 进程还是系统服务进程）进行广播的发送和接收（即进行数据交互）。

#### 3.2.2 本地广播（局部广播）

本地广播就是只能在同一个进程的组件与组件之间进行广播的发送和接收（即进行数据交互）。

> 这里所指的组件可以是系统组件，也可以是普通组件。
> 
> 系统组件指的是：`Activity`/`Fragment`、`Service` 和 `Application`。
> 
> 普通组件指的是：为了让代码更容易管理和维护，我们通常会将代码按照功能或作用封装成组件。（也可以称之为自定义组件）

##### 3.2.2.1 本地广播的出现背景：广播的安全性问题

`BroadcastReceiver` 设计的初衷是用于在进程之间进行数据交互的。但是，可能会出现安全性问题，如：恶意进程不断地发送其他 `App` 进程可以接收的广播。

对于仅在进程内部进行数据交互的需求，同时为了避免恶意进程的干扰，`Android` 提供了 `LocalBroadcastManager` 来发送仅在同一进程中才可以接收到的广播。

##### 3.2.2.3 本地广播的特点（好处）

相比与全局广播，本地广播具体如下特点：

1. 因为广播数据仅在进程中传播，所以不用担心广播数据泄露的问题。

2. 对于仅注册为只监听本地广播的接收者，不用担心会接收到其它进程所发出的全局广播（即不用担心接收到其它恶意进程发出的伪造广播，而造成安全隐患）。

    > 如果一个广播接收者不仅注册为可监听本地广播，还注册为可监听全局广播，那么该广播接收者还是有可能接收到其它恶意进程发出的伪造广播，而造成安全隐患。

3. 相比于全局广播而已，本地广播不涉及进程间通信，所以本地广播更高效。

4. 注意：没有为本地广播中的广播接收者提供静态注册的方式。

##### 3.2.2.2 本地广播的使用：`LocalBroadcastManager`

相比与全局广播的使用，本地广播只是在发送广播、以及注册/注销广播接收者时的方式不同：

1. 本地广播的发送通过 `LocalBroadcastManager` 来发送。（而不是通过 `Context` 发送）

2. 接收本地广播的广播接收者也必须通过 `LocalBroadcastManager` 来注册/注销。（而不是通过 `Context` 注册/注销）

> 本地广播的接收过程和全局广播一样，都是通过回调 `BroadcastReceiver.onReceive(Context, Intent)` 方法实现的。
> 
> 另外，本地广播中不存在发送本地的有序广播或发送本地的黏性广播。

```java:no-line-numbers
/* LocalBroadcastManager.java */
/*
    LocalBroadcastManager 采用了单例设计模式
*/
static LocalBroadcastManager getInstance(Context context)
```

```java:no-line-numbers
/* LocalBroadcastManager.java */
/*
    广播接收者总是在 App 进程的主线程中回调 onReceive 方法接收广播。
*/
boolean sendBroadcast(Intent intent)

/*
   广播接收者回调 onReceive 方法接收广播时所在的线程，与调用 sendBroadcastSync 方法发送广播时所在的线程相同。
*/
void sendBroadcastSync(Intent intent)
```

```java:no-line-numbers
/* LocalBroadcastManager.java */
/*
    将参数 receiver 注册为本地广播的接收者，
    receiver 可接收的本地广播通过参数 filter.addAction(String) 声明。
*/
void registerReceiver(BroadcastReceiver receiver, IntentFilter filter)

/*
    注销参数 receiver，不再让其接收本地广播。
*/
void unregisterReceiver(BroadcastReceiver receiver)
```

注意：

1. 通过 `LocalBroadcastManager.sendBroadcast` 发送的本地广播，只有通过 `LocalBroadcastManager.registerReceiver` 注册了的广播接收者才能接收到。

2. 一个广播接收者实例既可以注册为本地广播的接收者，也可以同时注册为全局广播的接收者。此时，该广播接收者实例的 `onReceive` 方法回调时，既可能表示收到本地广播，也可能表示收到全局广播。

3. 本地广播的发送/接收过程，本地广播的接收者的注册/注销过程都在 `LocalBroadcastManager` 类中实现。`LocalBroadcastManager` 的实现并不存在 `App` 进程与 `AMS` 进程之间的通信。只存在同一个 `App` 进程中的多线程间通信。

### 3.3 系统广播

`Android` 系统内置了多个广播。其中，只要涉及手机的基本操作，基本上都会发出相应的系统广播，如：开机启动、网络状态改变、拍照、屏幕关闭与开启、电量不足等。

当系统的某些状态改变，或者触发了系统中的某些操作时，系统内部就会发出相应的系统广播。

常见的系统广播有：

```java:no-line-numbers
/* Telephone.java */
/*
    手机接收到短信时的广播
*/
public static final String SMS_RECEIVED_ACTION = "android.provider.Telephony.SMS_RECEIVED";
```

```java:no-line-numbers
/* Intent.java */
/*
    电量过低时的广播
*/
public static final String ACTION_BATTERY_LOW = "android.intent.action.BATTERY_LOW";

/*
    电量发生改变时的广播
    （粘性广播）
*/
public static final String ACTION_BATTERY_CHANGED = "android.intent.action.BATTERY_CHANGED";

/*
    手机连接上外部电源时的广播
*/
public static final String ACTION_POWER_CONNECTED = "android.intent.action.ACTION_POWER_CONNECTED";
```

> 更多的系统广播可参考` Intent.java` 文件中定义的相关静态成员变量

## 4. `BroadcastReceiver` 在主线程中执行 & `BroadcastReceiver` 的生命周期很短

一般情况下，`BroadcastReceiver` 的 `onReceive` 方法在主线程中执行。所以 `onReceive` 方法执行时不能做耗时操作。

> 在子线程中调用 `LocalBroadcastManager.sendBroadcastSync(Intent)` 方法发送本地广播时，接收此广播的 `BroadcastReceiver` 的 `onReceive` 方法与 `sendBroadcastSync` 方法在同一子线程中执行。

另外，如果 `App` 进程中只有一个 `BroadcastReceiver` 组件正在执行 `onReceive` 方法处理接收到的广播，那么当 `onReceive` 方法执行完毕后，`BroadcastReceiver` 组件马上就会被销毁，于是，由于 `App` 进程中无组件运行，所以 `App` 进程会成为空进程。而空进程是容易被系统杀死的。由此可知：

```:no-line-numbers
对于只有一个 BroadcastReceiver 组件正在运行的 App 进程，
不要在 onReceive 方法中通过开启子线程来处理比较重要的线程任务。
因为在 onReceive 方法执行完毕，BroadcastReceiver 被销毁后，App 进程会变成空进程，
此时，即使空进程中的线程任务仍然在执行，这个空进程也是会很容易被系统杀死的。
```

## 5. 通过权限限制广播的接收，增加广播的安全性

对于仅在同一进程中的数据交互，可以使用本地广播将数据交互限制在一个进程中，不需要考虑其他恶意进程所造成的安全性问题。

但对于多个进程之间的数据交互，则必须使用全局广播，于是就有可能因其他恶意进程而产生安全性问题。此时，为了在全局广播中避免安全性问题，可以考虑通过在发送广播、或者注册广播接收者时声明权限来限制哪些进程可以参与广播的发送/接收过程。

### 5.1 发送广播时携带权限

```java:no-line-numbers
/* Context.java */
public abstract void sendBroadcast(Intent intent, String receiverPermission);

public abstract void sendOrderedBroadcast(Intent intent, String receiverPermission);

public abstract void sendOrderedBroadcast(
            Intent intent,
            String receiverPermission, 
            BroadcastReceiver resultReceiver,
            Handler scheduler, 
            int initialCode, 
            String initialData,
            Bundle initialExtras);
```

在发送广播的 `App` 进程中，调用 `sendBroadcast`/`sendOrderedBroadcast` 向接收广播的 `App` 进程发送广播时，可以通过参数 `receiverPermission` 指定接收广播的 `App` 进程需要申请的权限。

如果接收广播的 `App` 进程没有申请参数 `receiverPermission` 指定的权限，那么就无法接收到广播。

接收广播的 `App` 进程需要在 `AndroidManifest.xml` 中使用 `<uses-permission>` 来申请参数 `receiverPermission` 指定的权限。

示例如下：

```java:no-line-numbers
/* 发送广播的 App 发送广播时携带权限 */
sendBroadcast(new Intent("com.example.NOTIFY"),  Manifest.permission.SEND_SMS);
```

```xml:no-line-numbers
<!-- 接收广播的 App 需要在 AndroidManifest.xml 中申请 SEND_SMS 权限后，才能接收到广播 "com.example.NOTIFY" -->
<uses-permission android:name="android.permission.SEND_SMS"/>
```

注意：

1. 这里使用到的权限既可以是系统权限，也可以是自定义权限。

    > 自定义权限在 `AndroidManifest.xml` 中使用 [`<permission>`](https://developer.android.google.cn/guide/topics/manifest/permission-element) 进行自定义声明。

### 5.2 广播接收者注册时声明权限

在接收广播的 `App` 进程中注册广播接收者时，也可以声明发送广播的 `App` 进程需要申请的权限。

如果发送广播的 `App` 进程没有申请权限，那么广播就无法发送给接收者。

在接收广播的 `App` 进程中，静态注册和动态注册时声明权限的方式如下：

1. 静态注册时声明权限：

    ```xml:no-line-numbers
    <receiver android:name=".MyBroadcastReceiver"
              android:permission="android.permission.SEND_SMS">
        <intent-filter>
            <action android:name="android.intent.action.AIRPLANE_MODE"/>
        </intent-filter>
    </receiver>
    ```

2. 动态注册时声明权限：

    ```java:no-line-numbers
    IntentFilter filter = new IntentFilter(Intent.ACTION_AIRPLANE_MODE_CHANGED);
    registerReceiver(receiver, filter, Manifest.permission.SEND_SMS, null);
    ```

于是，在发送广播的 App 进程中需要申请权限 `SEND_SMS`：

```xml:no-line-numbers
/* AndroidManifest.xml */
<uses-permission android:name="android.permission.SEND_SMS"/>
```

> 注意：这里使用到的权限同样既可以是系统权限，也可以是自定义权限。

## 6. 让已停止的 `App` 接收到广播 & `FLAG_INCLUDE_STOPPED_PACKAGES`

在 `Android 3.1` 中为 `Intent` 添加了两个标记位，用来控制在发送广播时，广播是否要发送给已处于停止状态的应用。

这两个标记位分别是：

1. `FLAG_INCLUDE_STOPPED_PACKAGES`：表示包含已经停止的应用，这个时候广播会发送给已经停止的应用。

2. `和FLAG_EXCLUDE_STOPPED_PACKAGES`：表示不包含已经停止的应用，这个时候广播不会发送给已经停止的应用。

> 注意，已处于停止状态的应用可分为两种情形：
> 
> 1. 应用安装后未运行；
> 
> 2. 应用被手动或者其他应用强停了（可以理解为应用进程被杀掉了）。

从 `Android 5.0` 以后，默认情况下发送广播时，广播是不会发送给已经停止的应用的。对应的源码如下：

```java:no-line-numbers
/* ActivityManagerService.java */
final int broadcastIntentLocked(ProcessRecord callerApp,
            String callerPackage, Intent intent, String resolvedType,
            IIntentReceiver resultTo, int resultCode, String resultData,
            Bundle resultExtras, String[] requiredPermissions, int appOp, Bundle bOptions,
            boolean ordered, boolean sticky, int callingPid, int callingUid, int userId) {
    ...
    // By default broadcasts do not go to stopped apps.
    intent.addFlags(Intent.FLAG_EXCLUDE_STOPPED_PACKAGES);
    ...
}
```

> 这样做是为了防止广播无意间或者在不必要的时候调起已经停止运行的应用。

如果需要将广播发送给已停止的应用，那么在发送广播时，调用 `Intent.addFlags(flags)` 方法为 `sendBroadcast(Intent)` 方法的参数 `Intent` 添加 `FLAG_INCLUDE_STOPPED_PACKAGES` 标记即可。

> 注意：当 `FLAG_EXCLUDE_STOPPED_PACKAGES` 和 `FLAG_INCLUDE_STOPPED_PACKAGES` 两种标记位共存时，以 `FLAG_INCLUDE_STOPPED_PACKAGES` 为准。

> 补充：
> 
> 在 `Android 3.1` 之前，处于停止状态的应用是可以收到开机广播的；
> 
> 而从 `Android 3.1` 开始，处于停止状态的应用无法接收到开机广播。
> 
> 并且，由于开机广播是系统内部发送的，用户无法发送开机广播，也就无法添加 `FLAG_INCLUDE_STOPPED_PACKAGES` 标记。因此，在不修改系统源码的情况下，处于停止状态的应用是肯定无法接收到开机广播的。

还有两点需要注意：

1. 为了让已停止的 `App` 接收到广播，那么接收这个广播的 `BroadcastReceiver` 必须是静态注册的。（已停止的 `App` 中无法动态注册）

2. 如果 `BroadcastReceiver` 接收不到广播，可能是所在的 `App` 停止了，但也可能是其他 `App` 进程在发送广播时携带了权限。（此时，就需要 `BroadcastReceiver` 所在的 `App` 申请相应的权限）
