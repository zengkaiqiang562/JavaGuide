---
title: linux文件管理
category:
  - linux
tag:
  - linux
---

## 1. `linux` 目录结构

![](./images/_04_linux_file_manage/01.png)

### 1.1 命令目录：`/bin --> /usr/bin`、`/sbin --> /usr/sbin`

```:no-line-numbers
/bin --> /usr/bin
存放命令，一般来说，普通用户和 root 用户都可以运行。

/sbin --> /usr/sbin
存在特殊命令，一般来说，root 用户才可以运行。当然，普通用户可以申请操作的权限。
```

### 1.2 用户家目录：`/home`、`/root`

```:no-line-numbers
/home
是普通用户的家目录

/root
是超级管理员的家目录
```

### 1.3 配置文件目录：`/etc`

```:no-line-numbers
/etc
用于存储配置文件的命令，如：
1. 修改 IP 地址：/etc/sysconfig/network-scripts/ifcfg-xxx
2. 修改主机名称：/etc/hostname

修改完配置文件后如何生效？
1. 有的配置在修改后立即生效，即运行命令程序时即可生效。
2. 有的配置在修改后需要重启系统才能生效。
```

### 1.4 启动目录：`/boot`

```:no-line-numbers
/boot
存储系统启动时加载的文件，比如：内核文件、Grub 菜单、救援内核系统等
注意：如果删除启动目录中的文件，可能会造成无法启动系统的问题。
```

### 1.5 设备目录：`/dev`

```:no-line-numbers
/dev
设备目录中主要存放：键盘、光盘、磁盘、终端、/dev/null、/dev/random 等设备文件。
```

#### 1.5.1 黑洞：`/dev/null`

```:no-line-numbers
黑洞文件，存储在这个设备文件中的数据都会丢失。
```

#### 1.5.2 产生随机数：`dev/random`

```:no-line-numbers
产生随机数。
```

### 1.6 临时目录：`/tmp`

```:no-line-numbers
/tmp
谁都可以存储数据在该临时目录中。但是自己的数据只能自己移除，别人只能看却无法移除。
```

### 1.7 可变目录：`/var`

```:no-line-numbers
/var
可变是指会随着系统的运行（运行会产生一些数据、记录）而不断地发生变化。

/var/log
存储日志的目录，如：启动日志、系统操作日志、系统登录日志等。
```

### 1.8 运行时目录：`/proc`

```:no-line-numbers
/proc
记录设备（如 CPU、内存、磁盘）运行状态。
```

### 1.9 系统目录：`/usr`

```:no-line-numbers
/usr
和 windows 中的 C:\program files 目录类似。

/usr/lib, /usr/lib64
存放的是库文件

/usr/local
存放自行安装软件的路径（安装后的位置）。注：现在不用这种方式了

/usr/src
存放安装包（安装前的软件存储路径）。注：现在不用这种方式了
```

## 2. 文件路径

```:no-line-numbers
绝对路径：一定是从 / 开始的。即从 / 开始的路径都是绝对路径。
相对路径：相对于当前所在目录的路径。
```

```:no-line-numbers
.
表示当前目录

..
表示上一级目录
```