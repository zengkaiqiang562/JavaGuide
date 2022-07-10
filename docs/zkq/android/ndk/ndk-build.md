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

##### 1.2.1.2 `BUILD_EXECUTABLE`

##### 1.2.1.3 `BUILD_SHARED_LIBRARY`

##### 1.2.1.4 `BUILD_STATIC_LIBRARY`

##### 1.2.1.5 `PREBUILT_SHARED_LIBRARY`

##### 1.2.1.6 `PREBUILT_STATIC_LIBRARY`

## 2. `Application.mk`