---
title: JNI
category: 
  - android-ndk
tag:
  - android-ndk
---

## 1. `JNI` 和 `NDK` 开发

`JNI` 是为 `Java` 代码与 `C/C++` 代码进行交互所提供的一套接口 `API`。

`NDK` 是 `Android` 系统提供的用于 `JNI` 开发的工具包。

### 1.1 `JNI` 和 `NDK` 的开发流程

#### 1.1.1 `JNI` 的开发流程

`JNI` 的开发流程如下：

1. 在 `Java` 类中声明 `native` 方法

2. 先编译 `Java` 类的 `.java` 文件生成 `.class` 文件，再通过 `javah` 命令根据 `.class` 文件导出该 `Java` 类对应的 `JNI` 头文件（`.h` 文件）

    > `.h` 头文件中的声明函数对应 `Java` 类中的 `Native` 方法。
    >
    > 且头文件中函数名的命名规则为：`Java_包名_类名_方法名`

    ```:no-line-numbers
    头文件中声明的函数原型的形参列表中，前两个形参类型分别为：
    
    1. JNIEnv* ：表示一个指向 JNI 环境的指针，通过该指针可以调用 JNI 提供的接口方法
                 JNIEnv 的主要作用有两点：1. 调用 Java 类中的成员方法；2. 访问 Java 类中的成员变量
                 注意：JNIEnv 只在创建它的线程中有效，不能跨线程传递。

    2. jobject ：表示该函数所对应的 native 方法所在的 Java 类的对象，
                 即通过 jobject 表示的 Java 对象调用了 native 方法，从而执行了头文件中声明的这个函数。
    ```

3. 实现 `JNI` 函数

    > 即根据步骤 `3` 中生成的 `.h` 头文件中声明的函数原型进行函数定义，编写函数体代码。
    > 
    > 这里既可以选择用 `C` 实现 `JNI` 函数，也可以选择用 `C++` 实现 `JNI` 函数。
    >
    > 若用 `C` 实现，则新建一个 `.c` 文件实现 `JNI` 函数
    >
    > 若用 `C++` 实现，则新建一个 `.cpp` 文件实现 `JNI` 函数

4. 将 `.h` 头文件和 `.c`（或 `.cpp`）源文件编译成 `so` 库（如 `libname.so`）

    > 可以通过 `gcc` 编译；也可以通过 `NDK` 进行编译。

5. 将步骤 `4` 中生成的 `so` 库放到 `Android` 项目的 `app/src/main/jniLibs/` 目录中

    > 注意：`src/main/jniLibs/` 目录是 `AndroidStudio` 默认识别的目录。
    >
    > 可以通过在 `build.gradle` 中配置 `jniLibs.srcDir` 指定其他的目录来存放 `so` 库

    ```groovy:no-line-numbers
    android {
        ...
        sourceSets.main {
            jniLibs.srcDir 'src/main/jni_libs' // 修改 so 库的存放目录为 src/main/jni_libs/
        }
    }
    ```

6. 在声明了 `native` 方法的 `Java` 类的静态代码块中调用 `System.loadLibrary("name")` 方法加载步骤 `4` 中编译出来的动态库 `libname.so`

    > 注意：`System.loadLibrary("name")` 中传入的 `libname.so` 库名称不需要加前缀 "`lib`" 和后缀 "`.so`"

#### 1.1.2 `NDK` 的开发流程

使用 `NDK` 进行开发可以省去编译生成 `so` 库的步骤，`AndroidStudio` 会根据我们通过 `NDK` 所实现的相关配置自动编译生成 `so` 库。

> 即使用 `NDK` 可以省去 `JNI` 开发流程中的步骤 `4` 和步骤 `5`，
> 
> 但另外也多了些其他的配置文件。

使用 `NDK` 进行开发时，可以使用 `ndk-build`（基于 `Makefile` 的构建脚本）构建原生库（即 `so` 动态库，或静态库），也可以使用 `CMake` 构建原生库（现在推荐使用 `CMake` 了）。

不管是采用 `ndk-build` 进行构建，还是采用 `CMake` 的进行构建，最后都需要在 `build.gradle` 中进行配置后，才能集成到 `AndroidStudio` 项目中。

##### 1.1.2.1 使用 `ndk-build`（`Makefile`）构建

> 参考：[ndk-build](/zkq/android/ndk/ndk-build.html)

使用 `ndk-build`（`Makefile`） 进行构建时，需要创建 `Android.mk` 和 `Application.mk` 这两个配置文件，其中：

```:no-line-numbers
在 Android.mk 文件中可以配置编译 so 库时所需要的源文件，以及生成的 so 库的名称等信息。

在 Application.mk 文件中可以配置编译出来的 so 库所支持的 CPU 平台架构类型（如 armeabi、x86 等架构）
```

##### 1.1.2.2 使用 `CMake` 构建

> 参考：[CMake](/zkq/android/ndk/cmake.html)

使用 `CMake` 进行构建时，需要创建 `CMakeLists.txt` 配置文件

```:no-line-numbers
在 CMakeLists.txt 文件中，可以配置编译 so 库时所需要的源文件，以及生成的 so 库的名称等信息

即 CMakeLists.txt 文件的作用就相当于 Android.mk 文件
```

##### 1.1.2.3 在 `build.gradle` 中配置

使用 `build.gradle` 进行配置时：

1. 在 `defaultConfig` 代码块中添加 `ndk` 代码块，并通过 `moduleName` 属性配置 `so` 库的名称

    ```groovy:no-line-numbers
    android {
        ...
        defaultConfig {
            ...
            ndk {
                moduleName "name" // 生成的 so 库名为 libname.so
            }
        }
    }
    ```

2. 将编译 `so` 库所需要的 `.h` 头文件和 `.c`（或 `.cpp`）源文件放到 `app/src/main/jni/` 目录下

    > 也可以在 `build.gradle` 中通过 `jni.srcDirs` 属性修改 `C/C++` 源码的存放路径

    ```groovy:no-line-numbers
    android {
        ...
        sourceSets.main {
            jni.srcDirs 'src/main/jni_src' // 指定存放 C/C++ 源码的目录为 app/src/main/jni_src
        }
    }
    ```

3. 默认情况下，`Gradle` 会将适配所有 `CPU` 平台架构的 `so` 库都打包到 `apk` 中。此时，可以在 `build.gradle` 中通过 `abiFilter` 属性进行配置

    ```groovy:no-line-numbers
    android {
        ...
        productFlavors {
            arm { // 添加名为 arm 的构建产物（于是有 armDebug 和 armRelease 两种变体）
                ndk {
                    abiFilter "armeabi" // armDebug 和 armRelease 两种变体的 apk 中只打包了 armeabi 架构的 so 库
                }
            }

            x86 { // 添加名为 x86 的构建产物（于是有 x86Debug 和 x86Release 两种变体）
                ndk {
                    abiFilter "x86" // x86Debug 和 x86Release 两种变体的 apk 中只打包了 x86 架构的 so 库
                }
            }
        }
    }
    ```

### 1.2 `Native` 方法注册的两种方式：静态注册和动态注册

静态注册就是如 `JNI` 开发流程中的步骤 `2` 那样，通过 `javah` 命令生成 `.h` 头文件，在生成的 `.h` 头文件中声明 `Java` 类中的 `native` 方法所对应的 `C/C++` 中的函数原型。

函数原型中包括了 `native` 方法的方法名、所在类的类名和包名、以及 `native` 方法的形参列表。

也就是说：静态注册就是根据 `javah` 命令生成的头文件中的函数原型将 `Java` 类中的 `Native` 方法和 `C/C++` 中的 `JNI` 函数建立起联系。

> `C/C++` 中的 `JNI` 函数就是指根据头文件中的函数原型所定义的函数（即 `JNI` 开发流程中的步骤 `3` 中实现的 `JNI` 函数）

静态注册有如下缺点：

1. `JNI` 函数的名称过长；
2. 需要额外地通过 `javah` 命令为声明了 `native` 方法的类生成对应的 `JNI` 头文件；
3. 初次调用 `native` 方法时需要与 `JNI` 函数建立关联，影响效率。

静态注册就是通过 `javah` 命令生成的头文件中具有特殊名称的函数原型，将 `Java` 中的 `native` 方法与 `C/C++` 中的 `JNI` 函数关联起来。

动态注册则不需要通过 `javah` 命令生成包含了特殊名称的函数原型的头文件，而是在 `C/C++` 代码中通过 `JNINativeMethod` 结构体建立起 `native` 方法和 `JNI` 函数的关联，并通过调用 `AndroidRuntime::registerNativeMethods` 函数进行 `native` 方法的动态注册。

```cpp:no-line-numbers
/* libnativehelper/include/nativehelper/jni.h */
typedef struct {
    const char* name;  // Java 类中声明的 native 方法名
    const char* signature; // native 方法的方法签名
    void*       fnPtr; // JNI 函数名（C/C++ 中，函数名是一个指针常量）
} JNINativeMethod;
```

```cpp:no-line-numbers
/* frameworks/base/core/jni/AndroidRuntime.cpp */
/*
 * 对 Java 类中的 native 方法进行动态注册
 */
/*static*/ int AndroidRuntime::registerNativeMethods(
    JNIEnv* env,
    const char* className, // native 方法所在类的全路径类名
    const JNINativeMethod* gMethods, // 指向 JNINativeMethod 数组，数组中包含了 className 中所有 native 方法与 JNI 函数的关联信息
    int numMethods) // JNINativeMethod 数组中的元素个数
{
    return jniRegisterNativeMethods(env, className, gMethods, numMethods);
}
```

动态注册的示例：

```cpp:no-line-numbers
/* frameworks/base/media/jni/android_media_MediaRecorder.cpp */
// 函数名表示的指针常量类型需要强转成 void* 类型
static const JNINativeMethod gMethods[] = {
    ...
    {"_prepare",             "()V",                             (void *)android_media_MediaRecorder_prepare},
    {"getSurface",           "()Landroid/view/Surface;",        (void *)android_media_MediaRecorder_getSurface},
    {"getMaxAmplitude",      "()I",                             (void *)android_media_MediaRecorder_native_getMaxAmplitude},
    {"start",                "()V",                             (void *)android_media_MediaRecorder_start},
    {"stop",                 "()V",                             (void *)android_media_MediaRecorder_stop},
    {"pause",                "()V",                             (void *)android_media_MediaRecorder_pause},
    {"resume",               "()V",                             (void *)android_media_MediaRecorder_resume},
    {"native_reset",         "()V",                             (void *)android_media_MediaRecorder_native_reset},
    {"release",              "()V",                             (void *)android_media_MediaRecorder_release},
    {"native_init",          "()V",                             (void *)android_media_MediaRecorder_native_init},
    ...
};

// This function only registers the native methods, and is called from
// JNI_OnLoad in android_media_MediaPlayer.cpp
int register_android_media_MediaRecorder(JNIEnv *env)
{
    return AndroidRuntime::registerNativeMethods(env, "android/media/MediaRecorder", gMethods, NELEM(gMethods));
}
```

```cpp:no-line-numbers
/* frameworks/base/media/jni/android_media_MediaPlayer.cpp */
// JNI_OnLoad 函数会在 Java 类中调用 System.loadLibrary("name") 方法加载完 so 库时执行
jint JNI_OnLoad(JavaVM* vm, void* /* reserved */) 
{
    JNIEnv* env = NULL;
    jint result = -1;

    if (vm->GetEnv((void**) &env, JNI_VERSION_1_4) != JNI_OK) {
        ALOGE("ERROR: GetEnv failed\n");
        goto bail;
    }
    assert(env != NULL);
    ...
    // 在 MediaPlayer.cpp 中调用 MediaRecorder.cpp 中定义的该函数，对 MediaRecorder.java 中声明的 native 方法进行动态注册
    if (register_android_media_MediaRecorder(env) < 0) {
        ALOGE("ERROR: MediaRecorder native registration failed\n");
        goto bail;
    }
    ...
    /* success -- return valid version number */
    result = JNI_VERSION_1_4;

bail:
    return result;
}
```

### 1.3 `Java` 和 `JNI` 的数据类型

从 `native` 方法调用到 `JNI` 函数时，`native` 方法的参数和返回值的 `Java` 数据类型就需要转换成 `JNI` 数据类型。

1. `Java` 中的基本数据类型 `byte`/`char`/d`o`uble/`float`/`int`/`short`/`long`/`boolean` 转换成 `JNI` 中的基本数据类型时只需要在前面加 "`j`" 即可

2. `Java` 中的空类型和 `JNI` 中的空类型都是 `void`

3. 对于 `Java` 中的引用数据类型：

    1. `Object` 转换成 `jobject`

        > 除数组类型和 `Class`/`String`/`Throwable`/ 之外其他所有类类型都转换成 `jobject`

    2. `Class`/`String`/`Throwable`/ 转换成 `JNI` 中的 `jclass`/`jstring`/`jthrowable`

    3. 基本数据类型对应的数组类型转换成 `JNI` 中的基本数据类型对应的数组类型时只需要在 `JNI` 的基本数据类型后面加 "`Array`"

        > 如：`int[]` 转为 `jintArray`

    4. 引用数据类型对应的数组类型都转换成 `jobjectArray`

        > 如：`Object[]` 转为 `jobjectArray`

    > 注意：
    >
    > `JNI` 中的所有数组类型都继承自 `jarray`；
    >
    > `JNI` 中的所有引用类型都继承自 `jobject`。（`jarray` 也继承自 `jobject`）

### 1.4 JNI 的类型签名

基本数据类型的签名一般由类型名的首字母大写表示。但 `boolean` 和 `long` 比较特别：

1. `boolean` 的签名为 `Z`。因为 `B` 是 `byte` 的签名。
2. `long` 的签名为 `J`。因为 `L` 是类的签名的开头。

空类型 `Void` 的签名为 `V`

类的签名采用 "`L<PackageName><ClassName>;`" 的形式。其中包名 `PackageName` 中的 "`.`" 替换为 "`/`"

> 如 `String` 的签名为 "`Ljava/lang/String;`"

一维数组的签名采用 "`[<ElementTypeSignature>`" 的形式。其中 `ElementTypeSignature` 表示元素类型的签名

> 当元素为基本数据类型时，如 `int[]` 数组的签名为 "`[I`"
> 
> 当元素为类类型时，如 `String[]` 数组的签名为 "`[Ljava/lang/String;`"

二维数组的签名比一维数组的签名前面多了一个 "`[`"。（`n` 维数组的签名比一维数组的签名前面多了 `n-1` 个 "`[`"）

方法的签名采用 "`(<ParamTypeSignature><ParamTypeSignature><ParamTypeSignature>...)<ReturnTypeSignature>`" 的形式

> 如 `boolean fun(int, double, int[])` 的签名为 "`(ID[I)Z`"
> 
> 如 `boolean fun(int, String, int[])` 的签名为 "`(ILjava/lang/String;[I)Z`"
> 
> 如 `int fun()` 的签名为 "`()I`"
> 
> 如 `void fun(int)` 的签名为 "`(int)V`"


### 1.5 `JNI` 调用 `Java` 方法和访问 `Java` 变量的流程

`JNIEnv` 表示 `JNI` 环境，且 `JNIEnv` 只在创建它的线程中有效，不能跨线程传递。

`JNIEnv` 的主要作用有两点：1. 调用 `Java` 类中的成员方法；2. 访问 `Java` 类中的成员变量。

`JNI` 调用 `Java` 方法或者访问 `Java` 变量都是通过 `JNIEnv` 提供的 `API` 实现的。

`JNIEnv` 结构体在 `jni.h` 中定义。`JNIEnv` 其实只是对 `JNINativeInterface` 结构体的封装，即 `JNIEnv` 提供的 `API` 都是通过调用同名的 `JNINativeInterface` 提供的 `API` 实现的。

而 `JNINativeInterface` 结构体中定义了一系列的函数指针，这些函数指针都指向虚拟机中的函数表。即通过 `JNIEnv` 中封装的 `JNINativeInterface` 就可以实现从 `JNI` 到虚拟机中的函数调用，而通过虚拟机又可以访问到 `Java` 层中的 `API`。于是，通过 `JNIEnv` 就实现了从 `JNI` 层到 `Java` 层的函数调用。

`JNI` 调用 `Java` 方法的流程为：

1. 先通过类名找到类的 `Class` 对象

2. 再根据方法名和方法的类型签名通过 `Class` 对象找到方法 `id`

3. 最后通过方法 `id` 调用方法

> 注意：如果是调用非静态方法，那么在调用方法之前还需要先获取到构造方法 `id`，然后通过 `Class` 对象创建类的实例。

`JNI` 访问 `Java` 变量的流程类似：

1. 先通过类名找到类的 `Class` 对象

2. 再根据变量名和变量的类型签名通过 `Class` 对象找到变量 `id`

3. 最后通过变量 `id` 访问变量

> 注意：如果是访问非静态成员变量，那么在访问之前还需要先获取到构造方法 `id`，然后通过 `Class` 对象创建类的实例。

```cpp:no-line-numbers
/* libnativehelper/include/nativehelper/jni.h */

#if defined(__cplusplus)
typedef _JNIEnv JNIEnv; // C++ 中的 JNIEnv 是一个 _JNIEnv 结构体的别名，_JNIEnv 中封装了 JNINativeInterface
#else
typedef const struct JNINativeInterface* JNIEnv; // C 中的 JNIEnv 就是指向 JNINativeInterface 的指针
#endif


struct _JNIEnv {
    const struct JNINativeInterface* functions;

#if defined(__cplusplus)
...
    /*
        根据 Java 类的全路径名获取 JNI 层对应的 Class 字节码对象
    */
    jclass FindClass(const char* name)
    { return functions->FindClass(this, name); }

    /*
        根据成员变量名 name，和成员变量的类型签名 sig，在类的 Class 对象中获取到该成员变量的 id
    */
    jfieldID GetFieldID(jclass clazz, const char* name, const char* sig)
    { return functions->GetFieldID(this, clazz, name, sig); }

    /*
        根据成员方法名 name，和成员方法的类型签名 sig，在类的 Class 对象中获取到该成员方法的 id
    */
    jmethodID GetMethodID(jclass clazz, const char* name, const char* sig)
    { return functions->GetMethodID(this, clazz, name, sig); }

    /*
        根据构造方法名 name，和构造方法的类型签名 sig，以及调用构造方法时传入的参数列表，通过类的 Class 对象创建该类的实例
    */
    jobject NewObject(jclass clazz, jmethodID methodID, ...)
    {
        va_list args;
        va_start(args, methodID);
        jobject result = functions->NewObjectV(this, clazz, methodID, args);
        va_end(args);
        return result;
    }

    /*
        根据静态成员方法的 id，以及调用静态成员方法时传入的参数列表，通过类的 Class 对象来调用该静态成员方法
    */
    void CallStaticVoidMethod(jclass clazz, jmethodID methodID, ...)
    {
        va_list args;
        va_start(args, methodID);
        functions->CallStaticVoidMethodV(this, clazz, methodID, args);
        va_end(args);
    }

    /*
        根据非静态成员方法的 id，以及调用非静态成员方法时传入的参数列表，通过类的实例 obj 来调用该非静态成员方法
    */
    void CallVoidMethod(jobject obj, jmethodID methodID, ...)
    {
        va_list args;
        va_start(args, methodID);
        functions->CallVoidMethodV(this, obj, methodID, args);
        va_end(args);
    }

    /*
        根据非静态成员变量的 id，将变量值 value 设置给对象 obj 中非静态成员变量
        （如果是变量类型是 Int，则调用 SetIntField，其他类型以此类推）
    */
    void SetObjectField(jobject obj, jfieldID fieldID, jobject value)
    { functions->SetObjectField(this, obj, fieldID, value); }

    /*
        根据静态成员变量的 id，将变量值 value 设置给 Class 对象所表示的类中的静态成员变量
        （如果是变量类型是 Int，则调用 SetStaticIntField，其他类型以此类推）
    */
    void SetStaticObjectField(jclass clazz, jfieldID fieldID, jobject value)
    { functions->SetStaticObjectField(this, clazz, fieldID, value); }

    /*
        根据非静态成员变量的 id，从对象 obj 中获取到该非静态成员变量的值
        （如果是变量类型是 Int，则调用 GetIntField，其他类型以此类推）
    */
    jobject GetObjectField(jobject obj, jfieldID fieldID)
    { return functions->GetObjectField(this, obj, fieldID); }

    /*
        根据静态成员变量的 id，从 Class 对象所表示的类中获取到该静态成员变量的值
        （如果是变量类型是 Int，则调用 GetStaticIntField，其他类型以此类推）
    */
    jobject GetStaticObjectField(jclass clazz, jfieldID fieldID)
    { return functions->GetStaticObjectField(this, clazz, fieldID); }
...
#endif /*__cplusplus*/
};
```

### 1.6 `JNI` 中的引用类型

`JNI` 中的引用类型可分为：

1. 本地引用（局部引用）

    ```cpp:no-line-numbers
    JNIEnv 提供的函数所返回的引用，基本上都是本地引用。

    本地引用的特点为：
    1. 当 Java 类中的 nativ 方法调用结束后，native 方法所对应的 JNI 函数在执行过程中，
       通过调用 JNIEnv 提供的函数所返回的本地引用会被自动释放。

       注意：也可以调用 JNIEnv 提供的 DeleteLocalRef 函数立即释放本地引用，而不用等到 native 方法调用结束后才释放。

    2. 本地引用只在创建它的线程中有效，不能跨线程使用。

    3. 本地引用是 JVM 负责的引用类型，受 JVM 管理
    ```

2. 全局引用

    ```cpp:no-line-numbers
    全局引用的特点为：
    1. 在 native 方法调用结束后不会被自动释放，且不会被 GC 回收。
       因此，全局引用需要手动地进行释放。

       注意：调用 JNIEnv 提供的 NewGlobalRef 函数可以将一个本地引用转换成一个全局引用
            调用 JNIEnv 提供的 DeleteGlobalRef 函数释放全局引用

    2. 全局引用可以跨线程使用

    3. 全局引用不受 JVM 管理。
    ```

3. 弱全局引用

    ```cpp:no-line-numbers
    弱全局引用和全局引用的区别在于：弱全局引用会被 GC 回收。

    调用 JNIEnv 提供的 NewWeakGlobalRef 函数可以将一个本地引用转换为弱全局引用
    调用 JNIEnv 提供的 DeleteWeakGlobalRef 函数可以释放弱全局引用

    注意：当弱全局引用被 GC 回收后，弱全局引用指向 NULL，此时可以通过 JNIEnv 提供的 isSameObject 函数判断弱全局引用是否为 NULL

    // 判断两个引用是否相同，如 env->IsSameObject(wRef, NULL)，表示判断 wRef 是否为 NULL
    jboolean IsSameObject(jobject ref1, jobject ref2) 
    { return functions->IsSameObject(this, ref1, ref2); }
    ```