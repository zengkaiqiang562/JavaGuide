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

## 2. 事件跟踪（即：埋点）

```java:no-line-numbers
public static void trackEvent(String event, Map<String, String> params, boolean unique) {
    if (unique && SPUtils.getInstance().getBoolean(event)) {
        Log.e(TAG, "trackEvent() -->  unique event " + event + "  has been REPORT !!!");
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

## 3. `BI` 系统接入

`BI` 系统接入就是 `Adjust` 将客户端上报的信息再转发给 `BI` 系统。客户端只需关心要上报哪些信息给 `Adjust` 即可。

目前，需要上报三类信息：

1. 通过 `Adjust` 上报归因（上报 `FB` 安装事件）

2. 通过 `Adjust` 上报广告价值

3. 通过 `Adjust` 上报广告的请求事件、匹配事件、点击事件

### 3.1 通过 `Adjust` 上报归因（上报 `FB` 安装事件）

#### 3.1.1 产品需提供的信息

|**事件名称**|**`Adjust` 识别码**|**备注**|**触发条件**|**参数**|
|:-|:-|:-|:-|:-|
|`cfinstalla`|`xm2kgc`|`FB` `install` 事件||加密数据参数：`cfurla`|

#### 3.1.2 示例代码

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

### 3.2 通过 `Adjust` 上报广告价值

#### 3.2.1 Step1. `Adjust` 上报广告价值的方法封装

```java:no-line-numbers
public static void reportRevenue(long valueMicros, String currencyCode, String network, String adId, String adPlace) {
    double revenue = valueMicros / 1000000.0; //把原来的千分值转换成0.001
    AdjustAdRevenue adRevenue = new AdjustAdRevenue(AdjustConfig.AD_REVENUE_ADMOB);
    adRevenue.setRevenue(revenue, currencyCode);
    adRevenue.setAdRevenueNetwork(network); //广告源渠道
    adRevenue.setAdRevenuePlacement(adPlace); //广告位名称
    adRevenue.setAdRevenueUnit(adId); //广告ID
    Adjust.trackAdRevenue(adRevenue); //调用Adjust上报广告价值的方法
}
```

#### 3.2.2 Step2. 获取广告源渠道的方法封装

```java:no-line-numbers
public static String getAdChannel(String adapter) { // 参数 adapter 通过广告 SDK 提供的 API 获取
    String channel = ""; // 广告源渠道

    if (TextUtils.isEmpty(adapter)) {
        return channel;
    }

    if (adapter.contains("AdMobAdapter")) {
        channel = "admob";
    } else if (adapter.contains("adcolony")) {
        channel = "adcolony";
    } else if (adapter.contains("chartboost")) {
        channel = "chartboost";
    } else if (adapter.contains("inmobi")) {
        channel = "inmobi";
    } else if (adapter.contains("ironsource")) {
        channel = "ironsource";
    } else if (adapter.contains("pangle")) {
        channel = "pangle";
    } else if (adapter.contains("unity")) {
        channel = "unity";
    } else if (adapter.contains("vungle")) {
        channel = "vungle";
    } else if (adapter.contains(".mtg")) {
        channel = "mintegral";
    }

    return channel;
}
```

#### 3.2.3 Step3. 实现 `OnPaidEventListener` 接口

```java:no-line-numbers
public class MyOnPaidEventListener implements OnPaidEventListener {

    private final PlaceBean placeBean; // placeBean 实体类的作用是提供广告位名称
    private final UnitBean unitBean; // unitBean 实体类的作用是提供广告单元 id
    private final String adapter; // // 参数 adapter 通过广告 SDK 提供的 API 获取

    public MyOnPaidEventListener(PlaceBean placeBean, UnitBean unitBean, String adapter) {
        this.placeBean = placeBean;
        this.unitBean = unitBean;
        this.adapter = adapter == null ? "" : adapter;
    }

    @Override
    public void onPaidEvent(@NonNull AdValue adValue) {
        String network = getAdChannel(adapter); // 广告源渠道

        if (placeBean == null || unitBean == null) {
            return;
        }

        reportRevenue(adValue.getValueMicros(), adValue.getCurrencyCode(), network, unitBean.getId(), placeBean.getPlace());
    }
}
```

#### 3.2.4 Step4. 在请求成功的回调中为广告对象设置 `OnPaidEventListener`

```java:no-line-numbers
/* 示例：开屏广告设置监听器的方法。（插页广告与之类似） */
@Override
public void onAdLoaded(@NonNull AppOpenAd appOpenAd) {
    ...
    String adapterName = appOpenAd.getResponseInfo().getMediationAdapterClassName();
    /*
        placeBean 实体类的作用是提供广告位名称
        unitBean 实体类的作用是提供广告单元 id
    */
    appOpenAd.setOnPaidEventListener(new MyOnPaidEventListener(placeBean, unitBean, adapterName));
    ad = (T) appOpenAd;
    ...
}
```

```java:no-line-numbers
/* 示例：原生广告设置监听器的方法。 */
adLoadBuilder.forNativeAd(nativeAd -> { // onNativeAdLoaded
    ...
    String adapterName = nativeAd.getResponseInfo() == null ? "" : nativeAd.getResponseInfo().getMediationAdapterClassName();
    nativeAd.setOnPaidEventListener(new MyOnPaidEventListener(placeBean, unitBean, adapterName));
    ad = (T) nativeAd;
    ...
});
```

```java:no-line-numbers
/* 示例：Banner 广告设置监听器的方法。 */
public void onAdLoaded() {
    ...
    String adapterName = adView.getResponseInfo() == null ? "" : adView.getResponseInfo().getMediationAdapterClassName();
    adView.setOnPaidEventListener(new MyOnPaidEventListener(placeBean, unitBean, adapterName));
    ...
}
```

### 3.3 通过 `Adjust` 上报广告的请求事件、匹配事件、点击事件

#### 3.3.1 产品需提供的信息

|**事件名称**|**`Adjust` 识别码**|**备注**|**触发条件**|**参数**|
|:-|:-|:-|:-|:-|
|`cfaska`|`c6j2e7`|请求事件|开始请求广告后，回传数据|广告单元 `unitId`、广告位置 `place`|
|`cfmata`|`2scofd`|匹配事件|广告请求成功后，回传数据|广告单元 `unitId`、收入渠道 `channel`、广告位置 `place`|
|`cfpota`|`g55rtc`|点击事件|广告点击后，回传数据|广告单元 `unitId`、收入渠道 `channel`、广告位置 `place`|

> 注意：广告的请求事件触发时，还无法获取到收入渠道，所以此时不需要传（或根据产品需求传 `""`，或传一个默认值（如 "`admob`"））

#### 3.3.2 定义埋点方法（兼容带参数的事件）

```java:no-line-numbers
public static void trackEvent(String event, Map<String, String> params, boolean unique) {
    if (unique && SPUtils.getInstance().getBoolean(event)) {
        Log.e(TAG, "trackEvent() -->  unique event " + event + "  has been REPORT !!!");
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

#### 3.3.3 上报各个广告的请求事件

```java:no-line-numbers
/* 1. 广告请求事件的埋点方法封装 */
/**
 * 事件: 开始请求广告后，回传数据
 * 事件识别码: xxx
 * 广告单元参数 unitId, 广告位置参数 place
 */
public static void traceAdPreload(String unitId, String place) {
    LogUtils.e(TAG, "--> traceAdPreload()  unitId=" + unitId + "  place=" + place);
    Map<String, String> map = new HashMap<>();
    map.put("unitId", unitId);
    map.put("place", place);
    trackEvent("xxx", map, false);
}
```

```java:no-line-numbers
/* 2. 在各个广告请求前调用 traceAdPreload 方法 */

// 示例：在开屏广告请求前调用（其他广告类似处理）
traceAdPreload(unitBean.getId(), placeBean.getPlace());
AdRequest request = new AdRequest.Builder().build();
AppOpenAd.load(context, unitBean.getId(), request, AppOpenAd.APP_OPEN_AD_ORIENTATION_PORTRAIT, appOpenAdLoadCallback);
```

#### 3.3.4 上报各个广告的匹配事件（请求成功）

```java:no-line-numbers
/* 1. 广告匹配事件（请求成功）的埋点方法封装 */
/**
 * 事件: 广告请求成功后，回传数据
 * 事件识别码: xxx
 * 广告单元参数 unitId, 广告位置参数 place, 收入渠道参数 channel
 */
public static void traceAdLoadSuccess(String unitId, String place, String channel) {
    LogUtils.e(TAG, "--> traceAdLoadSuccess()  unitId=" + unitId + "  place=" + place + "  channel=" + channel);
    Map<String, String> map = new HashMap<>();
    map.put("unitId", unitId);
    map.put("place", place);
    map.put("channel", channel);
    trackEvent("xxx", map, false);
}
```

```java:no-line-numbers
/* 2. 在各个广告请求成功的回调中调用 traceAdLoadSuccess 方法 */

// 示例：在开屏广告请求成功时调用 traceAdLoadSuccess 方法（其他广告类似处理）
@Override
public void onAdLoaded(@NonNull AppOpenAd appOpenAd) {
    LogUtils.e(TAG, "--> onAdLoaded() appOpenAd=" + appOpenAd);
    ...
    String adapterName = appOpenAd.getResponseInfo().getMediationAdapterClassName();
    appOpenAd.setOnPaidEventListener(new MyOnPaidEventListener(placeBean, unitBean, adapterName));
    traceAdLoadSuccess(unitBean.getId(), placeBean.getPlace(), AdConfig.getAdChannel(adapterName));
    ad = (T) appOpenAd;
    ...
}
```

> 注意：就是在 [为广告对象设置 `OnPaidEventListener` 时](#_3-2-4-step4-在请求成功的回调中为广告对象设置-onpaideventlistener) 调用 `traceAdLoadSuccess` 方法 

#### 3.3.5 上报各个广告的点击事件

```java:no-line-numbers
/* 2. 广告点击事件的埋点方法封装 */
/**
 * 事件: 广告点击后，回传数据
 * 事件识别码: xxx
 * 广告单元参数 unitId, 广告位置参数 place, 收入渠道参数 channel
 */
public static void traceAdClick(String unitId, String place, String channel) {
    LogUtils.e(TAG, "--> traceAdClick()  unitId=" + unitId + "  place=" + place + "  channel=" + channel);
    Map<String, String> map = new HashMap<>();
    map.put("unitId", unitId);
    map.put("place", place);
    map.put("channel", channel);
    trackEvent("xxx", map, false);
}
```

```java:no-line-numbers
/* 2. 在各个广告点击事件的回调中调用 traceAdClick 方法 */

// 示例：在开屏广告的点击事件中调用 traceAdClick 方法（插页广告类似处理）
@Override
public void onAdClicked() {
    String adapterName = ((AppOpenAd) ad).getResponseInfo().getMediationAdapterClassName();
    traceAdClick(unitBean.getId(), placeBean.getPlace(), AdConfig.getAdChannel(adapterName));
    ...
}

// 示例：在原生广告的点击事件中调用 traceAdClick 方法
@Override
public void onAdClicked() {
    String adapterName = ((NativeAd) ad).getResponseInfo() == null ? 
            "" : ((NativeAd) ad).getResponseInfo().getMediationAdapterClassName();
    traceAdClick(unitBean.getId(), placeBean.getPlace(), AdConfig.getAdChannel(adapterName));
    ...
}

// 示例：在Banner 广告的点击事件中调用 traceAdClick 方法
@Override
public void onAdClicked() {
    String adapterName = adView.getResponseInfo() == null ? "" : adView.getResponseInfo().getMediationAdapterClassName();
    traceAdClick(unitBean.getId(), placeBean.getPlace(), AdConfig.getAdChannel(adapterName));
    ...
}
```