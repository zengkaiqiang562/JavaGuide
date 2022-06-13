---
title: 背压（Backpressure）
category: 
  - android
  - 第三方框架
tag:
  - android
  - 第三方框架
---

## 6. 背压

参考 [Carson带你学Android：图文详解RxJava背压策略](https://carsonho.blog.csdn.net/article/details/79081407)

背压的定义：

```java:no-line-numbers
当上下游在不同的线程中，通过 Observable 发射，处理，响应数据流时，
如果上游发射数据的速度快于下游接收处理数据的速度，这样对于那些没来得及处理的数据就会造成积压，
这些数据既不会丢失，也不会被垃圾回收机制回收，而是存放在一个异步缓存池中，
如果缓存池中的数据一直得不到处理，越积越多，最后就会造成内存溢出，这便是响应式编程中的背压（backpressure）问题。

个人理解：
    在发射数据和处理数据处于不同线程中的条件下，当 Observable 发射了大量数据时，Observer 可能会处理不过来。
    此时，随着 Observable 不断地发射数据，数据就会因 Observer 无法及时处理而堆积在内存中，从而可能会导致 OOM 内存溢出，
    这种情况称之为背压。

注意：
    可以把发射数据的 Observable 称为 “上游”，处理数据的 Observer 称为 “下游”。
```