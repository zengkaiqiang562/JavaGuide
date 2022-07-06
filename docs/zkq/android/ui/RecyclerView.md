---
title: RecyclerView（TODO）
category: 
  - UI
tag:
  - UI
---

> 参考：《`Android` 自定义控件高级进阶与精彩实例》 第 `7` 章>
> 
> 参考：[再也不用担心面试问RecyclerView了](https://www.jianshu.com/p/443d741c7e3e)
> 
> 参考：[控件：RecycleView](https://www.jianshu.com/p/fe168045a378)
> 
> 参考：[RecyclerView面试必问](https://zhuanlan.zhihu.com/p/414702218)
> 
> 参考：[【进阶】RecyclerView源码解析(一)——绘制流程](https://www.jianshu.com/p/c52b947fe064)

## 1. `RecyclerView` 概述

### 1.1 添加依赖

如果还没有迁移到 `Androidx`，那么添加如下的 `support` 依赖：

```groovy:no-line-numbers
implementation 'com.android.support:recyclerview-v7:28.0.0'
```

如果迁移到了 `Androidx`，那么添加如下依赖：

```groovy:no-line-numbers
implementation 'androidx.recyclerview:recyclerview:1.1.0'
```

### 1.2 `RecyclerView` 的基本使用

#### 1.2.1 在界面的 `xml` 布局文件中引入 `RecyclerView`

```xml:no-line-numbers
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".LinearActivity">

    <android.support.v7.widget.RecyclerView
        android:id="@+id/linear_recycler_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    </android.support.v7.widget.RecyclerView>

</android.support.constraint.ConstraintLayout>
```

#### 1.2.2 定义 `Adapter` 类（继承自 `RecyclerView.Adapter<RecyclerView.ViewHolder>`）

```java:no-line-numbers
public class RecyclerAdapter extends RecyclerView.Adapter<ViewHolder> {

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        return null;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {

    }

    @Override
    public int getItemCount() {
        return 0;
    }
}
```

当自定义一个继承自 `RecyclerView.Adapter<RecyclerView.ViewHolder>` 的 `Adapter` 类时，如下三个函数是必须重写的：

1. `onCreateViewHolder`
2. `onBindViewHolder`
3. `getItemCount`

##### 1.2.2.1 重写 `onCreateViewHolder` 方法

```java:no-line-numbers
/* RecyclerView.Adapter<VH extends ViewHolder> */
public abstract VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType);
```

重写 `onCreateViewHolder` 方法用于返回一个继承自 `RecyclerView.ViewHolder` 的自定义 `ViewHolder` 对象。

> 在 `RecyclerView` 中，通过 `ViewHolder` 来承载列表中每个 `item` 视图内的控件元素。

##### 1.2.2.2 重写 `onBindViewHolder` 方法

```java:no-line-numbers
/* RecyclerView.Adapter<VH extends ViewHolder> */
public abstract void onBindViewHolder(@NonNull VH holder, int position);
```

重写 `onBindViewHolder` 方法将数据集合中索引位置 `position` 上的数据与 `holder` 中的视图绑定起来。

##### 1.2.2.3 重写 `getItemCount` 方法

```java:no-line-numbers
/* RecyclerView.Adapter<VH extends ViewHolder> */
public abstract int getItemCount();
```

重写 `getItemCount` 方法用于返回 `RecyclerView` 的列表中 `item` 视图的总个数。

> 一般情况下，`item` 视图的总个数就是数据集合中的数据总个数。

##### 1.2.2.4 通过 `Adapter` 的构造函数传入列表数据集合

通常，填充在 `RecyclerView` 列表的 `item` 视图中的数据都是从外部传入到 `Adapter` 中的。因此，在定义 `Adapter` 类的构造函数时，通常会声明一个集合类型的参数用于将数据传入到 `Adapter` 中保存起来。

```java:no-line-numbers
public class RecyclerAdapter extends RecyclerView.Adapter<ViewHolder> {

    private Context mContext;
    private ArrayList<String> mDatas;

    public RecyclerAdapter(Context context, ArrayList<String> datas) {
        mContext = context;
        mDatas = datas;
    }
    ...
}
```

##### 1.2.2.5 定义 `ViewHolder` 类（继承自 `RecyclerView.ViewHolder`）

`ViewHolder` 就是用来承载 `RecyclerView` 列表中每个 `item` 视图内的控件元素的。

通过将 `item` 布局文件中的控件以变量的形式保存在 `ViewHolder` 中，以便于在 `onBindViewHolder` 方法中进行数据和视图的绑定。

所以首先需要创建 `item` 视图的布局文件，然后将布局文件中的控件对象的引用保存在 `ViewHolder` 的成员变量中。

###### 1.2.2.5.1 为 `ViewHolder` 显示的 `item` 创建 `xml` 布局文件

```xml:no-line-numbers
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:background="@android:color/holo_green_dark"
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <TextView
        android:id="@+id/item_tv"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:padding="10dp"/>

</LinearLayout>
```

###### 1.2.2.5.1 将 `item` 布局文件中的控件对象保存在 `ViewHolder` 中

```java:no-line-numbers
/* RecyclerView.java */
public abstract static class ViewHolder {
    ...
    public final View itemView;
    ...
    public ViewHolder(@NonNull View itemView) {
        if (itemView == null) {
            throw new IllegalArgumentException("itemView may not be null");
        }
        this.itemView = itemView;
    }
    ...
}
```

在自定义 `ViewHolder` 的构造函数中，需要调用父类 `ViewHolder` 的构造函数，将 `item` 布局文件的根视图 `itemView` 传给父类。

一般情况下，会在 `onCreateViewHolder` 函数中解析 `item` 布局文件得到其根视图 `itemView` ，然后创建 `ViewHolder` 对象时传给 `ViewHolder` 的构造函数。

自定义的 `ViewHolder` 的示例代码如下：

```java:no-line-numbers
public class NormalHolder extends RecyclerView.ViewHolder {
    public TextView mTV;

    public NormalHolder(View itemView) {
        super(itemView); // 将 item 布局文件的根视图 itemView 传给父类

        mTV = (TextView) itemView.findViewById(R.id.item_tv);
        mTV.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(mContext, mTV.getText(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
```

##### 1.2.2.6 完整的简单 `Adapter` 类的代码示例

```java:no-line-numbers
public class RecyclerAdapter extends RecyclerView.Adapter<ViewHolder> {

    private Context mContext;
    private ArrayList<String> mDatas;

    public RecyclerAdapter(Context context, ArrayList<String> datas) {
        mContext = context;
        mDatas = datas;
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        /*
            在 onCreateViewHolder 中：
            1. 通过 LayoutInflater 解析 item 布局文件，得到布局文件的根视图 itemView
            2. 创建 NormalHolder 对象，并传入 itemView。

            注意：
            这里调用 inflate 方法解析 item 布局文件时，第三个参数 attachToRoot 必须传入 false，
            表示不将 itemView 添加到 parent（parent 就是 RecyclerView） 中，
            此时，传入参数 parent 的作用就是为了在解析 item 布局文件时提供 LayoutParams
        */
        LayoutInflater inflater = LayoutInflater.from(mContext);
        return new NormalHolder(inflater.inflate(R.layout.item_layout, parent, false));
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        /*
            在 onBindViewHolder 方法中将数据集合 mDatas 中索引位置 position 处的数据
            绑定到 holder 中保存的 item 视图中的控件 mTV 上。
        */
        NormalHolder normalHolder = (NormalHolder) holder;
        normalHolder.mTV.setText(mDatas.get(position));
    }

    @Override
    public int getItemCount() {
        /*
            返回数据集合 mDatas 中的数据总个数。
            此时，集合中的数据有多少个，RecyclerView 列表中的 item 视图就有多少个。
        */
        return mDatas.size();
    }

    public class NormalHolder extends RecyclerView.ViewHolder {
        public TextView mTV;

        public NormalHolder(View itemView) {
            super(itemView);

            mTV = (TextView) itemView.findViewById(R.id.item_tv);
            mTV.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Toast.makeText(mContext, mTV.getText(), Toast.LENGTH_SHORT).show();
                }
            });
        }
    }
}
```

#### 1.2.3 为 `RecyclerView` 设置 `Adapter`

在 `Activity`/`Fragment` 界面中，当获取到 `RecyclerView` 对象，并创建了自定义的 `Adapter` 对象后，需要调用 `RecyclerView` 的 `setAdapter(adapter)` 方法将 `Adapter` 对象绑定到 `RecyclerView` 中。

```java:no-line-numbers
/* RecyclerView.java */
public void setAdapter(@Nullable Adapter adapter)
```

示例代码如下：

```java:no-line-numbers
public class LinearActivity extends AppCompatActivity {
    private ArrayList<String> mDatas = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_linear);

        // 生成测试数据集
        for (int i = 0; i < 200; i++) {
            mDatas.add("第 " + i + " 个item");
        }

        RecyclerView mRecyclerView = (RecyclerView) findViewById(R.id.linear_recycler_view);

        // 将 adapter 绑定到 RecyclerView 中
        RecyclerAdapter adapter = new RecyclerAdapter(this, mDatas);
        mRecyclerView.setAdapter(adapter);
        ...
    }
}
```

#### 1.2.4 为 `RecyclerView` 设置 `LayoutManager`

在 `RecyclerView` 列表中，`item` 视图的布局是通过 `LayoutManager` 实现的，不同的 `LayoutManager` 可以实现不同的 `item` 视图的布局效果（如垂直布局、水平布局、瀑布流布局等）

> 通过自定义 `LayoutManager`，甚至可以实现各种各样的 `item` 布局效果。

因此，除了将 `adapter` 绑定到 `RecyclerView` 之外，还需要调用 `RecyclerView` 的 `setLayoutManager(layout)` 方法指定该 `RecyclerView` 列表中 `item` 视图的布局效果。

```java:no-line-numbers
/* RecyclerView.java */
public void setLayoutManager(@Nullable LayoutManager layout)
```

示例代码如下：

```java:no-line-numbers
public class LinearActivity extends AppCompatActivity {
    private ArrayList<String> mDatas = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_linear);

        // 生成测试数据集
        for (int i = 0; i < 200; i++) {
            mDatas.add("第 " + i + " 个item");
        }

        RecyclerView mRecyclerView = (RecyclerView) findViewById(R.id.linear_recycler_view);

        // 将 adapter 绑定到 RecyclerView 中
        RecyclerAdapter adapter = new RecyclerAdapter(this, mDatas);
        mRecyclerView.setAdapter(adapter);
        
        // 设置 RecyclerView 列表中 item 视图的布局效果为垂直方向上的线性布局
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        linearLayoutManager.setOrientation(LinearLayoutManager.VERTICAL);
        mRecyclerView.setLayoutManager(linearLayoutManager);
    }
}
```

### 1.3 常见的三种 `LayoutManager`

#### 1.3.1 `LinearLayoutManager`

#### 1.3.2 `GridLayoutManager`

#### 1.3.3 `StaggeredGridLayoutManager`

### 1.4 为不同位置的列表 `item` 加载不同类型的 `View` 视图：`getItemViewType`

## 2. 添加分割线：`ItemDecoration`

### 2.1 什么是 `ItemDecoration`

### 2.2 为 RecyclerView 设置默认的 `ItemDecoration` 分割线

### 2.3 自定义 `ItemDecoration` 实现不同效果的分割线

## 3. 自定义 `LayoutManager`

## 4. `RecyclerView` 的回收复用机制