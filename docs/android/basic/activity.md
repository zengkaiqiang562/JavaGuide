---
title: Activity（TODO）
category: 
  - android-基础
tag:
  - android-基础
---

[Activity 的 36 大难点，你会几个？「建议收藏」](https://blog.csdn.net/qq_43377749/article/details/102728995)

## 1. 生命周期

### 1.1 生命周期切换过程

![](./images/activity/01.png)

### 1.2 正常生命周期

#### 1.2.1 `onCreate`

表示 `Activity` 正在被创建，这是生命周期的第一个方法。

在这个方法中，我们可以做一些初始化工作，比如：

1. 调用 `setContentView` 去加载界面布局资源；
2. 初始化 `Activity` 所需数据等。

#### 1.2.2 `onRestart`

表示 `Activity` 正在重新启动。

一般情况下，当 `Activity` 从不可见重新变为可见状态时，`onRestart` 就会被调用。

> 这种情况一般是用户行为所导致的，比如：当用户按 `Home` 键切换到桌面，或者用户打开了一个新的 `Activity` 时，原来的 `Activity` 会暂停，于是原来的 `Activity` 执行 `onPause` 和 `onStop`。接着，当用户又回到原来的 `Activity` 时，原来的 `Activity` 就会执行 `onRestart`。

#### 1.2.3 `onStart`

表示 `Activity` 正在被启动。此时，`Activity` 已经可见了，但是 `Activity` 还没有出现在前台，无法与用户交互。

#### 1.2.4 `onResume`

表示 `Activity` 已经可见了，并出现在前台，且可以和与用户交互了。

> 注意与 `onStart` 的对比：
> 
> `onStart` 和 `onResume` 都表示 `Activity` 已经可见，但是 `onStart` 时 `Activity` 还在后台；`onResume` 时才显示到前台。

#### 1.2.5 `onPause`

表示 `Activity` 正在停止。

此时可以做一些存储数据、停止动画等操作。但不能太耗时，因为这会影响到新的 `Activity` 的显示。

注意：**`onPause` 必须先执行完，新 `Activity` 的 `onResume` 才会执行**。

#### 1.2.6 `onStop`

表示 `Activity` 即将停止，可以做一些稍微重量级的回收工作，同样不能太耗时。

#### 1.2.7 `onDestroy`

表示 `Activity` 即将被销毁，这是 `Activity` 生命周期中的最后一个回调。

在这里，可以做一些回收工作和最终的资源释放。

#### 1.2.8 具体场景分析

##### 1.2.8.1 `Activity` 第一次启动时

```:no-line-numbers
onCreate -> onStart -> onResume
```

##### 1.2.8.2 `Activity` 退到后台（切换到桌面 or 跳转到其它 `Activity`）

```:no-line-numbers
onPause -> onStop
```

##### 1.2.8.3 跳转到采用了透明主题的其它 `Activity`

```:no-line-numbers
onPause
```

> `A` 跳转到 `B` 时，若 `B` 采用了透明主题，则 `A` 仅回调 `onPause`，不回调 `onStop`。

##### 1.2.8.4 `Activity` 回到前台（用户再次回到原 `Activity`）

```:no-line-numbers
onRestart -> onStart -> onResume
```

##### 1.2.8.5 锁屏 & 开屏

锁屏时：

```:no-line-numbers
onPause -> onStop
```

开屏时：

```:no-line-numbers
onStart -> onResume
```

##### 1.2.8.6 用户按 `back` 按键回退时

```:no-line-numbers
onPause -> onStop -> onDestroy
```

### 1.3 异常生命周期

#### 1.3.1 资源相关的系统配置改变导致 `Activity` 销毁重建（如横竖屏切换）

当 `Activity` 从竖屏切换到横屏时，系统配置发生了改变，此时需要去加载适配横屏的资源目录中的图片。默认情况下，`Activity` 就会被销毁并且重新创建，其生命周期如下：

```mermaid
flowchart LR
    A1([Activity])
    A2([Activity])
    A1cb1(onSaveInstanceState)
    A1cb2(onStop)
    A1cb3(onDestroy)
    A2cb1(onCreate)
    A2cb2(onStart)
    A2cb3(onRestoreInstanceState)
    A2cb4(onResume)

    subgraph S1
        A1 -- 异常情况 --> A1cb1 --> A1cb2 --> A1cb3  
    end

    subgraph S2
        A2 --> A2cb1 --> A2cb2 --> A2cb3 --> A2cb4
    end

    S1 -- 重新创建 --> S2
```

如上图所示：

1. 当系统配置发生改变后，`Activity` 会被销毁，其 `onPause`、`onStop`、`onDestroy` 均会被调用，同时由于 `Activity` 是在异常情况下终止的，系统会调用 `onSaveInstanceState` 来保存当前 `Activity` 的状态。

    > 只有在 `Activity` 被异常终止的情况下才会回调 `onSaveInstanceState` 方法，正常情况下系统不会回调这个方法。
    >
    > 系统只会在 `Activity` 即将被销毁并且有机会重新显示的情况下才会去调用 `onSaveInstanceState`。当 `Activity` 正常销毁的时候，系统不会调用 `onSaveInstanceState`，因为被销毁的 `Activity` 不可能再次被显示。

2. `onSaveInstanceState` 方法的调用时机是在 `onStop` 之前，但它和 `onPause` 没有既定的时序关系，即：它既可能在 `onPause` 之前调用，也可能在 `onPause` 之后调用。

3. 当 `Activity` 被重新创建后，系统会调用 `onRestoreInstanceState`，并且把 `Activity` 销毁时 `onSaveInstanceState` 方法所保存的 `Bundle` 对象作为参数同时传递给 `onRestoreInstanceState` 和 `onCreate` 方法。

4. `onRestoreInstanceState` 的调用时机在 `onStart` 之后，`onResume` 之前。

#####  1.3.1.1 `View` 层次结构的保存与恢复 & 委托思想

在 `onSaveInstanceState` 和 `onRestoreInstanceState` 方法中，系统自动为我们做了一定的恢复工作。

比如：当 `Activity` 在异常情况下需要重新创建时，系统会默认为我们保存当前 `Activity` 的视图结构，并且在 `Activity` 重启后为我们恢复这些数据，包括：文本框中用户输入的数据、`ListView` 滚动的位置等。

> 和 `Activity` 一样，每个 View 都有 `onSaveInstanceState` 和 `onRestoreInstanceState` 这两个方法，看一下它们的具体实现，就能知道系统能够自动为每个View恢复哪些数据。

关于保存和恢复 `View` 层次结构，系统的工作流程是这样的：

1. 首先 `Activity` 被意外终止时，`Activity` 会调用 `onSaveInstanceState` 去保存数据；
   
2. 然后 `Activity` 会委托 `Window` 去保存数据；
   
3. 接着 `Window` 再委托它上面的顶级容器去保存数据。
   
    > 顶层容器是一个 `ViewGroup`，一般来说它很可能是 `DecorView`。

4. 最后顶层容器再去一一通知它的子元素来保存数据。

这样整个数据保存过程就完成了（数据恢复过程也是类似的）。可以发现，这是一种典型的委托思想，上层委托下层、父容器委托子元素去处理一件事情。

> 这种思想在 `Android` 中有很多应用，比如 `View` 的绘制过程、事件分发等都是采用类似的思想。

#####  1.3.1.2 横竖屏切换时阻止 `Activity` 的销毁重建 & `configChanges` 属性

当资源相关的系统配置发生改变时，系统默认的处理方式是将 `Activity` 销毁重建。

但是，可以在 `AndroidManifest.xml` 文件中通过为 `<activity>` 标签设置属性 `android:configChanges` 来指定需要在变更时自行处理的系统配置。对于自行处理的系统配置，在变更时将阻止 `Activity` 销毁重建，而是让 `Activity` 保持运行状态，并回调此 `Activity` 的 `onConfigurationChanged` 方法。

`android:configChanges` 属性中可指定的系统配置如下：

|系统配置|说明|
|:-|:-|
|`density`|显示密度发生变更 - 用户可能已指定不同的显示比例，或者有不同的显示现处于活跃状态。|
|`fontScale`|字体缩放系数发生变更 - 用户已选择新的全局字号。|
|`keyboard`|键盘类型发生变更 - 例如，用户插入外置键盘。|
|`keyboardHidden`|键盘无障碍功能发生变更 - 例如，用户显示硬键盘。|
|`layoutDirection`|布局方向发生变更 - 例如，自从左至右 (`LTR`) 更改为从右至左 (`RTL`)。|
|`locale`|语言区域发生变更 - 用户已为文本选择新的显示语言。|
|`mcc`|`IMSI` 移动设备国家/地区代码 (`MCC`) 发生变更 - 检测到 `SIM` 并更新 `MCC`。|
|`mnc`|`IMSI` 移动设备网络代码 (`MNC`) 发生变更 - 检测到 `SIM` 并更新 `MNC`。|
|`navigation`|导航类型（轨迹球/方向键）发生变更。（这种情况通常不会发生。）|
|`orientation`|屏幕方向发生变更 - 用户旋转设备。|
|`screenLayout`|屏幕布局发生变更 - 现处于活跃状态的可能是其他显示模式。|
|`screenSize`|当前可用屏幕尺寸发生变更。该值表示目前可用尺寸相对于当前宽高比的变更，当用户在横向模式与纵向模式之间切换时，它便会发生变更。在 `API` 级别 `13` 中引入。|
|`smallestScreenSize`|物理屏幕尺寸发生变更。该值表示与方向无关的尺寸变更，因此它只有在实际物理屏幕尺寸发生变更（如切换到外部显示器）时才会变化。|
|`touchscreen`|触摸屏发生变更。（这种情况通常不会发生。）|
|`uiMode`|界面模式发生变更 - 用户已将设备置于桌面或车载基座，或者夜间模式发生变更。|

为了阻止横竖屏切换时导致 `Activity` 销毁重建，我们可以设置 `android:configChanges` 属性为：

```xml:no-line-numbers
android:configChanges="orientation|keyboardHidden|screenSize"
```

#### 1.3.2 系统内存不足导致低优先级的 Activity 所在进程被杀死

这种情况我们不好模拟，但是其数据存储和恢复过程和 [`1.3.1`](#_1-3-1-资源相关的系统配置改变导致-activity-销毁重建-如横竖屏切换) 完全一致。

这里我们描述一下 `Activity` 的优先级情况。`Activity` 按照优先级从高到低，可以分为如下 `3` 种：

1. 前台 `Activity`：正在和用户交互的 `Activity`，优先级最高。
   
2. 可见但非前台 `Activity`：比如 `Activity` 中弹出了一个对话框，导致 `Activity` 可见但是位于后台无法和用户直接交互。
   
3. 后台 `Activity`：已经被暂停的 `Activity`，比如执行了 `onStop`，优先级最低。

当系统内存不足时，系统就会按照上述优先级去杀死目标 `Activity` 所在的 **进程**，并在后续通过 `onSaveInstanceState` 和 `onRestoreInstanceState` 来存储和恢复数数据。

如果一个进程中没有四大组件在执行，那么这个进程将很快被系统杀死，因此，一些后台工作不适合脱离四大组件而独自运行在后台中，这样进程很容易被杀死。

比较好的方法是将后台工作放入 `Service` 中从而保证进程有一定的优先级，这样就不会轻易地被系统杀死。

### 1.4 将一个 `Activity` 设置成窗口的样式

只需要在 `AndroidManifest.xml` 文件中将 `Activity` 设置成 `Dialog` 主题即可：

```xml:no-line-numbers
android:theme="@android:style/Theme.Dialog"
```

### 1.5 退出已调用多个 `Activity` 的 `Application`

有如下 `4` 种方式：

1. 发送特定广播：在需要结束应用时，发送一个特定的广播，每个 `Activity` 收到广播后关闭即可。

2. 递归退出：在打开新的 `Activity` 时都使用 `startActivityForResult` 加上标志。关闭新的 `Activity` 时，在上一个 `Activity` 的 `onActivityResult` 方法中处理标志，递归关闭。

3. 通过 `Intent` 的 `flag` 实现：在跳转 `Activity` 时，设置 `intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)`。此时如果当前任务栈中已经有该 `Activity`，那么系统会把这个 `Activity` 上面的所有 `Activity` 干掉。

    > 其实相当于给 `Activity` 配置的启动模式为 `singleTask` 。

4. 记录打开的 `Activity`：每打开一个 `Activity`，就记录下来。在需要退出时，关闭每一个记录了的 `Activity`。

### 1.6 修改 `Activity` 进入和退出动画

有两种方式：

1. 在 `style.xml` 中设置过渡动画

    ```xml:no-line-numbers
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <!-- 启用窗口内容过渡 -->
        <item name="android:windowActivityTransitions">true</item>
        <!-- 指定进入和退出过渡 -->
        <item name="android:windowEnterTransition">@transition/explode</item>
        <item name="android:windowExitTransition">@transition/explode</item>
    </style>
    ```

2. 调用 `overridePendingTransition` 方法设置过渡动画

    ```java:no-line-numbers
    /* Activity.java */
    /*
        overridePendingTransition 方法的调用场景可分为两种：

            1. 在 finish 方法后调用，此时：
               1. 参数 enterAnim 表示当前 Activity 退出后将要显示出来的 Activity 的进场动画
               2. 参数 exitAnim 表示当前 Activity 退出时的动画
               
            2. 在 startActivity 方法后调用，此时：
               1. 参数 enterAnim 表示跳转的 Activity 的进场动画
               2. 参数 exitAnim 表示当前 Activity 退出时的动画
    */
    public void overridePendingTransition(int enterAnim, int exitAnim)
    ```

    ```java:no-line-numbers
    /* 示例：在 finish 方法后调用 */
    finish();
    overridePendingTransition(R.anim.activity_enter, R.anim.activity_exit);
    ```

    ```java:no-line-numbers
    /* 示例：在 startActivity 方法后调用 */
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) { // API LEVEL < 16
        startActivity(new Intent(this, XxxActivity.class));
        overridePendingTransition(R.anim.activity_enter, R.anim.activity_exit);
    }else{
        Bundle optionsBundle = ActivityOptionsCompat.makeCustomAnimation(
            this,
            R.anim.activity_enter,
            R.anim.activity_exit
        ).toBundle();

        startActivity(new Intent(this, XxxActivity.class), optionsBundle);
    }
    ```

## 2. 启动模式

## 3. 数据

## 4. `Context`

## 5. 进程