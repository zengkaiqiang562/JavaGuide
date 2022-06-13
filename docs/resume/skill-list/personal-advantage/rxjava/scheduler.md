---
title: 调度器（Scheduler）
category: 
  - android
  - 第三方框架
tag:
  - android
  - 第三方框架
---

## 8. 调度器（`Scheduler`）

如果我们不指定线程，则默认是在 `subscribe` 方法的执行线程上发射和接收数据项与事件。

如果我们想让发射和（或）接收数据项与事件的过程在子线程上执行，即进行异步操作，则需要使用调度器（`Scheduler`）来切换线程。

### 8.1 调度器的分类

#### 8.1.1 `Schedulers.io()`：

```java:no-line-numbers
/* Schedulers.java */
static Scheduler io() // 返回 IoScheduler 实例
```

```java:no-line-numbers
在此调度器（IoScheduler）接收到任务后，先检查线程缓存池中是否有空闲的线程：
如果有，则复用；
如果没有，则创建新的线程，并加入到线程缓存池中。

注意：
1. 如果每次都没有空闲线程使用，可以无上限的创建新线程；
2. 如果空闲线程的空闲时长超过 60s，则会销毁该空闲线程。

调度器 IoScheduler 具有线程缓存机制，可用于 IO 密集型的操作（如：读写 SD 卡文件、查询数据库、访问网络等）。
```

#### 8.1.2 `Schedulers.newThread()`：

```java:no-line-numbers
/* Schedulers.java */
static Scheduler newThread() // 返回 NewThreadScheduler 实例
```

```java:no-line-numbers
在此调度器（NewThreadScheduler）接收到任务后，直接创建新的线程。

也就是说，调度器 NewThreadScheduler 不具有线程缓存机制，每执行一个任务都创建一个新的线程。

注意：
虽然使用 IoScheduler 的地方都可以使用 NewThreadScheduler，
但是，由于创建一个新的线程比复用一个已存在的线程更耗资源，因此 NewThreadScheduler 的效率没有 IoScheduler 高。
```

#### 8.1.3 `Schedulers.computation()`：

```java:no-line-numbers
/* Schedulers.java */
static Scheduler computation() // 返回 ComputationScheduler 实例
```

```java:no-line-numbers
此调度器（ComputationScheduler）提供一个固定线程数（线程数 = CPU 核心数）的线程池。

注意：此调度器的线程池中的线程一旦开启就一直存在（除非关闭线程池），不会因空闲时间过长而被销毁。

适用于任务过程中不会被阻塞的耗时操作。
对于任务过程中可能会被阻塞的 IO 操作使用 IoScheduler。
```

#### 8.1.4 `Schedulers.trampoline()`：

```java:no-line-numbers
/* Schedulers.java */
static Scheduler trampoline() // 返回 TrampolineScheduler 实例
```

```java:no-line-numbers
此调度器（`TrampolineScheduler`）并不会将任务切换到其他线程中执行。该调度器的作用只是用来对任务的执行顺序进行排序的。即：
1. 任务提交时，默认的执行时间为当前系统时间；也可以指定延时，使任务的执行时间往后推迟。
2. 调度器 TrampolineScheduler 中维护一个按任务的执行时间进行排序的优先级队列，用于存放已提交的任务。
3. 凡是提交到调度器 TrampolineScheduler 中的任务都会先存放到优先级队列中，然后按照执行时间在当前线程中串行执行。
```

#### 8.1.5 `Schedulers.single()`：

```java:no-line-numbers
/* Schedulers.java */
static Scheduler single() // 返回 SingleScheduler 实例
```

```java:no-line-numbers
此调度器（SingleScheduler）提供的线程池中只存在一个线程。

调度器 SingleScheduler 中提交的任务都会在同一个线程中串行执行。
```

#### 8.1.6 `Scheduler.from(Executor)`：

```java:no-line-numbers
static Scheduler from(@NonNull Executor executor) // 返回 ExecutorScheduler 实例
```

```java:no-line-numbers
可以通过此调度器（ExecutorScheduler）传入一个自定义的线程池 executor。
```

#### 8.1.7 `AndroidSchedulers.mainThread()`：

> 需要添加依赖：
> 
> ```groovy:no-line-numbers
> implementation 'io.reactivex.rxjava2:rxandroid:2.0.2'
> ```

```java:no-line-numbers
/* AndroidSchedulers.java */
static Scheduler mainThread() // 返回 HandlerScheduler 实例
```

```java:no-line-numbers
调用 AndroidSchedulers.mainThread() 方法会将 UI 线程中的 Looper 对象传给 HandlerScheduler，
从而将提交到调度器 HandlerScheduler 中的任务切换到 UI 线程中执行。
```

### 8.1 使用操作符 `subscribeOn(Scheduler)`：指定发射和接收过程所在的线程

操作符 `subscribeOn` 传入一个 `Scheduler` 参数，通过 `Scheduler` 指定的线程来执行被观察者发射数据项或事件的过程。

### 8.2 使用操作符 `observeOn(Scheduler)`：仅指定接收过程所在的线程

操作符 `observeOn` 传入一个 `Scheduler` 参数，通过 `Scheduler` 指定的线程来执行观察者接收数据项或事件的过程。