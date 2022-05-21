---
title: Android的消息机制（TODO）
category: 
  - android
tag:
  - android
---

## 1. 概述

`Android` 的消息机制主要是指 `Handler` 的运行机制，以及 `Handler` 所附带的 `MessageQueue` 和 `Looper` 的工作过程。

> `Handler`、`MessageQueue`、`Looper` 这三者实际上是一个整体，只不过在开发过程中比较多地接触 `Handler` 而已。

`Handler` 的主要作用是将一个任务切换到某个指定的线程中去执行。


## 2. `Handler` 消息机制的工作过程

`Handler` 机制的工作过程如下：

![](./images/android-handler/02.png)

### 2.1 `Handler` 发送消息

![](./images/android-handler/01.png)

> 如上图所示，`Handler.sendXxx` 和 `Handler.postXxx` 方法最终都是调用了 `Handler.enqueueMessage` 方法。

### 2.2 从生产者消费者模式的角度理解 `Handler` 机制

`Handler` 机制符合生产者消费值模式，其中：
1. `Handler` 作为生产者，用来生产 `Message`；
2. `MessageQueue` 作为存储容器，用来存放生产的 `Message`；
3. `Looper` 作为消费值，用来从 `MessageQueue` 取出 `Message` 进行消费。

从生产者消费者模式的角度理解 `Handler` 的线程切换：

1. `Handler` 生产 `Message` 是通过调用 Handler.enqueueMessage 方法实现的：

2. `Looper` 消费 `Message` 的实现过程是通过 “死循环 + 等待唤醒机制” 从 `MessageQueue` 中取出 `Message`，然后调用 `Handler.dispatchMessage` 方法处理消息的。

也就是说，`Handler.enqueueMessage` 方法是在生产线程中执行的；`Handler.dispatchMessage` 方法是在消费线程中执行的。
`Handler` 机制的线程切换其实就是 `Handler.enqueueMessage` 方法和 `Handler.dispatchMessage` 方法的执行线程的切换。

## 3. `MessageQueue` 消息队列是由单链表实现的优先级队列

`MessageQueue` 消息队列的说明：
1. 头节点是 `MessageQueue.mMessages`，
2. 队列中节点的类型是 `Message`，
3. `Message` 节点中维护一个 `Message.next` 指针，指向队列中的下一个节点。（并没有指向上一个节点的指针）
4. 队列中的节点在插入时会按照 `Message.when` （消息被处理的时间）的先后顺序进行排序。

```java:no-line-numbers
/* MessageQueue.java */

// 消息入队
boolean enqueueMessage(Message msg, long when) {
    ...
    synchronized (this) {
        ...
        msg.when = when;
        Message p = mMessages; // mMessages 是消息队列的队头
        ...
        /*
            消息在入队时，按照消息被处理的时间 msg.when 从小到大排列，
            msg.when 越小，则越先被处理。
            队头节点 mMessages 指向最先被处理的消息。
        */
        if (p == null || when == 0 || when < p.when) { // 当前插入的消息 msg 最先被处理，所以放在队头
            msg.next = p;
            mMessages = msg;
            ...
        } else {
            ...
            Message prev;
            for (;;) {
                prev = p;
                p = p.next;
                if (p == null || when < p.when) { // 插入时，按照 msg.when 从小（先）到大（后）顺序进行排列。
                    break;
                }
                ...
            }
            msg.next = p;
            prev.next = msg;
        }

        if (needWake) {
            nativeWake(mPtr); // 唤醒消费 Message 的线程
        }
    }
    return true;
}
```

```java:no-line-numbers
/* MessageQueue.java */

// 消息出队
Message next() {
    /*
        在消费 Message 的线程中执行 next 方法，
        通过 “死循环 + 等待唤醒机制” 取出队列中的消息，返回给 Looper。
    */
    ...
    for (;;) {
        ...
        nativePollOnce(ptr, nextPollTimeoutMillis); // 休眠 nextPollTimeoutMillis 时间
        synchronized (this) {
            final long now = SystemClock.uptimeMillis();
            Message prevMsg = null;
            Message msg = mMessages; // 从队头取消息，取到的消息就应该是最先被处理的消息（不考虑异步消息）
            ...
            if (msg != null) {
                if (now < msg.when) { // 
                    // Next message is not ready.  Set a timeout to wake up when it is ready.
                    /*
                        如果最先被处理的消息 msg 在当前时间 now 都还没到被处理的时候，
                        那么就休眠到消息 msg 应该被处理的时间 msg.when 到来为止，即休眠 (msg.when - now) 时间
                    */
                    nextPollTimeoutMillis = (int) Math.min(msg.when - now, Integer.MAX_VALUE);
                } else {
                    ...
                    /*
                        如果最先被处理的消息 msg 在当前时间 now 可以被处理了，
                        那么就将消息 msg 返回给 Looper，并从消息队列中移除。
                    */
                    if (prevMsg != null) {
                        prevMsg.next = msg.next;
                    } else {
                        mMessages = msg.next;
                    }
                    msg.next = null;
                    ...
                    return msg;
                }
            }
            ...
        }
        ...
    }
}
```

## 4. 保证一个线程中只有一个 `Looper` 对象（构造方法私有化 + `ThreadLocal`）

通过以下 `2` 点保证一个线程中只有一个 `Looper` 对象：

1. `Looper` 的构造方法私有化，只能通过静态方法 `static void prepare(boolean quitAllowed)` 来创建 `Looper` 对象；

    ```java:no-line-numbers
    /* Looper.java */

    /*
        Looper 类只提供了这一个私有的构造方法。
        参数 quitAllowed 表示是否允许退出消息循环机制。true 允许；false 不允许。
    */
    private Looper(boolean quitAllowed) {
        mQueue = new MessageQueue(quitAllowed);
        mThread = Thread.currentThread();
    }

    /*
        prepare(quitAllowed) 方法是私有的，对外只提供了如下两个方法来创建 Looper 对象：
            1. prepare()：在子线程中通过该方法来创建 Looper 对象。消息循环机制是允许退出的。
            2. prepareMainLooper()：在主线程中通过该方法来创建 Looper 对象。消息循环机制是不允许退出的。
    */

    public static void prepare() {
        prepare(true);
    }

    public static void prepareMainLooper() {
        prepare(false);
        ...
    }
    ```

    > `Android` 系统已经在 `ActivityThread.main` 方法中调用了 `prepareMainLooper()` 方法，为 `App` 进程的主线程创建了一个 `Looper` 对象。

2. 在 `prepare(quitAllowed)` 方法中通过静态的 `ThreadLocal<Looper>` 类型的对象 `sThreadLocal` 保证一个线程中只能有一个 `Looper` 对象。

    ```java:no-line-numbers
    /* Looper.java */
    static final ThreadLocal<Looper> sThreadLocal = new ThreadLocal<Looper>();

    /*
        prepare(quitAllowed) 方法只能在一个线程中调用一次，否则就会抛出异常。
        （也就是说，对外提供的 prepare() 或 prepareMainLooper() 只能在线程中调用一次）

        因为一个线程中只能调用一次 prepare(quitAllowed) 方法，
        而在该方法中，会创建一个 Looper 对象，并通过 ThreadLocal 与当前线程绑定起来。
        所以就保证了一个线程中只有一个 Looper 对象。
    */
    private static void prepare(boolean quitAllowed) {
        if (sThreadLocal.get() != null) {
            throw new RuntimeException("Only one Looper may be created per thread");
        }
        sThreadLocal.set(new Looper(quitAllowed));
    }
    ```

### 4.1 `ThreadLocal` 如何将 `Looper` 对象与线程绑定？

1. `Thread` 线程对象中维护了一个以 `ThreadLocal` 对象为键，`Object` 对象为值的键值对数组。

    ```:no-line-numbers
    Thread 对象通过 threadLocals 属性引用了 ThreadLocal.ThreadLocalMap 对象。
    ThreadLocalMap 对象中保存了 ThreadLocalMap.Entry[] 类型的数组 table。
    Entry 表示以 ThreadLocal<T> 为键，以 T 为值的键值对。
    ```

2. 调用 `sThreadLocal.set(looper)` 方法，就是将以 `sThreadLocal` 为键，以 `looper` 为值的键值对保存到当前线程对象维护的键值对数组中。

    ```java:no-line-numbers
    /* ThreadLocal.java */
    public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t); // map = t.threadLocals
        if (map != null)
            map.set(this, value); // t.threadLocals.table[index] = new Entry(this, value)
        else
            createMap(t, value); // t.threadLocals = new ThreadLocalMap(this, value);
    }
    ```

    ```:no-line-numbers
    调用 ThreadLocal<Looper> 对象的 set(Looper) 方法，
    就是将以 ThreadLocal<Looper> 对象为键，以 Looper 参数为值的键值对 Entry 对象，
    保存到 set 方法的执行线程对象所维护的 threadLocals.table 数组中。
    ```

3. 调用 `sThreadLocal.get()` 方法，就是从当前线程对象维护的键值对数组中取出以 `sThreadLocal` 为键的值。

    ```java:no-line-numbers
    /* ThreadLocal.java */
    public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t); // map = t.threadLocals
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                T result = (T)e.value;
                return result;
            }
        }
        ...
    }
    ```

    ```:no-line-numbers
    调用 ThreadLocal<Looper> 对象的 get() 方法，
    就是在 get 方法的执行线程对象所维护的 threadLocals.table 数组中，
    获取到以 ThreadLocal<Looper> 对象为键的键值对 Entry 对象，并将作为值的 Looper 对象取出来。
    ```

因为 `sThreadLocal` 作为 `Looper` 类的静态属性，是唯一存在的，且 `prepare(quitAllowed)` 方法只能在一个线程中调用一次，所以在一个线程中，以 `sThreadLocal` 为键获得的 `Looper` 对象在这个线程中也是唯一的。

注意：

1. 一个线程中可以保存多个 `ThreadLocal<T>` 和 `T` 构成的键值对。
   
2. **一个 `ThreadLocal<T>` 可以在不同的线程中对应有不同的 `T` 值**。
   
3. 通过 `ThreadLocal<T>` 保存在线程中的 `T` 值是线程私有的。

    > 即：在线程 `A` 中调用 `sThreadLocal.set(looper)` 保存在线程 `A` 中的 `looper` 对象，是无法在线程 `B` 中通过调用 `sThreadLocal.get()` 方法获取到的。

4. `T` 值是被线程对象持有的，而不是被 `ThreadLocal<T>` 对象持有的。`ThreadLocal<T>` 对象只是作为键，对线程相关的 `T` 值进行存取。

## 5. `MessageQueue` 的创建时机

```java:no-line-numbers
/* Looper.java */
private Looper(boolean quitAllowed) {
    mQueue = new MessageQueue(quitAllowed);
    mThread = Thread.currentThread();
}
```

`MessageQueue` 对象 是在 `Looper` 的构造方法中创建的。即在线程中调用 `Looper` 的静态方法 `prepare` 后就创建好了 `Looper` 和 `MessageQueue` 对象。

因为 `Looper` 对象是线程唯一的，所以在 `Looper` 的构造方法中创建的 `MessageQueue` 对象也是线程唯一的。

## 6. `Handler` & `MessageQueue` & `Looper` 三者之间的引用关系

1. 一个线程中最多只有一个 `Looper` 对象，和一个 `MessageQueue` 对象。（但在一个线程中可以创建多个 `Handler` 对象）

2. `Handler` 对象中通过属性 `mLooper` 持有 `Looper` 对象的引用，通过属性 `mQueue` 持有 `MessageQueue` 对象的引用。其中，`Handler.mQueue` 就是引用了 `mLooper.mQueue`，即 `Handler` 对象中引用的 `MessageQueue` 就是在 `mLooper` 对象中创建的。（即：`Handler` 对象绑定了 `Looper` 对象，同时也就绑定了 `MessageQueue` 对象）

    ![](./images/android-handler/03.png)

    > 如上图所示，创建 `Handler` 对象时：
    >
    > 1. 如果没有传入 `Looper` 对象，那么 `Handler` 对象绑定的 `Looper` 对象就是当前线程中的 `Looper` 对象。（注意：如果当前线程中还没有调用 `Looper.prepare` 方法创建 `Looper` 对象，就会报错）
    >
    > 2. 在子线程中使用 `Handler` 机制时，则需要传入一个与该子线程相关的 `Looper` 对象。

3. 多个 `Handler` 对象可以绑定同一个 `Looper` 对象。此时，通过这些 `Handler` 对象发送的消息都会按照消息的被处理时间 `msg.when` 插入到同一个 `MessageQueue` 消息队列中。

## 7. `Handler` 消息机制中的休眠唤醒机制

## 8. 消息入队和消息出队时的加锁原因

## 9. `Handler` 消息机制的退出流程

## 10. `MessageQueue` 消息队列的容量没有限制

