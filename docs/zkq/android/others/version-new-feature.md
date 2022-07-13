---
title: Android 版本新特性
category: 
  - Android
tag:
  - Android
---

> 参考：[API 级别](https://developer.android.google.cn/guide/topics/manifest/uses-sdk-element?hl=zh-cn#ApiLevels)

Android 5.0

```:no-line-numbers
1. Meterial Design 设计风格
2. 弃用 Dalvik 虚拟机，支持 ART 虚拟机
3. 新增了一些 UI 控件，如：RecyclerView、CardView、Toolbar、CoordiantorLayout 等
```

Android 6.0

```:no-line-numbers
1. 运行时的权限机制：6.0 之前，App 所申请的权限只会在安装 App 是出现一次，如果用户同意了，
App 在运行时就可以直接访问权限内的东西。而在 6.0 时，会在运行到每个需要权限的地方询问用户来授予权限。

2. 提供了统一的指纹支持。在 6.0 之前对指纹的支持都是由各个手机厂商实现的，在 6.0 时，谷歌提供了统一的指纹识别方案。
```

Android 7.0

```:no-line-numbers
1. 多窗口模式：支持在大屏设备中，同时打开两个 app 窗口
2. 支持 Java 8 语言平台，开发者可以使用 Java 8 中的 Lambda 表达式了。
```

Android 8.0

```:no-line-numbers
1. 重新设计了通知中心，为每个通知都分配了一个渠道，通过通知渠道来控制通知的行为
2. 画中画支持
3. 多显示器支持：如果 Activity 支持多窗口模式，且在多显示器的设备上运行，则可以将 Activity 从一个显示器移动到另一个显示器。
```

Android 9.0

```:no-line-numbers
1. 支持全面屏：通过 DisplayCutout类可以确定非功能区域的位置和形状，如确定摄像头和扬声器的预留空间的屏幕缺口区域。
2. 引入了 AnimateImageDrawable 类，用于绘制和显示 GIF 和 WebP 动画图像。
3. 扩展和改进了机器学习相关的 API
```

Android 10.0

```:no-line-numbers
1. 5G 网络支持
2. 可折叠设备
3. 暗黑主题
4. 引入了全手势导航模式
5. 在保护用户隐私和用户控制权方面做了不少改进
```