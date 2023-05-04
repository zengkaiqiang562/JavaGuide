---
title: 开发笔记
category: 
  - HNAP 
tag:
  - HNAP 
---

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


