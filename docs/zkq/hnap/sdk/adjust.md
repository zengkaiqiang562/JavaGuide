---
title: Adjust接入
category: 
  - HNAP 
tag:
  - sdk 
---

## 1. 接入步骤

> 参考：[Adjust 开发文档](https://help.adjust.com/zh/article/get-started-android-sdk#set-up-environment)

### Step 1. 添加依赖包

```groovy:no-line-numbers
/* 在 Module 的 build.gradle 中添加依赖 */

dependencies {
    implementation 'com.adjust.sdk:adjust-android:4.33.0'

    // Install Referrer 是一种唯一标识符，可用来将应用安装归因至来源
    implementation 'com.android.installreferrer:installreferrer:2.2'

    // Add the following if you are using the Adjust SDK inside web views on your app
    implementation 'com.adjust.sdk:adjust-android-webbridge:4.33.0'

    // 为了让 Adjust SDK 能使用 Google 广告 ID，需要集成 Google Play 服务
    implementation 'com.google.android.gms:play-services-ads-identifier:17.0.1'
}
```

### Step 2. 添加权限

```xml:no-line-numbers
/* AndroidManifest.xml */

<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```

### Step 3. 设置 `Proguard` 混淆

```:no-line-numbers
/* proguard-rules.pro */

-keep class com.adjust.sdk.**{ *; }
-keep class com.google.android.gms.common.ConnectionResult {
    int SUCCESS;
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient {
    com.google.android.gms.ads.identifier.AdvertisingIdClient$Info getAdvertisingIdInfo(android.content.Context);
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient$Info {
    java.lang.String getId();
    boolean isLimitAdTrackingEnabled();
}
-keep public class com.android.installreferrer.**{ *; }
```

### Step 4. 在 `Application` 中进行配置和初始化

```java:no-line-numbers
import com.adjust.sdk.Adjust;
import com.adjust.sdk.AdjustConfig;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        initAdjust(this);
        registerActivityLifecycleCallbacks(new MyLifecycleCallbacks());
    }

    public static void initAdjust(Application application) {
        // TODO 正式环境改为实际的 appToken
        String appToken = "{YourAppToken}";
        /*
        Debug 时 environment 设置为 AdjustConfig.ENVIRONMENT_SANDBOX 。
        Release 时 environment 设置为 AdjustConfig.ENVIRONMENT_PRODUCTION。
         */
        String environment = BuildConfig.DEBUG ? AdjustConfig.ENVIRONMENT_SANDBOX : AdjustConfig.ENVIRONMENT_PRODUCTION;
        AdjustConfig config = new AdjustConfig(application, appToken, environment);
        // LogLevel.SUPRESS 禁用所有日志
        config.setLogLevel(BuildConfig.DEBUG ? LogLevel.WARN : LogLevel.SUPRESS);
        Adjust.onCreate(config);
    }

    // 跟踪 Activity 的生命周期
    private static final class MyLifecycleCallbacks implements ActivityLifecycleCallbacks {
        @Override
        public void onActivityResumed(Activity activity) {
            Adjust.onResume();
        }

        @Override
        public void onActivityPaused(Activity activity) {
            Adjust.onPause();
        }

        //...
    }
}
```

## 2. 事件跟踪

```java:no-line-numbers
public static void traceEventByAdjust(String event, Map<String, Object> params, boolean unique) {
    AdjustEvent adjustEvent = new AdjustEvent(event); // 设置事件对象
    if (unique) {
        /* 
            事件数据去重：
                可以发送一个可选的标识符，以避免跟踪重复事件。
                SDK 会存储最新的十个标识符。这意味着带有重复交易 ID 的收入事件会被跳过。
        */
        adjustEvent.setOrderId(event);
    }
    if (params != null && !params.isEmpty()) {
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (value instanceof String) {
                /*
                    将回传参数发送至 Adjust
                */
                adjustEvent.addCallbackParameter(key, (String) value);
            }
        }
    }
    Adjust.trackEvent(adjustEvent);
}
```

## 3. 通过 `Adjust` 上报归因

## 4. 通过 `Adjust` 上报广告价值