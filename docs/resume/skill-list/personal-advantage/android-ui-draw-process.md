---
title: UI绘制流程（DOING）
category: android
tag:
  - android
---

**基于Android 6.0**

## 从启动 `Activity` 到 `UI` 绘制的时序图

```sequence
participant A as Activity
participant I as Instrumentation
participant WMI as WindowManagerImpl
participant LA as LoadedApk
participant AT as ActivityThread
participant ATH as ActivityThread.H
participant APPT as ActivityThread.ApplicationThread
participant AMS as ActivityManagerService
participant ASS as ActivityStackSupervisor
participant AS as ActivityStack

A ->> A : startActivity
A ->> A : startActivityForResult
A ->> I : execStartActivity
I ->> AMS : startActivity
AMS ->> AMS : startActivityAsUser
AMS ->> ASS : startActivityMayWait
ASS ->> ASS : startActivityLocked
ASS ->> ASS : startActivityUncheckedLocked
ASS ->> AS : startActivityLocked
AS ->> ASS : resumeTopActivitiesLocked
ASS ->> AS : resumeTopActivityLocked
AS ->> AS : resumeTopActivityInnerLocked
AS ->> ASS : startSpecificActivityLocked
ASS ->> ASS : realStartActivityLocked
ASS ->> APPT : scheduleLaunchActivity
APPT ->> ATH : sendMessage(H.LAUNCH_ACTIVITY, r)
ATH ->> AT : handleLaunchActivity
activate AT
AT ->> AT : performLaunchActivity
activate AT
AT ->> I : newActivity
I -->> AT : return Activity
AT ->> LA : makeApplication
alt mApplication != null
LA -->> AT : return mApplication
else mApplication == null
LA ->> I : newApplication
I -->> LA : return app
LA -->> AT : return mApplication
end
AT ->> A : attach
AT ->> I : callActivityOnCreate
I ->> A : performCreate
A ->> A : onCreate
AT ->> A : performStart
A ->> I : callActivityOnStart
I ->> A : onStart
deactivate AT
AT ->> AT : handleResumeActivity
activate AT
AT ->> AT : performResumeActivity
activate AT
AT ->> A : performResume
A ->> A : performRestart
activate A
opt mStopped == true
A ->> I : callActivityOnRestart
I ->> A : onRestart
A ->> A : performStart
I ->> A : callActivityOnStart
A ->> A : onStart
end
deactivate A
A ->> I : callActivityOnResume
I ->> A : onResume
deactivate AT
AT ->> WMI : wm.addView(decor, l)
Note over AT,WMI: wm在Activity的构造方法中调用PhoneWindow.setWindowManager时创建
deactivate AT
deactivate AT
```

> 执行 `wm.addView(decor, l)` 时，开始进入 `UI` 的绘制流程，也就是说，`UI` 的绘制是在执行完 `Activity.onResume` 方法之后才开始的。

```sequence
participant WMI as WindowManagerImpl
participant WMG as WindowManagerGlobal
participant VRI as ViewRootImpl
participant D as DecorView
participant C as Choreographer
WMI ->> WMG : addView(view, params, ...)
WMG ->> WMG : root = new ViewRootImpl(...)
WMG ->> VRI : root = setView(view, wparams, ...)
VRI ->> VRI : requestLayout()
activate VRI
VRI ->> VRI : scheduleTraversals()
VRI ->> C : postCallback(Choreographer.CALLBACK_TRAVERSAL, mTraversalRunnable, ...)
deactivate VRI
C ->> VRI : mTraversalRunnable.run()
VRI ->> VRI : doTraversal()

VRI ->> VRI : performTraversals()
activate VRI

%% 测量流程
opt layoutRequested is true
VRI ->> VRI : measureHierarchy
activate VRI
VRI ->> VRI : performMeasure
VRI ->> D : measure
D ->> D : onMeasure
deactivate VRI
end
Note over VRI : 以上是首次测量流程，但测量流程可能会重复多次

%% 布局流程
opt didLayout is true
VRI ->> VRI : performLayout
activate VRI
VRI ->> D : layout
D ->> D : onLayout
deactivate VRI
end

%% 绘画流程
VRI ->> VRI : performDraw
activate VRI
VRI ->> VRI : draw
VRI ->> VRI : drawSoftware
VRI ->> D : draw
D ->> D : onDraw
deactivate VRI

deactivate VRI
```

> `Android 6.0` 中，`DecorView` 还是 `PhoneWindow` 的内部类


## `Window`，`ViewRootImpl`，`DecorView` 三者的关系

## `VSync` 信号 和 `Choreographer` 编舞者

### 屏幕刷新机制

## `UI`绘制中的测量过程

### `MeasureSpec`

### 多次测量的原因

## `UI`绘制中的布局过程

## `UI`绘制中的绘画过程

## `Surface` 和 `Canvas` 的作用