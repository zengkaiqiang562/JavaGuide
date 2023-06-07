---
title: 远程打包方案
category: 
  - HNAP 
tag:
  - general 
---

> 参考：[远程打包方案示例代码](https://github.com/zengkaiqiang562/HNAP_VpnTemplate)

## 1. 项目结构介绍

![](./images/remote_pack/01.png)

### 1.1 `Module` 模块介绍

项目结构如上所示，至少需要三个 `Module`：

```:no-line-numbers
1. app：项目代码
2. buildSrc：Gralde 本地插件，提供各种属性和修改包路径结构
3. libconfig：封装 buildSrc 提供的各种属性，集中管理，方便维护
```

`Module` 模块中的文件结构如下：

![](./images/remote_pack/02.png)

**注意：跟默认结构不同的是，`main` 目录下多了 `debug` 目录，代码文件、资源文件、布局文件、`jni` 文件、混淆文件都放在了 `main/debug` 目录下。**

> 这样做的目的是为了区别正式环境的所有文件，因为正式环境的文件都会在 `Gradle Sync` 后生成在 `main/release` 目录下。

### 1.2 配置文件介绍

**一些重要的配置文件介绍如下：**

```:no-line-numbers
1. deploy.json：
    定义项目所需的属性，这些属性会在 buildSrc 插件中进行解析
    该文件不能提交到 git 仓库中

2. config.json：
    放置本地内置的全局配置数据
    该文件不能提交到 git 仓库中

3. app/google-services.json：
    集成 firebase 所需的文件
    注意：测试环境下，该文件并不是产品提供的，而是自己按内容格式胡乱定义的，目的只是为了在测试环境下集成 firebase 后能编译通过
    该文件不能提交到 git 仓库中

4. xxx.jks
    测试环境下的签名文件
    该文件不能提交到 git 仓库中

5. template.ovpn
    提供 vpn 证书信息，只有在 VPN 项目中才需提供这个文件
    注意：文件内容并不是完整的 ovpn 文件内容，而是截取从 <ca> 到文件结尾这部分的内容
```

### 1.3 `.gitinore` 中需要忽略的文件

`.gitignore` 文件内容如下：

> 注意：新项目一定要记得修改 `.gitignore` 文件，不要把测试环境相关的配置提交到 `git` 仓库中。

```:no-line-numbers
*.iml
.gradle/
.idea/
.DS_Store
build/
captures/
.externalNativeBuild/
.cxx/
local.properties
app/release/
config.json
deploy.json
*.jks
google-services.json
define.cmake
*/src/main/release/
```

## 2. 集成步骤

### 2.1 在项目中创建所需的配置文件

#### 2.1.1 创建 `deploy.json` 文件

```json:no-line-numbers
{
    "outputName": "vpn", // 声明 aab 文件的名称为：<outputName>-<versionName>-<versionCode>.aab
    "versionName": "1.0.0",
    "versionCode": 1,
  
    "zipwd": "123456", // 声明将 aab 文件压缩后得到的同名 zip 文件的解压密码
  
    "signPwd": "xxx", // 声明签名文件的密码
    "signPath": "xxx.jks", // 声明签名文件的路径

    "enableLog": true, // 是否打印日志（正式环境打包时需置为 false）
    // 是否允许 firebase 上传混淆映射文件 mapping.txt （测试环境置为 false，因为测试环境无法上传，会导致编译失败）
    "uploadMappingFile": false, 
    "debug": true, // 区分测试环境和正式环境：测试环境置为 true，正式环境置为 false。
  
    "debugPkgName": "com.template.vpn", // 声明测试包名
    "releasePkgName": "com.proxy.vpn", // 声明正式包名
    "debugLibPrefix": "com.template", // 声明测试环境下 lib 模块的包路径前缀
    "releaseLibPrefix": "com.proxy", // 声明正式环境下 lib 模块的包路径前缀
  
    "debugMainDir": "src/main/debug", // 声明测试环境下的 main 目录路径
    "releaseMainDir": "src/main/release",  // 声明正式环境下的 main 目录路径
  
    "facebookId": "222222222222222", // 声明 Facebook 的应用 id
    "facebookToken": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", // 声明 Facebook 的 token
    "adjustToken": "{YourAppToken}", // 声明 Adjust 的 token
    "admobId": "ca-app-pub-3940256099942544~3347511713", // 声明 Admob 的应用 id
  
    "urlPrivacy": "https://xxx/privacy", // 隐私协议 url
    "urlTerms": "https://xxx/term", // 服务条款 url
    "emailFeedback": "xxx@xxx.com", // 反馈邮箱
  
    "baseUrl": "http://baseUrl/", // 后台接口域名
    "pathConfig": "/pathConfig", // 请求全局配置的 path 路径
    "pathVpnNodeList": "/pathVpnNodeList", // vp 项目中请求 vps 列表的 path 路径
    "pathVpnNodeInfo": "/pathVpnNodeInfo",  // vp 项目中上报 vps 连接状态的 path 路径
  
    // 后台给的用于接口请求的签名字符串，如果不提供该属性，则会根据 jks 签名文件自动生成一个签名字符串
    "fixSign": "757vhrf9mbvustbwx6g1ex1otu68vn8o", 
    "ckey": "eSV1FDdfzDlDVQTU", // 后台给的用于接口请求的客户端 key
    "civ": "A", // 后台给的用于接口请求的客户端 iv
    "skey": "s9enGjjZm3yeGiZn", // 后台给的用于接口请求的服务端 key
    "siv": "A" // 后台给的用于接口请求的服务端 iv
}
```

#### 2.1.2 创建 `config.json` 文件

**注意：** `config.json` 文件中的内容建议只包含后台接口文档中的基本出参内的响应体部分。（这个跟自己在解析全局配置时的代码相关，请参考自己的代码确定是否需要导入完整的出参数据）

```json:no-line-numbers
{
  "strategies": [...],
  "ext_enable": true,
  "outerAds": [...],
  "load_duration": 10,
  "config_duration": 1,
  "country": "US"
}
```

#### 2.1.3 创建 `app/google-services.json` 文件

**注意：** 在测试环境中集成 firebase 时，需要提供 `google-services.json` 文件，否则无法编译通过。

而正式环境的 `google-services.json` 文件禁止在测试环境中出现，所以我们可以自己按照内容格式胡乱地定义内容数据，只要保证包名与测试报名对应上即可。

```json:no-line-numbers
{
  "project_info": {
    "project_number": "545454545454",
    "project_id": "abab-ababa",
    "storage_bucket": "abab-ababa.dfdfdfd.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:545454545454:android:ererererererererererer",
        "android_client_info": {
          "package_name": "com.template.vpn" // 对应测试包名
        }
      },
      "oauth_client": [
        {
          "client_id": "545454545454-asasasasasasasasasasasasasasasas.apps.googleusercontent.com",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "nbnbnbnbnbnbnbnbnbnbnbnbnbnbnbnbnbnbnbn"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": [
            {
              "client_id": "545454545454-asasasasasasasasasasasasasasasas.apps.googleusercontent.com",
              "client_type": 3
            }
          ]
        }
      }
    }
  ],
  "configuration_version": "1"
}
```

#### 2.1.4 创建 `xxx.jks` 签名文件

可以通过如下指令来创建 `jks` 文件，也可以通过 `AS` 来生成，放到项目根目录下即可。

```shell:no-line-numbers
keytool -genkey -keystore xxx.jks -alias xxx -keypass xxx -keyalg RSA -keysize 2048 -validity 36500 -storepass xxx
```

#### 2.1.5 创建 `template.ovpn` 证书文件

原始的 `.ovpn` 文件由各组长提供，根据各自的 `vpncore` 的封装不同，对 `.ovpn` 文件中内容的导入方式也不同。

本打包方案中是将 `.ovpn` 文件中的证书信息提取出来，经过加密处理后作为宏变量保存在 `native` 层中。

因此，在本打包方案中，`template.ovpn` 证书文件的内容只需截取原始的 `.ovpn` 文件中 `<ca>` 后面部分的内容，如下所示：

```:no-line-numbers
<ca>
-----BEGIN CERTIFICATE-----
xxx
-----END CERTIFICATE-----
</ca>
<cert>
-----BEGIN CERTIFICATE-----
xxx
-----END CERTIFICATE-----
</cert>
<key>
-----BEGIN PRIVATE KEY-----
xxx
-----END PRIVATE KEY-----
</key>
<tls-crypt>
#
# 2048 bit OpenVPN static key
#
-----BEGIN OpenVPN Static key V1-----
xxx
-----END OpenVPN Static key V1-----
</tls-crypt>
```

### 2.2 将 `buildSrc` 插件模块导入到项目中

![](./images/remote_pack/03.png)

```:no-line-numbers
DeployPlugin：
    自定义插件类，插件处理流程的入口

DeployExtension：
    自定义插件提供的扩展属性类（导入该插件的 Project 可以访问到这些扩展属性）

DeployLoader：
    处理一些数据，如：
    1. 根据 jks 文件生成签名字符串
    2. 对 config.json 中的本地内置全局配置数据进行压缩加密
    3. 对 template.ovpn 中的 VPN 证书进行压缩加密
    4. 将生成的签名字符串、压缩加密后的全局配置以及 VPN 证书写入到 cmake 文件中，作为宏变量给 Native 层使用

DeployAdapter：
    在 main/release 下生成正式环境下的代码，并修改包路径结构，以及文件中的包名
```

### 2.3 将 `libconfig` 配置模块导入到项目中

![](./images/remote_pack/04.png)

导入 `libconfig` 模块后，需要修改如下内容：

**1、修改 `build.gradle.kts` 文件（注释的部分）**

```kotlin:no-line-numbers
plugins {
    id("com.android.library")

    id("com.deploy.plugin") // 导入自定义插件 buildSrc
}

android {
    println("curLibPkgName=${deployExt.curLibPkgName}")
    namespace = deployExt.curLibPkgName // 库模块的包路径
    compileSdk = 32

    defaultConfig {
        minSdk = 21
        targetSdk = 32

        /* 将扩展属性添加到库模块的 BuildConfig 类中 */
        buildConfigField("boolean", "VPN_DEBUG", "${deployExt.debug}")
        buildConfigField("boolean", "ENABLE_LOG", "${deployExt.enableLog}")
        buildConfigField("boolean", "LIMIT_VPN", "${deployExt.limitVPN}")

        buildConfigField("String", "PROTOCOL_PRIVACY", "\"${deployExt.urlPrivacy}\"")
        buildConfigField("String", "PROTOCOL_SERVICE", "\"${deployExt.urlTerms}\"")
        buildConfigField("String", "FEEDBACK_EMAIL", "\"${deployExt.emailFeedback}\"")

        buildConfigField("String", "BASE_URL", "\"${deployExt.baseUrl}\"")
        buildConfigField("String", "PATH_CONFIG", "\"${deployExt.pathConfig}\"")
        buildConfigField("String", "PATH_VPN_NODE_LIST", "\"${deployExt.pathVpnNodeList}\"")
        buildConfigField("String", "PATH_VPN_NODE_INFO", "\"${deployExt.pathVpnNodeInfo}\"")

        buildConfigField("String", "PATH_LOCATION_1", "\"${deployExt.pathLocation1}\"")
        buildConfigField("String", "PATH_LOCATION_2", "\"${deployExt.pathLocation2}\"")
        buildConfigField("String", "PATH_LOCATION_3", "\"${deployExt.pathLocation3}\"")
        buildConfigField("String", "PATH_LOCATION_4", "\"${deployExt.pathLocation4}\"")

        /* 将扩展属性添加到库模块的资源文件 string.xml 中 */
        resValue("string", "facebook_id", deployExt.facebookId)
        resValue("string", "facebook_token", deployExt.facebookToken)
        resValue("string", "adjust_token", deployExt.adjustToken)
        resValue("string", "admob_id", deployExt.admobId)

        buildConfigField("String", "FACEBOOK_ID", "\"${deployExt.facebookId}\"")
        buildConfigField("String", "FACEBOOK_TOKEN", "\"${deployExt.facebookToken}\"")
        buildConfigField("String", "ADJUST_TOKEN", "\"${deployExt.adjustToken}\"")
    }

    buildTypes {
        release {
            // 混淆文件的路径从扩展属性中取
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), deployExt.proguardPath) 
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    sourceSets {
        getByName("main") {
            /* 因为需要区分测试环境(main/debug/)和正式环境(main/release/)的代码，所以需要修改项目文件的默认存放位置 */
            assets.srcDirs(deployExt.assetsPath)
            java.srcDirs(deployExt.javaPath)
            res.srcDirs(deployExt.resPath)
            manifest.srcFile(deployExt.manifestPath)
        }
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.4.2")
    implementation("com.google.android.material:material:1.6.1")
}
```

**2、修改 `AndroidManifest.xml` 文件**

一些需要在配置清单文件（``AndroidManifest.xml``）中配置的数据，请在 `libconfig` 模块的 `AndroidManifest.xml` 文件中配置。

```xml:no-line-numbers
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application>
        <!-- Facebook -->
        <meta-data
            android:name="com.facebook.sdk.ApplicationId"
            android:value="@string/facebook_id"/>

        <!-- Admob -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="@string/admob_id"/>
    </application>
</manifest>
```

**3. 修改 `LibConfig.java`**

`LibConfig` 类存在的目的是对 `BuildConfig` 的属性做一次封装，避免直接使用 `BuildConfig`。

因为在项目未编译时，`BuildConfig` 类是不存在的，此时无法访问到 `BuildConfig`，于是引用 `BuildConfig` 的地方都会报错。

因此，`LibConfig` 的作用主要就是让 `BuildConfig` 引起的报错都集中在一个地方，方便管理。

```java:no-line-numbers
package com.template.config;

public final class LibConfig {
    public static final boolean VPN_DEBUG = BuildConfig.VPN_DEBUG;
    public static final boolean ENABLE_LOG = BuildConfig.ENABLE_LOG;
    public static final boolean LIMIT_VPN = BuildConfig.LIMIT_VPN;

    public static final String PROTOCOL_PRIVACY = BuildConfig.PROTOCOL_PRIVACY;
    public static final String PROTOCOL_SERVICE = BuildConfig.PROTOCOL_SERVICE;
    public static final String FEEDBACK_EMAIL = BuildConfig.FEEDBACK_EMAIL;

    public static final String BASE_URL = BuildConfig.BASE_URL;
    public static final String PATH_CONFIG = BuildConfig.PATH_CONFIG;
    public static final String PATH_VPN_NODE_LIST = BuildConfig.PATH_VPN_NODE_LIST;
    public static final String PATH_VPN_NODE_INFO = BuildConfig.PATH_VPN_NODE_INFO;

    public static final String PATH_LOCATION_1 = BuildConfig.PATH_LOCATION_1;
    public static final String PATH_LOCATION_2 = BuildConfig.PATH_LOCATION_2;
    public static final String PATH_LOCATION_3 = BuildConfig.PATH_LOCATION_3;
    public static final String PATH_LOCATION_4 = BuildConfig.PATH_LOCATION_4;

    public static final String FACEBOOK_ID = BuildConfig.FACEBOOK_ID;
    public static final String FACEBOOK_TOKEN = BuildConfig.FACEBOOK_TOKEN;
    public static final String ADJUST_TOKEN = BuildConfig.ADJUST_TOKEN;
}
```

### 2.4 修改 `app` 模块的目录结构以及 `build.gradle.kts` 文件

![](./images/remote_pack/05.png)

为了区分正式环境的代码，需要将测试环境的代码以及资源文件、混淆文件、`AndroidManifest.xml` 文件都放到 `main/debug/` 目录下。

然后在 `build.gradle.kts` 中修改这些文件的默认存放位置：

```kotlin:no-line-numbers
import com.google.firebase.crashlytics.buildtools.gradle.CrashlyticsExtension

plugins {
    id("com.android.application")
    id("com.google.gms.google-services")  
    id("com.google.firebase.crashlytics") 

    id("com.deploy.plugin") // // 导入自定义插件 buildSrc
}

android {
    namespace = deployExt.curPkgName
    compileSdk = 32

    defaultConfig {
        /* 版本信息和包名从扩展属性中取 */
        applicationId = deployExt.curPkgName
        minSdk = 21
        targetSdk = 32
        versionCode = deployExt.versionCode
        versionName = deployExt.versionName

        externalNativeBuild {
            ndk {
                abiFilters += listOf(/*"x86", "x86_64",*/ "armeabi-v7a", "arm64-v8a")
            }
        }
    }

    signingConfigs {
        register("release") {
            /* 签名信息从扩展属性中取 */
            enableV1Signing = true
            enableV2Signing = true
            keyAlias = deployExt.signPwd
            keyPassword = deployExt.signPwd
            storePassword = deployExt.signPwd
            storeFile = rootProject.file(deployExt.signPath)

            println("storeFile=${storeFile?.absolutePath}")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            // 混淆文件的路径从扩展属性中取
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), deployExt.proguardPath)

            configure<CrashlyticsExtension> {
                // 是否上传混淆映射文件到 firebase（测试环境下不上传，因为 google-services.json 文件是乱写的，会上传失败）
                mappingFileUploadEnabled = deployExt.uploadMappingFile
            }

            ndk {
                debugSymbolLevel = "none"
            }

            signingConfig = signingConfigs.getByName("release")
        }
    }

    sourceSets {
        getByName("main") {
            /* 修改项目文件的默认存放位置 */
            assets.srcDirs(deployExt.assetsPath)
            java.srcDirs(deployExt.javaPath)
            res.srcDirs(deployExt.resPath)
            manifest.srcFile(deployExt.manifestPath)
        }
    }

    externalNativeBuild {
        cmake {
            path(deployExt.cmakePath) // cmake 文件的路径从扩展属性中取
            version = "3.18.1"
        }
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    bundle {
        abi { enableSplit = false }
    }

    packagingOptions {
        jniLibs {
            useLegacyPackaging = true
        }
    }

    dataBinding {
        enable = true
    }
}

dependencies {
    ...
    implementation(project(":libconfig")) // app 模块需要依赖 libconfig 模块
    ...
}
```

### 2.5 项目编译

**Step1：** 根据测试环境和正式环境的不同，修改如下内容：

1. 修改 `config.json`
2. 修改 `deploy.json`
3. 正式环境下替换产品给的 `app/google-services.json`
4. 正式环境下替换远程打包服务器上生成的 `jks` 签名文件

**Step2：** 执行 `build` -> `Clean Project` 清理下项目，此时会把之前生成的 `main/release` 下的正式环境的代码都删除掉。

**Step3：** 执行 `Gralde Sync`，此时会根据当前的 `main/debug` 下的代码在 `main/release` 下生成正式环境的代码

**Step4：** 编译项目或打 `aab` 包

## 3. 注意事项

1. 将 `aab` 包压缩成 `zip` 文件，需要用到 `7z` 压缩软件，且该打包方案的压缩程序只适配了 `windows` 系统的命令格式。所以只会在远程打包服务器上生成 `zip` 压缩文件。

    > `windows` 系统中需安装 `7z` 压缩软件，并将 `7z.exe` 添加到环境变量后，再打开 `AS`，才能生成 `zip` 文件。