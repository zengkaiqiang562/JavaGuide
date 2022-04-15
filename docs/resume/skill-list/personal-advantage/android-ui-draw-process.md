---
title: UI绘制流程（DOING）
category: android
tag:
  - android
---

**基于Android 6.0**

`UI`的绘制是在 `Activity.onCreate` 方法调用结束后，在 `Activity.onResume` 方法调用之前处理的。

## `UI`绘制的入口

## `Window`，`ViewRootImpl`，`DecorView` 三者的关系

## `VSync` 信号 和 `Choreographer` 编舞者

### 屏幕刷新机制

## `UI`绘制中的测量过程

### `MeasureSpec`

### 多次测量的原因

## `UI`绘制中的布局过程

## `UI`绘制中的绘画过程

## `Surface` 和 `Canvas` 的作用