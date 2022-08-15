---
title: 启动优化 
category: 
  - HNAP 
tag:
  - C407 
---

## 1. 启动优化的几个方面

1. 主题中 `android:windowBackgroud` 属性添加的背景带有图片时，会导致延迟

2. `build.gradle` 中添加 `admob` 广告 `sdk`  的依赖，以及 `<application>` 中配置 `admob` 的广告 `meta-data` 会导致 `300-600ms` 左右的延迟

    > `sdk` 中加入了 `ContentProvider` ？

3. 在 `Application.onCreate` 中调用 `MobileAds.initialize` 对 `admob` 广告 `sdk` 进行初始化会导致 `300ms` 左右的延迟

4. 在启动过程中发起网络请求时，开子线程，在子线程中处理请求数据和响应数据。否则也会造成延迟

5. `debug` 构建时，如果同 `release` 一样开启代码混淆和删除无用资源以减小 `apk` 体积可以提高启动速度

    ```groovy:no-line-numbers
    android {
        ...
        buildTypes {

            release {
                shrinkResources true
                minifyEnabled true
                proguardFiles
                    getDefaultProguardFile('proguard-android.txt'),
                    'proguard-rules.pro'
            }

            debug {
                shrinkResources true
                minifyEnabled true
                proguardFiles
                    getDefaultProguardFile('proguard-android.txt'),
                    'proguard-rules.pro'
            }
        }
    }
    ```

## 2. 主题样式相关的配置项

### 2.1 `Application` 的主题配置

`Application` 的主题是对所有 `Activity` 起作用的（除非单独为 `Activity` 配置了主题）

:::: code-group
::: code-group-item values
```xml:no-line-numbers
<style name="Theme.FlowVPN" parent="Theme.MaterialComponents.Light.NoActionBar">
    <!-- 设置状态栏的背景颜色 -->
    <item name="android:statusBarColor">@android:color/transparent</item> 

    <!-- Customize your theme here. -->
    <item name="android:windowAnimationStyle">@style/AnimationActivity</item>
    <item name="android:windowNoTitle">true</item>
</style>

<style name="AnimationActivity" mce_bogus="1" parent="@android:style/Animation.Activity">
    <item name="android:activityOpenEnterAnimation">@anim/anim_enter</item>
    <item name="android:activityOpenExitAnimation">@anim/anim_exit</item>
    <item name="android:activityCloseEnterAnimation">@anim/back_enter</item>
    <item name="android:activityCloseExitAnimation">@anim/back_exit</item>

    <item name="android:taskOpenEnterAnimation">@anim/anim_enter</item>
    <item name="android:taskOpenExitAnimation">@anim/anim_exit</item>
    <item name="android:taskCloseEnterAnimation">@anim/back_enter</item>
    <item name="android:taskCloseExitAnimation">@anim/back_exit</item>
    <item name="android:taskToFrontEnterAnimation">@anim/anim_enter</item>
    <item name="android:taskToFrontExitAnimation">@anim/anim_exit</item>
    <item name="android:taskToBackEnterAnimation">@anim/back_enter</item>
    <item name="android:taskToBackExitAnimation">@anim/back_exit</item>
</style>
```
:::

::: code-group-item values-v23:active
```xml:no-line-numbers
<style name="Theme.FlowVPN" parent="Theme.MaterialComponents.Light.NoActionBar">
    <!-- 设置状态栏的背景颜色 -->
    <item name="android:statusBarColor">@android:color/transparent</item>

    <!-- Customize your theme here. -->
    <item name="android:windowAnimationStyle">@style/AnimationActivity</item>
    <item name="android:windowNoTitle">true</item>

    <!-- 设置状态栏的字体颜色为黑色（即亮背景下使用深色字体）（API 23 及其以上生效） -->
    <item name="android:windowLightStatusBar">true</item>
</style>
```
:::
::::

> `values-v23` 文件夹下的资源文件对 `API 23` 及其以上的 `Android` 版本生效。
> 
> `values-v23` 下的资源文件中可以引用 `values` 中的资源（如 `values` 下的资源 `@style/AnimationActivity`）。

**使用示例：**

```xml:no-line-numbers
<application
    ...
    android:theme="@style/Theme.FlowVPN">

    ...
</application>
```


### 2.2 为单个 `Activity` 设置主题 & 设置透明主题

```xml:no-line-numbers
<style name="StartAppTheme" parent="Theme.MaterialComponents.Light.NoActionBar">
    <!-- 设置主题背景 -->
    <item name="android:windowBackground">@drawable/splash_bg_transparent</item>

    <!-- 设置主题背景为透明 -->
    <item name="android:windowIsTranslucent">true</item>

    <!-- 设置状态栏 & 导航栏的背景为透明 -->
    <item name="android:statusBarColor">@android:color/transparent</item>
    <item name="android:navigationBarColor">@android:color/transparent</item>
</style>
```

```xml:no-line-numbers
<!-- splash_bg_transparent.xml -->
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="@color/transparent"/>
</shape>
```

> 注意：在有的手机上，只是设置 `<item name="android:windowIsTranslucent">true</item>` 无法实现透明主题，
> 
> 还需要加上 `<item name="android:windowBackground">@drawable/splash_bg_transparent</item>`，其中背景图片为一个透明的 `shape` 图。

使用示例：

```xml:no-line-numbers
<!-- 为启动页设置 StartAppTheme 主题（透明主题） -->
<activity
    android:name=".view.activity.GuideActivity"
    android:theme="@style/StartAppTheme"
    android:launchMode="singleTask"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

> 当启动时间较长且无法继续优化的情况下，通常会为 `App` 的启动页设置一个背景图，或者将启动页设置成透明主题。
> 
> 从而避免 `App` 在启动时出现白屏或黑屏现象。

## 3. 开源项目 `Immersionbar` 的使用

> 参考：[ImmersionBar](https://github.com/gyf-dev/ImmersionBar)