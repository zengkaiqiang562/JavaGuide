---
title: 远程打包方案
category: 
  - HNAP 
tag:
  - general 
---

> 参考：[远程打包方案示例代码](https://github.com/zengkaiqiang562/HNAP_VpnTemplate)

## 1. 项目文件结构介绍

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

## 2. 快速集成步骤

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

### 2.3 将 `libconfig` 配置模块导入到项目中

### 2.4 修改 `app` 模块的目录结构以及 `build.gradle` 文件
