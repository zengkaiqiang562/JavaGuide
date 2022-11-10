---
title: 开发笔记
category: 
  - HNAP 
tag:
  - HNAP 
---

## 1. `Admob` 广告 `SDK` 接入

> 参考：[入门指南](https://developers.google.cn/admob/android/quick-start)

**Step 1. 添加依赖仓库**

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

**Step 2. 添加依赖包**

在模块 `build.gradle` 文件中添加：

```groovy:no-line-numbers
dependencies {
    implementation 'com.google.android.gms:play-services-ads:21.0.0'
}
```

**Step 3. 在 `AndroidManifest.xml` 中配置 `App Id`**

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

**Step 4. 在 `Application` 中初始化**

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

**Step 5. 测试广告**

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

## 2. `Firebase SDK` 接入

> 参考：[将 Firebase 添加到您的 Android 项目](https://firebase.google.com/docs/android/setup?authuser=0#prerequisites)
> 
> 参考：[Google Analytics（分析）使用入门](https://firebase.google.com/docs/analytics/get-started?platform=android&authuser=0)
> 
> 参考：[Firebase Crashlytics 使用入门](https://firebase.google.com/docs/crashlytics/get-started?authuser=0&platform=android)

**Step 1. 添加依赖仓库**

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

**Step 2. 导入 `Gradle` 插件**

```groovy:no-line-numbers
/* Module build.gradle */
plugins {
    id 'com.android.application'
    id 'com.google.gms.google-services'  // Google Services plugin
    id 'com.google.firebase.crashlytics' // Apply the Crashlytics Gradle plugin
}
```

**Step 3. 添加依赖包**

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

**Step 4. 导入 `google-services.json` 配置文件**

将 `google-services.json` 文件存放在模块目录下（如路径 `app/google-services.json`）

**Step 5. AndroidManifest.xml 中的配置**

```xml:no-line-numbers
<!-- 在 application 标签下配置 -->

<!-- Firebase 的 Crashlytics 启用自选式报告 -->
<!-- 参考：https://firebase.google.com/docs/crashlytics/customize-crash-reports?authuser=0&platform=android#enable-reporting -->
<!-- 此时，当代码中调用 FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true); 时才会启动崩溃分析  -->
<meta-data
    android:name="firebase_crashlytics_collection_enabled"
    android:value="false" />
```

**Step 6. 在 `Application` 中进行初始化配置**

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

## 3. `Facebook SDK` 接入

**Step 1. 添加依赖包**

```groovy:no-line-numbers
/* Module build.gradle */

/* Facebook */
implementation 'com.facebook.android:facebook-core:12.1.0'
implementation 'com.facebook.android:facebook-applinks:12.1.0'
```

**Step 2. 在 `AndroidManifest.xml` 中配置 `App ID`**

```xml:no-line-numbers
<!-- Facebook -->
<meta-data
    android:name="com.facebook.sdk.ApplicationId"
    android:value="000000000000000"/>
```

**Step3. 在 `Application` 中进行初始化配置**

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

## 4. `keytool` 命令生成应用签名文件

```sh:no-line-numbers
keytool -genkey -keystore xxx.keystore -alias xxx -keypass xxx -keyalg RSA -keysize 2048 -validity 36500 -storepass xxx
```

![](./images/dev-note/01.png)

**注意：**

1. 后缀 `.jks` 的签名文件是 `AndroidStudio` 向导生成的；后缀 `.keystore` 的签名文件是 `Eclipse` 的向导生成的，通过 `keytool` 命令生成签名文件时，这两种后缀都可以；
   
2. `-keysize 1024` 会有警告，所以使用 `-keysize 2048`；
   
3. `-validity 36500` 是 `36500` 天，即有效期 `100` 年；

4. 建议签名文件名、别名、密码、以及组织、地区等信息都用同一个名称，方便记忆。

**另外，可以执行如下命令查看生成的签名文件：**

```sh:no-line-numbers
keytool --list -v -keystore xxx.keystore
```

![](./images/dev-note/02.png)

## 5. 通过 `pepk.jar` 导出签名中的密钥并输出为 `output.zip` 文件

![](./images/dev-note/03.png)

**执行命令如下：**

```sh::no-line-numbers
java -jar pepk.jar --keystore=xxx.keystore --alias=xxx --output=output.zip --include-cert --encryptionkey=eb10fe8f7c7c9df715022017b00c6471f8ba8170b13049a11e6c09ffe3056a104a3bbe4ac5a955f4ba4fe93fc8cef27558a3eb9d2a529a2092761fb833b656cd48b9de6a
```

![](./images/dev-note/04.png)

## 6. 本地安装 `aab` 包

**注意：**

有的手机需要安装两次 `apks` 文件后，才能打开 `app`。（第一次安装后打开无法找到资源文件）

### 6.1 本地安装签名的 `aab` 包

**Step 1.** 先下载 [bundtool 工具](https://github.com/google/bundletool/releases)（一个 `jar` 包）放在本地新建的文件夹中


**Step 2.** 生成设备信息的 `json` 文件 `device-spec.json`

```sh:no-line-numbers
java -jar bundletool-all-1.11.2.jar get-device-spec --output=./device-spec.json
```

**Step 3.** 转换 `apk` 文件（即 `apks` 文件）

```sh:no-line-numbers
java -jar bundletool-all-1.11.2.jar build-apks --bundle=./app-release.aab --output=./app-release.apks --overwrite --ks=./xxx.jks --ks-pass=pass:xxx --ks-key-alias=xxx --key-pass=pass:xxx --device-spec=./device-spec.json
```

**Step 4.** 安装 `apks`

```sh:no-line-numbers
java -jar bundletool-all-1.11.2.jar install-apks --apks=./app-release.apks
```

### 6.2 本地安装测试的 `aab` 包

本地安装测试的 `aab` 包不需要设备信息文件，也不需要配置签名相关的属性：

**Step 1.** 先转换 `apk` 文件：

```sh:no-line-numbers
java -jar bundletool-all-1.11.2.jar build-apks --local-testing --bundle=./app-debug.aab --output=./app-debug.apks
```

**Step 2.** 再安装 `apk` 文件：

```sh:no-line-numbers
java -jar bundletool-all-1.11.2.jar install-apks --apks app-debug.apks
```

## 7. `aab` 包无法连接 `vpn` 的解决配置

> 参考：[https://github.com/schwabe/ics-openvpn/issues/1331](https://github.com/schwabe/ics-openvpn/issues/1331)

**问题原因** 

`aab` 打包时 `vpn` 的 `aar` 库中的 `so` 库在打包时出现了问题。

**解决方案（修改编译配置）**

1. 在引用了 `vpn` 的 `aar` 库的 `VPN` 项目的 `gradle.properties` 文件中添加如下配置属性：

    ```:no-line-numbers
    android.bundle.enableUncompressedNativeLibs=false
    ```

2. 在引用了 `vpn` 的 `arr` 库的 `VPN` 项目下的 `app` 模块的 `build.gradle` 文件中添加：

    ```groovy:no-line-numbers
    android {
      bundle {
        abi { enableSplit = false } 
      }
    }
    ```


## 8. `GitHub` 生成 `token`

**Step 1.** 登录 `GitHub` ，点击右上角头像，选中 `Settings` (设置)。

![](./images/dev-note/05.png)

**Step 2.** 选择左侧菜单的 `Developer settings` 一项

![](./images/dev-note/06.png)

**Step 3.** 再选择 `Personal access tokens`

![](./images/dev-note/07.png)

**Step 4.** 点击 `Generate a personal access token`

![](./images/dev-note/08.png)

**Step 5.** 设置 `token` 名字 & 勾选权限

在 `Note` 中随便填一个描述名称，下面的复选框是你这个 `token` 需要的权限，全部勾上就可以了。

![](./images/dev-note/09.png)

然后点击下面这个绿色的按钮：

![](./images/dev-note/10.png)

**Step 6.** 复制 `token` 值

下面这个就是你的 `token` 了，可以直接复制使用。（记住这个 `token` 值，此值只显示一次）

![](./images/dev-note/11.png)

## 9. 使用 `token` 访问远程仓库

当从本地向 `GitHub` `push` 代码时，若提示如下的错误信息，则原因是 `GitHub` 不再使用密码方式验证身份，而是使用个人 `token`。

```log:no-line-numbers
remote: Support for password authentication was remove on August 123, 2021. Please use a personal access token instead.
```

当通过 [GitHub 生成 token](#_8-github-生成-token) 后，在访问 `GitHub` 远程仓库时（如执行 `git clone`，`git push`，`git pull` 命令），提示输入的密码就是个人 `token`。

```sh:no-line-numbers
$ git clone https://github.com/username/repo.git
Username: your_username
Password: your_token
```

## 10. 为 `GitHub` 生成 `SSH key`

如果本地想通过 `SSH` 协议（而不是 `Https` 协议）克隆并访问远程仓库，那么需要先在本地生成 `SSH key`，并添加到 `GitHub` 账号中。

**Step 1.** 执行 `ssh-keygen -t rsa -C "youremail@example.com"` 命令生成 `SSH key`

后面的 `your_email@youremail.com` 改为你在 `Github` 上注册的邮箱。之后会要求确认路径和输入密码，我们这使用默认的一路回车就行。

成功的话会在 `~/` 下生成 `.ssh` 文件夹，进去并打开 `id_rsa.pub`，复制里面的 `key`。

![](./images/dev-note/12.png)

**Step 2.** 登陆 `github` ，进入 `Account` -> `Settings`（账户配置）

![](./images/dev-note/13.png)

**Step 3.** 左边选择 `SSH and GPG keys`，然后点击 `New SSH key` 按钮。

`title` 设置标题，可以随便填，粘贴在你电脑上生成的 `key`。

![](./images/dev-note/14.png)

![](./images/dev-note/15.png)

**Step 4.** 添加成功后界面如下所示

![](./images/dev-note/16.png)

**Step 5.** 为了验证是否成功，输入以下命令：

![](./images/dev-note/17.png)

## 11. 创建 `GitHub` 远程仓库

**Step 1.** 登录 `GitHub`，点击 "`New repository`" 如下图所示：

![](./images/dev-note/18.png)

**Step 2.** 在 `Repository name` 填入 `runoob-git-test` (远程仓库名)，其他保持默认设置，点击 "`Create repository`" 按钮，就成功地创建了一个新的 `Git` 仓库：

> 注意：如果要创建私有仓库，选中 ”`Private`“。

![](./images/dev-note/19.png)

**Step 3.** 创建成功后，显示如下信息：

![](./images/dev-note/20.png)

以上信息告诉我们：

1. 可以从这个远程仓库在本地克隆出新的仓库；

2. 也可以把本地仓库的内容推送到这个 `GitHub` 远程仓库。

## 12. 透明主题

当启动时间较长且无法继续优化的情况下，通常会为 `App` 的启动页设置一个背景图，或者将启动页设置成透明主题。从而避免 `App` 在启动时出现白屏或黑屏现象。

**Step 1. 给 Application 配置主题样式**

```xml:no-line-numbers
<!-- res/values/themes.xml -->

<resources xmlns:tools="http://schemas.android.com/tools">
    <!-- Base application theme. -->
    <style name="Theme.FlashVPN" parent="Theme.MaterialComponents.Light.NoActionBar">
        <!-- Primary brand color. -->
        <item name="colorPrimary">@color/purple_500</item>
        <item name="colorPrimaryVariant">@color/purple_700</item>
        <item name="colorOnPrimary">@color/white</item>
        <!-- Secondary brand color. -->
        <item name="colorSecondary">@color/teal_200</item>
        <item name="colorSecondaryVariant">@color/teal_700</item>
        <item name="colorOnSecondary">@color/black</item>
        <!-- Status bar color. -->
        <item name="android:statusBarColor">@android:color/transparent</item>
        <!-- Customize your theme here. -->

        <!-- 为所有的 Activity 设置统一的转场动画 -->
        <item name="android:windowAnimationStyle">@style/TransitionStyle</item>

        <item name="android:windowNoTitle">true</item>

        <!-- 为所有的 TextView 设置统一的字体 -->
        <item name="android:fontFamily">@font/aileron_black</item>
    </style>
</resources>
```

```xml:no-line-numbers
<!-- res/values-v23/themes.xml -->
<resources>
    <style name="Theme.FlashVPN" parent="Theme.MaterialComponents.Light.NoActionBar">
        <!-- Primary brand color. -->
        <item name="colorPrimary">@color/purple_500</item>
        <item name="colorPrimaryVariant">@color/purple_700</item>
        <item name="colorOnPrimary">@color/white</item>
        <!-- Secondary brand color. -->
        <item name="colorSecondary">@color/teal_200</item>
        <item name="colorSecondaryVariant">@color/teal_700</item>
        <item name="colorOnSecondary">@color/black</item>
        <!-- Status bar color. -->
        <item name="android:statusBarColor">@android:color/transparent</item>
        <!-- Customize your theme here. -->

        <!-- 为所有的 Activity 设置统一的转场动画 -->
        <item name="android:windowAnimationStyle">@style/TransitionStyle</item>

        <item name="android:windowNoTitle">true</item>

        <!-- 为所有的 TextView 设置统一的字体 -->
        <item name="fontFamily">@font/aileron_black</item>



        <!-- 以上跟 values/themes.xml 一样 -->


        <!-- Android 6.0 (API 23) 以上设置 windowLightStatusBar 为 true，从而为亮背景的状态栏配置黑色字体 -->
        <item name="android:windowLightStatusBar">true</item>
    </style>
</resources>
```

```xml:no-line-numbers
<!-- res/values/styles.xml -->

<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="TransitionStyle" mce_bogus="1" parent="@android:style/Animation.Activity">
        <item name="android:activityOpenEnterAnimation">@anim/open_enter</item>
        <item name="android:activityOpenExitAnimation">@anim/open_exit</item>
        <item name="android:activityCloseEnterAnimation">@anim/close_enter</item>
        <item name="android:activityCloseExitAnimation">@anim/close_exit</item>

        <item name="android:taskOpenEnterAnimation">@anim/open_enter</item>
        <item name="android:taskOpenExitAnimation">@anim/open_exit</item>
        <item name="android:taskCloseEnterAnimation">@anim/close_enter</item>
        <item name="android:taskCloseExitAnimation">@anim/close_exit</item>
        <item name="android:taskToFrontEnterAnimation">@anim/open_enter</item>
        <item name="android:taskToFrontExitAnimation">@anim/open_exit</item>
        <item name="android:taskToBackEnterAnimation">@anim/close_enter</item>
        <item name="android:taskToBackExitAnimation">@anim/close_exit</item>
    </style>
</resources>
```

**Step 2. 给启动 Activity 配置主题样式**

**注意：**

在有的手机上，只是设置 `<item name="android:windowIsTranslucent">true</item>` 无法实现透明主题，

还需要加上 `<item name="android:windowBackground">@drawable/bg_launch</item>`，其中背景图片为一个透明的 `shape` 图。

```xml:no-line-numbers
<!-- res/values/styles.xml -->

<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="LaunchTheme" parent="Theme.MaterialComponents.Light.NoActionBar">
        <item name="android:windowBackground">@drawable/bg_launch</item>
        <item name="android:windowIsTranslucent">true</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="fontFamily">@font/aileron_black</item>
    </style>
</resources>
```

```xml:no-line-numbers
<!-- res/drawable/bg_launch.xml -->

<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="@color/transparent"/>
</shape>
```

**Step 3. 在 AndroidManifest.xml 中使用透明主题**

```xml:no-line-numbers
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        ...
        android:theme="@style/Theme.FlashVPN"
        ...>

        <activity android:name="com.cfos.vpn.ui.launch.LaunchUI"
            android:theme="@style/LaunchTheme"
            android:exported="true"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
```

## 13. `build.gradle` 中配置签名文件

```groovy:no-line-numbers
/* Module build.gradle */
android {
    signingConfigs {
        release {
            v1SigningEnabled true
            v2SigningEnabled true
            keyAlias 'xxx'
            keyPassword 'xxx'
            storeFile file('sign/xxx.jks') // 路径为 <Module>/sign/xxx.jks
            storePassword 'xxx'
        }
    }
}
```

## 14. `build.gradle` 中配置混淆

```groovy:no-line-numbers
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'

            // TODO 设置是否要自动上传 mapping.txt 文件到 Firebase（默认为true，要自动上传），正式环境注释掉
            firebaseCrashlytics {
                mappingFileUploadEnabled false
            }
        }
    }
}
```

## 15. 获取 `Google` 的广告 `ID`

```java:no-line-numbers
/* 需要依赖 Admob 广告 SDK */
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

## 16. 在一台设备上管理多个不同 `GitHub` 账号的仓库

> 参考：[彻底解决github push failed问题（remote: Permission to userA/repo.git denied to userB）](https://blog.csdn.net/weixin_38214171/article/details/95080746)
> 
> 参考：[git clone private repo remote: Repository not found. | git新电脑上clone私有库](https://blog.csdn.net/qazwsxrx/article/details/125554433)
> 
> 参考：[Git配置credential helper](https://blog.csdn.net/wzy901213/article/details/84334163)

**`Mac` 上管理多个不同 `GitHub` 账号的仓库时，可能会出现如下问题：**

```sh:no-line-numbers
zkqcom@zkqcomdeMac-mini JavaGuide % git push
remote: Permission to zengkaiqiang562/JavaGuide.git denied to HarrietCeda.
fatal: unable to access 'https://github.com/zengkaiqiang562/JavaGuide.git/': The requested URL returned error: 403
```

出现以上问题的原因是 `Mac` 上存在一个 `HarrietCeda` 账号下的 `FlashVPN` 仓库，和一个 `zengkaiqiang562` 账号下的 `JavaGuide` 仓库，
而 `Mac` 的钥匙访问串中只为 `HarrietCeda` 保存了 `GitHub` 账号密码，所以当在 `zengkaiqiang562` 账号下的 `JavaGuide` 仓库中执行 `git push` 命令时，默认就会使用钥匙访问串中的 `HarrietCeda` 账号来访问 `zengkaiqiang562` 账号下的 `JavaGuide` 仓库，从而报错：

```:no-line-numbers
Permission to zengkaiqiang562/JavaGuide.git denied to HarrietCeda.
```

**另一个问题如下：**
 
```sh:no-line-numbers
zkqcom@zkqcomdeMac-mini FlashVPN % git push
remote: Repository not found.
fatal: repository 'https://github.com/HarrietCeda/FlashVPN.git/' not found
```

出现以上问题的原因是在解决上一个问题时，将 `Mac` 的钥匙访问串中为 `HarrietCeda` 保存的 `GitHub` 账号密码给删除了，并且由于 `HarrietCeda` 账号下的 `FlashVPN` 仓库是私有的（`Private`），从而 `Git` 无法在 `GitHub` 上找到私有仓库 `FlashVPN` 了。

**解决方式：**

将这两个仓库的 `https` 地址都改成 `https://<账号名>@github.com/<账号名>/<仓库名>.git/` 的形式。

已 `FalshVPN` 为例，编辑 `FalshVPN` 仓库下的 `.git/config` 文件，

将第 `9` 行的 `https://github.com/HarrietCeda/FlashVPN.git/` 改为 `https://HarrietCeda@github.com/HarrietCeda/FlashVPN.git`

```sh:no-line-numbers
zkqcom@zkqcomdeMac-mini FlashVPN % vim .git/config    
```

![](./images/dev-note/21.png)

于是，执行 `git push` 访问远程仓库时就会要求重新输入密码。

以同样的方式修改 `zengkaiqiang562` 账号下的 `JavaGuide` 仓库关联的远程 `GitHub` 仓库地址即可。

于是，在 `Mac` 的钥匙访问串中，就会为这两个 `GitHub` 账号分别生成对应的钥匙串项目，如下图所示：

![](./images/dev-note/22.png)

**通过 `Credential Helper` 保存密码**

可以通过 `Credential Helper` 保存 `Git` 仓库的密码，避免每次访问远程仓库时都要求输入密码。

以 `FlashVPN` 为例，执行如下指令：

```sh:no-line-numbers
zkqcom@zkqcomdeMac-mini FlashVPN % git config --local credential.helper store
zkqcom@zkqcomdeMac-mini FlashVPN % git config --local --list                 
...
user.name=HarrietCeda
user.email=HarrietCeda@outlook.com
credential.helper=store
zkqcom@zkqcomdeMac-mini FlashVPN % 
```

> 因为存在多个 `GitHub` 账号下的仓库，所以使用选项 `--local` 单独的为一个仓库进行配置。

设置了 `credential.helper=store` 之后，在执行 `git push` 命令访问远程仓库并输入密码后，就会把密码保存在 `~/.git-credentials` 文件中。

```sh:no-line-numbers
zkqcom@zkqcomdeMac-mini FlashVPN % cat ~/.git-credentials   
https://HarrietCeda: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@github.com
https://zengkaiqiang562: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@github.com
```

> 以上为 `HarrietCeda` 和 `zengkaiqiang562` 这两个账号保存了密码（密码就是 `token`，一个账号的所有仓库可以共用一个 `token` 作为密码）。

**注意：`Credential Helper` 保存多个账号的不同 `Token`，会导致 `Token` 被 `Github` 检测为不安全的，从而删除掉。**

## 17. `Adjust` 接入 & `Adjust` 事件跟踪

> 参考：[Adjust 开发文档](https://help.adjust.com/zh/article/get-started-android-sdk#set-up-environment)

**Step 1. 添加依赖包**

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

**Step 2. 添加权限**

```xml:no-line-numbers
/* AndroidManifest.xml */

<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```

**Step 3. 设置 `Proguard` 混淆**

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

**Step 4. 在 `Application` 中进行配置和初始化**

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

**Step 5. 事件跟踪**

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
