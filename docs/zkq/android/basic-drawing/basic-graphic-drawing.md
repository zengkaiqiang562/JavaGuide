---
title: 基本图形绘制
category: android
tag:
  - 绘图基础
---

## 1. 概述

我们平时画图需要两个工具：纸和笔。在 `Android` 中，`Paint` 类就是画笔，而 `Canvas` 类就是纸，在这里叫作画布。所以：

1. 凡是跟画笔设置相关的，比如画笔大小、粗细、画笔颜色、透明度、字体的样式等，都在 `Paint` 类里设置；
   
2. 凡是要画出成品的东西，比如圆形、矩形、文字等，都调用 `Canvas` 类里的函数生成。

## 2. 画笔的基本设置

### 2.1 `setAntiAlias`：是否打开抗锯齿功能

```java:no-line-numbers
/* Paint.java */
public void setAntiAlias(boolean aa)
```

```:no-line-numbers
表示是否打开抗锯齿功能。true 为打开
抗锯齿是依赖算法的，一般在绘制不规则的图形时使用，比如圆形、文字等。当打开抗锯齿功能时，所绘图像可以产生平滑的边缘。
在绘制棱角分明的图像时，比如一个矩形、一张位图，是不需要打开抗锯齿功能的。
```

**示例代码：**

```java:no-line-numbers
@Override 
protected void onDraw(Canvas canvas) { 
    super.onDraw(canvas); 

    Paint paint=new Paint(); 

    paint.setColor(Color.RED); // 设置画笔颜色
    paint.setStyle(Paint.Style.FILL); // 设置填充样式
    paint.setAntiAlias(true); // 打开抗锯齿功能
    paint.setStrokeWidth(50); // 设置画笔宽度

    // 画圆
    canvas.drawCircle(190, 200, 150, paint); 
}
```

### 2.2 `setColor`：设置画笔颜色

```java:no-line-numbers
/* Paint.java */
public void setColor(@ColorInt int color)
```

```:no-line-numbers
该函数的作用是设置画笔颜色。
参数 color 取十六进制颜值（0xAARRGGBB，其中 AA：透明度，RR：红色分量，GG：绿色分量，BB：蓝色分量）。

注意：除手动组合颜色的方法以外，系统还提供了一个专门用来解析颜色的类：Color.java
```

**示例代码：**

```java:no-line-numbers
Paint paint=new Paint(); 

paint.setColor(0xFFFF0000); 
paint.setStyle(Paint.Style.FILL); 
paint.setStrokeWidth(50); 
canvas.drawCircle(190, 200, 150, paint); // 不透明的红色，半径取 150px

paint.setColor(0x7EFFFF00); 
canvas.drawCircle(190, 200, 100, paint); // 半透明的黄色，半径取 100px
```

**效果图：**

![](./images/basic-graphic-drawing/01.png)

### 2.3 `setStyle`：设置填充样式

```java:no-line-numbers
/* Paint.java */
public void setStyle(Style style)
```

```:no-line-numbers
该函数用于设置填充样式，对于文字和几何图形都有效。
```

参数 `Style` 的取值如下：

```java:no-line-numbers
/* Paint.java */
public enum Style {
    FILL            (0), // 仅填充内部
    STROKE          (1), // 填充内部和描边
    FILL_AND_STROKE (2); // 仅描边
    ...
}
```

**示例代码：**

```java:no-line-numbers
Paint paint=new Paint(); 
paint.setColor(0xFFFF0000); 

// paint.setStyle(Paint.Style.FILL); 
// paint.setStyle(Paint.Style.STROKE); 
paint.setStyle(Paint.Style.FILL_AND_STROKE); 

paint.setStrokeWidth(50); 
canvas.drawCircle(190, 200, 150, paint);
```

**效果图：**

![](./images/basic-graphic-drawing/02.png)

> 明显可见，`FILL_AND_STROKE` 是 `FILL` 和 `STROKE` 叠加在一起显示的结果。
> 
> `FILL_AND_STROKE` 比 `FILL` 多了一个描边的宽度。

### 2.4 `setStrokeWidth`：设置描边宽度值

```java:no-line-numbers
/* Paint.java */
public void setStrokeWidth(float width)
```

```:no-line-numbers
用于设置描边宽度值，单位是 px。
当画笔的 Style 样式是 STROKE 或 FILL_AND_STROKE 时有效。
```

## 3. `Canvas` 使用基础

### 3.1 设置画布背景

```java:no-line-numbers
/* Canvas.java */
public void drawColor(@ColorInt int color)
public void drawARGB(int a, int r, int g, int b)
public void drawRGB(int r, int g, int b) // 透明度 Alpha 的值默认取 255
```

**示例代码：**

```java:no-line-numbers
protected void onDraw(Canvas canvas) { 
    super.onDraw(canvas); 
    // 将画布默认填充为紫色
    canvas.drawColor(0xFFFF00FF); 
    // canvas.drawARGB(0xFF, 0xFF, 0, 0xFF);
    // canvas.drawRGB(255,0,255); // 可以是十进制的数值
    // canvas.drawRGB(0xFF,0x00,0xFF); // 也可以是十六进制的数值
}
```

### 3.2 画直线

```java:no-line-numbers
/* Canvas.java */
public void drawLine(float startX, float startY, float stopX, float stopY, Paint paint)
```

```:no-line-numbers
startX：起始点 X 坐标。
startY：起始点 Y 坐标。
stopX ：终点 X 坐标。
stopY ：终点 Y 坐标。
```

**示例代码：**

```java:no-line-numbers
Paint paint=new Paint(); 
paint.setColor(Color.RED); 
// paint.setStyle(Paint.Style.FILL); 
// paint.setStyle(Paint.Style.STROKE); 
paint.setStyle(Paint.Style.FILL_AND_STROKE); 
paint.setStrokeWidth(50); 
 
canvas.drawLine(100, 100, 200, 200, paint);
```

**效果图：**

![](./images/basic-graphic-drawing/03.png)

> 从效果图中可以明显看出，直线的粗细与画笔 `Style` 是没有关系的。

当设置不同的 `strokeWidth` 时，效果图如下：

![](./images/basic-graphic-drawing/04.png)

> 可见，直线的粗细与 `paint.setStrokeWidth` 有直接关系的。所以，一般而言:
> 
> 1. `paint.setStrokeWidth` 用于设置描边宽度时，`Style` 起作用；
> 
> 2. `paint.setStrokeWidth` 用于设置画笔宽度时，`Style` 不起作用。

### 3.3 画多条直线

#### 3.3.1 方法一

```java:no-line-numbers
/* Canvas.java */
public void drawLines(float[] pts, Paint paint)
```

```:no-line-numbers
pts：点的集合。每两个点形成一条直线，pts 的组织方式为 {x1, y1, x2, y2, x3, y3, ...}，
     其中 (x1, y1) 表示一个点，(x2, y2) 表示另一个点。
     两点确定一条直线，所以 pts 数组中的元素个数必须为 4 的整数倍
```

**示例代码：**

```java:no-line-numbers
Paint paint = new Paint(); 
paint.setColor(Color.RED); 
paint.setStrokeWidth(5); 

// 有 4 个点，分别是 (10,10)、(100,100)、(200,200) 和 (400,400)，两两连成一条直线。
float[] pts = {10, 10, 100, 100, 200, 200, 400, 400}; 
canvas.drawLines(pts, paint);
```

**效果图：**

![](./images/basic-graphic-drawing/05.png)

#### 3.3.2 方法二

```java:no-line-numbers
/* Canvas.java */
public void drawLines(float[] pts, int offset, int count, Paint paint)
```

```:no-line-numbers
相比上面的构造函数，这里多了两个参数：
1. int offset：集合中跳过的数值个数。注意不是点的个数！一个点有两个数值。
2. int count：参与绘制的数值个数，指 pts 数组中数值的个数，而不是点的个数，因为一个点有两个数值。
```

**示例代码：**

```java:no-line-numbers
Paint paint = new Paint(); 
paint.setColor(Color.RED); 
paint.setStrokeWidth(5); 

float[] pts = {10, 10, 100, 100, 200, 200, 400, 400}; 

// 从 pts 数组中索引为 2 的数字开始绘图，有 4 个数值参与绘图，
// 也就是点 (100,100) 和 (200,200)，所以效果图就是这两个点的连线。
canvas.drawLines(pts, 2, 4, paint);
```

**效果图：**

![](./images/basic-graphic-drawing/06.png)

### 3.4 画点

### 3.5 画多个点

### 3.6 矩形工具类 `RectF`、`Rect` & 画矩形

### 3.7 画圆角矩形

### 3.8 画圆

### 3.9 画椭圆

### 3.10 画弧

## 4. `Rect` 与 `RectF`

## 5. `Color`