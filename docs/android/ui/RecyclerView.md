---
title: RecyclerView（TODO）
category: 
  - UI
tag:
  - UI
---

[再也不用担心面试问RecyclerView了](https://www.jianshu.com/p/443d741c7e3e)

[控件：RecycleView](https://www.jianshu.com/p/fe168045a378)

[RecyclerView面试必问](https://zhuanlan.zhihu.com/p/414702218)

[【进阶】RecyclerView源码解析(一)——绘制流程](https://www.jianshu.com/p/c52b947fe064)

## 1. `RecyclerView` 概述

### 1.1 添加依赖

如果还没有迁移到 `Androidx`，那么添加如下的 `support` 依赖：

```groovy:no-line-numbers
implementation 'com.android.support:recyclerview-v7:28.0.0'
```

如果迁移到了 `Androidx`，那么添加如下依赖：

```groovy:no-line-numbers
implementation 'androidx.recyclerview:recyclerview:1.1.0'
```

### 1.2 `RecyclerView` 的基本使用

#### 1.2.1 在界面的 `xml` 布局文件中引入 `RecyclerView`

#### 1.2.2 定义 `Adapter` 类（继承自 `RecyclerView.Adapter<RecyclerView.ViewHolder>`）

##### 1.2.2.1 重写 `onCreateViewHolder` 方法

##### 1.2.2.2 重写 `onBindViewHolder` 方法

##### 1.2.2.3 重写 `getItemCount` 方法

##### 1.2.2.4 通过 `Adapter` 的构造函数传入列表数据集合

##### 1.2.2.5 定义 `ViewHolder` 类（继承自 `RecyclerView.ViewHolder`）

###### 1.2.2.5.1 为 `ViewHolder` 显示的 `item` 创建 `xml` 布局文件

##### 1.2.2.6 完整的简单 `Adapter` 类的代码示例

#### 1.2.3 为 `RecyclerView` 设置 `Adapter`

#### 1.2.4 为 `RecyclerView` 设置 `LayoutManager`

### 1.3 常见的三种 `LayoutManager`

#### 1.3.1 `LinearLayoutManager`

#### 1.3.2 `GridLayoutManager`

#### 1.3.3 `StaggeredGridLayoutManager`

### 1.4 为不同位置的列表 `item` 加载不同类型的 `View` 视图：`getItemViewType`

## 2. 添加分割线：`ItemDecoration`

### 2.1 什么是 `ItemDecoration`

### 2.2 为 RecyclerView 设置默认的 `ItemDecoration` 分割线

### 2.3 自定义 `ItemDecoration` 实现不同效果的分割线

## 3. 自定义 `LayoutManager`

## 4. `RecyclerView` 的回收复用机制