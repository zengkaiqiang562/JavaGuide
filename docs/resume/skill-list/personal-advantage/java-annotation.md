---
title: 注解技术
category: Java
tag:
  - Java基础
---

## 注解的简介

从JDK 5开始，Java增加了对元数据（`MetaData`）的支持，也就是注解（`Annotation`）。

注解就是代码里的特殊标记，这些标记可以在编译、类加载、运行时被读取，并执行相应的处理。

注解提供了一种为程序元素（包、类、构造器、方法、成员变量等）设置元数据的方法，从某些方面来看，注解就像修饰符一样，可用于修饰包、类、构造器、方法、成员变量、参数、局部变量。

通过使用注解，开发人员可以在不改变原有逻辑的情况下，在源文件中嵌入一些补充信息，代码分析工具、开发工具和部署工具可以通过这些补充信息进行验证或进行部署。

值得指出的是，如果希望让程序中的注解在编译时起作用，只有通过某种配套的工具对注解中的信息进行访问和处理。访问和处理注解的工具统称为`APT`，即`Annotation Processing Tool`。可以将此`APT`注解处理工具理解成一套用于获取并处理注解的程序代码。**没有使用APT注解处理工具处理过的注解，在程序中是不会起任何作用的。**

另外注解除了用来描述注解这一概念之外，它还表示一个接口。Java代码中，通过`@interface`定义的注解类型都默认实现了`Annotation`接口，通过反射获取的注解就是一个`Annotation`对象。
```java
package java.lang.annotation;
public interface Annotation {
  // 返回注解对象的实际类型（即是哪个Annotation接口的实现类）
  Class<? extends Annotation> annotationType(); 
}
```

在Java代码中，对于可以接受注解的程序元素，需要实现`AnnotatedElement`接口。如`Class`(类)、`Constructor`(构造器)、`Field`(成员变量)、`Method`(成员方法)、`Package`(包)，它们都实现了`AnnotatedElement`接口。


## 自定义注解

### 语法

```
//定义注解类型

@元注解
...
@元注解
public @interface 注解名称 {
    //定义成员变量
    成员变量类型 成员变量名() [default 默认值]
    成员变量类型 成员变量名() [default 默认值]
    ...
}
```

1. 使用@interface关键字定义注解类型

2. 定义注解类型时，还可以通过一个或多个元注解进行修饰

3. 注解类型可以定义成员变量，也可以不定义成员变量

4. 成员变量的类型只能是：8种基本数据类型、String、Class、注解类型、枚举类型、以及这些类型的一维数组类型

5. 成员变量可以通过default关键字设置默认值，设置了默认值的成员变量，在使用注解时可以省略不赋值。

**注意：** 如果定义注解时，定义了一个名为`value`的成员变量，并且使用此注解时只需要为此`value`成员变量赋值，即：
```
1. 只定义了成员变量`value`
2. 除了`value`之外的其他成员变量在定义时都设置了默认值
```
如上两种情况下，则使用该注解时可以直接在该注解后的圆括号里指定成员变量`value`的值，无需使用`value=变量值`的形式。
>此时，若`value`表示的是一个数组类型，并且指定值时只需要指定一个元素值，则可以不用加花括号。

### 自定义注解示例

```java
//1. 定义无成员变量的注解类型
public @interface Annotation0 {
}

//2. 定义有成员变量的注解类型
public @interface Annotation1 {
    String name();
    int age();  
    String[] children();
    Class[] clazzes();
}

//3. 定义有成员变量的注解类型，并给部分成员变量设置了默认值
public @interface Annotation2 {
    String name();
    int age();
    String city() default "shenzhen";
}

//4. 定义存在一个value成员变量的注解。
//因为成员变量name设置了默认值，所有使用此注解时，可以只给value成员变量赋值
public @interface Annotation3 {
    String[] value();
    String name() default "19";
}

//5. 定义被多个元注解修饰的注解类型
@Documented  //使用此元注解修饰的注解Annotation4将被javadoc工具提取成文档
@Target({ElementType.FIELD,ElementType.METHOD}) //使用此元注解修饰Annotation4后，Annotation4注解只能用来修饰指定的程序元素：成员变量和方法。
@Retention(RetentionPolicy.RUNTIME) //使用此元注解修饰的Annotation4，可以保留到运行时。
public @interface Annotation4 {
    String name();
}
```

### 使用注解示例

通过`@ + 注解类型名 +赋值列表(可省略)`的方法使用注解：

```java
@Annotation0
public void method(){
}

@Annotation1(name="zengk", age=26, children={"aa", "bb"}, clazzes={Object.class, TestAnnotation1.class})
public void method(){
}

//没有对存在默认值的city成员变量赋值
@Annotation2(name="zengk", age=26)
public void method(){
}

//@Annotation3(value={"xx","yy"})
@Annotation3({"xx","yyy"})
public void method(){
}

//@Annotation3(value={"yy"}) 此方式也可以
//@Annotation3(value="yy") 此方式也可以
//@Annotation3({"yy"}) 此方式也可以
@Annotation3("yy")
public void method(){
}
```

## 标记注解&元数据注解

根据注解在定义时是否有成员变量，可以把注解分为两类：

**1. 标记注解：** 没有定义成员变量的`Annotation`类型被称为标记。这种注解仅利用自身的存在与否来提供信息。如@Override

**2. 元数据注解**： 定义了成员变量的`Annotation`类型，因为他们可以接受更多的元数据，所以也被称为元数据注解。

## 元注解

元注解（Meta Annotation）就是用来修饰注解的注解

### @Retention

```java
package java.lang.annotation;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Retention {
    RetentionPolicy value();
}
```

`@Retention`只能用于修饰`Annotation`类型，用于指定被修饰的`Annotation`可以保留多长时间。`@Retention`元注解只定义了一个`RetentionPolicy`枚举类型的`value`成员变量，`value`成员变量的值只有如下三个：

```
RetentionPolicy.CLASS：编译器把注解信息记录在class文件中，但不会保留到运行时期。因此运行时不可获取注解信息。这是默认值。

RetentionPolicy.RUNTIME：编译器把注解信息记录在class文件中，且会保留到运行时期。因此运行时可以通过反射获取注解信息。
        
RetentionPolicy.SOURCE：注解信息只保留在源代码中，编译器直接丢弃这种注解信息。
```

>如果需要通过反射获取某个注解的元数据，则必须使用`@Retention(RetentionPolicy.RUNTIME)`来修饰此注解类型。

### @Target

```java
package java.lang.annotation;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Target {
    ElementType[] value();
}
```

`@Target`只能用于修饰`Annotation`类型，用于指定被修饰的`Annotation`能用于修饰哪些程序元素。`@Target`元注解只定义了一个`ElementType[]`数组类型的`value`成员变量（其中`ElementType`是枚举类型），`value`成员变量的值可以是如下几个：

```
ElementType.TYPE：	指定该策略的Annotation只能修饰类，接口（包括注解类型），枚举定义。
ElementType.FIELD：	指定该策略的Annotation只能修饰成员变量。
ElementType.METHOD：	指定该策略的Annotation只能修饰方法定义。
ElementType.PARAMETER：	指定该策略的Annotation只能修饰参数。
ElementType.CONSTRUCTOR：	指定该策略的Annotation只能修饰构造方法。
ElementType.LOCAL_VARIABLE：	指定该策略的Annotation只能修饰局部变量。
ElementType.ANNOTATION_TYPE：	指定该策略的Annotation只能修饰Annotation。
ElementType.PACKAGE：	指定该策略的Annotation只能修饰包定义。
```

### @Documented

```java
package java.lang.annotation;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Documented {
}
```

`@Documented`用于指定被该元注解修饰的`Annotation`类将被`javadoc`工具提取成文档，如果定义`Annotation`类时使用了`@Documented`修饰，则所有使用该`Annotation`修饰的程序元素的`API`文档中将会包含该`Annotation`说明

### @Inherited

```java
package java.lang.annotation;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Inherited {
}
```

`@Inheritd`用于指定被它修饰的`Annotation`将具有继承性。如果定义`Annotation`类时使用了`@Inherited`修饰，那么当使用该`Annotation`修饰了某个类，则这个类的子类也将自动被此`Annotation`修饰。

## Java中提供的基本Annotation介绍

### @Override

```java
package java.lang;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}
```

`@Override`用来修饰方法，强制类中的方法必须是重写了父类中的方法。当一个类中的某个方法使用`@Override`修饰后，则必须保证此类的父类或父接口中定义了一个被该方法重写的方法，否则会编译报错。使用`@Override`可以避免重写方法时的笔误。


### @Deprecated

```java
package java.lang;

import java.lang.annotation.*;
import static java.lang.annotation.ElementType.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})
public @interface Deprecated {
}
```

`@Deprecated`用于表示某个程序元素已过时。当程序元素（如成员变量，方法等）被`@Deprecated`修饰后的，调用这些程序元素时，编译器将会给出警告。

### @SuppressWarnings

```java
package java.lang;

import java.lang.annotation.*;
import static java.lang.annotation.ElementType.*;

@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
    String[] value();
}
```

`@SuppressWarnings`修饰某个程序元素后，对于作用在此程序元素上的`@SuppressWarning`指定的编译器警告会被取消掉。如果某个程序元素被`@SuppressWarnings`修饰，那么该程序元素范围内的其他程序元素也会被此`@SuppressWarnings`修饰。例如当一个类被`@SuppressWarnings`修饰，此类中的某个方法又被另一个`@SuppressWarnings`修饰，那么对于这两个`@SuppressWarnings`指定的所有编译器警告，作用在此方法上时都会被取消。

## 提取注解信息

对于用`@Retention(RetentionPolicy.RUNTIME)`修饰的运行时注解，可以通过反射提取`Annotation`中的元数据。由于是运行时才处理注解信息，并且使用了大量的反射技术，所以效率会比较慢。


对于用`@Retention(RetentionPolicy.CLASS)`或`@Retention(RetentionPolicy.SOURCE)`修饰的注解，需要在编译时处理，此时不能使用反射技术，需通过`javax.annotation.processing`包下的`Processor`接口来实现一个注解处理器（`Annotation Processor`），一般采用继承`AbstractProcessor`的方式定义一个注解处理器。通过使用注解处理器来处理和提取`Annotation`信息。

### 提取运行时注解信息

上文已经提到过，在Java中，通过`Annotation`对象表示一个注解。所以只有得到注解的`Annotation`对象才能提取此注解中的元数据。

那么怎么得到`Annotation`对象呢？上文也有提到，对于可以接受注解的程序元素，需要实现`AnnotatedElement`接口，而其中的`AnnotationElement`接口就提供了获取`Annotation`对象的方法。所以只需要得到`AnnotatedElement`的实现类对象，就能获取到`Annotation`对象，从而提取`Annotation`中的元数据。

而`AnnotatedElement`的实现类，在上文中也有提到，就是`Class`、`Method`、`Field`、`Constructor`等这些程序元素在Java中对应的类。于是，我们可以通过反射获取到`Class`、`Constructor`、`Method`、`Field`这些类的对象。

通过反射提取Annotation中的元数据的步骤总结如下：

```
1. 通过反射得到Class、Constructor、Method、Field这些实现了AnnotationElement接口的类的对象。

2. 通过AnnotationElement实现类对象调AnnotationElement提供的API，获取注解对应的Annotation对象。

3. 通过Annotation对象获取到注解的元数据。
```

#### AnnotationElement接口的API

```java
/**
* 判断该程序元素上是否存在指定注解类型的注解，存在返回true，否则返回false。
*/
boolean isAnnotationPresent(Class<? extends Annotation> annotationClass);

/**
* 返回此程序元素上存在的、指定注解类型的Annotation对象。如果该注解类型的注解不存在，则返回null。
*/
<T extends Annotation> T getAnnotation(Class<T> annotationClass);

/**
* 返回该程序元素上存在的所有注解
*/
Annotation[] getAnnotations();

/**
* 返回直接修饰该程序元素的所有注解
*/
Annotation[] getDeclaredAnnotations();
```

#### 代码示例

通过反射处理运行时注解，实现`Android`中`Button`按键的点击事件绑定

**1. 定义注解类型**

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ButtonAnnotation {
    int resId();
    Class<? extends View.OnClickListener> listenClazz();
}
```

**2. 定义注解处理工具**

```java
public class ButtonAnnotationProcessTools {
    public static void process(Object obj){
        //获取使用了注解的程序元素所在的类的class对象
        Class clazz = obj.getClass();

        //因为@ButtonAnnotation只能修饰成员变量，
        //所以只需变量此类中的成员变量，找到被@ButtonAnnotation修饰的成员变量
        Field[] declaredFields = clazz.getDeclaredFields();

        for (Field field : declaredFields) {
            //因为后面需要给@ButtonAnnotation修饰的成员变量赋值，
            //所以对于私有的成员变量，需获取访问权限
            field.setAccessible(true);

            //判断成员变量是否被@ButtonAnnotation修饰
            boolean annotationPresent = field.isAnnotationPresent(ButtonAnnotation.class);

            if (annotationPresent) {
                //获取修饰此成员变量的ButtonAnnotation注解对象
                ButtonAnnotation buttonAnnotation = field.getAnnotation(ButtonAnnotation.class);

                try {
                    Class fieldType = field.getType();

                    //对Button类型的成员变量，通过注解@ButtonAnnotation中的元数据对其进行赋值和设置点击事件监听
                    if (fieldType.equals(Button.class) && obj instanceof MainActivity){

                        Activity activity = (Activity) obj;

                        //通过@ButtonAnnotation中的资源ID得到view对象
                        View view = activity.findViewById(buttonAnnotation.resId());

                        //通过@ButtonAnnotation中的监听器Class对象，利用反射得到View.OnClickListener对象
                        Class<? extends View.OnClickListener> listenClazz = buttonAnnotation.listenClazz();

                        View.OnClickListener onClickListener =  listenClazz.newInstance();
                        view.setOnClickListener(onClickListener);

                        //给@ButtonAnnotation修饰的成员变量赋值
                        field.set(obj, view);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

**3. 使用注解对Button类型的成员变量进行赋值并绑定点击事件监听器**

```java
public class MainActivity extends AppCompatActivity{
    @ButtonAnnotation(resId = R.id.btn, listenClazz = ButtonOnClickListener.class)
    private Button mBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //使用注解处理工具对@ButtonAnnotation进行处理
        ButtonAnnotationProcessTools.process(this);
    }

    class ButtonOnClickListener implements View.OnClickListener{
        @Override
        public void onClick(View v) {
            Log.d(TAG, "onclick");
        }
    }
}
```

### 提取编译时注解信息

**step1. 继承`AbstractProcessor`类，处理注解**

`AbstractProcessor`实现了`Processor`接口，继承`AbstractProcessor`重写`process`方法处理注解信息

``` java
/**
* 在 javax.annotation.processing 包下提供了 AbstractProcessor抽象类
*/
public abstract class AbstractProcessor implements Processor

/**
* 重写此方法。返回此注解处理器APT 处理的注解类型
* 返回Set集合包含要处理的注解类型，String表示注解类名（最好使用全路径名）
* Java1.7 以后也可以不重写此方法，通过注解@SupportedAnnotationTypes指定处理的注解类型，
* @SupportedAnnotationTypes的目标程序元素是类，即在自定义的AbstractProcessor子类上使用
*/
public Set<String> getSupportedAnnotationTypes()

/**
* 重写此方法，返回处理注解时采用的Java版本
* Java1.7以后也可以不重写此方法，通过注解@SupportedSourceVersion指定Java版本
* @SupportedAnnotationTypes也是作用在自定义的AbstractProcessor子类上
*/
public SourceVersion getSupportedSourceVersion()

/**
* 通常不需要重写此方法
*/
public synchronized void init(ProcessingEnvironment processingEnv)
    
/**
* 重写此方法，处理注解
*/
public abstract boolean process(Set<? extends TypeElement> annotation, RoundEnvironment roundEnv);
```