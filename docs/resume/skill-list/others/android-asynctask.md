---
title: AsyncTask
category: 
  - android
tag:
  - android
---

## 1. `AsyncTask` 的介绍及适用场景

`AsyncTask` 是一种轻量级的异步任务类。通过 `AsyncTask` 可以将任务提交到线程池中执行，然后把执行的进度和最终的结果传递给主线程去更新 `UI`。

从实现上看，`AsyncTask` 封装了 `Thread` 和 `Handler`。

`AsyncTask` 并不适合进行特别耗时的后台任务，对于特别耗时的任务来说，建议使用线程池。

## 2. `AsyncTask` 的 `3` 个泛型参数

`AsyncTask` 是一个抽象的泛型类，声明了三个泛型参数：

```java:no-line-numbers
public abstract class AsyncTask<Params, Progress, Result> {...}
```

### 2.1 `Params`

表示提交和处理任务时，所传入的参数的类型。

1. 通过调用 `execute(Params... params)` 方法或 `executeOnExecutor(Executor exec, Params... params)` 方法提交任务。

2. 通过回调 `doInBackground(Params... params)` 方法执行任务。

### 2.2 `Progress`

表示任务的执行进度值的类型。

1. 需要在重写的 `doInBackground` 方法中，主动调用 `publishProgress(Progress... values)` 更新进度。

2. 每调用一次 `publishProgress` 方法，都会在主线程中回调一次 `onProgressUpdate(Progress... values)` 方法。于是，重写 `onProgressUpdate` 方法，将传入的参数进度值更新在 `UI` 中即可。

### 2.3 `Result`

表示任务的结果数据的类型。

1. 重写 `Result doInBackground(Params... params)` 方法时，需要返回任务的结果数据。

2. `doInBackground` 方法返回的结果数据会回调给 `onPostExecute(Result result)` 方法。`onPostExecute` 方法在主线程中执行，于是重写 `onPostExecute` 方法时，可以将传入的结束数据更新到 `UI` 中。

## 3. `AsyncTask` 的 `4` 个核心方法

### 3.1 `onPreExecute()`

```java:no-line-numbers
@MainThread
protected void onPreExecute() {}
```

```:no-line-numbers
1. 在主线程中执行。
2. 在 doInBackground 方法执行之前调用，用来做一些准备工作。
```

### 3.2 `doInBackground(Params... params)`

```java:no-line-numbers
@WorkerThread
protected abstract Result doInBackground(Params... params);
```

```:no-line-numbers
1. 在子线程中执行。
2. 用来处理一个具体的线程任务。
3. 重写此方法时，调用 publishProgress 方法可更新任务的执行进度。调用 publishProgress 方法后会在主线程中回调 onProgressUpdate 方法。
4. 需要返回一个任务执行完成后的结果数据。返回的结果数据会回调给在主线程中执行的 onPostExecute 方法。
```

### 3.3 `onProgressUpdate(Progress...values)`

```java:no-line-numbers
@MainThread
protected void onProgressUpdate(Progress... values) {}
```

```:no-line-numbers
1. 在主线程中执行。
2. 用于处理传入的任务执行进度值。如显示在 UI 中。
```

### 3.4 `onPostExecute(Result result)`

```java:no-line-numbers
@MainThread
protected void onPostExecute(Result result) {}
```

```:no-line-numbers
1. 在主线程中执行。
2. 在 doInBackground 方法执行之后调用，用来处理任务完成后的收尾工作。
```

## 4. `AsyncTask` 取消任务

### 4.1 调用 `cancel` 方法取消任务

```java:no-line-numbers
/*
    mayInterruptIfRunning 为 true 表示允许中断正在执行的任务
*/
boolean cancel(boolean mayInterruptIfRunning)
```

```:no-line-numbers
一个 AsyncTask 对象只能提交一个任务，调用 cancel 方法有如下几种情况：
1. 如果 AsyncTask 提交的任务已经执行完了，那么 cancel 方法会返回 false。
2. 如果 AsyncTask 提交的任务还没有执行，那么就不会再执行。
3. 如果 AsyncTask 提交的任务正在执行，那么：
    1. 当参数 mayInterruptIfRunning 为 false 时，正在执行的任务会继续执行完；
    2. 当参数 mayInterruptIfRunning 为 true 时，会向任务所在的线程发出中断。 

注意：
1. 调用 cancel 方法后，如果任务正在执行，那么 doInBackground 执行完后，
    不会再回调 onPostExecute 方法，而是回调 onCancelled 方法。
2. 在 doInBackground 方法中，可以通过 isCancelled() 方法判断任务是否取消了。
    对于取消了的任务，应该尽快地结束 doInBackground 方法的执行。
```

### 4.2 任取取消后的回调 `onCancelled()` 

```java:no-line-numbers
/*
    任务取消后，不会回调 onPostExecute(Result result) 了，
    如果想得到取消后的任务的结果，可以重写 onCancelled(Result result) 方法
*/
protected void onCancelled(Result result) {
    onCancelled();
} 

protected void onCancelled() {}
```

## 5. `AsyncTask` 在使用时的注意事项

`AsyncTask` 在使用时的注意事项如下：

1. `AsyncTask` 对象必须在主线程中创建。
   
2. `AsyncTask` 对象的 `execute` 方法和 `executeOnExecutor` 方法必须在主线程中调用。

3. 一个 `AsyncTask` 对象只能执行一次线程任务。即一个 `AsyncTask` 对象的 `execute` 方法或 `executeOnExecutor` 方法只能被开发者主动调用一次，否则会报异常。

4. `onPreExecute`、`doInBackground`、`onProgressUpdate`、`onPostExecute`、`onCancelled` 这些方法都只是在 `AsyncTask` 内部被动回调的方法，开发者不能主动调用它们。

5. 在同一个进程中，所有调用 `execute` 方法的各个 `AsyncTask` 对象是串行执行任务的。

    > 即：同一进程，同一时间，对于调用 `execute` 方法开始执行线程任务的所有 `AsyncTask` 对象的集合中，只有一个 `AsyncTask` 对象在执行线程任务。

6. 可以通过调用 `executeOnExecutor` 方法来并行地执行任务。

### 5.1 通过 `execute` 方法串行执行任务

```java:no-line-numbers
/*
    只是简单地将任务 runnable 放入到线程池 sDefaultExecutor 中执行，
    任务没有输入的参数，也没有返回的结果。
    不会回调 onPreExecute、doInBackground、onProgressUpdate、onPostExecute 这些方法
    无法通过调用 cancel 方法取消任务，也不会回调 onCancelled 方法
*/
@MainThread
public static void execute(Runnable runnable) {
    sDefaultExecutor.execute(runnable);
}

/*
    构建一个 mFuture 任务放入到线程池 sDefaultExecutor 中执行。
    任务可以输入参数 params，也有返回结果。
    会回调 onPreExecute、doInBackground、onProgressUpdate、onPostExecute 这些方法
    可以通过调用 cancel 方法取消任务，并会回调 onCancelled 方法
*/
@MainThread
public final AsyncTask<Params, Progress, Result> execute(Params... params) {
    return executeOnExecutor(sDefaultExecutor, params);
}
```

### 5.2 通过 `executeOnExecutor` 方法并行执行任务

```java:no-line-numbers
/*
    与 execute(Params... params) 方法的区别是：executeOnExecutor 方法可以传入自定义的线程池 exec。
    execute 方法中，sDefaultExecutor 变量引用的是 SERIAL_EXECUTOR 线程池，通过该线程池只能串行执行任务，
    而 executeOnExecutor 方法允许传入一个可以并行执行任务的自定义线程池。
*/
@MainThread
public final AsyncTask<Params, Progress, Result> executeOnExecutor(Executor exec, Params... params) {
    if (mStatus != Status.PENDING) {
        switch (mStatus) {
            case RUNNING:
                throw new IllegalStateException("Cannot execute task:"
                        + " the task is already running.");
            case FINISHED:
                throw new IllegalStateException("Cannot execute task:"
                        + " the task has already been executed "
                        + "(a task can be executed only once)");
        }
    }

    mStatus = Status.RUNNING;

    onPreExecute();

    mWorker.mParams = params;

    exec.execute(mFuture);

    return this;
}
```

## 5. `AsyncTask` 源码分析

### 5.1 `SERIAL_EXECUTOR` 线程池 & `THREAD_POOL_EXECUTOR` 线程池

`SERIAL_EXECUTOR` 线程池的相关代码如下：

```java:no-line-numbers
private static volatile Executor sDefaultExecutor = SERIAL_EXECUTOR;
public static final Executor SERIAL_EXECUTOR = new SerialExecutor();

private static class SerialExecutor implements Executor {
    final ArrayDeque<Runnable> mTasks = new ArrayDeque<Runnable>();

    Runnable mActive;

    public synchronized void execute(final Runnable r) {
        mTasks.offer(new Runnable() {
            public void run() {
                try {
                    r.run();
                } finally {
                    scheduleNext();
                }
            }
        });

        if (mActive == null) {
            scheduleNext();
        }
    }

    protected synchronized void scheduleNext() {
        if ((mActive = mTasks.poll()) != null) {
            THREAD_POOL_EXECUTOR.execute(mActive);
        }
    }
}
```

```:no-line-numbers
SERIAL_EXECUTOR 线程池的作用只是将任务存入到 ArrayDeque 队列中，并逐个地取出来再提交给 THREAD_POOL_EXECUTOR 线程池执行。
通过 SERIAL_EXECUTOR 线程池保证了 execute 方法提交的任务能够串行地执行。
```

`THREAD_POOL_EXECUTOR` 线程池的相关代码如下：

```java:no-line-numbers
// CPU 核心数
private static final int CPU_COUNT = Runtime.getRuntime().availableProcessors();
// 核心线程数 = CPU 核心数 + 1
private static final int CORE_POOL_SIZE = CPU_COUNT + 1;
// 最大线程数 = CPU 核心数 x 2 + 1
private static final int MAXIMUM_POOL_SIZE = CPU_COUNT * 2 + 1;

private static final int KEEP_ALIVE = 1;

// 任务队列的容量为 128
private static final BlockingQueue<Runnable> sPoolWorkQueue = new LinkedBlockingQueue<Runnable>(128);

private static final ThreadFactory sThreadFactory = new ThreadFactory() {
    private final AtomicInteger mCount = new AtomicInteger(1);
    public Thread newThread(Runnable r) {
        return new Thread(r, "AsyncTask #" + mCount.getAndIncrement());
    }
};

// 核心线程无超时机制
public static final Executor THREAD_POOL_EXECUTOR 
        = new ThreadPoolExecutor(CORE_POOL_SIZE, MAXIMUM_POOL_SIZE,
                                 KEEP_ALIVE, TimeUnit.SECONDS, // 非核心线程的空闲超时时长为 1s。
                                 sPoolWorkQueue, 
                                 sThreadFactory);
```

### 5.2 通过 `FutureTask` 和 `Callable` 实现任务的参数传入和结果返回

```java:no-line-numbers
public AsyncTask() {
    mWorker = new WorkerRunnable<Params, Result>() {
        public Result call() throws Exception {
            mTaskInvoked.set(true);

            Result result = doInBackground(mParams);

            return postResult(result);
        }
    };
    
    mFuture = new FutureTask<Result>(mWorker) {
        @Override
        protected void done() {
            try {
                postResultIfNotInvoked(get());
            } catch (CancellationException e) {
                postResultIfNotInvoked(null);
            }
        }
    };
}

private static abstract class WorkerRunnable<Params, Result> implements Callable<Result> {
    Params[] mParams;
}
```

```:no-line-numbers
创建 AsyncTask 实例时，在 AsyncTask 的构造方法中就：
1. new 了一个 Callable 对象 mWorker；
2. new 了一个 FutureTask 对象 mFuture。

通过 mWorker 可以传入任务需要的参数（见下面的 executeOnExecutor 方法）
mWorker.call() 会在 mFuture 的 run 方法中执行。（FutureTask 实现了 Runnable 接口）
mWorker.call() 方法中调用 doInBackground 方法处理任务。
doInBackground 方法返回的结果会通过主线程中的 Handler 回调给 AsyncTask.onPostExecute 方法。
```

```java:no-line-numbers
@MainThread
public final AsyncTask<Params, Progress, Result> executeOnExecutor(Executor exec, Params... params) {
    ...
    mStatus = Status.RUNNING;

    onPreExecute();

    mWorker.mParams = params; // 通过 mWorker 可以传入任务需要的参数

    exec.execute(mFuture); // mFuture 实现了 Runnable 接口，作为一个任务提交到线程池 exec 中。

    return this;
}
```

