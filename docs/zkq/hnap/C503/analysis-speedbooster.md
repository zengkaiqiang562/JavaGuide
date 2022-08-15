---
title: 竞品分析（SpeedBooster）
category: 
  - HNAP 
tag:
  - C503 
---

## 1. 架构

```:no-line-numbers
MainActivity

-- MainFragment（ViewPager）

---- HomeFragment
------ CleanJunkFragment // 垃圾文件
------ PhoneBoostFragment // 电话提升（手机加速的意思）
------ CpuCoolerFragment // CPU 散热器
------ BatterySaverFragment // 省电

---- ToolsFragment

---- SettingFragment
```

## 2. 申请的权限

```xml:no-line-numbers
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.USE_FINGERPRINT"/>
<uses-permission android:name="android.permission.VIBRATE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.CLEAR_APP_CACHE"/>
<uses-permission android:name="android.permission.GET_PACKAGE_SIZE"/>
<uses-permission android:name="android.permission.KILL_BACKGROUND_PROCESSES"/>
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS"/>
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>
<uses-permission android:name="android.permission.GET_TASKS"/>
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
<uses-permission android:name="android.permission.SYSTEM_OVERLAY_WINDOW"/>
<uses-permission android:name="com.android.launcher.permission.UNINSTALL_SHORTCUT"/>
<uses-permission android:name="com.android.launcher.permission.INSTALL_SHORTCUT"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.REQUEST_DELETE_PACKAGES"/>
<uses-permission android:name="android.permission.WAKE_LOCK"/>
```

## 3. 使用到的开源项目

```:no-line-numbers
1. https://github.com/deano2390/MaterialShowcaseView  // 引导

2. https://github.com/Karumi/Dexter  // 权限请求
```

## 4. HomeFragment

四个选项的点击事件：

```java:no-line-numbers
/* HomeFragment_ViewBinding.java */
private View f4314c;
private View f4315d;
private View f4316e;
private View f;
public HomeFragment_ViewBinding(HomeFragment homeFragment, View view) {
    this.f4313b = homeFragment;
    homeFragment.mViewPager = (ViewPager) g.c(view, R.id.view_pager, "field 'mViewPager'", ViewPager.class);
    homeFragment.mPageIndicator = (CircleIndicator) g.c(view, R.id.page_indicator, "field 'mPageIndicator'", CircleIndicator.class);
    View a2 = g.a(view, (int) R.id.feature_junk_files, "method 'doJunkFiles'");
    this.f4314c = a2;
    a2.setOnClickListener(new a(homeFragment));
    View a3 = g.a(view, (int) R.id.feature_phone_boost, "method 'doPhoneBoost'");
    this.f4315d = a3;
    a3.setOnClickListener(new b(homeFragment));
    View a4 = g.a(view, (int) R.id.feature_battery_saver, "method 'doBatterySaver'");
    this.f4316e = a4;
    a4.setOnClickListener(new c(homeFragment));
    View a5 = g.a(view, (int) R.id.feature_cpu_cooler, "method 'doCpuCooler'");
    this.f = a5;
    a5.setOnClickListener(new d(homeFragment));
}
```

```java:no-line-numbers
/* HomeFragment_ViewBinding.java */
class a extends butterknife.c.c {
    final /* synthetic */ HomeFragment f;

    a(HomeFragment homeFragment) {
        this.f = homeFragment;
    }

    public void a(View view) {
        this.f.doJunkFiles();
    }
}

class b extends butterknife.c.c {
    final /* synthetic */ HomeFragment f;

    b(HomeFragment homeFragment) {
        this.f = homeFragment;
    }

    public void a(View view) {
        this.f.doPhoneBoost();
    }
}

class c extends butterknife.c.c {
    final /* synthetic */ HomeFragment f;

    c(HomeFragment homeFragment) {
        this.f = homeFragment;
    }

    public void a(View view) {
        this.f.doBatterySaver();
    }
}

class d extends butterknife.c.c {
    final /* synthetic */ HomeFragment f;
    
    d(HomeFragment homeFragment) {
        this.f = homeFragment;
    }

    public void a(View view) {
        this.f.doCpuCooler();
    }
}
```

### 4.1 点击垃圾文件

```java:no-line-numbers
/* HomeFragment.java */
@OnClick({2131296516})
public void doJunkFiles() { // 点击 垃圾文件
    String str = "android.permission.READ_EXTERNAL_STORAGE";
    String str2 = "android.permission.WRITE_EXTERNAL_STORAGE";
    if (a((Context) requireActivity(), str, str2)) { // 当申请到了读写权限时才执行 if 语句中的代码
        if (s()) {
            b(new CleanJunkFragment());
        } else {
            u();
        }
        return;
    }

    // 申请读写权限
    Dexter.withContext(requireActivity()).withPermissions(str, str2).withListener(new b()).check();
}
```

```java:no-line-numbers
/* HomeFragment.java */
private boolean a(@h0 Context context, @h0 @q0(min = 1) String... strArr) { // 遍历数组中的权限是否已申请到了
    if (VERSION.SDK_INT < 23) {
        return true;
    }
    for (String a2 : strArr) {
        if (androidx.core.content.c.a(context, a2) != 0) {
            return false;
        }
    }
    return true;
}

/* androidx.core.content.c.java */
public static int a(@h0 Context context, @h0 String str) { // 判断权限 str 是否已申请到
    if (str != null) {
        return context.checkPermission(str, Process.myPid(), Process.myUid());
    }
    throw new IllegalArgumentException("permission is null");
}
```

```java:no-line-numbers
/* HomeFragment.java */
class b extends BaseMultiplePermissionsListener {
    b() {
    }

    public void onPermissionRationaleShouldBeShown(List<PermissionRequest> list, PermissionToken permissionToken) {
        super.onPermissionRationaleShouldBeShown(list, permissionToken);
        permissionToken.continuePermissionRequest();
    }

    public void onPermissionsChecked(MultiplePermissionsReport multiplePermissionsReport) { // 权限弹框中点击 "禁止" 或 "始终允许" 后返回
        super.onPermissionsChecked(multiplePermissionsReport);
        if (!multiplePermissionsReport.areAllPermissionsGranted()) { // 点击禁止时走 if 语句
            n0.a((Activity) HomeFragment.this.requireActivity(), 11, (OnClickListener) l0.f4375d); // 弹框提示用户去设置中开启权限
        } else if (HomeFragment.this.s()) { // 点击始终允许后，再判断 s()
            HomeFragment.this.requireActivity().o().b().b(R.id.main_layout, new CleanJunkFragment()).a("CleanJunkFragment").g(); // 显示 CleanJunkFragment
        } else {
            HomeFragment.this.u();
        }
    }
}

/* BaseMultiplePermissionsListener.java */
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
public class BaseMultiplePermissionsListener implements MultiplePermissionsListener {
    public void onPermissionRationaleShouldBeShown(List<PermissionRequest> list, PermissionToken permissionToken) {
        permissionToken.continuePermissionRequest();
    }

    public void onPermissionsChecked(MultiplePermissionsReport multiplePermissionsReport) {
    }
}
```

```java:no-line-numbers
/* com.bsoft.core.n0.java */
public static void a(Activity activity, int i, DialogInterface.OnClickListener onClickListener) {
    a(activity, -1, i, onClickListener);
}

public static void a(Activity activity, int i, int i2, DialogInterface.OnClickListener onClickListener) {
    a aVar; // Dialog 弹框
    if (i == -1) {
        aVar = new a(activity);
    } else {
        aVar = new a(activity, i);
    }
    aVar.d(n.title_need_permissions); // 注意
    aVar.c(n.msg_need_permission); // 此应用需要获得使用此功能的权限，您可以在应用设置中授予它们。
    aVar.d(n.goto_settings, new g(activity, i2)); // 设置
    aVar.b(17039360, onClickListener);
    aVar.a(false);
    aVar.c();
}

/* com.bsoft.core.g.java */
public final class g implements OnClickListener {

    public g(Activity activity, int i) {
        this.f4649d = activity;
        this.f4650e = i;
    }

    public final void onClick(DialogInterface dialogInterface, int i) {
        n0.a(this.f4649d, this.f4650e);
    }
}

/* com.bsoft.core.n0.java */
public static void a(Activity activity, int i) {
    Intent intent = new Intent("android.settings.APPLICATION_DETAILS_SETTINGS"); // 跳转到开启权限的页面
    intent.setData(Uri.fromParts("package", activity.getPackageName(), null));
    activity.startActivityForResult(intent, i);
}
```

```java:no-line-numbers
public boolean s() {
    if (VERSION.SDK_INT < 21) { // API 21 是 Android 5.0
        return true;
    }
    boolean z = false;
    try {
        PackageManager packageManager = requireActivity().getPackageManager();
        if (packageManager != null) {
            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(requireActivity().getPackageName(), 0);
            // "appops" => Context.APP_OPS_SERVICE
            // "android:get_usage_stats" => AppOpsManager.OPSTR_GET_USAGE_STATS
            // 调用 AppOpsManager 的 checkOpNoThrow 方法检查 app 是否可以访问  UsageStatsManager
            // 访问  UsageStatsManager 需要在 AndroidManifest.xml 中添加 "android.permission.PACKAGE_USAGE_STATS" 权限（该权限不需要动态申请）
            if (((AppOpsManager) requireActivity().getSystemService("appops")).checkOpNoThrow("android:get_usage_stats", applicationInfo.uid, applicationInfo.packageName) == 0) {
                z = true;
            }
        }
    } catch (NameNotFoundException unused) {
    }
    return z;
}
```

```java:no-line-numbers
public void b(Fragment fragment) { // 将 fragment 添加到 View 容器（R.id.main_layout）中
    requireActivity().o().b().b(R.id.main_layout, fragment).a(fragment.getClass().getSimpleName()).f();
}
```

```java:no-line-numbers
public void u() {
    androidx.appcompat.app.c.a aVar = new androidx.appcompat.app.c.a(this.f4384d, R.style.AlertDialogTheme);
    StringBuilder sb = new StringBuilder();
    sb.append(getString(R.string.for_android_5));
    sb.append(getString(R.string.request_permit_usage));
    // sb.toString() =>  适用于Android 5.0或以上，您必须允许使用速度助推器的使用权限，以便您可以使用此功能。

    // R.string.permit 允许
    aVar.a((CharSequence) sb.toString()).a(false).c((CharSequence) getString(R.string.permit), (OnClickListener) new m0(this)).b(17039360, (OnClickListener) k0.f4372d).c();
}
```

```java
/* com.bsoft.cleanmaster.fragment.m0.java */
public final class m0 implements OnClickListener {

    private final HomeFragment f4378d;

    public m0(HomeFragment homeFragment) {
        this.f4378d = homeFragment;
    }

    public final void onClick(DialogInterface dialogInterface, int i) {
        this.f4378d.a(dialogInterface, i);
    }
}

/* HomeFragment.java */
public void a(DialogInterface dialogInterface, int i) {
    j o = requireActivity().o();
    com.bsoft.cleanmaster.c.a aVar = new com.bsoft.cleanmaster.c.a();
    aVar.a(false);
    aVar.a(o, com.bsoft.cleanmaster.c.a.class.getSimpleName());
    dialogInterface.dismiss();
}


/* com.bsoft.cleanmaster.c.a.java */
public class a extends b implements OnClickListener { // a 应该是一个 DialogFragment，是 "需要许可" 的弹框
    private static final int A = 303;

    private void a(View view) {
    }

    private void b(View view) {
        view.findViewById(R.id.btn_enable).setOnClickListener(this);
    }

    private void c(View view) {
        a(view);
        b(view);
    }

    private void u() {
        if (VERSION.SDK_INT >= 23 && Settings.canDrawOverlays(getContext())) {
            getContext().startService(new Intent(getContext(), GuideUsageAccess.class));
        }
    }

    private void v() {
        n();
    }

    public void onActivityResult(int i, int i2, Intent intent) {
        super.onActivityResult(i, i2, intent);
        if (i == A) {
            v();
        }
    }

    public void onClick(View view) {
        if (view.getId() == R.id.btn_enable) {
            startActivityForResult(new Intent("android.settings.USAGE_ACCESS_SETTINGS"), A); // 点击启用后跳转的界面
            u();
        }
    }

    public View onCreateView(@h0 LayoutInflater layoutInflater, ViewGroup viewGroup, Bundle bundle) {
        return layoutInflater.inflate(R.layout.fragment_dialog_permission_usage, viewGroup, false);
    }

    public void onViewCreated(@h0 View view, @i0 Bundle bundle) {
        super.onViewCreated(view, bundle);
        p().requestWindowFeature(1);
        c(view);
    }
}
```

#### 4.1.1 申请读写权限时的弹框

1. 请求时的弹框

    ![](./images/analysis-speedbooster/01.png)

2. 点击禁止时的弹框

    ![](./images/analysis-speedbooster/02.png)

3. 点击设置时跳转到开启权限的页面

    ![](./images/analysis-speedbooster/03.png)

#### 4.1.2 申请访问 `UsageStatsManager` 的弹框（执行 `HomeFragment` 中的 `u()` 方法）

1. 需要许可的弹框

    ![](./images/analysis-speedbooster/04.png)

2. 点击启用按钮后的界面

    ![](./images/analysis-speedbooster/05.png)

3. 点击速度助推器项后的界面

    ![](./images/analysis-speedbooster/06.png)

### 4.2 点击电话提升（手机加速）

```java:no-line-numbers
@OnClick({2131296517})
public void doPhoneBoost() { // 点击 电话提升（手机加速）
    if (s()) {
        b(new PhoneBoostFragment());
    } else {
        u();
    }
}
```

### 4.3 点击 `CPU` 散热器 

```java:no-line-numbers
@OnClick({2131296515})
public void doCpuCooler() {
    if (s()) {
        a((Fragment) new CpuCoolerFragment());
    } else {
        u();
    }
}

```

### 4.4 点击省电

```java:no-line-numbers
@OnClick({2131296514})
public void doBatterySaver() {
    if (s()) {
        a((Fragment) new BatterySaverFragment());
    } else {
        u();
    }
}
```

## 参考

[Android-读取已安装应用列表](https://www.jianshu.com/p/45e295e12bde)

[Android 读取已安装应用列表需要申请权限吗？](https://www.jianshu.com/p/dee8bc1fb847)

[Android 如何完整的获取到用户已安装应用列表](https://blog.csdn.net/q384415054/article/details/72972405)
