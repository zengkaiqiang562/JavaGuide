---
title: Android 中的权限
category: 
  - Android
tag:
  - Android
---

> 参考：[Android 中的权限](https://developer.android.google.cn/guide/topics/permissions/overview?hl=zh_cn)

## 1. 权限的作用（保护用户隐私）

应用权限的作用就是 **保护用户隐私**。这种保护包含两方面的内容：

1. 对数据的访问进行限制，被应用权限所限制的数据称为 **受限数据**。

    > 如：系统状态、用户的联系信息等，都是被应用权限所限制的受限数据。

2. 对操作的执行进行限制，被应用权限所限制的操作称为 **受限操作**。

    > 如：连接到已配对的设备、录制音频等，都是被应用权限所限制的受限操作。

## 2. 权限的分类

`Android` 中的权限可分为三大类：安装时权限、运行时权限、特殊权限。

### 2.1 安装时权限

安装时权限只需要在 AndroidManifest.xml 配置清单文件中声明即可，系统会在 app 安装时自动授予 app 相应权限。

> 应用商店会在用户查看应用详情页面时向其显示安装时权限通知。

安装时权限又可分为两种子类：普通权限、签名权限。

#### 2.1.1 普通权限（保护级别：`normal`）

被普通权限所限制的受限数据和受限操作所带来的风险是比较小的。

系统为普通权限分配的保护级别（`protection level`）是： `normal`

#### 2.1.2 签名权限（保护级别：`signature`）

当应用声明了其他应用已定义的签名权限时，如果两个应用使用同一证书进行签名，系统会在安装时向前者授予该权限。否则，系统无法向前者授予该权限。

系统为签名权限分配的保护级别（`protection level`）是：`signature`

### 2.2 运行时权限（保护级别：`dangerous`）

运行时权限也称为 **危险权限**，被运行时权限所限制的受限数据和受限操作所带来的风险是比较大的。

许多运行时权限会访问用户私有数据（这是一种特殊的受限数据，其中包含可能比较敏感的信息。例如，位置信息和联系信息就属于用户私有数据）

从 `Android 6.0` 开始，运行时权限不仅需要在 `AndroidManifest.xml` 配置清单文件中声明，还需要在代码中调用相关的 `API` 进行动态请求。

系统为运行时权限分配的保护级别（`protection level`）是：`dangerous`

### 2.3 特殊权限（保护级别：`appop`）

特殊权限与特定的应用操作相对应。

只有平台和原始设备制造商（`OEM`）可以定义特殊权限。

> 如果平台和 `OEM` 想要防止有人执行功能特别强大的操作（例如通过其他应用绘图），通常会定义特殊权限。

系统设置中的 “特殊应用访问权限页面” 包含一组用户可切换的操作。其中的许多操作都以特殊权限的形式实现。

系统为特殊权限分配的保护级别（`protection level`）是：`appop`

### 2.4 如何判断权限的类别

`Android` 系统提供的权限都定义在 [Manifest.permission](https://developer.android.google.cn/reference/android/Manifest.permission?hl=zh-cn) 中。通过查看其中权限的保护级别就可以判断权限是安装时权限，还是运行时权限，又或者是特殊权限。

## 3. 使用权限时的工作流程

![](./images/permission/01.svg)

## 4. 常用权限举例

> 参考：[Manifest.permission](https://developer.android.google.cn/reference/android/Manifest.permission?hl=zh-cn)

```xml:no-line-numbers
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    允许读取外部存储中的信息（dangerous）

<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    允许向外部存储写入信息（dangerous）

<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    允许接收手机开机的广播（normal）

<uses-permission android:name="android.permission.READ_SYNC_SETTINGS" />
    允许读取同步设置（normal）

<uses-permission android:name="android.permission.CAMERA" />
    允许执行拍照功能（dangerous）

<uses-permission android:name="android.permission.FLASHLIGHT" />
    允许访问闪光灯（官网文档中未找到此权限）

<uses-permission android:name="android.permission.WAKE_LOCK" />
    允许在手机屏幕关闭后，程序的后台进程仍然运行（normal）

<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    允许程序修改声音设置信息（normal）

<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    允许程序获取用户大概的位置信息（dangerous）

<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    允许程序获取用户精确的位置信息（dangerous）

<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
    允许程序访问额外的定位提供者指令（normal）

<uses-permission android:name="android.permission.BLUETOOTH" />
    允许程序连接配对过的蓝牙设备（normal）

<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    允许程序进行发现和配对新的蓝牙设备（normal）

<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    允许程序将服务设置为前台服务（normal）

<uses-permission android:name="android.permission.INTERNET" />
    允许程序访问网络连接（normal）

<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    允许程序访问WiFi网络的相关信息（normal）

<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
    允许应用程序改变Wi-Fi连接状态（normal）

<uses-permission android:name="android.permission.READ_PHONE_STATE" />
    允许读取电话状态，包括:
        1. 移动网络信息，
        2. 正在呼叫的状态，
        3. 注册在手机上的电话帐户列表。
    （dangerous）

<uses-permission android:name="android.permission.RECORD_AUDIO" />
    允许程序录制声音（dangerous）

<uses-permission android:name="android.permission.READ_PHONE_NUMBERS" />
    允许读取设备的电话号码（权限 READ_PHONE_STATE 授予功能的一个子集）。（dangerous）

<uses-permission android:name="android.permission.READ_SMS" />
    允许程序读取短信内容（dangerous）

<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
    允许应用程序更改网络连接状态（normal）

<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    允许应用程序访问有关网络的信息。（normal）

<uses-permission android:name="android.permission.GET_TASKS" />
    允许程序获取任务信息（Android5.0 后废弃）

<uses-permission android:name="android.permission.READ_SETTINGS" />
    （未查找到此权限）

<uses-permission android:name="android.permission.WRITE_SETTINGS" />
    允许程序读取或写入系统设置（signature|preinstalled|appop|pre23）

<uses-permission android:name="android.permission.VIBRATE" />
    允许程序振动（normal）

<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS" />
    允许程序挂载、反挂载外部文件系统（Not for use by third-party applications）
```

## 5. 声明权限

> 参考：[声明应用权限](https://developer.android.google.cn/training/permissions/declaring?hl=zh_cn)

## 6. 请求权限

> 参考：[请求应用权限](https://developer.android.google.cn/training/permissions/requesting?hl=zh_cn)

### 6.1 请求权限的相关框架

> 参考：[PermissionsDispatcher](https://github.com/permissions-dispatcher/PermissionsDispatcher)
> 
> 参考：[RxPermissions](https://github.com/tbruyelle/RxPermissions)

## 7. 自定义权限

> 参考：[定义自定义应用权限](https://developer.android.google.cn/guide/topics/permissions/defining?hl=zh_cn)