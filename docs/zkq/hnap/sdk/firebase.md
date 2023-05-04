---
title: Firebase接入
category: 
  - HNAP 
tag:
  - sdk 
---

## 1. 接入步骤

> 参考：[将 Firebase 添加到您的 Android 项目](https://firebase.google.com/docs/android/setup?authuser=0#prerequisites)
> 
> 参考：[Google Analytics（分析）使用入门](https://firebase.google.com/docs/analytics/get-started?platform=android&authuser=0)
> 
> 参考：[Firebase Crashlytics 使用入门](https://firebase.google.com/docs/crashlytics/get-started?authuser=0&platform=android)

### Step 1. 添加依赖仓库

```groovy:no-line-numbers
/* Project build.gradle */
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.14'  // Google Services plugin
        classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.2'
    }
}
```

> 注意：`Android Gradle Plugin 7.0+` 中 `buildscript {...}` 需要添加在 `plugins {...}` 之前。

### Step 2. 导入 `Gradle` 插件

```groovy:no-line-numbers
/* Module build.gradle */
plugins {
    id 'com.android.application'
    id 'com.google.gms.google-services'  // Google Services plugin
    id 'com.google.firebase.crashlytics' // Apply the Crashlytics Gradle plugin
}
```

### Step 3. 添加依赖包

```groovy:no-line-numbers
/* Module build.gradle */

/* Firebase */
// Import the BoM for the Firebase platform
implementation platform('com.google.firebase:firebase-bom:30.5.0')
// Declare the dependencies for the Crashlytics and Analytics libraries
// When using the BoM, you don't specify versions in Firebase library dependencies
implementation 'com.google.firebase:firebase-crashlytics'
implementation 'com.google.firebase:firebase-analytics'
```

### Step 4. 导入 `google-services.json` 配置文件

将 `google-services.json` 文件存放在模块目录下（如路径 `app/google-services.json`）

### Step 5. AndroidManifest.xml 中的配置

```xml:no-line-numbers
<!-- 在 application 标签下配置 -->

<!-- Firebase 的 Crashlytics 启用自选式报告 -->
<!-- 参考：https://firebase.google.com/docs/crashlytics/customize-crash-reports?authuser=0&platform=android#enable-reporting -->
<!-- 此时，当代码中调用 FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true); 时才会启动崩溃分析  -->
<meta-data
    android:name="firebase_crashlytics_collection_enabled"
    android:value="false" />
```

### Step 6. 在 `Application` 中进行初始化配置

```java:no-line-numbers
public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        setFirebaseEnable();
    }

    private void setFirebaseEnable() {
        // Analytics
        obtainAnalytics().setAnalyticsCollectionEnabled(true);
        // Crashlytics: release 传 true，debug 传 false
        FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(!BuildConfig.VPN_DEBUG);
    }

    // 埋点时需要用到 FirebaseAnalytics 实例，所以对外提供 FirebaseAnalytics 对象
    public static FirebaseAnalytics obtainAnalytics() {
        return FirebaseAnalytics.getInstance(app);
    }
}
```

## 2. `FCM` 云消息

## 3. `Remote Config`

## 4. `A/B Testing`