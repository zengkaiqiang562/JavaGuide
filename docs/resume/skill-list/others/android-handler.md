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


## 2. `Handler` 机制的工作过程

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
