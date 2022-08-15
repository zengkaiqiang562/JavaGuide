---
title: Admob SDK 集成 
category: 
  - HNAP 
tag:
  - C407 
---

> 参考：[入门指南](https://developers.google.cn/admob/android/quick-start)

## 1. 添加依赖仓库

在根 `build.gradle` 文件中添加：

```groovy:no-line-numbers
buildscript {
    repositories {
        google()
        mavenCentral()
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
```

## 2. 添加依赖包

在模块 `build.gradle` 文件中添加：

```groovy:no-line-numbers
dependencies {
    implementation 'com.google.android.gms:play-services-ads:21.0.0'
}
```

## 3. 在 `AndroidManifest.xml` 中配置 `App Id`

```xml:no-line-numbers
<manifest>
    <application>
        <!-- Sample AdMob app ID: ca-app-pub-3940256099942544~3347511713 -->
        <!-- 注意：实际开发时要替换成自己的 App Id -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"/>
    </application>
</manifest>
```

## 4. 在 `Application` 中初始化

```java:no-line-numbers
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        MobileAds.initialize(this, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {
                Zlog.e(TAG, "--> MobileAds onInitializationComplete  initializationStatus : " + initializationStatus);
            }
        });
    }
}
```

> 加载广告之前，请先调用 `MobileAds.initialize()`，以便让应用初始化 `Google` 移动广告 `SDK`。
> 
> 该方法将初始化相应 `SDK`，并在初始化完成后或 `30` 秒超时后回调完成监听器。此操作仅需执行一次，最好是在应用启动时执行。

## 5. 测试广告

在开发过程中启用测试广告非常重要，这样您就可以在不向 `Google` 广告客户收费的情况下点击广告。

**在非测试模式下，如果您点击过多广告，可能会导致您的帐号因为无效活动而被举报。**

有以下两种获得测试广告的方法：

1. 使用 `Google` 提供的任一示例广告单元 `ID`。
   
2. 使用自己的广告单元 `ID` 并 [启用测试设备](https://developers.google.cn/admob/android/test-ads#enable_test_devices)。

**如下所示，为 `Google` 提供的示例广告单元 `ID`：**

|广告格式|示例广告单元 `ID`|
|:-|:-|
|开屏广告|`ca-app-pub-3940256099942544/3419835294`|
|横幅广告|`ca-app-pub-3940256099942544/6300978111`|
|插页式广告|`ca-app-pub-3940256099942544/1033173712`|
|插页式视频广告|`ca-app-pub-3940256099942544/8691691433`|
|激励广告|`ca-app-pub-3940256099942544/5224354917`|
|插页式激励广告|`ca-app-pub-3940256099942544/5354046379`|
|原生高级广告|`ca-app-pub-3940256099942544/2247696110`|
|原生高级视频广告|`ca-app-pub-3940256099942544/1044960115`|

## 6. 接入开屏广告

## 7. 接入插页广告

## 8. 接入横幅（`Bannder`）广告

## 9. 接入原生广告


