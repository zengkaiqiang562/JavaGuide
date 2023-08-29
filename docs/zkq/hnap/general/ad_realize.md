---
title: 广告变现方案
category: 
  - HNAP 
tag:
  - general 
---

## 1. `Admob SDK` 集成 `MAX` 中介

> 参考 [AdMob 中介功能](https://developers.google.com/admob/android/mediate?hl=zh-cn)
> 
> 参考 [集成 MAX 中介](https://developers.google.com/admob/android/mediation/applovin?hl=zh-cn#supported_integrations_and_ad_formats)
> 
> 注意：`Applovin` 可以像 `Admob` 一样作为广告源，此时需要接入 `Applovin MAX SDK`；也可以仅仅只作为一种广告中介，此时一般称之为 `MAX` 中介。

接入 `MAX` 中介只需在集成了 `Admob SDK` 的基础上添加依赖即可：

```kotlin:no-line-numbers
/* Admob SDK */
implementation("com.google.android.gms:play-services-ads:22.2.0")
/* MAX 中介 */
implementation("com.google.ads.mediation:applovin:11.11.1.0")
```

**注意：**

```:no-line-numbers
1. Admob SDK 和 MAX 中介的依赖版本都升级到最新的。
2. 《集成 MAX 中介》 文档中的可选步骤不需要处理。
3. 通过中介请求广告，需要在 Admob SDK 初始化完成后才会请求到。因此，在启动加载过程中若广告请求失败，需要不断请求。
```

## 2. 接入 `Applovin MAX SDK`，并集成 `Meta` 和 `Mintergal` 中介

### 2.1 添加 `Applovin MAX SDK` 依赖并初始化

> 参考 [Applovin MAX SDK 集成](https://dash.applovin.com/documentation/mediation/android/getting-started/integration)

**添加依赖：**

```kotlin:no-line-numbers
implementation("com.applovin:applovin-sdk:11.11.2")
```

**配置 `SDK KEY`**

```xml:no-line-numbers
<!-- 
    AndroidManifest.xml 的 <application> 标签下
    注意：SKD密钥格式是84位的字符串，开发阶段可以随机生成一个84位字符串即可
 -->
<meta-data android:name="applovin.sdk.key"
           android:value="YOUR_SDK_KEY_HERE"/>
```

**初始化**

```java:no-line-numbers
private void initApplovin(Application application) {

    AppLovinSdk.getInstance(application).getSettings().setVerboseLogging(HealthConfig.HEALTH_DEBUG); // 是否打开调试日志

    // Make sure to set the mediation provider value to "max" to ensure proper functionality
    AppLovinSdk.getInstance(application).setMediationProvider("max");
    AppLovinSdk.initializeSdk(application, new AppLovinSdk.SdkInitializationListener() {
        @Override
        public void onSdkInitialized(final AppLovinSdkConfiguration configuration) {
            // AppLovin SDK is initialized, start loading ads
            LogUtils.e(TAG, "--> initApplovin()  onSdkInitialized  configuration=" + configuration);
        }
    } );
}
```

### 2.2 集成 `banner` 广告

> 参考 [Banners](https://dash.applovin.com/documentation/mediation/android/ad-formats/banners)

```java:no-line-numbers
@Override
protected boolean showBanAd(Activity activity, @Nullable ViewGroup container) {
    ...

    MaxAdView maxAdView = new MaxAdView(unitBean.getId(), activity);

    maxAdView.setPlacement(placeBean.getPlace()); // 设置广告位名称

    maxAdView.setRequestListener(new MaxAdRequestListener() { // 设置开始请求的监听
        @Override
        public void onAdRequestStarted(String adUnitId) {
            LogUtils.e(TAG, "-->  onAdRequestStarted() MaxAdView adUnitId=" + adUnitId);
        }
    });

    maxAdView.setRevenueListener(new MaxAdRevenueListener() { // 设置广告价值的监听
        @Override
        public void onAdRevenuePaid(MaxAd maxAd) {
            LogUtils.e(TAG, "-->  onAdRevenuePaid() MaxAdView  maxAd=" + maxAd);
            // 上报广告价值
            AdjustAdRevenue adjustAdRevenue = new AdjustAdRevenue( AdjustConfig.AD_REVENUE_APPLOVIN_MAX );
            adjustAdRevenue.setRevenue(maxAd.getRevenue(), "USD");
            adjustAdRevenue.setAdRevenueNetwork(maxAd.getNetworkName());
            adjustAdRevenue.setAdRevenueUnit(maxAd.getAdUnitId() );
            adjustAdRevenue.setAdRevenuePlacement(maxAd.getPlacement());
            Adjust.trackAdRevenue(adjustAdRevenue);
        }
    });

    maxAdView.setListener(new MaxAdViewAdListener() {

        @Override
        public void onAdExpanded(MaxAd maxAd) {
            LogUtils.e(TAG, "-->  onAdExpanded() MaxAdView  maxAd=" + maxAd);
        }

        @Override
        public void onAdCollapsed(MaxAd maxAd) {
            LogUtils.e(TAG, "-->  onAdCollapsed() MaxAdView  maxAd=" + maxAd);
        }

        @Override
        public void onAdLoaded(MaxAd maxAd) { // 广告请求成功的回调
            LogUtils.e(TAG, "--> onAdLoaded() MaxAdView  maxAd=" + maxAd);
            ...
        }

        @Override
        public void onAdLoadFailed(String s, MaxError maxError) { // 广告请求失败的回调
            LogUtils.e(TAG, "--> onAdLoadFailed() MaxAdView maxError=" + maxError);
            status = Status.PULL_FAILED;
            int code = maxError.getCode();
            String message = maxError.getMessage();
            int mediatedNetworkErrorCode = maxError.getMediatedNetworkErrorCode();
            String mediatedNetworkErrorMessage = maxError.getMediatedNetworkErrorMessage();
            String errorMsg = String.format(Locale.getDefault(), "code: %d, message: %s, mediatedNetworkErrorCode: %d, mediatedNetworkErrorMessage: %s",
                    code, message, mediatedNetworkErrorCode, mediatedNetworkErrorMessage);
            if (listener != null) {
                listener.onPullFailed(MaxResource.this, code, errorMsg);
            }
        }
        
        @Override
        public void onAdDisplayed(MaxAd maxAd) { // 广告展示成功的回调
            LogUtils.e(TAG, "--> onAdDisplayed() MaxAdView  maxAd=" + maxAd);
            status = Status.SHOW;
            if (listener != null) {
                listener.onShow(MaxResource.this);
            }
        }
        @Override
        public void onAdHidden(MaxAd maxAd) { // 广告展示后隐藏的回调
            LogUtils.e(TAG, "--> onAdHidden() MaxAdView  maxAd=" + maxAd);
            status = Status.DISMISS;
            if (listener != null) {
                listener.onDismiss(MaxResource.this);
            }
        }
        @Override
        public void onAdClicked(MaxAd maxAd) {
            LogUtils.e(TAG, "--> onAdClicked() MaxAdView  maxAd=" + maxAd);
            EventTracker.traceAdClick(unitBean.getId(), placeBean.getPlace(), maxAd.getNetworkName());
            if (listener != null) {
                listener.onClick(MaxResource.this);
            }
        }
        @Override
        public void onAdDisplayFailed(MaxAd maxAd, MaxError maxError) { // 广告展示失败的回调
            LogUtils.e(TAG, "--> onAdDisplayFailed() MaxAdView maxAd=" + maxAd + "  maxError=" + maxError);
            status = Status.UNSHOW;
            int code = maxError.getCode();
            String message = maxError.getMessage();
            int mediatedNetworkErrorCode = maxError.getMediatedNetworkErrorCode();
            String mediatedNetworkErrorMessage = maxError.getMediatedNetworkErrorMessage();
            String errorMsg = String.format(Locale.getDefault(), "code: %d, message: %s, mediatedNetworkErrorCode: %d, mediatedNetworkErrorMessage: %s",
                    code, message, mediatedNetworkErrorCode, mediatedNetworkErrorMessage);
            if (listener != null) {
                listener.onUnshow(MaxResource.this, code, errorMsg);
            }
        }
    });

    maxAdView.setExtraParameter( "allow_pause_auto_refresh_immediately", "true" );
    maxAdView.stopAutoRefresh(); // banner 广告请求前先停止自动刷新

    status = Status.PULLING;

    maxAdView.loadAd();
    int widthPx = container.getLayoutParams().width;
    if (widthPx <= 0) {
        widthPx = ScreenUtils.getScreenWidth(); // dp
    }
    int heightPx = ConvertUtils.dp2px(50);
    maxAdView.setLayoutParams(new FrameLayout.LayoutParams(widthPx, heightPx)); // 设置 banner 广告的尺寸

    maxAdView.setBackgroundColor(Color.parseColor("#FFFFE7D6")); // 设置 banner 广告的背景

    container.removeAllViews();
    container.addView(maxAdView);

    maxAdView.startAutoRefresh(); // 开始自动刷新
    ad = (T) maxAdView;
    return true;
}
```

### 2.3 集成原生广告

> 参考：[Native Ads (Manual)](https://dash.applovin.com/documentation/mediation/android/ad-formats/native-manual)

**请求广告**

```java:no-line-numbers
@Override
protected void pullNavAd() {

    maxNativeAdLoader = new MaxNativeAdLoader(unitBean.getId(), LifecyclerManager.INSTANCE.getApplication());

    maxNativeAdLoader.setPlacement(placeBean.getPlace()); // 设置广告位名称

    maxNativeAdLoader.setRevenueListener(new MaxAdRevenueListener() { // 设置广告价值的监听
        @Override
        public void onAdRevenuePaid(MaxAd maxAd) {
            LogUtils.e(TAG, "-->  onAdRevenuePaid() MaxNativeAd  maxAd=" + maxAd);
            // 上报广告价值
            AdjustAdRevenue adjustAdRevenue = new AdjustAdRevenue( AdjustConfig.AD_REVENUE_APPLOVIN_MAX );
            adjustAdRevenue.setRevenue(maxAd.getRevenue(), "USD");
            adjustAdRevenue.setAdRevenueNetwork(maxAd.getNetworkName());
            adjustAdRevenue.setAdRevenueUnit(maxAd.getAdUnitId() );
            adjustAdRevenue.setAdRevenuePlacement(maxAd.getPlacement());
            Adjust.trackAdRevenue(adjustAdRevenue);
        }
    });

    maxNativeAdLoader.setNativeAdListener(new MaxNativeAdListener() {

        @Override
        public void onNativeAdLoaded(@Nullable MaxNativeAdView maxNativeAdView, MaxAd maxAd) { // 广告请求成功的回调
            LogUtils.e(TAG, "--> onNativeAdLoaded() MaxNativeAd nativeAd=" + maxAd);
            status = Status.PULL_SUCCESS;
            timeLoaded = SystemClock.elapsedRealtime();
            EventTracker.traceAdPullSuccess(unitBean.getId(), placeBean.getPlace(), maxAd.getNetworkName());
            ad = (T) maxAd;
            if (listener != null) {
                listener.onPullSuccess(MaxResource.this);
            }
        }

        @Override
        public void onNativeAdLoadFailed(String s, MaxError maxError) { // 广告请求失败的回调
            LogUtils.e(TAG, "--> onNativeAdLoadFailed() MaxNativeAd maxError=" + maxError);
            status = Status.PULL_FAILED;
            int code = maxError.getCode();
            String message = maxError.getMessage();
            int mediatedNetworkErrorCode = maxError.getMediatedNetworkErrorCode();
            String mediatedNetworkErrorMessage = maxError.getMediatedNetworkErrorMessage();
            String errorMsg = String.format(Locale.getDefault(), "code: %d, message: %s, mediatedNetworkErrorCode: %d, mediatedNetworkErrorMessage: %s",
                    code, message, mediatedNetworkErrorCode, mediatedNetworkErrorMessage);
            if (listener != null) {
                listener.onPullFailed(MaxResource.this, code, errorMsg);
            }
        }

        @Override
        public void onNativeAdClicked(MaxAd maxAd) {
            LogUtils.e(TAG, "--> onAdClicked()");
            EventTracker.traceAdClick(unitBean.getId(), placeBean.getPlace(), maxAd.getNetworkName());
            if (listener != null) {
                listener.onClick(MaxResource.this);
            }
        }

        @Override
        public void onNativeAdExpired(MaxAd maxAd) { // 广告过期的回调
            status =  Status.EXPIRED;
            if (listener != null) {
                listener.onExpired(MaxResource.this);
            }
        }
    });

    maxNativeAdLoader.loadAd();
}
```

**展示广告**

```xml:no-line-numbers
<!-- 原生广告的布局文件 -->
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    ...>

    <FrameLayout
        android:id="@id/ad_media"
        .../>

    <ImageView
        android:id="@id/ad_app_icon"
        ... />

    <TextView
        android:id="@+id/tv_ad"
        ...
        android:text="@string/ad"
        />

    <TextView
        android:id="@+id/ad_headline"
        .../>

    <TextView
        android:id="@+id/ad_body"
        .../>

    <Button
        android:id="@+id/ad_call_to_action"
        ...
        android:text="@string/install"/>

</androidx.constraintlayout.widget.ConstraintLayout>
```

```java:no-line-numbers
// 原生广告的展示代码
@Override
protected boolean showNavAd(Activity activity, @Nullable ViewGroup container, @NonNull NativeAdViewCreator creator) {
    if (container == null) {
        return false;
    }
    MaxAd nativeAd = (MaxAd) ad;
    if (maxNativeAdLoader == null || nativeAd.getNativeAd() == null || nativeAd.getNativeAd().isExpired()) {
        status = Status.UNSHOW;
        if (listener != null) {
            String errorMsg = "errorMsg: {" + " maxNativeAdLoader=" + maxNativeAdLoader + "  nativeAd=" +nativeAd.getNativeAd() + "}";
            listener.onUnshow(MaxResource.this, -1, errorMsg);
        }
        return false;
    }

    MaxNativeAdView maxNativeAdView = creator.create(Provider.MAX, activity);
    // 从 nativeAd 中获取原生广告的资源（图片，标题，文本等），渲染到视图 MaxNativeAdView 中
    maxNativeAdLoader.render(maxNativeAdView, nativeAd);

    container.removeAllViews();
    container.addView(maxNativeAdView);

    status = Status.SHOW;
    if (listener != null) {
        listener.onShow(MaxResource.this);
    }
    return true;
}


public abstract class NativeAdViewCreator {

    private static final String TAG = "NativeAdViewCreator";

    // 用于渲染 Admob 原生广告
    NativeAdView create(Provider provider, NativeAd ad, Activity activity) {
        return AdmobNavRender.render(getLayoutId(provider), hasMediaView(), ad, activity);
    }

    // 用于渲染 Max 原生广告
    public MaxNativeAdView create(Provider provider, Activity activity) {
        return MaxNavRender.render(getLayoutId(provider), hasMediaView(), activity);
    }

    protected abstract boolean hasMediaView();

    protected abstract @LayoutRes int getLayoutId(Provider provider);
}


public class MaxNavRender {

    public static MaxNativeAdView render(int layoutId, boolean hasMediaView, Activity activity) {

        MaxNativeAdViewBinder.Builder builder = new MaxNativeAdViewBinder.Builder(layoutId);

        builder.setTitleTextViewId(R.id.ad_headline);
        builder.setBodyTextViewId(R.id.ad_body);
        builder.setIconImageViewId(R.id.ad_app_icon);
        builder.setCallToActionButtonId(R.id.ad_call_to_action); // Button

        if (hasMediaView) {
            builder.setMediaContentViewGroupId(R.id.ad_media); // FrameLayout
        }

        MaxNativeAdViewBinder binder = builder.build();
        return new MaxNativeAdView(binder, activity);
    }
}
```

### 2.4 集成其他类型的广告

> 参考：[集成开屏广告](https://dash.applovin.com/documentation/mediation/android/ad-formats/app-open)
> 
> 参考：[集成插页广告](https://dash.applovin.com/documentation/mediation/android/ad-formats/interstitials)
> 
> 参考：[集成激励广告](https://dash.applovin.com/documentation/mediation/android/ad-formats/rewarded-ads)

### 2.5 集成 `Meta` 和 `Mintergal` 中介

类似于 `Admob SDK` 集成 `MAX` 中介，`Applovin MAX SDK` 集成 `Meta` 和 `Mintergal` 中介也是只需要添加依赖即可。

```kotlin:no-line-numbers
/* Applovin SDK 的依赖 */
implementation("com.applovin:applovin-sdk:11.11.2")

/* Meta 中介的依赖 */
implementation("com.applovin.mediation:facebook-adapter:6.15.0.0")

/* Mintergal 中介的依赖 */
implementation("com.applovin.mediation:mintegral-adapter:16.4.91.0")
```