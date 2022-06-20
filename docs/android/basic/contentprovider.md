---
title: ContentProvider（TODO）
category: 
  - android-基础
tag:
  - android-基础
---

> 参考：[Android 这 13 道 ContentProvider 面试题，你都会了吗？](https://hornhuang.blog.csdn.net/article/details/102979418)
> 
> 参考：《`Android` 开发艺术探索》 第 `9.5` 节（`ContentProvider` 的工作过程）
> 
> 参考：[内容提供者程序](https://developer.android.google.cn/guide/topics/providers/content-providers)
> 
> 参考：[`<provider>`](https://developer.android.google.cn/guide/topics/manifest/provider-element)>

## 1. `ContentProvider` 概述

`ContentProvider` 是一种内容共享型组件，实现了不同 `App` 进程之间的数据共享。

和 `Messenger` 一样，基于 `ContentProvider` 的进程间通信的底层实现同样也是 `Binder`。

当 `ContentProvider` 所在的进程启动时，`ContentProvider` 组件会同时启动并被发布到 `AMS` 进程中。

### 1.1 `ContentProvider` 组件的优势

相比于直接访问数据库，`ContentProvider` 具有如下优势：

1. `ContentProvider` 对外提供统一的 `CRUD` 接口，使得外界可以按照统一的方式访问不同来源提供的数据，而不用关心这些数据是怎么来的。（数据可以来源于数据库、`xml` 文件、网络请求等）

2. `ContentProvider` 提供一种可跨进程的数据共享方式。

3. `ContentProvider` 提供了数据更新时的通知机制。即：当 `ContentProvider` 所在进程中的数据更新时，访问这些数据的其他进程可以通过 `ContentProvider` 收到相关的通知。

### 1.2 `ContentProvider` & `ContentResolver`

`ContentProvider` 组件主要是用于进程间的数据共享的。其中：

1. 提供数据的 `App` 进程中通过 `ContentProvider` 向其他 `App` 进程提供访问数据的 `API` 方法；

2. 访问数据的 `App` 进程中通过 `ContentResolver` 访问提供数据的 `App` 进程中的 `ContentProvider`。

### 1.3 `ContentProvider` 对外提供的数据形式 & 内部的数据存储方式

#### 1.3.1 `ContentProvider` 以表格的形式对外提供数据

`ContentProvider` 主要以表格的形式来组织数据，并且可以包含多个表，这点和数据库很类似。

`ContentProvider` 可以对外提供文件数据，通过将文件的句柄保存在表格中提供给外界。从而让外界可以根据查询到的文件句柄来访问 `ContentProvider` 所提供的文件。

> `Android` 系统所提供的 `MediaStore` 功能就是包含文件类型数据的 `ContentProvider`，详细实现可以参考 `MediaStore`。

#### 1.3.2 `ContentProvider` 对内部的数据存储方式没有任何要求

虽然 `ContentProvider` 对外提供的数据看起来像是来自数据库中的数据，但是 `ContentProvider` 对内部的数据存储方式没有任何要求：我们既可以使用 `SQLite` 数据库；也可以使用普通的文件；甚至可以采用内存中的一个对象来进行数据的存储。

> 也就是说，`ContentProvider` 对外提供的数据，可以是数据库数据、文件数据、内存数据等。

## 2. `ContentProvider` 的使用方式

### 2.1 自定义 `ContentProvider` 的子类

```java:no-line-numbers
/* ContentProvider.java */
/*
    onCreate 代表 ContentProvider 的创建，
    一般来说我们需要在 onCreate 中做一些初始化工作，如获取数据库实例。
    注意：
        1. onCreate 方法在主线程中执行，不允许执行耗时操作，否则会导致 App 进程的启动时间延长。
        2. ContentProvider 的 onCreate 方法的调用时机先于 Application 的 onCreate 方法。
*/
public abstract boolean onCreate();

// 返回一个 Uri 请求所对应的 MIME 类型（媒体类型）。比如：图片（"image/png"）、视频（"video/mp4"）等。
// 如果 ContentProvider 提供的数据不需要配置 MIME 类型，那么可以返回 null 或者 "*/*" 
public abstract String getType(Uri uri);

public abstract Uri insert(Uri uri, ContentValues values);

public abstract int delete(Uri uri, String selection, String[] selectionArgs);

public abstract int update(Uri uri, ContentValues values, String selection, String[] selectionArgs);

public abstract Cursor query(Uri uri, String[] projection,
            String selection, String[] selectionArgs,
            String sortOrder);
```

自定义 `ContentProvider` 子类时需要重写如上的抽象方法，其中 `insert`/`delete`/`update`/`query` 方法对应于 `CRUD` 操作，即实现对数据表的增删改查功能。

### 2.2 注册 `ContentProvider` 子类

```xml:no-line-numbers
<provider android:authorities="list"
          android:directBootAware=["true" | "false"]
          android:enabled=["true" | "false"]
          android:exported=["true" | "false"]
          android:grantUriPermissions=["true" | "false"]
          android:icon="drawable resource"
          android:initOrder="integer"
          android:label="string resource"
          android:multiprocess=["true" | "false"]
          android:name="string"
          android:permission="string"
          android:process="string"
          android:readPermission="string"
          android:syncable=["true" | "false"]
          android:writePermission="string" >
    ...
</provider>
```

#### 2.2.1 `android:authorities`：`ContentProvider` 的唯一标识

#### 2.2.2 `android:permission`：限制访问 `ContentProvider` 所需的权限

### 2.3 其他进程中通过 `ContentResolver` 来访问 `ContentProvider`

### 2.4 `ContentProvider` 的数据更新通知机制

## 3. `ContentProvider` 的工作线程

### 3.1 `onCreate` 方法在主线程中执行

### 3.2 `query`/`update`/`insert`/`delete`/`getType` 在 `Binder` 线程中执行

## 4. `ContentProvider` 中通过 `UriMatcher` 标识多张表

## 5. `ContentProvider` 的线程安全问题