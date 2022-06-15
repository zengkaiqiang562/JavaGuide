---
title: 背压（Backpressure）
category: 
  - android
  - 第三方框架
tag:
  - android
  - 第三方框架
---

## 6. 出现背压的原因

> 参考 [Carson带你学Android：图文详解RxJava背压策略](https://carsonho.blog.csdn.net/article/details/79081407)

当上下游在不同线程中时，如果上游发射数据项的速度快于下游响应数据项的速度，那么对于来不及响应的数据项就会造成积压，这些积压的数据项既不会丢失，也不会被垃圾回收机制回收，而是存放在一个异步缓存池中，如果缓存池中的数据项一直得不到处理，越积越多，最后就会造成内存溢出，这便是响应式编程中的背压（`backpressure`）问题。

简单地说，背压问题就是：被观察者发射数据项的速度太快，使得观察者无法及时响应所有发射过来数据项，最终导致缓存区的内存溢出。

更简单地说，背压问题就是：上游的数据流速与下游的数据流速不匹配，导致缓存区的内存溢出。（上游数据流速 > 下游数据流程）

注意：

1. “上游” 指的是发射数据项的被观察者，“下游” 指的是响应数据项的观察者。

2. 背压问题主要出现在异步操作中（即发射数据项与响应数据项在不同的线程中），但同步操作中也有可能出现背压问题。


## 7. 背压策略 & `Flowable`

背压策略就是用来解决：被观察者发射数据项的速度太快，使得观察者无法及时响应所有发射过来的数据项而产生的问题的。

背压策略从以下两个方面给出了不同的解决方案：

1. 避免出现发射数据项的速度与响应数据项的速度不匹配的情况的解决方案：

    1. 控制观察者响应数据项的速度

    2. 控制被观察者发射数据项的速度

2. 当出现出现发射数据项的速度与响应数据项的速度不匹配的情况时的解决方案：

    1. 通过采用不同的背压策略模式（`BackpressureStrategy`）对超出缓存区的数据项进行丢弃、保留、报错等处理

`Flowable` 是 `RxJava 2.0` 中新增的被观察者。`Flowable` 是背压策略的具体实现，即采用 `Flowable` 可解决背压相关的问题。

### 7.1 被观察者 `Flowable` 的特点

#### 7.1.1 对应的观察者为 `Subscriber`

#### 7.1.2 所有的操作符强制支持背压

#### 7.1.3 缓存区存放策略（先进先出）

异步操作中，被观察者 `Flowable` 发射的数据项总是先保存在缓存区中，观察者 `Subscriber` 接收的数据项总是从缓存区中取出。（且先发射的先取出）

#### 7.1.4 缓存区的默认大小 `bufferSize = 128`

#### 7.1.5 同步操作中不存在缓存区

### 7.2 背压策略 —— 控制观察者响应数据项的速度（响应式拉取）

#### 7.2.1 原理：观察者按需接收指定个数的数据项

```:no-line-numbers
异步操作中，观察者按需接收数据项，且：
1. 被观察者发射的数据项都先保存到缓存区中；
2. 观察者按需从缓存区中接收指定个数的数据项

同步操作中，观察者按需接收数据项，且：
1. 被观察者每发射一个数据项，必须等到观察者响应这个数据项之后，才能继续发射下一个数据项。
```

> 响应式拉取指的就是：观察者按需接收指定个数的数据项。

#### 7.2.2 实现方式：`Subscription.request(n)`

```:no-line-numbers
不管是同步操作，还是异步操作，我们只需要指定观察者需要接收的数据项个数即可，其它的 Flowable 内部已实现。
在观察者 Subscriber 的回调方法 onSubscribe(Subscription) 中，通过调用参数 Subscription 的 request(n) 方法，
即可指定观察者所需接收的数据项个数 n。
```

```java:no-line-numbers
/* Subscription.java */
/*
    该方法的作用为：指定观察者能够接收多少个数据项。
    如：调用 subscription.request(3) 表示观察者能够接收从缓存区中取出的 3 个数据项。
    注意：
        1. 观察者能够接收多少个数据项，就从缓存区取出多少个数据项，
           未取出的数据项仍然保留在缓存区中等待下次观察者再调用 request(n) 方法接着取。
        2. 官方默认推荐使用 Long.MAX_VALUE，即 subscription.request(Long.MAX_VALUE);
           也就是说，推荐尽可能地将缓存区中的数据项全部取出，以避免缓存区溢出。
*/
public void request(long n);
```

#### 7.2.3 示例 1：异步操作中的响应式拉取

```java:no-line-numbers
// 1. 创建被观察者 Flowable
Flowable.create(new FlowableOnSubscribe<Integer>() {

    @Override
    public void subscribe(FlowableEmitter<Integer> emitter) throws Exception {
        // 一共发送 4 个事件

        Log.d(TAG, "发送事件 1");
        emitter.onNext(1);

        Log.d(TAG, "发送事件 2");
        emitter.onNext(2);

        Log.d(TAG, "发送事件 3");
        emitter.onNext(3);

        Log.d(TAG, "发送事件 4");
        emitter.onNext(4);

        Log.d(TAG, "发送完成");
        emitter.onComplete();
    }

}, BackpressureStrategy.ERROR)
        .subscribeOn(Schedulers.io()) // 先设置发射、响应数据项的过程都在 IOScheduler 调度器维护的子线程中执行
        .observeOn(AndroidSchedulers.mainThread()) // 再单独设置响应数据项的过程在主线程中执行
        .subscribe(new Subscriber<Integer>() {

            @Override
            public void onSubscribe(Subscription s) {
                /*
                    Subscription 参数具备 Disposable 参数的作用，即：
                        1. Disposable 中调用 dispose() 切断连接
                        2. Subscription 中调用 cancel() 切断连接

                    此外，Subscription 增加了 request(long n) 方法。
                */
                s.request(3); // 观察者能够接收从缓存区中取出的 3 个数据项。
            }

            @Override
            public void onNext(Integer integer) {
                Log.d(TAG, "接收到了事件" + integer);
            }

            @Override
            public void onError(Throwable t) {
                Log.w(TAG, "onError: ", t);
            }

            @Override
            public void onComplete() {
                Log.d(TAG, "onComplete");
            }
        });
```

打印日志：

![](./images/backpressure/01.png)

> 从打印日志可以看出，异步操作中：
> 
> 1. 发射数据项与响应数据项的过程在不同的线程中执行（发射数据项的线程 `id` 为 `2121`，响应数据项的线程 `id` 为 `2105`）；
> 
> 2. 在发射下一个数据项之前，不需要考虑观察者有没有接收到上一个数据项。（因为发射的数据项总是先保存在缓存区中）

#### 7.2.4 示例 2：同步操作中的响应式拉取

### 7.3 背压策略 —— 控制被观察者发射数据项的速度（反馈控制）

### 7.4 背压策略 —— 采用不同的背压策略模式