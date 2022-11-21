---
title: Task详解与实战
category:
  - gradle
tag:
  - gradle
---

## 1. `Task` 的创建 & 配置

### 1.1 创建 `Task`

`Project` 类提供如下方法创建一个 `Task`。

**方式一：**

```groovy:no-line-numbers
Task task(String name, Closure configureClosure)
```

**方式二：**

```groovy:no-line-numbers
TaskContainer getTasks()

// TaskContainer 提供了多个重载的 create 方法来创建 task
Task create(String name, Closure configureClosure)
```

**注意：**

```:no-line-numbers
1. Project 依赖 TaskContainer 来管理 Task。可以通过 TaskContainer 来创建和查找 Task；

2. task(name, configureClosure) 和 tasks.create(name, configureClosure) 中的实参闭包用于配置 Task，
    并且，在 Gradle 配置阶段就会执行配置 Task 的实参闭包；

3. 在执行 gradlew taskName 命令执行某个 Task 时，会经历 Gradle 的配置阶段，
    此时，所有在 Project 中创建的 Task，在创建时用于配置 Task 的实参闭包都会执行到；

4. 采用 task 'name' {...} 创建 task 时，其中的单引号可省略，即写成：task name {...}

5. task 创建后，taskName 作为 Project 的属性，可以直接在 build.gradle 中通过 taskName 调用 Task 的 API
```

**示例代码：**

![](./images/_06_task/01.png)

### 1.2 配置 `Task`

#### 1.2.1 `Task` 中可配置的属性

`org.gradle.api.Task` 类中定义了如下几个属性用于配置 `Task`。

##### 1.2.1.1 配置 `Task` 的名字：`name`

```groovy:no-line-numbers
String TASK_NAME = "name"
```

##### 1.2.1.2 配置 `Task` 的描述信息：`description`

```groovy:no-line-numbers
String TASK_DESCRIPTION = "description"
```

##### 1.2.1.3 配置 `Task` 的分组：`group`

```groovy:no-line-numbers
String TASK_GROUP = "group"
```

##### 1.2.1.4 配置 `Task` 的类型：`type`

```groovy:no-line-numbers
String TASK_TYPE = "type"
```

##### 1.2.1.5 配置 `Task` 所依赖的其他 `Task`：`dependsOn`

```groovy:no-line-numbers
String TASK_DEPENDS_ON = "dependsOn"
```

##### 1.2.1.6 配置 `Task` 用于重写 `overwrite` 属性指定的 `Task`：`overwrite`

```groovy:no-line-numbers
String TASK_OVERWRITE = "overwrite"
```

##### 1.2.1.7 配置 `Task` 的动作（即执行逻辑）：`action`

```groovy:no-line-numbers
String TASK_ACTION = "action"
```

#### 1.2.2 配置 `Task` 的 `2` 种方式

**方式一：**

```groovy:no-line-numbers
// 调用 Project 类提供的方法
Task task(Map<String, ?> args, String name, Closure configureClosure)

// 调用示例
task ([attrName1: attrValue1, attrName2: attrValue2, ...], 'taskName') {...}

// 还可以写成
// 其中，taskName 可以省略单引号，上面的书写形式中不可以省略
task taskName(attrName1: attrValue1, attrName2: attrValue2, ...) {...}
```

**方式二：**

```groovy:no-line-numbers
// 调用 Project 类提供的方法：
Task task(String name, Closure configureClosure)

// 调用示例
// 其中，1. taskName 可以省略单引号；2. 在实参闭包中设置 Task 属性
task taskName {
    attrName1 = attrValue1
    attrName2 = attrValue2
    ...
}
```

**注意：**

```:no-line-numbers
如果不设置 Task 的 group 属性，那么 Task 默认放在当前 Project 的 other 组中。
```

**示例代码：**

![](./images/_06_task/02.png)

## 2. `Task` 的动作集合 & `doLast` & `doFirst`

### 2.1 注意：只有通过 `Task` 才能将业务放在 `Gradle` 执行阶段去处理

### 2.2 `Task` 的动作集合就是 `Task` 在 `Gradle` 执行阶段才执行的代码

### 2.3 一个动作（`Action`）就是一段代码，动作集合就是代码段集合

### 2.4 向动作集合的头部插入一个动作：`doFirst(closure)`

```:no-line-numbers
doFirst(closure) 用于将实参闭包表示的动作插入到动作集合的头部。

注意：多次调用 doFirst(closure)，最后一次调用的 doFirst 配置的动作最先执行。
```

### 2.5 向动作集合的尾部插入一个动作：`doLast(closure)`

```:no-line-numbers
doLast(closure) 用于将实参闭包表示的动作插入到动作集合的尾部。

注意：多次调用 doLast(closure), 最后一次调用的 doLast 配置的动作最后执行。
```

### 2.6 示例代码

![](./images/_06_task/03.png)

### 2.7 案例：统计 `build` 时长

#### 2.7.1 如何查找所有存在的 `task`

```:no-line-numbers
调用 tasks.getByName(taskName) 可以查找指定的 task。另外，也可以通过 tasks 遍历所有存在的 task。

注意：
为了保证 tasks.getByName(taskName) 能够查找到所有存在的 task，应该在 Gradle 配置阶段完后，即所有 task 都配置完成后，
再调用 tasks.getByName(taskName) 方法。也就是说，应该在 Project.afterEvaluate(closure) 的实参闭包中调用该方法。
```

#### 2.7.2 案例代码

![](./images/_06_task/04.png)

## 3. `Task` 的执行顺序

## 4. `Task` 的输入输出

## 5. `Task` 的类型
