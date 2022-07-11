---
title: ndk-build（Makefile）（TODO）
category: 
  - android-ndk
tag:
  - android-ndk
---

`ndk-build` 通过 `Makefile` 脚本构建原生库项目。

`ndk-build` 使用 `Android.mk` 和 `Application.mk` 这两个构建文件来配置原生库项目。

## 1. `Android.mk`

`Android.mk` 文件一般放在模块的 `jni/` 目录下，用于向 `NDK` 构建系统描述源文件和共享库。

> `jni/` 目录可用来存放构建原生库所需的源文件、头文件、`Android.mk` 文件。
> 
> `jni/` 目录的默认路径是 `src/main/jni/`。可以在 `build.gradle` 中通过 `jni.srcDirs` 属性进行修改：
>
> ```groovy:no-line-numbers
> android {
>     ...
>     sourceSets.main {
>         jni.srcDirs 'src/main/jni_src' // 指定存放 C/C++ 源码的目录为 app/src/main/jni_src
>     }
> }
> ```

`Android.mk` 文件实际上是一个微小的 `GNU makefile` 片段，构建系统会对 `Android.mk` 解析一次或多次。

通过 `Android.mk` 文件，可以将 `jni/` 目录下的源文件分组为多个模块（`Module`）。一个模块的构建产物可以一个静态库；或一个共享库（`so` 动态库）；或一个独立的可执行文件。

> 注意：
> 
> 1. `Android.mk` 中可以定义一个或多个模块；
>    
> 2. `Android.mk` 中定义的不同模块中可以使用同一个源文件。
>    
> 3. `NDK` 构建系统只会将构建生成的共享库（`so` 动态库）放入到 `apk` 文件中。
>    
> 4. 静态库可生成共享库，即可以在 `Android.mk` 中对一个构建生成共享库的模块进行配置，向模块中导入静态库，于是静态库就会参与共享库的构建，达到将静态库转换成共享库的目的。

### 1.1 `Android.mk` 的基本配置

> 参考：示例代码 [hello-jni](https://github.com/android/ndk-samples/blob/android-mk/hello-jni/jni/Android.mk)

```makefile:no-line-numbers
LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE    := hello-jni
LOCAL_SRC_FILES := hello-jni.c

include $(BUILD_SHARED_LIBRARY)
```

如上配置示例所示，其中：

1. `LOCAL_PATH := $(call my-dir)`

    ```:no-line-numbers
    1. Android.mk 中必须先定义 LOCAL_PATH 变量
    2. 这里通过 LOCAL_PATH 变量来表示源文件在原生库项目中的位置。
       其中，my-dir 是 NDK 构建系统提供的宏函数，该函数返回当前目录的路径（即当前 Android.mk 文件所在的路径）
    ```

2. `include $(CLEAR_VARS)`

    ```:no-line-numbers
    1. include $(CLEAR_VARS) 表示声明 CLEAR_VARS 变量，该变量的值由 NDK 构建系统提供。
    2. CLEAR_VARS 变量指向一个特殊的 GNU Makefile 脚本，这个特殊的 GNU Makefile 脚本会清除许多 LOCAL_XXX 变量，
       例如 LOCAL_MODULE、LOCAL_SRC_FILES 和 LOCAL_STATIC_LIBRARIES。
    3. 注意：CLEAR_VARS 变量指向的特殊 GNU Makefile 脚本不会清除 LOCAL_PATH。
    4. 如果 Android.mk 中定义了多个模块，那么在定义的每个模块之前，
       都必须先调用 include $(CLEAR_VARS) 对 CLEAR_VARS 变量进行声明。
    ```

3. `LOCAL_MODULE := hello-jni`

    ```:no-line-numbers
    1. 通过 LOCAL_MODULE 变量声明要构建的模块名。
       如果 Android.mk 中定义了多个模块，那么每个模块中都需要设置一次 LOCAL_MODULE 变量，为不同的模块声明不同的模块名
    2. 对于用来构建共享库的模块，NDK 构建系统默认会为 LOCAL_MODULE 变量声明的模块名添加前缀 "lib" 和后缀 ".so"，
       如，会根据 LOCAL_MODULE := hello-jni 构建出共享库 libhello-jni.so 文件
       注意：如果 LOCAL_MODULE 变量声明的模块名以 "lib" 开头，那么构建系统就不会再添加前缀 "lib"
    ```

4. `LOCAL_SRC_FILES := hello-jni.c`

    ```:no-line-numbers
    1. 通过 LOCAL_SRC_FILES 变量声明构建所需的所有源文件。（多个源文件以空格分隔开来）
    ```

5. `include $(BUILD_SHARED_LIBRARY)`

    ```:no-line-numbers
    1. include $(BUILD_SHARED_LIBRARY) 表示声明 BUILD_SHARED_LIBRARY 变量，该变量的值由 NDK 构建系统提供。
    2. BUILD_SHARED_LIBRARY 变量指向一个 GNU Makefile 脚本，
       该脚本会收集 include $(CLEAR_VARS) 之后的在 LOCAL_XXX 变量中声明的所有信息，
       并确定如何根据 LOCAL_SRC_FILES 变量中列出的源文件构建共享库。
    ```

### 1.2 `Android.mk` 中使用的变量和宏

`NDK` 构建系统提供许多可在 `Android.mk` 文件中使用的变量。其中部分变量已预先赋值。另一些变量在 `Android.mk` 中由我们自己赋值。

除了 `NDK` 构建系统已提供的变量之外，还可以在 `Android.mk` 中自定义变量。

由于 `NDK` 构建系统保留了下列变量名称：

1. 以 `LOCAL_` 开头的名称，例如 `LOCAL_MODULE`。
2. 以 `PRIVATE_`、`NDK_` 或 `APP` 开头的名称。构建系统在内部使用这些变量名。
3. 小写名称，例如 `my-dir`。构建系统也是在内部使用这些变量名。
   
所以在 `Android.mk` 中自定义变量时，建议在名称前附加 `MY_`。

#### 1.2.1 NDK 构建系统定义的 `include` 相关的变量

##### 1.2.1.1 `CLEAR_VARS`

使用语法：

```makefile:no-line-numbers
include $(CLEAR_VARS)
```

```:no-line-numbers
1. include $(CLEAR_VARS) 表示声明 CLEAR_VARS 变量，该变量的值由 NDK 构建系统提供。
2. CLEAR_VARS 变量指向一个特殊的 GNU Makefile 脚本，这个特殊的 GNU Makefile 脚本会清除许多 LOCAL_XXX 变量，
   例如 LOCAL_MODULE、LOCAL_SRC_FILES 和 LOCAL_STATIC_LIBRARIES。
3. 注意：CLEAR_VARS 变量指向的特殊 GNU Makefile 脚本不会清除 LOCAL_PATH。
4. 如果 Android.mk 中定义了多个模块，那么在定义的每个模块之前，
   都必须先调用 include $(CLEAR_VARS) 对 CLEAR_VARS 变量进行声明。
```

##### 1.2.1.2 `BUILD_EXECUTABLE`

使用语法：

```makefile:no-line-numbers
include $(BUILD_EXECUTABLE)
```

```:no-line-numbers
1. include $(BUILD_EXECUTABLE) 表示声明 BUILD_EXECUTABLE 变量，该变量的值由 NDK 构建系统提供。
2. BUILD_EXECUTABLE 变量指向一个 GNU Makefile 脚本，
   该脚本会收集 include $(CLEAR_VARS) 之后的在 LOCAL_XXX 变量中声明的所有信息，
   并确定如何根据 LOCAL_SRC_FILES 变量中列出的源文件构建可执行文件。
3. 执行 BUILD_EXECUTABLE 变量指向的 GNU Makefile 脚本之前，
   要求至少已经为 LOCAL_MODULE 和 LOCAL_SRC_FILES 变量赋值
```

##### 1.2.1.3 `BUILD_SHARED_LIBRARY`

使用语法：

```makefile:no-line-numbers
include $(BUILD_SHARED_LIBRARY)
```

```:no-line-numbers
1. include $(BUILD_SHARED_LIBRARY) 表示声明 BUILD_SHARED_LIBRARY 变量，该变量的值由 NDK 构建系统提供。
2. BUILD_SHARED_LIBRARY 变量指向一个 GNU Makefile 脚本，
   该脚本会收集 include $(CLEAR_VARS) 之后的在 LOCAL_XXX 变量中声明的所有信息，
   并确定如何根据 LOCAL_SRC_FILES 变量中列出的源文件构建共享库（即构建生成后缀为 .so 的动态库文件）。
3. 执行 BUILD_SHARED_LIBRARY 变量指向的 GNU Makefile 脚本之前，
   要求至少已经为 LOCAL_MODULE 和 LOCAL_SRC_FILES 变量赋值
4. NDK 构建系统默认会将生成的 so 动态库文件打包到 apk 文件中
```

##### 1.2.1.4 `BUILD_STATIC_LIBRARY`

使用语法：

```makefile:no-line-numbers
include $(BUILD_STATIC_LIBRARY)
```

```:no-line-numbers
1. include $(BUILD_STATIC_LIBRARY) 表示声明 BUILD_STATIC_LIBRARY 变量，该变量的值由 NDK 构建系统提供。
2. BUILD_STATIC_LIBRARY 变量指向一个 GNU Makefile 脚本，
   该脚本会收集 include $(CLEAR_VARS) 之后的在 LOCAL_XXX 变量中声明的所有信息，
   并确定如何根据 LOCAL_SRC_FILES 变量中列出的源文件构建静态库（即构建生产后缀为 .a 的库文件）。
3. 执行 BUILD_STATIC_LIBRARY 变量指向的 GNU Makefile 脚本之前，
   要求至少已经为 LOCAL_MODULE 和 LOCAL_SRC_FILES 变量赋值
4. NDK 构建系统不会将 .a 静态库文件打包到 apk 文件中。
   如果想让使用静态库，可以通过预构建库的方式将静态库转换成动态库。
```

##### 1.2.1.5 `PREBUILT_SHARED_LIBRARY`

使用语法：

```makefile:no-line-numbers
include $(PREBUILT_SHARED_LIBRARY)
```

```:no-line-numbers
1. PREBUILT_SHARED_LIBRARY 变量指向的 GNU Makefile 脚本用于生成预构建共享库（so 动态库）
2. 与 BUILD_SHARED_LIBRARY 不同的是，PREBUILT_SHARED_LIBRARY 指向的 GNU Makefile 脚本所收集的 
   LOCAL_SRC_FILES 变量中的信息不能是源文件，而必须是指向预构建共享库的单一路径，如 foo/libfoo.so

注意：对于第三方提供的共享库，应该先将其路径赋给 LOCAL_SRC_FILES 变量，
      然后通过 include $(PREBUILT_SHARED_LIBRARY) 封装成预构建共享库模块，
      最后在依赖第三方共享库的其他模块中，将第三方共享库对于的预构建共享库模块的名称赋给 LOCAL_SHARED_LIBRARIES 变量。
```

##### 1.2.1.6 `PREBUILT_STATIC_LIBRARY`

使用语法：

```makefile:no-line-numbers
include $(PREBUILT_STATIC_LIBRARY)
```

```:no-line-numbers
1. PREBUILT_STATIC_LIBRARY 变量指向的 GNU Makefile 脚本用于生成预构建静态库
2. 与 BUILD_STATIC_LIBRARY 不同的是，PREBUILT_STATIC_LIBRARY 指向的 GNU Makefile 脚本所收集的 
   LOCAL_SRC_FILES 变量中的信息不能是源文件，而必须是指向预构建静态库的单一路径，如 foo/libfoo.a

注意：对于第三方提供的静态库，应该先将其路径赋给 LOCAL_SRC_FILES 变量，
      然后通过 include $(PREBUILT_STATIC_LIBRARY) 封装成预构建静态库模块，
      最后在依赖第三方静态库的其他模块中，将第三方静态库对于的预构建静态库模块的名称赋给 LOCAL_STATIC_LIBRARIES 变量。
```

#### 1.2.2 `NDK` 构建系统定义的模块构建产物相关的变量

##### 1.2.2.1 `CPU` 架构 & `ABI`

不同的 `Android` 设备可能采用不同的 `CPU` 架构。不同的 `CPU` 架构支持不同的指令集。不同的指令集对应不同的 `ABI`（`Application Binary Interface`，应用程序二进制接口）。

也就是说，若 `CPU` 架构不同，则 `ABI` 不同。于是，**我们通常用 `ABI` 表示不同的 `CPU` 架构**。

常见的 `CPU` 架构和 `ABI` 的对应关系如下：

|`CPU` 架构|`ABI`|
|:-|:-|
|`ARMv5`|`armeabi`|
|`ARMv7`|`armeabi-v7a`|
|`ARMv8 AArch64`|`arm64-v8a`|
|`i686`|`x86`|
|`x86-64`|`x86_64`|

> 其中：
> 1. `ARMv5` 是 `32` 位的 `ARM` 架构
> 2. `ARMv7` 是 `32` 位的 `ARM` 架构
> 3. `ARMv8` 是 `64` 位的 `ARM` 架构
> 4. `i686` 是 `32` 位的 `x86` 架构
> 5. `x86-64` 是 `64` 位的 `x86` 架构
> 
> 注意：
> 1. `armeabi` 和 `armeabi-v7a` 都是 `32` 位 `ARM` 架构下的 `ABI`。其中 `armeabi` 是相当老旧的一个版本，缺少对浮点数计算的硬件支持，在需要大量计算时有性能瓶颈。`armeabi-v7a` 是替代 `armeabi` 的主流版本。且 `armeabi-v7a` 向下兼容 `armeabi`。
> 2. `arm64-v8a` 是 `64` 位 `ARM` 架构下的 `ABI`。且 `arm64-v8a` 向下兼容 `armeabi-v7a` 和 `armeabi`。

在 `Application.mk` 文件中，可以通过 `APP_ABI` 变量声明 `Android.mk` 中所定义模块的构建产物支持的 `ABI`（即 `CPU` 架构）。

通过 `APP_ABI` 变量可以同时声明多个支持的 `ABI`，此时针对每个 `ABI` 都会对 `Android.mk` 文件解析一次，且每次解析时 `Android.mk` 文件中跟模块构建产物相关的变量的取值都不相同。

##### 1.2.2.2 `TARGET_ARCH`

##### 1.2.2.3 `TARGET_PLATFORM`

##### 1.2.2.4 `TARGET_ARCH_ABI`

##### 1.2.2.5 `TARGET_ABI`

### 1.3 预构建库

预构建库就是指为了将第三方静态库文件或共享库文件添加到使用这些库文件的其他模块中，而将这些第三方库文件预先声明在某模块中，这个用于声明第三方库文件的模块就是预构建库模块。

使用预构建库的流程如下：

1. 声明预构建库模块

   ```makefile:no-line-numbers
   LOCAL_PATH := $(call my-dir)

   include $(CLEAR_VARS)
   LOCAL_MODULE := foo-prebuilt
   LOCAL_SRC_FILES := libfoo.so
   include $(PREBUILT_SHARED_LIBRARY)
   ```

   ```:no-line-numbers
   注意：
   1. 通过 LOCAL_SRC_FILES 变量引入第三方库文件路径。
      （库文件路径可以是相对于 LOCAL_PATH 的相对路径，即当前 Android.mk 所在目录的相对路径）
   2. 第三方库文件所支持的 CPU 平台架构，必须跟使用这些库文件的其他模块所生成的构建产物的 CPU 平台架构相同。
   3. 如果第三方库文件是静态库文件，那么通过 PREBUILT_STATIC_LIBRARY 声明预构建库模块；
      如果第三方库文件是共享库文件，那么通过 PREBUILT_SHARED_LIBRARY 声明预构建库模块
   ```

2. 将预构建库模块引入到使用预构建库的其他模块中

    ```makefile:no-line-numbers
    include $(CLEAR_VARS)
    LOCAL_MODULE := foo-user
    LOCAL_SRC_FILES := foo-user.c
    LOCAL_SHARED_LIBRARIES := foo-prebuilt # 引入第三方库文件对应的预构建库模块的模块名
    include $(BUILD_SHARED_LIBRARY)
    ```

    ```:no-line-numbers
    注意：
    1. 在使用第三方库文件的其他模块中，通过变量 LOCAL_SHARED_LIBRARIES 或 LOCAL_STATIC_LIBRARIES 
       引入第三方库文件对应的预构建库模块的模块名。
       （若预构建库模块是通过 PREBUILT_SHARED_LIBRARY 声明，则通过变量 LOCAL_SHARED_LIBRARIES 引入）
       （若预构建库模块是通过 PREBUILT_STATIC_LIBRARY 声明，则通过变量 LOCAL_STATIC_LIBRARIES 引入）
    ```

#### 1.3.1 导出预构建库的头文件

通常，第三方在提供库文件时，还会提供对应的暴露给外部调用的头文件。

此时，在声明预构建库模块时可以通过变量 `LOCAL_EXPORT_C_INCLUDES` 声明头文件的路径：

```makefile:no-line-numbers
include $(CLEAR_VARS)
LOCAL_MODULE := foo-prebuilt
LOCAL_SRC_FILES := libfoo.so
LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/include # 声明第三库文件对应的头文件路径
include $(PREBUILT_SHARED_LIBRARY)
```

于是，在使用预构建库的其他模块中，可以通过变量 `LOCAL_C_INCLUDES` 引入声明的头文件路径。

## 2. `Application.mk`