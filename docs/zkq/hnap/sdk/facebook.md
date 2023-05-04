---
title: Facebook接入
category: 
  - HNAP 
tag:
  - sdk 
---

> 参考：[Android 版 Facebook SDK 入门指南](https://developers.facebook.com/docs/android/getting-started)

## 1. 接入步骤

### Step 1. 添加依赖包

```groovy:no-line-numbers
/* Module build.gradle */

/* Facebook */
implementation 'com.facebook.android:facebook-core:12.1.0'
implementation 'com.facebook.android:facebook-applinks:12.1.0'
```

### Step 2. 在 `AndroidManifest.xml` 中配置 `App ID`

```xml:no-line-numbers
<!-- Facebook -->
<meta-data
    android:name="com.facebook.sdk.ApplicationId"
    android:value="000000000000000"/>
```

### Step3. 在 `Application` 中进行初始化配置

```java:no-line-numbers
public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        initFacebook();
    }

    private void initFacebook() {
        FacebookSdk.setApplicationId("000000000000000"); // app id（跟 AndroidManifest.xml 中配置的一样）
        FacebookSdk.setClientToken("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"); // token
        FacebookSdk.sdkInitialize(this);
        AppEventsLogger.activateApp(this);
        FacebookSdk.setAutoLogAppEventsEnabled(true);
    }
}
```