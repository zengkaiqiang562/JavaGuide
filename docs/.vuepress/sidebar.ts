import { defineSidebarConfig } from "vuepress-theme-hope";

export const sidebarConfig = defineSidebarConfig({
  // 应该把更精确的路径放置在前边

  "/android/": [//Android相关的Blog
    {
      text: "UI",
      collapsable: true,
      prefix: "ui/",
      children: [
        "RecyclerView",
        "ConstraintLayout",
        "CoordinatorLayout",
        "NestedScrolling",
        "animation",
        "view-event",
        "view-tools",
      ],
    },
  ],

  "/resume/": [//个人简历
    {
      text: "技能列表",
      collapsable: false,
      prefix: "skill-list/",
      children: [
        {
          text: "个人优势",
          collapsable: true,
          prefix: "personal-advantage/",
          children: [
            "java-reflect", // 反射机制
            "java-annotation", // 注解技术
            "java-genericity", // 泛型编程
            // "design-model", // 设计模式（单例模式，代理模式，工厂模式，建造者模式，外观模式等 ）
            {
              text: "设计模式",
              collapsable: true,
              prefix: "design-pattern/",
              children: [
                "object-oriented-design-principles",
                "Singleton-Pattern",
                "Proxy-Pattern",
                "Factory-Pattern",
                "Builder-Pattern",
                "Facade-Pattern",
              ]
            },
            "android-custom-view", // 自定义View
            "android-ui-draw-process", // UI绘制流程
            "android-event-dispatch-mechanism", // 事件分发机制
            "android-memory-optimize", // 内存优化
            "android-layout-optimize", // 布局优化
            "frame-okhttp", // OkHttp框架
            "frame-rxjava", // RxJava框架
            "frame-retrofit", // Retrofit框架
            "frame-glide", // Glide框架
            "frame-eventbus", // EventBus框架
            "architecture-mvc-mvp-mvvm", // MVC/MVP/MVVM 模式
          ]
        },
        {
          text: "VCAT+重构",
          prefix: "vcat-plus-refactor/",
          collapsable: true,
          children: [
            "component-design", // 组件化设计（ARouter框架）
            "kotlin-program", // Kotlin编程语言
            "migrate-androidx", // Support库迁移至AndroidX的步骤和要点
          ]
        },
        {
          text: "VCAT+",
          prefix: "vcat-plus/",
          collapsable: true,
          children: [
            "netease-nimlib-sdk", // 网易云信SDK的使用方式和要点
            "recyclerview", // RecyclerView的基本使用，自定义LayoutManager，无限轮播的实现方式，ViewHolder的回收复用
            "smartrefreshlayout", // SmartRefreshLayout实现下拉刷新的原理
            "lottie", // Lottie动画的使用场景和使用方式，怎样结合SmartRefreshLayout实现自定义刷新动画
            "realm", // Realm数据库的特点和使用方式
            "reactnative", // ReactNative混合开发的流程
            "hot-fix", // 热修复的概念，Sophix热修复框架的使用方式
            "ping-plus-plus", // Ping++ SDK的特点和使用方式
            "leakcanary", // LeakCanary监测内存的原理
          ]
        },
        {
          text: "即时猫",
          prefix: "instant-cat/",
          collapsable: true,
          children: [
            "constraintlayout", // ConstraintLayout约束布局的特点和使用方式
            "coordinatorlayout", // CoordinatorLayout布局的使用场景，如何实现折叠效果
            "frame-MPAndroidChart", // MPAndroidChart的使用方式和绘制图表的原理
            "frame-PickerView", // PickerView的使用方式和实现原理
            "plugin-switch-skin", // 插件化的概念，动态换肤的实现原理
            "android-camera2", // Camera2的使用方式，如何实现人脸检测的
            "frame-gson", // Gson框架的使用方式和实现原理
          ]
        },
        {
          text: "党建展厅",
          prefix: "party-oto/",
          collapsable: true,
          children: [
            "viewpager-fragment-lazy-load", // ViewPager+Fragment如何实现懒加载
            "frame-rxjava", // RxJava的使用方式和实现原理
            "frame-retrofit", // Retrofit的使用方式和实现原理
            "frame-okhttp", // OkHttp的使用方式和实现原理
            "frame-glide", // Glide的使用方式和实现原理
            "frame-glide-transformations", // glide-transformations如何实现图片转换的（如怎么得到圆角图或圆形图的）
            "frame-GSYVideoPlayer", // GSYVideoPlayer的特点，使用方式和实现原理
            "frame-RichText", // RichText的使用方式和实现原理
            "viewpager-auto-play", // ViewPager的自动轮播是怎样实现的
          ]
        },
        {
          text: "车载音乐",
          prefix: "car-music/",
          collapsable: true,
          children: [
            "android-AsyncTask", // AsyncTask的使用场景，使用方式和实现原理
            "frame-GreenDao", // GreenDao的特点，使用方式和实现原理
            "java-thread-pool", // 线程池的特点，使用方式，几个参数的意义，常用的线程池
            "java-RandomAccesFile", // RandomAccesFile的特点和使用方式
            "breakpoint-download", // 如何实现断点下载的，
            "real-network-speed-and-download-speed", // 如何获取实时网速，如何获取下载进度
            "recyclerview-refresh-methods", // RecyclerView的几个刷新列表的方法的区别
            "android-ContentResolver-MediaStore", // ContentProvider的作用，使用方式，MediaStore的作用，
            "id3-intro", // 什么是ID3信息
            "android-MediaPlayer", // MediaPlayer的使用方式和状态图
            "background-play", // 如何实现后台播放功能
            "lyric-sync", // 自定义控件如何实现lrc歌词的同步显示
          ]
        },
        {
          text: "车载控制系统",
          prefix: "car-control-system/",
          collapsable: true,
          children: [
            "binder", // binder通信的概念，两个进程间如何实现binder通信
            "aidl", // aidl的概念和使用方式
            "XmlPullParser", // XmlPullParser的使用方式
            "abstract-factory-model", // 什么是抽象工厂模式
            "proxy-model", // 什么是静态代理模式和动态代理模式
            "frame-eventbus", // EventBus的特点，使用方式和实现原理
          ]
        },
        {
          text: "车载收音机",
          prefix: "car-fmam/",
          collapsable: true,
          children: [
            "architecture-mvc-mvp-mvvm", // MVC/MVP/MVVM 的概念，特点，区别
            "viewpager-fragment-lazy-load", // ViewPager+Fragment如何实现懒加载
            "android-RemoteViews", // RemoteViews的作用，和普通View的区别，使用场景
            "android-AppWidget", // 桌面小部件的实现方式
            "android-ListView-RecyclerView-compare", // ListView和RecyclerView的区别，如何选择
            "frame-PullToRefresh", // PullToRefresh实现上拉刷新的原理
            "frame-Universal-Image-Loader", // Universal Image Loader 的实现原理，和Glide的区别
            "ListView-RecyclerView-scroll-event-listener", // ListView和RecyclerView中各自如何监听列表滑动事件
            "android-FrameAnimation", // 帧动画的使用方式
          ]
        },
        {
          text: "远东支付",
          prefix: "yd-pay/",
          collapsable: true,
          children: [
            "custom-circle-menu", // 自定义圆形转盘控件的实现原理
            "bezier-line-draw", // 如何绘制贝塞尔曲线，如何实现手签功能
            "android-AsyncTask", // AsyncTask的使用场景，使用方式和实现原理
            "frame-HttpClient-Okhttp-compare", // HttpClient的使用方式，和OkHttp的区别
            "traditional-bluetooth-and-ble", // 传统蓝牙和BLE蓝牙的概念，区别
            "ble-characteristic", // BLE蓝牙中什么是特征值
            "android-api-traditional-bluetooth", // 传统蓝牙API的使用方式（如何进行扫描，连接，通信）
            "android-api-ble-bluetooth", // BLE蓝牙API的使用方式
          ]
        },
        {
          text: "其他",
          prefix: "others/",
          collapsable: true,
          children: [
            "serializable-and-parcelable", // 对象序列化的概念，Serializeable实现序列化的方式，Parcelable实现序列化的方式，这两种方式的区别和使用场景
            "greendao-realm-compare", // GreenDao和Realm的对比，如何选择
            "android-nested-scroll", // 嵌套滑动的实现方式和原理
            "android-Anim", // 帧动画，补间动画，属性动画各自的概念，特点，使用场景。什么是插值器，什么是估值器
            "java-thread", // 线程
            "java-jmm", // Java内存模型——底层原理
            "android-handler", // 消息机制
            "tcp-handshake",
            {
              text: "JVM",
              prefix: "jvm/",
              collapsable: true,
              children: [
                "jvm-spec",
                "classloader",
                "memory-allocate",
                "class-exe-engine",
                "gc",
                "concurrence",
              ]
            }
          ]
        }
      ],
    }
  ],

  "/javaguide/": ["intro", "contribution-guideline", "faq", "todo"],
  "/zhuanlan/": ["java-mian-shi-zhi-bei", "handwritten-rpc-framework"],
  "/open-source-project/": [
    "tutorial",
    "practical-project",
    "system-design",
    "tool-library",
    "tools",
    "machine-learning",
    "big-data",
  ],
  "/about-the-author/": [
    {
      text: "个人经历",
      icon: "zuozhe",
      collapsable: false,
      children: [
        "internet-addiction-teenager",
        "javaguide-100k-star",
        "feelings-after-one-month-of-induction-training",
        "feelings-of-half-a-year-from-graduation-to-entry",
      ],
    },
    {
      text: "杂谈",
      icon: "chat",
      collapsable: false,
      children: [
        "my-article-was-stolen-and-made-into-video-and-it-became-popular",
        "dog-that-copies-other-people-essay",
        "zhishixingqiu-two-years",
      ],
    },
  ],
  "/high-quality-technical-articles/": [
    {
      text: "练级攻略",
      icon: "et-performance",
      prefix: "advanced-programmer/",
      collapsable: false,
      children: ["seven-tips-for-becoming-an-advanced-programmer"],
    },
    {
      text: "个人经历",
      icon: "zuozhe",
      prefix: "personal-experience/",
      collapsable: false,
      children: [
        "two-years-of-back-end-develop--experience-in-didi&toutiao",
        "8-years-programmer-work-summary",
      ],
    },
    {
      text: "面试",
      icon: "mianshi",
      prefix: "interview/",
      collapsable: false,
      children: [
        "the-experience-and-thinking-of-an-interview-experienced-by-an-older-programmer",
        "technical-preliminary-preparation",
        "screen-candidates-for-packaging",
      ],
    },
    {
      text: "工作",
      icon: "work0",
      prefix: "work/",
      collapsable: false,
      children: ["get-into-work-mode-quickly-when-you-join-a-company"],
    },
  ],
  // 必须放在最后面
  "/": [
    {
      text: "面试准备",
      icon: "mianshi",
      prefix: "interview-preparation/",
      collapsable: true,
      children: [
        "teach-you-how-to-prepare-for-the-interview-hand-in-hand",
        "interview-experience",
      ],
    },
    {
      text: "Java",
      icon: "java",
      prefix: "java/",
      collapsable: true,
      children: [
        {
          text: "基础",
          prefix: "basis/",
          icon: "basic",
          collapsable: true,
          children: [
            "java-basic-questions-01",
            "java-basic-questions-02",
            "java-basic-questions-03",
            {
              text: "重要知识点",
              icon: "important",
              collapsable: true,
              children: [
                "why-there-only-value-passing-in-java",
                "serialization",
                "reflection",
                "proxy",
                "io",
                "bigdecimal",
              ],
            },
          ],
        },
        {
          text: "容器",
          prefix: "collection/",
          icon: "container",
          collapsable: true,
          children: [
            "java-collection-questions-01",
            "java-collection-questions-02",
            "java-collection-precautions-for-use",
            {
              text: "源码分析",
              collapsable: true,
              children: [
                "arraylist-source-code",
                "hashmap-source-code",
                "concurrent-hash-map-source-code",
              ],
            },
          ],
        },
        {
          text: "并发编程",
          prefix: "concurrent/",
          icon: "et-performance",
          collapsable: true,
          children: [
            "java-concurrent-questions-01",
            "java-concurrent-questions-02",
            {
              text: "重要知识点",
              icon: "important",
              collapsable: true,
              children: [
                "java-thread-pool-summary",
                "java-thread-pool-best-practices",
                "java-concurrent-collections",
                "aqs",
                "reentrantlock",
                "atomic-classes",
                "threadlocal",
                "completablefuture-intro",
              ],
            },
          ],
        },
        {
          text: "JVM",
          prefix: "jvm/",
          icon: "virtual_machine",
          collapsable: true,
          children: [
            "memory-area",
            "jvm-garbage-collection",
            "class-file-structure",
            "class-loading-process",
            "classloader",
            "jvm-parameters-intro",
            "jvm-intro",
            "jdk-monitoring-and-troubleshooting-tools",
          ],
        },
        {
          text: "新特性",
          prefix: "new-features/",
          icon: "features",
          collapsable: true,
          children: [
            "java8-common-new-features",
            "java8-tutorial-translate",
            "java9",
            "java10",
            "java11",
            "java12-13",
            "java14-15",
          ],
        },
      ],
    },
    {
      text: "计算机基础",
      icon: "computer",
      prefix: "cs-basics/",
      collapsable: true,
      children: [
        {
          text: "网络",
          prefix: "network/",
          icon: "network",
          collapsable: true,
          children: [
            "osi&tcp-ip-model",
            "http&https",
            "http1.0&http1.1",
            "other-network-questions",
          ],
        },
        {
          text: "操作系统",
          prefix: "operating-system/",
          icon: "caozuoxitong",
          collapsable: true,
          children: [
            "operating-system-basic-questions-01",
            "linux-intro",
            "shell-intro",
          ],
        },
        {
          text: "数据结构",
          prefix: "data-structure/",
          icon: "people-network-full",
          collapsable: true,
          children: [
            "linear-data-structure",
            "graph",
            "heap",
            "tree",
            "red-black-tree",
            "bloom-filter",
          ],
        },
        {
          text: "算法",
          prefix: "algorithms/",
          icon: "suanfaku",
          collapsable: true,
          children: [
            "string-algorithm-problems",
            "linkedlist-algorithm-problems",
            "the-sword-refers-to-offer",
          ],
        },
      ],
    },
    {
      text: "数据库",
      icon: "database",
      prefix: "database/",
      collapsable: true,
      children: [
        "basis",
        "character-set",
        {
          text: "MySQL",
          prefix: "mysql/",
          icon: "mysql",
          collapsable: true,
          children: [
            "mysql-questions-01",
            "a-thousand-lines-of-mysql-study-notes",
            "mysql-high-performance-optimization-specification-recommendations",
            {
              text: "重要知识点",
              icon: "important",
              collapsable: true,
              children: [
                "mysql-index",
                "mysql-logs",
                "transaction-isolation-level",
                "innodb-implementation-of-mvcc",
                "how-sql-executed-in-mysql",
                "some-thoughts-on-database-storage-time",
                "index-invalidation-caused-by-implicit-conversion",
              ],
            },
          ],
        },
        {
          text: "Redis",
          prefix: "redis/",
          icon: "redis",
          collapsable: true,
          children: [
            "redis-questions-01",
            {
              text: "重要知识点",
              icon: "important",
              collapsable: true,
              children: [
                "3-commonly-used-cache-read-and-write-strategies",
                "redis-memory-fragmentation",
              ],
            },
          ],
        },
      ],
    },
    {
      text: "开发工具",
      icon: "Tools",
      prefix: "tools/",
      collapsable: true,
      children: [
        {
          text: "Git",
          icon: "git",
          prefix: "git/",
          collapsable: true,
          children: ["git-intro", "github-tips"],
        },
        {
          text: "Docker",
          icon: "docker1",
          prefix: "docker/",
          collapsable: true,
          children: ["docker-intro", "docker-in-action"],
        },
        {
          text: "IDEA",
          icon: "intellijidea",
          link: "https://gitee.com/SnailClimb/awesome-idea-tutorial",
        },
      ],
    },
    {
      text: "系统设计",
      icon: "xitongsheji",
      prefix: "system-design/",
      collapsable: true,
      children: [
        "system-design-questions",
        {
          text: "基础",
          prefix: "basis/",
          icon: "basic",
          collapsable: true,
          children: ["RESTfulAPI", "naming", "refactoring"],
        },
        {
          text: "常用框架",
          prefix: "framework/",
          icon: "framework",
          collapsable: true,
          children: [
            {
              text: "Spring",
              prefix: "spring/",
              collapsable: true,
              children: [
                "spring-knowledge-and-questions-summary",
                "spring-common-annotations",
                "spring-transaction",
                "spring-design-patterns-summary",
                "spring-boot-auto-assembly-principles",
              ],
            },
            "mybatis/mybatis-interview",
            "netty",
            {
              text: "SpringCloud",
              prefix: "springcloud/",
              children: ["springcloud-intro"],
            },
          ],
        },
        {
          text: "安全",
          prefix: "security/",
          icon: "security-fill",
          collapsable: true,
          children: [
            "basis-of-authority-certification",
            "advantages&disadvantages-of-jwt",
            "sso-intro",
            "sentive-words-filter",
            "data-desensitization",
          ],
        },
        "schedule-task",
      ],
    },
    {
      text: "分布式",
      icon: "distributed-network",
      prefix: "distributed-system/",
      collapsable: true,
      children: [
        {
          text: "理论&算法&协议",
          prefix: "theorem&algorithm&protocol/",
          collapsable: true,
          children: ["cap&base-theorem", "paxos-algorithm", "raft-algorithm"],
        },
        "api-gateway",
        "distributed-id",
        {
          text: "RPC",
          prefix: "rpc/",
          collapsable: true,
          children: ["dubbo", "why-use-rpc"],
        },
        "distributed-transaction",
        {
          text: "分布式协调",
          prefix: "distributed-process-coordination/",
          collapsable: true,
          children: [
            "zookeeper/zookeeper-intro",
            "zookeeper/zookeeper-plus",
            "zookeeper/zookeeper-in-action",
          ],
        },
      ],
    },
    {
      text: "高性能",
      icon: "et-performance",
      prefix: "high-performance/",
      collapsable: true,
      children: [
        "read-and-write-separation-and-library-subtable",
        "load-balancing",
        {
          text: "消息队列",
          prefix: "message-queue/",
          icon: "MQ",
          collapsable: true,
          children: [
            "message-queue",
            "kafka-questions-01",
            "rocketmq-intro",
            "rocketmq-questions",
            "rabbitmq-intro",
          ],
        },
      ],
    },
    {
      text: "高可用",
      icon: "CalendarAvailability-1",
      prefix: "high-availability/",
      collapsable: true,
      children: [
        "high-availability-system-design",
        "limit-request",
        "fallback&circuit-breaker",
        "timeout-and-retry",
        "cluster",
        "disaster-recovery&remote-live",
        "performance-test",
      ],
    },
  ],
});
