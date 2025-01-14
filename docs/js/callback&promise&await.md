# 参考资料
https://zh.javascript.info/callbacks

# 异步
js 是单线程的，为了避免过大的非主要任务长时间占据主线程，js 提供了很多异步函数， 比如 setTimeout、setInterval、Promise、fetch、script 标签的加载等。

这些异步函数在执行时，会立即返回，不会阻塞主线程，而是将任务添加到任务队列中，等待主线程空闲时执行。

如果想在异步任务执行完成后执行某些操作，就需要使用回调函数。

# 回调 callback
以 script 标签的加载为例，如果想要在 script 标签加载完成后执行某些操作，就需要使用回调函数。

```js
script.onload = function() {
    console.log('script loaded');
}
```

那如果想在 script 标签加载完成之后再加载另一个 script 标签，就需要使用回调函数。

```js
script.onload = function() {
    console.log('script loaded');
    script2.onload = function() {
        console.log('script2 loaded');
    }
}
```

这样下去，如果我有 10 个 script 标签要按照顺序加载，就需要 10 个回调函数，这样代码就会变得非常难以维护，变成了一个金字塔形状的回掉地狱/厄运金字塔。

# Promise

为了避免回调地狱，js 提供了 Promise 对象，Promise 对象可以用来表示一个异步操作的最终完成（或失败）及其结果值。


| Promise | callback |
| -------- | ------- |
| promise 允许正常编码顺序来处理异步后的逻辑，支持多次链式调用，其实就是支持多次回掉；首先运行异步函数，之后对异步函数的结果通过 .then/.catch/.finally 来进行处理 | callback 函数必须在异步函数执行前就已经定义好并且传入了，也就是说，在执行前我就要知道如何处理异步的结果。 |
| 支持多次链式调用，其实就是支持多次回调 | 仅支持一个回调 |

Promise 含义如其名，就是承诺，承诺在未来的某个时间点完成某个操作，并返回结果。有点类似于生产者消费者，也有点类似于发布订阅，new Promise((resolve,reject) => {}) 中的函数就是生产者，而消费者函数则通过 Promise.then/.catch/.finally 来注册。
但是其实比发布订阅要灵活的多。因为发布订阅需要在发布前订阅，而 Promise 即使已经生产完有结果了，也允许消费者再来注册，这个时候消费者函数会立即执行。

### Promise 对象内部状态
- pending：初始状态，既不是成功，也不是失败状态。
- fulfilled：意味着操作成功完成。
- rejected：意味着操作失败。

由 new Promise 构造器返回的 promise 对象具有以下内部属性：
- state —— 最初是 "pending"，然后在 resolve 被调用时变为 "fulfilled"，或者在 reject 被调用时变为 "rejected"。
- result —— 最初是 undefined，然后在 resolve(value) 被调用时变为 value，或者在 reject(error) 被调用时变为 error。

Promise 状态一旦改变，就不会再变，也不会再执行状态改变后的代码。

```js
let promise = new Promise(function(resolve, reject) {
    //  executor（生产者代码)
    setTimeout(() => resolve("done"), 1000);
});

promise.then((result) => {
    console.log(result);
});
```

### Promise .then
Promise 对象的 then 方法可以用来注册一个回调函数，当 Promise 对象的状态变为 fulfilled 时，回调函数会被执行。
promisr.then 其实是有两个参数的，第一个参数是 fulfilled 状态的回调函数，第二个参数是 rejected 状态的回调函数，我们平时使用的时候一般只传第一个参数，第二个参数不传。而 .catch 方法其实就相当于 .then(null,onRejected)。

```js
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done!"), 1000);
});

// resolve 运行 .then 中的第一个函数
promise.then(
  result => alert(result), // 1 秒后显示 "done!"
  error => alert(error) // 不运行
);
```

### Promise .catch
Promise 对象的 catch 方法可以用来注册一个回调函数，当 Promise 对象的状态变为 rejected 时，回调函数会被执行。本质上其实是 .then(null,onRejected)。

```js
promise.catch(function(error) {
    console.log(error);
});
```

### Promise .finally
.finally 方法的回调函数不接受任何参数，因为无论最后状态如何，它都会被执行, 无论是被 resolve 还是被 reject。
有点类似于 .then(function(){},function(){}), 但是 .finally 的回调函数不接受任何参数。
所以, finally 方法的回调函数一般用来做一些清理工作，比如关闭数据库连接，释放资源等, 用于与状态无关的操作。表示常规完成之后的操作。
finally 会将 promise 的最终状态传递给下一个处理程序，比如将 value 传递给后续的 .then 方法，将 error 传递给后续的 .catch 方法。

- finally 处理程序没有得到前一个处理程序的结果（它没有参数）。而这个结果被传递给了下一个合适的处理程序。
- 如果 finally 处理程序返回了一些内容，那么这些内容会被忽略。
- 当 finally 抛出 error 时，执行将转到最近的 error 的处理程序。

```js
new Promise((resolve, reject) => {
  throw new Error("error");
})
  .finally(() => alert("Promise ready")) // 先触发
  .catch(err => alert(err));  // <-- .catch 显示这个 error
```


### Promise 中的错误处理
promise 的执行者（executor）和 promise 的处理程序周围都有一个隐式的 try catch 包裹，所以，如果执行者中抛出错误，那么这个错误会被 catch 捕获，并传递给下一个处理程序。
注意，try catch 只能捕获同步错误，不能捕获异步错误。所以，如果异步错误需要处理，必须显式使用 reject 抛出，采用 .catch 来捕获。

以下是几个通过 promise 内部隐式 try catch 捕获同步错误的例子，他们都不需要显式使用 reject 抛出，只需要在 .catch 中捕获即可。
```js
// promise.catch 直接捕获同步错误，触发 .catch
new Promise((resolve, reject) => {
  throw new Error("error");
})
  .catch(err => alert(err));  // <-- .catch 显示这个 error
```

```js
// promise.catch 直接捕获同步错误，触发 .catch 之后再次抛出错误，触发下一个 .catch
new Promise((resolve, reject) => {
  throw new Error("error");
})
  .catch(err => {
    alert(err) // <-- .catch 显示这个 error
    throw new Error("error2");
  })
  .catch(err => {
    alert(err) // <-- .catch 显示这个 error2
  });
```

```js
// .catch 捕获到错误后，没有继续抛出错误，.then 仍然会执行
new Promise((resolve, reject) => {
  throw new Error("error");
})
  .catch(err => {
    alert(err) // <-- .catch 显示这个 error
  })
  .then(() => {
    alert("done"); // <-- .catch 捕获到错误后，没有继续抛出错误，.then 仍然会执行；所以一般 .catch 都放在所有 .then 之后
  });
```

```js
// 异步错误需要显式使用 reject 抛出，采用 .catch 来捕获
new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("error")), 1000);
})
  .catch(err => alert(err));  // <-- .catch 显示这个 error

// 异步错误无法被 try catch 捕获，所以需要显式使用 reject 抛出，采用 .catch 来捕获
new Promise((resolve, reject) => {
  setTimeout(() => throw new Error("error")), 1000);
})
  .catch(err => alert(err));  // 不会执行，因为 try catch 只能捕获同步错误

```
