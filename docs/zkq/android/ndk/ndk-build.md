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

> 参考：[Android.mk](https://developer.android.google.cn/ndk/guides/android_mk?hl=zh-cn)

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

```:no-line-numbers
TARGET_ARCH 变量用来表示不同的 CPU 系列。取值可以是：arm、arm64、x86 或 x86_64
（不同的 ABI 对应不同的 CPU 架构，不同的 CPU 架构可能属于不同的 CPU 系列）
在每次解析 Android.mk 文件时，NDK 构建系统会根据 ABI 的不同为 TARGET_ARCH 变量设置不同的值。
```

`CPU` 架构、`ABI`、`CPU` 系列的对应关系如下（个人理解，可能有误）：

|`CPU` 架构|`ABI`|`CPU` 系列|
|:-|:-|:-|
|`ARMv5`|`armeabi`|`arm`|
|`ARMv7`|`armeabi-v7a`|`arm`|
|`ARMv8 AArch64`|`arm64-v8a`|`arm64`|
|`i686`|`x86`|`x86`|
|`x86-64`|`x86_64`|`x86_64`|

##### 1.2.2.3 `TARGET_PLATFORM`

```:no-line-numbers
TARGET_PLATFORM 变量用来表示不同的 Android 版本号。取值为 "android-<API Level>"
如，Android 5.1 系统版本 的 API Level 为 22，于是 TARGET_PLATFORM 变量取值为 android-22
```

示例：

```makefile::no-line-numbers
ifeq ($(TARGET_PLATFORM), android-22)
    # ... do something ...
endif
```

##### 1.2.2.4 `TARGET_ARCH_ABI`

```:no-line-numbers
TARGET_ARCH_ABI 变量用来表示不同的 ABI。取值为：armeabi、armeabi-v7a、arm64-v8a、x86、x86_64
在每次解析 Android.mk 文件时，NDK 构建系统会根据 ABI 的不同为 TARGET_ARCH_ABI 变量设置不同的值。
```

示例：

```makefile::no-line-numbers
ifeq ($(TARGET_ARCH_ABI),arm64-v8a)
  # ... do something ...
endif
```

##### 1.2.2.5 `TARGET_ABI`

```:no-line-numbers
TARGET_ABI 变量的取值是 TARGET_PLATFORM 和 TARGET_ARCH_ABI 变量值的组合，
即 TARGET_ABI 变量用来表示当前解析 Android.mk 时使用的 Android 系统版本和 ABI
```

示例：

```makefile::no-line-numbers
ifeq ($(TARGET_ABI),android-22-arm64-v8a)
  # ... do something ...
endif
```

#### 1.2.3 `NDK` 构建系统定义的描述模块的变量

##### 1.2.3.1 `Android.mk` 中描述（定义）模块的基本流程

`Android.mk` 中可以定义多个模块，每个模块在定义时的描述流程如下：

1. 先调用 `include $(CLEAR_VARS)` 初始化描述模块的变量（即清除掉描述模块的变量中已存储的值）

    > 注意：`include $(CLEAR_VARS)` 不会清除掉 `LOCAL_PATH` 变量值。

2. 为形如` LOCAL_XXX` 这样的用于描述模块的多个变量赋值，以实现对所定义模块的描述。

3. 调用形如 `include $(BUILD_XXX)` 或 `include $(PREBUILT_XXX)` 所指向的 `GUN makefile` 脚本对所定义的模块进行构建。

##### 1.2.3.2 `LOCAL_PATH`

此变量用于指定当前文件的路径。必须在 `Android.mk` 文件开头定义此变量。以下示例演示了如何定义此变量：

```makefile::no-line-numbers
LOCAL_PATH := $(call my-dir)
```

`CLEAR_VARS` 所指向的脚本不会清除此变量。因此，即使 `Android.mk` 文件描述了多个模块，您也只需定义此变量一次。

##### 1.2.3.3 `LOCAL_MODULE`

此变量用于存储模块名称。指定的名称在所有模块名称中必须唯一，并且不得包含任何空格。

您必须先定义该名称，然后才能添加任何脚本（`CLEAR_VARS` 的脚本除外）。

无需添加 `lib` 前缀或 `.so` 或 `.a` 文件扩展名；构建系统会自动执行这些修改。

例如，以下行会导致生成名为 `libfoo.so` 的共享库模块：

```makefile::no-line-numbers
LOCAL_MODULE := "foo"
```

如果不想让模块构建的库文件以 `lib<Module_Name>` 命名，则可以使用 `LOCAL_MODULE_FILENAME` 变量指定其他的库文件名。

##### 1.2.3.4 `LOCAL_MODULE_FILENAME`

`LOCAL_MODULE_FILENAME` 为可选变量，显示指定模块构建生成的库文件名。

示例：

```makefile::no-line-numbers
# 此时，模块构建生成的库文件名不是 libfoo.so，而是 libnewfoo.so
LOCAL_MODULE := foo
LOCAL_MODULE_FILENAME := libnewfoo
...
include $(BUILD_SHARED_LIBRARY)
```

> 注意：`LOCAL_MODULE_FILENAME` 变量无法指定库文件名的后缀，以及库文件的生成路径

##### 1.2.3.5 `LOCAL_SRC_FILES`

指定构建模块时所需的所有源文件。

只需要列出构建系统实际传递到编译器的文件，因为构建系统会自动计算所有相关的依赖项。

注意：可以使用相对（相对于 `LOCAL_PATH`）和绝对文件路径。

##### 1.2.3.6 `LOCAL_CPP_EXTENSION`

可选变量，用于指定可识别的 `C++` 源文件的后缀名。

示例：

```makefile::no-line-numbers
# 构建系统只能识别后缀为 ".cxx" 的 C++ 源文件
LOCAL_CPP_EXTENSION := .cxx
```

```makefile::no-line-numbers
# 构建系统只能识别后缀为 ".cxx"、".cpp"、".cc" 的 C++ 源文件
LOCAL_CPP_EXTENSION := .cxx .cpp .cc
```

##### 1.2.3.7 `LOCAL_CPP_FEATURES`

指定构建模块时所支持的 `C++` 功能特征

示例：

```makefile::no-line-numbers
# 指定 C++ 源代码中支持使用 RTTI（运行时类型信息）
LOCAL_CPP_FEATURES := rtti
```

```makefile::no-line-numbers
# 指定 C++ 源代码中支持使用 C++ 异常
LOCAL_CPP_FEATURES := exceptions
```

```makefile::no-line-numbers
# 同时指定多个 C++ 功能特征时，用空格分隔
LOCAL_CPP_FEATURES := rtti exceptions
```

> 注意：通过在 `LOCAL_CPPFLAGS` 变量中设置 `-frtti` 和 `-fexceptions` 也可以达到同样的效果。区别是：
> 1. `LOCAL_CPP_FEATURES` 变量可让构建系统对每个模块使用适当的标记。
> 2. `LOCAL_CPPFLAGS` 变量会导致编译器将所有指定的标记用于所有模块，而不管实际需求如何。

##### 1.2.3.8 `LOCAL_C_INCLUDES`

您可使用此可选变量指定相对于 `NDK root` 目录的路径列表，以便在编译所有源文件（`C`、`C++` 和 `Assembly`）时添加到 `include` 搜索路径中。

示例：

```makefile::no-line-numbers
# 相对于 NDK root 目录的路径列表
LOCAL_C_INCLUDES := sources/foo
```

```makefile::no-line-numbers
# 相对于当前 Android.mk 文件所在目录的路径列表
LOCAL_C_INCLUDES := $(LOCAL_PATH)/<subdirectory>/foo
```

> 注意：
> 1. 如果另外还通过了 `LOCAL_CFLAGS` 或 `LOCAL_CPPFLAGS` 变量设置了 `include` 搜素路径（`-I<path>`），那么应该在设置 `LOCAL_CFLAGS` 或 `LOCAL_CPPFLAGS` 变量之前，先设置 `LOCAL_C_INCLUDES` 变量。
> 2. 在使用 `ndk-gdb` 启动原生调试时，构建系统也会自动使用 `LOCAL_C_INCLUDES` 路径。

##### 1.2.3.9 `LOCAL_CFLAGS`

此可选变量用于设置在构建 `C` 和 `C++` 源文件时构建系统要传递的编译器标记。

这样，您就可以指定额外的宏定义或编译选项。

> 可以使用 `LOCAL_CPPFLAGS` 仅为 `C++` 指定标记。

示例：

```makefile::no-line-numbers
# 指定额外的 include 路径，
# 但最好使用 LOCAL_C_INCLUDES，因为 LOCAL_C_INCLUDES 指定的 include 路径还可用于 ndk-gdb 原生调试
LOCAL_CFLAGS += -I<path>,
```

##### 1.2.3.10 `LOCAL_CPPFLAGS`

只构建 `C++` 源文件时将传递的一组可选编译器标记。

`LOCAL_CPPFLAGS` 设置的标记出现在编译器命令行中的 `LOCAL_CFLAGS` 后面。

> 注意：如果要同时为 `C` 和 `C++` 指定标记，那么使用 `LOCAL_CFLAGS` 。

##### 1.2.3.11 `LOCAL_STATIC_LIBRARIES`

指定构建当前模块时所依赖的静态库模块列表。

如果当前模块是共享库或可执行文件，此变量将强制这些库链接到生成的二进制文件。

如果当前模块是静态库，此变量只是指出依赖于当前模块的其他模块也会依赖于列出的库。

##### 1.2.3.12 `LOCAL_SHARED_LIBRARIES`

指定构建当前模块时所依赖的共享库模块列表。

此变量将强制这些库链接到生成的二进制文件。

##### 1.2.3.13 `LOCAL_WHOLE_STATIC_LIBRARIES`

此变量是 `LOCAL_STATIC_LIBRARIES` 的变体，表示链接器应将相关的库模块视为完整归档。

> 如需详细了解完整归档，请参阅有关 `--whole-archive` 标记的 [GNU Id 文档](http://ftp.gnu.org/old-gnu/Manuals/ld-2.9.1/html_node/ld_3.html)

多个静态库之间存在循环依赖关系时，此变量十分有用。

使用此变量构建共享库文件时，它将强制构建系统将静态库中的所有对象文件添加到最终二进制文件。

但是，使用此变量构建可执行文件时不会发生这种情况。

##### 1.2.3.14 `LOCAL_LDLIBS`

此变量列出了在构建共享库或可执行文件时使用的额外链接器标记。

利用此变量，您可使用 `-l` 前缀传递特定系统库的名称。

示例：

```makefile::no-line-numbers
# 在构建当前模块的加载过程中，指示链接器链接到 /system/lib/libz.so 库。
LOCAL_LDLIBS := -lz
```

> 如需查看可以链接的公开系统库列表，请参阅 [原生 API](https://developer.android.google.cn/ndk/guides/stable_apis?hl=zh-cn)。

> 注意：如果当前构建的模块用于生成静态库，那么构建系统会忽略此变量，并且 `ndk-build` 显示一则警告。

##### 1.2.3.15 `LOCAL_LDFLAGS`

此变量列出了构建系统在构建共享库或可执行文件时使用的其他链接器标记。

示例：

```makefile::no-line-numbers
# 若要在 ARM/X86 上使用 ld.bfd 链接器，则需配置以下链接器标记
LOCAL_LDFLAGS += -fuse-ld=bfd
```

> 注意：如果当前构建的模块用于生成静态库，那么构建系统会忽略此变量，并且 `ndk-build` 显示一则警告。

##### 1.2.3.16 `LOCAL_ALLOW_UNDEFINED_SYMBOLS`

默认情况下，如果构建系统在尝试构建共享库时遇到未定义的引用，将会抛出 “未定义的符号” 错误。

> 根据抛出 “未定义的符号” 错误可帮助您捕获源代码中的错误。

如需停用此检查（即不抛出 “未定义的符号” 错误），请将 `LOCAL_ALLOW_UNDEFINED_SYMBOLS` 变量设置为 `true`。

> 请注意，将 `LOCAL_ALLOW_UNDEFINED_SYMBOLS` 变量设置为 `true` 可能会导致共享库在运行时加载。

> 注意：如果当前构建的模块用于生成静态库，那么构建系统会忽略此变量，并且 `ndk-build` 显示一则警告。

##### 1.2.3.17 `LOCAL_ARM_MODE`

默认情况下，构建系统会以 `thumb` 模式生成 `ARM` 目标二进制文件，其中每条指令都是 `16` 位宽，并与 `thumb/` 目录中的 `STL` 库链接。

将此变量定义为 `arm` 会强制构建系统以 `32` 位 `arm` 模式生成模块的对象文件。以下示例演示了如何执行此操作：

```makefile::no-line-numbers
LOCAL_ARM_MODE := arm
```

您也可以对源文件名附加 `.arm` 后缀，指示构建系统仅以 `arm` 模式构建特定的源文件。例如，以下示例指示构建系统始终以 `ARM` 模式编译 `bar.c`，但根据 `LOCAL_ARM_MODE` 的值构建 `foo.c`。

```makefile::no-line-numbers
LOCAL_SRC_FILES := foo.c bar.c.arm
```

> 注意：
> 
> 您也可以在 `Application.mk` 文件中将 `APP_OPTIM` 设置为 `debug`，强制构建系统生成 `ARM` 二进制文件。
> 
> 指定 `debug` 会强制构建 `ARM`，因为工具链调试程序无法正确处理 `Thumb` 代码。

##### 1.2.3.18 `LOCAL_ARM_NEON`

此变量仅在以 `armeabi-v7a` `ABI` 为目标时才有意义。它允许在 `C` 和 `C++` 源文件中使用 `ARM Advanced SIMD (NEON)` 编译器内建函数，以及在 `Assembly` 文件中使用 `NEON` 指令。

> 请注意，并非所有基于 `ARMv7` 的 `CPU` 都支持 `NEON` 扩展指令集。因此，必须执行运行时检测，以便在运行时安全地使用此代码。如需了解详情，请参阅 [Neon 支持](https://developer.android.google.cn/ndk/guides/cpu-arm-neon?hl=zh-cn) 和 [CPU 功能](https://developer.android.google.cn/ndk/guides/cpu-features?hl=zh-cn)。

此外，您也可以使用 `.neon` 后缀，指定构建系统仅以 `NEON` 支持来编译特定源文件。在以下示例中，构建系统以 `Thumb` 和 `NEON` 支持编译 `foo.c`，以 `Thumb` 支持编译 `bar.c`，并以 `ARM` 和 `NEON` 支持编译 `zoo.c`：

```makefile::no-line-numbers
LOCAL_SRC_FILES = foo.c.neon bar.c zoo.c.arm.neon
```

> 如果同时使用这两个后缀，`.arm` 必须在 `.neon` 前面。

##### 1.2.3.19 `LOCAL_DISABLE_FORMAT_STRING_CHECKS`

默认情况下，构建系统会在编译代码时保护格式字符串。这样的话，如果 `printf` 样式的函数中使用了非常量格式的字符串，就会强制引发编译器错误。

此保护默认启用，但您也可通过将此变量的值设置为 `true` 将其停用。（如果没有必要的原因，我们不建议停用）

##### 1.2.3.20 `LOCAL_EXPORT_CFLAGS`

在一个模块中使用此变量来记录一组 `C/C++` 编译器标记，这些标记将被添加到通过 `LOCAL_STATIC_LIBRARIES` 或 `LOCAL_SHARED_LIBRARIES` 变量依赖这个模块的其他模块的 `LOCAL_CFLAGS` 变量中。

示例：

```makefile::no-line-numbers
include $(CLEAR_VARS)
LOCAL_MODULE := foo
LOCAL_SRC_FILES := foo/foo.c
LOCAL_EXPORT_CFLAGS := -DFOO=1
include $(BUILD_STATIC_LIBRARY)

include $(CLEAR_VARS)
LOCAL_MODULE := bar
LOCAL_SRC_FILES := bar.c
LOCAL_CFLAGS := -DBAR=2
LOCAL_STATIC_LIBRARIES := foo
include $(BUILD_SHARED_LIBRARY)
```

以上示例中，模块 `bar` 通过 `LOCAL_STATIC_LIBRARIES` 变量依赖了模块 `foo`，于是模块 `foo` 中通过 `LOCAL_EXPORT_CFLAGS` 变量记录的编译器标记 `-DFOO=1` 会被添加到模块 `bar` 的 `LOCAL_CFLAGS` 变量中。最终，在构建模块 `bar` 时会向编译器传递 `2` 个标记，即：`-DBAR=2` 和 `-DFOO=1`。

注意：

1. 在构建模块 `foo` 时（即在执行局部构建时），不会向编译器传递 `LOCAL_EXPORT_CFLAGS` 变量中设置的标记。

    > 如果想在构建模块 `foo` 时向编译器传递 `-DFOO=1` 标记，那么需要在模块 `foo` 中通过 `LOCAL_CFLAGS` 变量设置此标记。

2. `LOCAL_EXPORT_CFLAGS` 变量导出的编译器标记具有传递性，即：如果模块 `other` 依赖了模块 `bar`，模块 `bar` 依赖了模块 `foo`，那么在模块 `foo` 中通过 `LOCAL_EXPORT_CFLAGS` 变量导出的标记，也会添加到模块 `other` 的 `LOCAL_CFLAGS` 变量中。

##### 1.2.3.21 `LOCAL_EXPORT_CPPFLAGS`

此变量与 `LOCAL_EXPORT_CFLAGS` 类似，但仅适用于 `C++` 标记。

##### 1.2.3.22 `LOCAL_EXPORT_C_INCLUDES`

此变量与 `LOCAL_EXPORT_CFLAGS` 类似，但适用于 `C include` 路径。

例如，当 `bar.c` 需要包括模块 `foo` 的头文件时，此变量很有用。

##### 1.2.3.23 `LOCAL_EXPORT_LDFLAGS`

此变量与 `LOCAL_EXPORT_CFLAGS` 类似，但适用于链接器标记。

##### 1.2.3.24 `LOCAL_EXPORT_LDLIBS`

此变量与 `LOCAL_EXPORT_CFLAGS` 类似，用于指示构建系统将特定系统库的名称传递到编译器。

> 请在您指定的每个库名称前附加 `-l`。

##### 1.2.3.25 `LOCAL_SHORT_COMMANDS`
##### 1.2.3.26 `LOCAL_THIN_ARCHIVE`
##### 1.2.3.27 `LOCAL_FILTER_ASM`

### 1.3 预构建库

> 参考：[使用预构建库](https://developer.android.google.cn/ndk/guides/prebuilts?hl=zh-cn)

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

> 参考：[Application.mk](https://developer.android.google.cn/ndk/guides/application_mk?hl=zh-cn)