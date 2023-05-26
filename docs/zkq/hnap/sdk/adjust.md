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
public static void traceEvent(String event, Map<String, String> params, boolean unique) {
    if (unique && SPUtils.getInstance().getBoolean(event)) {
        Log.e(TAG, "traceEvent() -->  unique event " + event + "  has been REPORT !!!");
        return; // 去重事件已经上报过，不再上报
    }

    AdjustEvent adjustEvent = new AdjustEvent(event);
    if (unique) {
        adjustEvent.setOrderId(event); // Adjust 内部的去重（最多只能支持10个事件，所以自己再套了层 SP 保证去重）
    }

    if (params != null && !params.isEmpty()) {
        for (Map.Entry<String, String> entry : params.entrySet()) {
            adjustEvent.addCallbackParameter(entry.getKey(), entry.getValue());
        }
    }

    Adjust.trackEvent(adjustEvent);
    if (unique) {
        SPUtils.getInstance().put(event, true); // 自己通过 SP 保证去重
    }
}
```

## 3. 通过 `Adjust` 上报归因（上报 `FB` 安装事件）

**Step1. 让产品提供如下信息**

|**事件名称**|**`Adjust` 识别码**|**备注**|**触发条件**|**参数**|
|:-|:-|:-|:-|:-|
|`cfinstalla`|`xm2kgc`|`FB` `install` 事件||加密数据参数：`cfurla`|

**Step2. 示例代码**

```java:no-line-numbers
public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        initAdjust(this);
        registerActivityLifecycleCallbacks(new MyLifecycleCallbacks());
        ...
        // 上报归因的初始化
        setupReferrer(this);
        ...
    }
}
```

```java:no-line-numbers
private void setupReferrer(Application application) {
    InstallReferrerClient referrerClient;
    referrerClient = InstallReferrerClient.newBuilder(application).build();
    referrerClient.startConnection(new InstallReferrerStateListener() {
        @Override
        public void onInstallReferrerSetupFinished(int responseCode) {
            try {
                switch (responseCode) {
                    case InstallReferrerClient.InstallReferrerResponse.OK:
                        // Connection established.
                        boolean traced = SPUtils.getInstance().getBoolean(IConstants.SP_REFERRER_TRACE);
                        if (!traced) {
                            String referrerUrl = referrerClient.getInstallReferrer().getInstallReferrer();
                            AdjustEvent event = new AdjustEvent("xm2kgc");
                            event.addCallbackParameter("cfurla", referrerUrl);
                            Adjust.trackEvent(event);
                            //注意要做一个上传标记，避免重复上传，文档也说了尽量避免不必要的重复调用
                            SPUtils.getInstance().put(IConstants.SP_REFERRER_TRACE, true);
                        }
                        //获取归因后要及时断开，避免内存泄露
                        referrerClient.endConnection();
                        break;
                    case InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED:
                        // API not available on the current Play Store app.
                        break;
                    case InstallReferrerClient.InstallReferrerResponse.SERVICE_UNAVAILABLE:
                        // Connection couldn't be established.
                        break;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onInstallReferrerServiceDisconnected() {
            // Try to restart the connection on the next request to
            // Google Play by calling the startConnection() method.
        }
    });
}
```

## 4. 通过 `Adjust` 上报广告价值


## 5. 通过 `Adjust` 上报广告的请求事件、匹配事件、点击事件

**Step1. 让产品提供如下信息**

|**事件名称**|**`Adjust` 识别码**|**备注**|**触发条件**|**参数**|
|:-|:-|:-|:-|:-|
|`cfaska`|`c6j2e7`|请求事件|开始请求广告后，回传数据|广告单元 `unit`、广告位置 `place`|
|`cfmata`|`2scofd`|匹配事件|广告请求成功后，回传数据|广告单元 `unit`、收入渠道 `income`、广告位置 `place`|
|`cfpota`|`g55rtc`|点击事件|广告点击后，回传数据|广告单元 `unit`、收入渠道 `income`、广告位置 `place`|

> 注意：广告的请求事件触发时，还无法获取到收入渠道，所以此时不需要传（或者传 `""`，或者传一个默认值（如 "`admob`"））

**Step2. `Adjust` 事件上报方法的封装（兼容带参数的事件）**

```java:no-line-numbers
public static void traceEvent(String event, Map<String, String> params, boolean unique) {
    if (unique && SPUtils.getInstance().getBoolean(event)) {
        Log.e(TAG, "traceEvent() -->  unique event " + event + "  has been REPORT !!!");
        return; // 去重事件已经上报过，不再上报
    }

    AdjustEvent adjustEvent = new AdjustEvent(event);
    if (unique) {
        adjustEvent.setOrderId(event); // Adjust 内部的去重（最多只能支持10个事件，所以自己再套了层 SP 保证去重）
    }

    if (params != null && !params.isEmpty()) {
        for (Map.Entry<String, String> entry : params.entrySet()) {
            adjustEvent.addCallbackParameter(entry.getKey(), entry.getValue());
        }
    }

    Adjust.trackEvent(adjustEvent);
    if (unique) {
        SPUtils.getInstance().put(event, true); // 自己通过 SP 保证去重
    }
}
```

**Step3. 上报各个广告的请求事件**

```java:no-line-numbers
/* 1. 封装广告请求事件的上报方法 */
/**
 * 事件: 开始请求广告后，回传数据
 * 事件名: c6j2e7
 * 广告单元参数 unit、广告位置参数 place
 */
public static void traceAdmobPreload(String admobId, String admobPos) {
    Log.e(TAG, "--> traceAdmobPreload()  admobId=" + admobId + "  admobPos=" + admobPos);
    Map<String, String> map = new HashMap<>();
    map.put("unit", admobId);
    map.put("place", admobPos);
    traceEvent("c6j2e7", map, false);
}
```

```java:no-line-numbers
/* 2. 在各个广告请求前调用 traceAdmobPreload 方法 */
```

**Step4. 上报各个广告的匹配事件（请求成功）**

```java:no-line-numbers
/* 1. 封装广告匹配事件的上报方法 */
/**
 * 事件: 广告请求成功后，回传数据
 * 事件名: 2scofd
 * 广告单元参数 unit、收入渠道参数 income、广告位置参数 place
 */
public static void traceAdmobLoadSuccess(String admobId, String admobPos, String admobChannel) {
    Glog.e(TAG, "--> traceAdmobLoadSuccess()  admobId=" + admobId + "  admobPos=" + admobPos + "  admobChannel=" + admobChannel);
    Map<String, String> map = new HashMap<>();
    map.put("unit", admobId);
    map.put("income", admobPos);
    map.put("place", admobChannel);
    ThirdService.traceEvent("2scofd", map, false);
}
```

```java:no-line-numbers
/* 2. 在各个广告请求成功的回调中调用 traceAdmobLoadSuccess 方法 */
```

**Step5. 上报各个广告的点击事件**

```java:no-line-numbers
/* 2. 封装广告点击事件的上报方法 */
/**
 * 事件: 广告点击后，回传数据
 * 事件名: g55rtc
 * 广告单元参数 unit、收入渠道参数 income、广告位置参数 place
 */
public static void traceAdmobClick(String admobId, String admobPos, String admobChannel) {
    Glog.e(TAG, "--> traceAdmobClick()  admobId=" + admobId + "  admobPos=" + admobPos + "  admobChannel=" + admobChannel);
    Map<String, String> map = new HashMap<>();
    map.put("unit", admobId);
    map.put("income", admobPos);
    map.put("place", admobChannel);
    ThirdService.traceEvent("g55rtc", map, false);
}
```

```java:no-line-numbers
/* 2. 在各个广告点击事件的回调中调用 traceAdmobClick 方法 */
```