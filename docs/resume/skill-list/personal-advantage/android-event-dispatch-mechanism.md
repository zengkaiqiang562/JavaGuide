---
title: 事件分发机制（DOING）
category: android
tag:
  - android
---

## 什么是事件

用户通过屏幕与手机交互的时候，每一次点击、长按、移动等，都是一个事件。

## 事件分发机制

某一个事件从屏幕传递到各个 `View`，由 `View` 来使用这一事件（消费事件）或者忽略这一事件（不消费事件），这整个过程的控制就称之为事件分发机制。

## 事件分发的对象是谁（即分发的是什么）

系统把事件封装为 `MotionEvent` 对象，事件分发的过程就是 `MotionEvent` 分发的过程。

## 事件的类型

```
按下：ACTION_DOWN
移动：ACTION_MOVE
抬起：ACTION_UP
取消：ACTION_CANCEL
```

> 这里只列出了单点触摸事件的类型

## 什么是事件序列

从手指按下屏幕开始，到手指离开屏幕所产生的一系列事件。

## 事件的传递层级

```
Activity -> Window -> DecorView -> ViewGroup -> View
```

### `Activity` 的事件分发流程

![](./images/android-event-dispatch-mechanism-01.png)

![](./images/android-event-dispatch-mechanism-02.png)

```
Activity 持有 PhoneWindow 对象的引用（Activity.mWindow）

PhoneWindow 持有 DecorView 对象的引用（PhoneWindow.mDecor）

DecorView 继承自 FrameLayout (extends ViewGroup)。
DecorView 就是 Activity 界面上的顶层 ViewGroup 容器。
于是，事件 MotionEvent 进入到 ViewGroup.dispatchTouchEvent 方法。
```

