---
title: Admob广告接入
category: 
  - HNAP 
tag:
  - sdk 
---

> 参考：[入门指南](https://developers.google.cn/admob/android/quick-start)

## 1. 接入步骤

### Step 1. 添加依赖仓库

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

`Android Gradle Plugin 7.0+` 在 `settings.gradle` 中添加：

```groovy:no-line-numbers
pluginManagement {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url 'https://jitpack.io' }
    }
}
```

### Step 2. 添加依赖包

在模块 `build.gradle` 文件中添加：

```groovy:no-line-numbers
dependencies {
    implementation 'com.google.android.gms:play-services-ads:21.0.0'
}
```

### Step 3. 在 `AndroidManifest.xml` 中配置 `App Id`

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

### Step 4. 在 `Application` 中初始化

```java:no-line-numbers
public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        initMobileAds();
    }

    private void initMobileAds() {

        // if (BuildConfig.DEBUG) {
        //     // TODO 添写测试机的 DeviceId
        //     // 参考：https://developers.google.cn/admob/android/test-ads#add_your_test_device_programmatically
        //       List<String> testDeviceIds = Arrays.asList("2B290798B3C52E15FF6CACDAAA57C910", "F9180FB4550B86775EB93370CFB3BCA8");
        //       RequestConfiguration configuration =
        //               new RequestConfiguration.Builder().setTestDeviceIds(testDeviceIds).build();
        //       MobileAds.setRequestConfiguration(configuration);
        // }

        MobileAds.initialize(this, initializationStatus -> {
            for (Map.Entry<String, AdapterStatus> entry : initializationStatus.getAdapterStatusMap().entrySet()) {
                Printer.e(TAG, "==> initMobileAds() onCompleted  entry.key=" + entry.getKey()
                        + "  entry.AdapterStatus.desc=" + entry.getValue().getDescription() 
                        + "  entry.AdapterStatus.state=" + entry.getValue().getInitializationState());
            }
        });
    }
}
```

> 加载广告之前，请先调用 `MobileAds.initialize()`，以便让应用初始化 `Google` 移动广告 `SDK`。
> 
> 该方法将初始化相应 `SDK`，并在初始化完成后或 `30` 秒超时后回调完成监听器。此操作仅需执行一次，最好是在应用启动时执行。

### Step 5. 测试广告

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

## 2. 获取 `Google` 的广告 `ID`

```java:no-line-numbers
/* 需要依赖 Admob 广告 SDK */
// 在子线程中执行
private void fetchGoogleAdvertID() {
    try {
        AdvertisingIdClient.Info adInfo = AdvertisingIdClient.getAdvertisingIdInfo(this);
        sGoogleAdvertID = adInfo.getId();
        Printer.e(TAG, "fetchGoogleAdvertID() ==>  sGoogleAdvertID=" + sGoogleAdvertID);
    } catch (Exception e) {
        Printer.e(TAG, "fetchGoogleAdvertID() ==>  Exception=" + e);
    }
}
```