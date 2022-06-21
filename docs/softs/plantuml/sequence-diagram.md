---
title: 时序图（TODO）
category: 
  - 软件工具
tag:
  - 软件工具-PlantUML
---

> 参考： [《`PlantUML_Language_Reference_Guide_zh`》](https://plantuml.com/zh/guide) 中的 `时序图` 章节。

## 1. 开始 & 结束：`@startuml` & `@enduml`

一段表示一张 `UML` 图的 `PlantUML` 代码已 `@startuml` 开始，已 `@enduml` 结束

```:no-line-numbers
@startuml
...
@enduml
```

## 2. 显示地声明参与者对象

注意：也可以不显示地声明参与者对象，箭头的两端默认就是参与者对象的名称

### 2.1 使用关键字 `participant` 声明参与者对象

### 2.2 使用其它关键字声明不同图标表示的参与者对象

#### 2.2.1 `actor`（角色）

#### 2.2.2 `boundary`（边界）

#### 2.2.3 `control`（控制）

#### 2.2.4 `entity`（实体）

#### 2.2.5 `database`（数据库）

#### 2.2.6 `collections`（集合）

#### 2.2.7 `queue`（队列）

### 2.3 在声明参与者对象时起别名：`participant` <原名> `as` <别名>

### 2.4 示例：声明不同图标的参与者对象 & 起别名

```plantuml
@startuml
participant participant as Foo
actor actor as Foo1
boundary boundary as Foo2
control control as Foo3
entity entity as Foo4
database database as Foo5
collections collections as Foo6
queue queue as Foo7

Foo -> Foo1 : To actor
Foo -> Foo2 : To boundary
Foo -> Foo3 : To control
Foo -> Foo4 : To entity
Foo -> Foo5 : To database
Foo -> Foo6 : To collections
Foo -> Foo7 : To queue
@enduml
```

![](./images/sequence-diagram/01.png)

### 2.5 为参与者对象的背景框设置颜色 & 对参与者对象的名字分行显示

```plantuml
@startuml
' 可以使用 "#<颜色名>" 设置颜色
participant Bob #red

' 也可以使用 "#<十六进制颜色值>" 设置颜色
participant Alice #99FF99

' 可以使用 '\n' 对长名称进行换行
' 注意：当参与者对象的名称中存在转义字符时，需要用双引号括起来。
participant "很长很长很长\n的名字" as L #33CC77

Alice->Bob: 认证请求
Bob->Alice: 认证响应
Bob->L: 记录事务日志
@enduml
```

![](./images/sequence-diagram/02.png)

### 2.6 使用关键字 `order` 设置参与者对象的显示顺序优先级

```plantuml
@startuml
participant 最后 order 30
participant 中间 order 20
participant 首个 order 10
@enduml
```

![](./images/sequence-diagram/03.png)

## 3. 使用箭头

### 3.1 设置箭头的样式

```plantuml
@startuml
' Bob -> Alice 与 Alice <- Bob 一样，即：箭头的指向可以反过来
' 后面的所有类型的箭头的指向都可以这样反过来
Bob -> Alice
Alice <- Bob

Bob ->> Alice
Bob ->x Alice
Bob -\ Alice

Bob \\- Alice
Bob //-- Alice

Bob ->o Alice
Bob o\\-- Alice

Bob <-> Alice
Bob <->o Alice
@enduml
```

![](./images/sequence-diagram/04.png)

### 3.2 设置箭头的颜色

```plantuml
@startuml
Bob -[#red]> Alice : hello
Alice -[#0000FF]->Bob : ok
@enduml
```

![](./images/sequence-diagram/05.png)

## 4. 给自己发消息：`A -> A`

```plantuml
@startuml
Alice -> Alice: This is a signal to self.\nIt also demonstrates\nmultiline \ntext
@enduml
```

![](./images/sequence-diagram/06.png)

## 5. 让响应信息显示在箭头下面

可以使用 `skinparam responseMessageBelowArrow true` 命令，让响应信息显示在箭头下面：

> `skinparam` 命令的作用域是全局的，即 `skinparam responseMessageBelowArrow true` 命令会将所有的响应信息都显示在箭头下面

```plantuml
@startuml
participant Bob
participant Alice

Bob -> Alice : hello
Alice -> Bob : ok

skinparam responseMessageBelowArrow true

Bob -> Alice : hello
Alice -> Bob : ok

Bob -> Alice : hello
Alice -> Bob : ok
@enduml
```

![](./images/sequence-diagram/07.png)

## 6. 为发送的消息设置序号

### 6.1 使用关键字 `autonumber` 自动设置序号（从 `1` 开始，递增 `1`）

```plantuml
@startuml
autonumber
Bob -> Alice : Authentication Request
Bob <- Alice : Authentication Response
@enduml
```

![](./images/sequence-diagram/08.png)

### 6.2 指定序号的初始值：`autonumber <start>`

### 6.3 指定序号的初始值和递增值：`autonumber <start> <increment>`

注意：`autonumber` 命令只对命令后面的消息起作用。

```plantuml
@startuml
Bob -> Alice : Request
Bob <- Alice : Response
autonumber
Bob -> Alice : Request
Bob <- Alice : Response
autonumber 15
Bob -> Alice : Request
Bob <- Alice : Response
autonumber 40 10
Bob -> Alice : Request
Bob <- Alice : Response
@enduml
```

![](./images/sequence-diagram/09.png)

### 6.4 指定序号的格式

可以使用双引号字符串来指定序号的格式，其中可以使用 `HTML` 标签来设置格式样式。

```plantuml
@startuml
autonumber "<b>[000]"
Bob -> Alice : Request
Bob <- Alice : Response

' 0 和 # 都表示数字序号的占位符，即 "<b>(<u>##</u>)" 相当于 "<b>(<u>00</u>)"
autonumber 15 "<b>(<u>##</u>)"
Bob -> Alice : Request
Bob <- Alice : Response

autonumber 40 10 "<font color=red><b>Message 0 "
Bob -> Alice : Request
Bob <- Alice : Response
@enduml
```

![](./images/sequence-diagram/10.png)

### 6.5 暂停设置序号 & 继续设置序号

可以使用 `autonumber stop` 暂停设置序号。

可以使用 `autonumber resume <increment> <format>` 继续设置序号

```plantuml
@startuml
autonumber 10 10 "<b>[000]"
Bob -> Alice : Request
Bob <- Alice : Response

autonumber stop
Bob -> Alice : dummy

autonumber resume "<font color=red><b>Message 0 "
Bob -> Alice : Request
Bob <- Alice : Response

autonumber stop
Bob -> Alice : dummy

autonumber resume 1 "<font color=blue><b>Message 0 "
Bob -> Alice : Request
Bob <- Alice : Response
@enduml
```

![](./images/sequence-diagram/11.png)

## 7. 对消息进行分组：`alt/else`、`opt`、`loop`、`par`、`break`、`critical`、`group`

`alt/else`、`opt`、`loop`、`par`、`break`、`critical`、`group` 这些不同类型的分组都是以关键字 `end` 结束的。

示例 `1`：多种类型的分组嵌套使用

```plantuml
@startuml
Alice -> Bob: 认证请求

' alt 后可以跟多个 else 子语句，以 end 结尾
alt 成功情况
    Bob -> Alice: 认证接受
else 某种失败情况
    Bob -> Alice: 认证失败
    group 我自己的标签
        Alice -> Log : 开始记录攻击日志
        loop 1000次
            Alice -> Bob: DNS 攻击
        end
        Alice -> Log : 结束记录攻击日志
    end
else 另一种失败
    Bob -> Alice: 请重复
end
@enduml
```

![](./images/sequence-diagram/12.png)

示例 `2`：在 `group` 分组中显示次级分组条件

```plantuml
@startuml
Alice -> Bob: 认证请求
Bob -> Alice: 认证失败

' 通过 "[]" 设置 group 分组的次级条件
group 我自己的标签 [我自己的标签2]
    Alice -> Log : 开始记录攻击日志
    loop 1000次
        Alice -> Bob: DNS攻击
    end
    Alice -> Log : 结束记录攻击日志
end
@enduml
```

![](./images/sequence-diagram/13.png)

## 8. 在 `UML` 图中添加注释文本

### 8.1 设置注释文本的相对位置：`note left of`、`note right of`、`note over`

### 8.2 设置注释文件框的背景颜色

### 8.3 对注释文件进行换行：使用 `end note` 命令 或 `'\n'` 转义字符

```plantuml
@startuml
participant Alice
participant Bob

note left of Alice #aqua
This is displayed
left of Alice.
end note

note right of Alice: This is displayed right of Alice.

note over Alice: This is displayed over Alice.

note over Alice, Bob #FFAAAA: This is displayed\n over Bob and Alice.

note over Bob, Alice
This is yet another
example of
a long note.
end note

@enduml
```

![](./images/sequence-diagram/14.png)

### 8.4 设置注释文本框的形状：`hnote` & `rnote`

`hnote` 表示六边形（`hexagonal`）的注释文本框。

`rnote` 代表正方形（`rectangle`）的注释文本框。

```plantuml
@startuml
caller -> server : conReq
hnote over caller : 空闲

caller <- server : conConf
rnote over server
"r"是正方形
"h"是六边形
endrnote

rnote over server
多行
文本
endrnote

hnote over caller
多行
文本
endhnote
@enduml
```

![](./images/sequence-diagram/15.png)

### 8.5 注释横跨多个参与者对象：`note over <first>,<last>` & `note across`

```plantuml
@startuml
Alice->Bob:m1
Bob->Charlie:m2

note over Alice, Charlie: 创建跨越所有参与者对象的注释文本的旧方法：\n ""note over //FirstPart, LastPart//"".

note across: 新方法：\n""note across""

Bob->Alice

hnote across: 跨越所有参与者对象的注释文本。
@enduml
```

![](./images/sequence-diagram/16.png)

### 8.6 同一行的多个注释文本水平对齐：`/ note ...`

默认情况下，多个注释文本不是对齐的。而使用 "`/`" 开头的 `note` 命令可以与之前的同一行注释水平对齐 。

未对齐时：

```plantuml
@startuml
note over Alice : Alice的初始状态
note over Bob : Bob的初始状态
Bob -> Alice : hello
@enduml
```

![](./images/sequence-diagram/17.png)

水平对齐时：

```plantuml
@startuml
note over Alice : Alice的初始状态
/ note over Bob : Bob的初始状态
Bob -> Alice : hello
@enduml
```

![](./images/sequence-diagram/18.png)

## 9. 使用分隔符 `==` 将 `UML` 图分隔成多个逻辑步骤

```plantuml
@startuml
== 初始化 ==
Alice -> Bob: 认证请求
Bob --> Alice: 认证响应

== 重复 ==
Alice -> Bob: 认证请求
Alice <-- Bob: 认证响应
@enduml
```

![](./images/sequence-diagram/19.png)

## 10. 使用 `...` 表示延迟 & 在延迟中添加注释

```plantuml
@startuml
Alice -> Bob: 认证请求
Bob --> Alice: 认证响应

...

Bob --> Alice: 认证响应

...5分钟后...

Bob --> Alice: 再见！
@enduml
```

![](./images/sequence-diagram/20.png)

## 11. 消息文本换行：`'\n'` 或 `skinparam maxMessageSize <size>` 命令

你可以通过手动在文本中添加转义字符 `'\n'` 使长文本换行。

或者使用 `skinparam maxMessageSize <size>` 命令设置一行的宽度（此方式暂不支持中文换行）

```plantuml
@startuml
skinparam maxMessageSize 50
participant a
participant b
a -> b :这\n一条\n是\n手动换行
a -> b :this is a very long message on several words
@enduml
```

![](./images/sequence-diagram/21.png)

## 12. 使用 `|||` 增加消息与消息之间的垂直高度

注意：使用 `|||` 时可以指定增加的高度像素值。

```plantuml
@startuml
Alice -> Bob: message 1
Bob --> Alice: ok
|||
Alice -> Bob: message 2
Bob --> Alice: ok
||45||
Alice -> Bob: message 3
Bob --> Alice: ok
@enduml
```

![](./images/sequence-diagram/22.png)

## 13. 设置参与者对象的生命周期

### 13.1 激活 & 取消 & 终结生命周期：`activate` & `deactivate` & `destroy`

激活参与者对象的生命周期：`activate <name>`

取消激活参与者对象的生命周期：`deactivate <name>`

终结参与者对象的生命周期：`destroy <name>`

```plantuml
@startuml
participant User

User -> A: DoWork
activate A
    A -> B: << createRequest >>
    activate B
        B -> C: DoWork
        activate C
            C --> B: WorkDone
        destroy C
        B --> A: RequestCreated
    deactivate B
    A -> User: Done
deactivate A
@enduml
```

![](./images/sequence-diagram/23.png)

### 13.2  生命线框的嵌套 & 设置生命线框的颜色

```plantuml
@startuml
participant User

User -> A: DoWork
activate A #FFBBBB
    A -> A: Internal call
    activate A #DarkSalmon
        A -> B: << createRequest >>
        activate B
            B --> A: RequestCreated
        deactivate B
    deactivate A
    A -> User: Done
deactivate A
@enduml
```

![](./images/sequence-diagram/24.png)

### 13.3 自动激活 & 取消上一次激活并返回消息：`autoactivate on` & `return`

执行 `autoactivate on` 命令后，每次发送消息时，都会激活接收消息的参与者对象的生命周期，且可以嵌套激活。

执行 `return` 命令时，取消上一次激活（即最近一次的激活）并返回消息。

> 如果取消激活时不需要返回消息，则使用 `deactivate` 命令，不要使用 `return`。

```plantuml
@startuml
participant User

autoactivate on 
User -> A #FFBBBB: DoWork
    A -> A #DarkSalmon: Internal call
        A -> B: << createRequest >>
        return RequestCreated
    ' 如果取消激活后不返回消息，则使用 deactivate，只有返回消息的情况下才使用 return
    deactivate A
return Done
@enduml
```

![](./images/sequence-diagram/25.png)

## 14. 发送消息时创建参与者对象

通过 `create <name>` 命令创建参与者对象。

在创建时可以声明不同图标的参与者对象，也可以在创建时起别名：`create [participant|actor|...] <name> as <别名>`

> 不指定参与者对象的图标类型时，默认使用 `participant` 类型。

`create` 命令会作用于下一条发送消息的语句，创建接收消息的参与者对象

```plantuml
@startuml
Bob -> Alice : hello

create Other
Alice -> Other : new

' 可以创建不同图标的参与者对象，也可以在创建时起别名
create database Users as U
Alice -> U

note right : You can also put notes!

Alice --> Bob : ok
@enduml
```

![](./images/sequence-diagram/26.png)

## 15. 激活/取消激活生命周期 & 创建参与者对象的快捷方式（使用操作符）

在发送消息的同时可以通过指定的操作符来声明激活/取消激活参与者对象的生命周期，以及声明创建参与者对象。

操作符如下：

1. 激活接收消息的参与者对象的生命周期：`++`

2. 取消激活 **发送消息的参与者对象** 的生命周期：`--`

3. 创建接收消息的参与者对象：`**`

4. 销毁接收消息的参与者对象：`!!`

示例：

```plantuml
@startuml
/'
    操作符 ++ 调用了三次，表示激活了三次生命周期（即 UML 图中存在三条生命周期线框），
    于是，应该调用三次操作符 --，或者调用三次 return 命令。
'/
alice -> bob ++ : hello
bob -> bob ++ : self call
bob -> bib ++ #005500 : hello
bob -> george ** : create
return done
return rc
bob -> george !! : delete
return success
@enduml
```

![](./images/sequence-diagram/27.png)

### 15.1 在一条发送消息的语句上同时进行激活和取消激活的操作

示例 `1`：

```plantuml
/'
    A -> B --++ : Message
    其中："--" 表示取消激活 A 的生命周期
          "++" 表示激活 B 的生命周期
'/
@startuml
alice -> bob ++ : hello1
bob -> charlie --++ : hello2
charlie --> alice -- : ok
@enduml
```

![](./images/sequence-diagram/28.png)

示例 `2`：

```plantuml
@startuml
/'
    在操作符之后可设置生命周期线框的背景颜色值
'/
alice -> bob --++ #gold: hello
bob -> alice --++ #gold: you too
alice -> bob --: step1
alice -> bob : step2
@enduml
```

![](./images/sequence-diagram/29.png)

## 16. 不指定发送方的消息（输入消息） & 不指定接收方的消息（输出消息）

可以使用 "`[`" 代替非箭头端的发送方，表示不指定发送方的情况下发送消息。

可以使用 "`]`" 代替箭头端的接收方，表示不指定接收方的情况下发送消息。

示例 `1`：

```plantuml
@startuml
[-> A: DoWork
activate A
    A -> A: Internal call
    activate A
        A ->] : << createRequest >>
        A<--] : RequestCreated
    deactivate A
    [<- A: Done
deactivate A
@enduml
```

![](./images/sequence-diagram/30.png)

示例 `2`：不同类型的箭头中使用 "`[`" 和 "`]`"

```plantuml
@startuml
participant Alice
participant Bob #lightblue
Alice -> Bob
Bob -> Carol
...
[-> Bob
[o-> Bob
[o->o Bob
[x-> Bob
...
[<- Bob
[x<- Bob
...
Bob ->]
Bob ->o]
Bob o->o]
Bob ->x]
...
Bob <-]
Bob x<-]
@enduml
```

![](./images/sequence-diagram/31.png)

### 16.1 缩短输入/输出消息的箭头长度

使用 "`?`" 代替 "`[`" 和 "`]`" 可以让箭头长度缩短：

```plantuml
@startuml
participant Alice
participant Bob
[-> Bob : message
?-> Bob : message

Alice -> Bob : 维持 Alice 与 Bob 之间的水平间距\n让 "?" 的效果更明显

Alice ->] : message
Alice ->? : message
@enduml
```

![](./images/sequence-diagram/32.png)

## 17. 通过设置锚点消息来指定多条消息的持续时间

一开始，需要添加 `!pragma teoz true` 命令开启此功能。

通过 "`{<anchorName>} A -> B : message`" 设置锚点消息，同时指定锚点名称。

通过 "`{<anchorName1>} <-> {<anchorName2>} : duration time`" 指定锚点与锚点之间的多条消息的持续时间。

```plantuml
@startuml
!pragma teoz true

{start} Alice -> Bob : start doing things during duration

Bob -> Max : something
Max -> Bob : something else

{end} Bob -> Alice : finish

{start} <-> {end} : some time
@enduml
```

![](./images/sequence-diagram/33.png)

## 18. 声明参与者对象时指定参与者对象的类型

使用 "`<<Type>>`" 声明参与者对象的类型。

同时可以使用 "`(X, color)`" 声明对象的类型是类（`C`）、或接口（`I`）、或枚举（`E`）。

示例 `1`：

```plantuml
@startuml
participant "Little Bob" as Bob <<Student>>
participant Alice <<(C,#ADD1B2) Teacher>>

Bob->Alice: First message
@enduml
```

![](./images/sequence-diagram/34.png)

示例 `2`：

```plantuml
@startuml
participant Bob <<(C,#ADD1B2)>>
participant Alice <<(C,#ADD1B2)>>

Bob->Alice: First message
@enduml
```

![](./images/sequence-diagram/35.png)

## 19. 将多个参与者包裹在一个区域中

可以使用 `box` 和 `end box` 画一个盒子将参与者包裹起来。

同时可以在 `box` 关键字之后添加包裹区域的标题或者背景颜色。

```plantuml
@startuml
box "Internal Service" #LightBlue
participant Bob
participant Alice
end box

participant Other

Bob -> Alice : hello
Alice -> Other : hello
@enduml
```

![](./images/sequence-diagram/36.png)

## 20. 将参与者的底部脚注移除掉

使用 `hide footbox` 关键字移除脚注。

```plantuml
@startuml
hide footbox

Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
@enduml
```

![](./images/sequence-diagram/37.png)

## 21. 设置 UML 图的标题 & 页眉 & 页脚

使用 `title` 关键词增加标题

使用 `header` 关键词增加页眉

使用 `footer` 关键词增加页脚

```plantuml
@startuml
header Page Header
footer Page %page% of %lastpage%
title Example Title

Alice -> Bob : message 1
Alice -> Bob : message 2
@enduml
```

![](./images/sequence-diagram/38.png)

## 22. 隐藏未使用到的参与者对象

默认情况下会显示所有参与者。

可以使用 `hide unlinked` 命令来隐藏未被链接到的参与者。

示例 `1`：未隐藏时

```plantuml
@startuml
participant Alice
participant Bob
participant Carol

Alice -> Bob : hello
@enduml
```

![](./images/sequence-diagram/39.png)

示例 `2`：隐藏时

```plantuml
@startuml
hide unlinked

participant Alice
participant Bob
participant Carol

Alice -> Bob : hello
@enduml
```

![](./images/sequence-diagram/40.png)