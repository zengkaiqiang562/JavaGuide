---
title: 内存优化（DOING）
category: android
tag:
  - android
---

参考 《`Android` 进阶解密》 第 `17` 章（内存优化）

## 1. 避免可控的内存泄漏

内存泄漏是内存优化的重点。

如何避免、发现、解决内存泄漏是非常重要的。

### 1.1 什么是内存泄漏

当内存不足时，`Android` 系统就会触发 `GC`（垃圾回收）。`GC` 时采用根搜索算法来发现垃圾对象。
> 在根搜索算法中，如果一个对象仍然在以 `GCRoots` 为根节点的引用链上，那么该对象是不会被当做垃圾进行回收的。
>
> `GCRoots` 可以理解成像 静态成员变量、未销毁的局部变量等这些所占内存空间不在堆上的变量。

内存泄漏就是指没有用的对象仍然在以 `GCRoots` 为根节点的引用链上，导致这个没有用的对象无法被回收掉，从而一直占用着堆中的内存空间。

### 1.2 内存泄漏的场景

#### 1.2.1 非静态内部类的静态实例

非静态内部类会持有外部类实例的引用，如果非静态内部类的实例是静态的，就会间接地长期维持着外部类的引用，无法被垃圾回收。

```java
public class SecondActivity extends AppCompatActivity {
    private static InnerClass inner;
  
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ...
        findViewById(R.id.bt_next).setOnClickListener(v -> {
            inner = new InnerClass();
            finish();
        });
    }

    class InnerClass {}
}
```

如上代码所示，点击事件发生时，会创建非静态内部类 `InnerClass` 的静态实例 `inner`。在整个应用程序的进程中，静态实例 `inner` 一直存在，所以 `SecondActivity` 一直被 `inner` 持有。从而即使执行完 `SecondActivity.onDestroy` 方法，`SecondActivity` 也无法被垃圾回收。

#### 1.2.2 多线程相关的匿名内部类/非静态内部类

和非静态内部类一样，匿名内部类也会持有外部类实例的引用。因此，对于多线程相关的 `AsyncTask`、`Thread`、`Runnable` 等类，它们的匿名内部类/非静态内部类，如果做耗时操作就可能发生内存泄漏。以 `AsyncTask` 的匿名内部类为例：

```java
public class TaskActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        ...
         findViewById(R.id.bt_next).setOnClickListener(v -> {
             startAsyncTask();
             finish();
         });
    }

    void startAsyncTask() {
        new AsyncTask<Void, Void, Void>() {
            protected Void doInBackground(Void... params) {
                while (true);
            }
        }.execute();
    }
}
```

如上代码所示，`AsyncTask` 的实例持有 `TaskActivity` 的引用。且 `AsyncTask` 的异步任务一直在子线程中执行（`while` 死循环），因此，即使 `TaskActivity.onDestroy` 方法执行完，`TaskActivity` 也不会被垃圾回收。

> 同理，自定义的 `AsyncTask` 如果是非静态内部类，也会发生内存泄漏。

解决办法就是自定义一个静态的 `AsyncTask`，如下代码所示：

 ```java
 public class TaskActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        ...
         findViewById(R.id.bt_next).setOnClickListener(v -> {
             startAsyncTask();
             finish();
         });
    }

    void startAsyncTask() {
        new MyAsyncTask().execute();
    }

    private static class MyAsyncTask extends AsyncTask<Void, Void, Void> {
        protected Void doInBackground(Void... params) {
            while (true);
        }
    }
}
 ```

#### 1.2.3 `Handler` 内存泄漏

`Handler` 的 `Message` 被存储在 `MessageQueue` 中，有些 `Message` 并不能马上被处理，它们在 `MesaageQueue` 中存在的时间会很长，这就会导致 `Handler` 无法被垃圾回收。如果 `Handler` 是 `Activity` 中的非静态内部类/匿名内部类，则 `Handler` 同样会持有这个 `Activity`，导致这个 `Activity` 无法被垃圾回收。（对 `Service` 也存在同样的情况）

```java
public class MyActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        ...
        findViewById(R.id.bt_next).setOnClickListener(v -> {
            mHandler.sendMessageDelayed(Message.obtain(), 60000);
            finish();
        });
    }

    private final Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            ...
        }
    }
}
```

如上代码所示，`mHandler` 是匿名内部类的实例，它持有外部类 `MyActivity` 的引用。由于发送了一个延迟消息，所以引用了 `mHandler` 的消息在 `MyActivity.onDestroy` 执行完毕后还存在于 `MessageQueue` 中，从而导致被 `mHandler` 持有的 `MyActivity` 无法被垃圾回收。
> 即：由于匿名内部类的实例没有被垃圾回收，所以被匿名内部类所持有的外部类实例也无法被垃圾回收。

有两种解决方案：

1. 使用静态的 `Handler` 内部类，且 `Handler` 需要访问 `MyActivity` 时，采用弱引用的方式持有 `MyActivity` 实例。

    ```java
    public class MyActivity extends AppCompatActivity {
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            ...
            findViewById(R.id.bt_next).setOnClickListener(v -> {
                mHandler.sendMessageDelayed(Message.obtain(), 60000);
                finish();
            });
        }

        private final Handler mHandler = new MyHandler(this);

        private static class MyHandler extends Handler {
            final WeakReference<MyActivity> mWRefActivity;

            MyHandler(MyActivity activity) {
                mWRefActivity = new WeakReference<>(activity);
            }

            @Override
            public void handleMessage(Message msg) {
                ...
            }
        }
    }
    ```

    > `GitHub` 上提供了一个避免内存泄漏的 `Handler` 开源库 `WeakHandler`。地址为：`https://github.com/badoo/android-weak-handler`。

2. 在 `Activity` 的 `onDestroy` 方法中移除 `MessageQueue` 中的消息。

    ```java
    @Override
    public void onDestroy() {
        if (mHandler != null) {
            // 将 Callbacks 和 Messages 全部清除掉
            mHandler.removeCallbacksAndMessages(null);
        }
        super.onDestroy();
    }
    ```

    > 采用这种解决方案，`Handler` 中的消息可能无法全部处理完，因此建议采用第 `1` 种解决方案。

#### 1.2.4 未正确使用 `Context`

#### 1.2.5 静态 `View`

#### 1.2.6 `WebView`

#### 1.2.7 资源对象未关闭

#### 1.2.8 集合中对象没清理

#### 1.2.9 `Bitmap` 对象

#### 1.2.10 监听器未关闭`

## 2. `Memory Monitor`

### 2.1 使用 `Memory Monitor`

### 2.2 大内存申请与 `GC`

### 2.3 内存抖动

## 3. `Allocation Tracker`

### 3.1 使用 `Allocation Tracker`

### 3.2 `alloc` 文件分析

## 4. `Heap Dump`

### 4.1 使用 `Heap Dump`

### 4.2 检测内存泄漏

## 5. 内存分析工具 `MAT`

### 5.1 生成 `hprof` 文件

### 5.2 `MAT` 分析 `hprof` 文件

## 6. `LeakCanary`

### 6.1 使用 `LeakCanary`

### 6.2 `LeakCanary` 应用举例

