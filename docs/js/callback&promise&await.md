# 参考资料
https://zh.javascript.info/callbacks
https://juejin.cn/post/7038043707265777672

# 进程与线程
进程是操作系统分配资源的基本单位，一个进程可以包含多个线程，线程是操作系统调度的基本单位。
比如在浏览器中，一般一个 tab 页就是一个进程，一个进程可以包含多个线程，比如渲染线程、js 引擎线程、事件线程等。
多个线程共享进程的资源，但是每个线程都有自己的执行上下文，包括代码执行位置、变量、堆栈等。
多个线程可以同时执行，但是需要操作系统进行调度，操作系统会根据线程的优先级、状态、等待时间等进行调度，以保证每个线程都能公平地使用 CPU 资源。
（注意，js引擎线程 和 渲染线程 是互斥的，因为渲染线程需要访问 dom 树 和样式表，而 js 引擎线程可能会修改 dom 树 和样式表，所以需要互斥）

# 为什么 js 是单线程的
js 是单线程的，非阻塞的。为了保证单线程的非阻塞，对于异步耗时任务和同步任务，则需要一套调度机制，这套调度机制就是事件循环。
因为 js 的主要任务是在浏览器中执行，与用户互动，操作 dom 等，这些任务都是需要与用户交互的，所以需要单线程。如果 js 是多线程的，一个线程去增加 dom，另一个线程去删除 dom，那么 dom 的状态就会变得不可控，不知道该以哪个线程为准。所以 js 从诞生开始就是设计为单线程的。
HTML5 中提供了 web worker 来实现多线程，但是 web worker 不能访问 dom，所以不能直接操作 dom。所以并不会与 js 的设计初衷冲突，也并没有改变 js 是单线程的本质。

# 异步
js 是单线程的，所以用异步编程的方式来处理非主要任务，避免过大的非主要任务长时间占据主线程。

js 中对于同步任务会放入执行栈中去执行，执行完毕后出栈。
而对于异步任务，js会将异步任务挂起后立即返回，继续执行执行栈中的同步任务，避免异步任务阻塞主线程。当异步任务返回结果的时候，将任务添加到任务队列中，等待主线程空闲时执行。这也是为什么说 setTimeout 的 delay 参数并不是精确的，而是最小延迟时间，也就是说，如果当前宏任务队列中没有其他宏任务，那么这个宏任务会立即执行，而不是等到延迟时间到达。但是，如果当前宏任务队列中已经有其他宏任务，那么这个宏任务会等到当前宏任务队列中的其他宏任务执行完毕后，再执行。

为了避免过大的非主要任务长时间占据主线程，js 提供了很多异步函数， 比如 setTimeout、setInterval、Promise、fetch、script 标签的加载等。

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

Promise 状态一旦改变，就不会再变，也不会执行后面继续改变状态的 resolve/reject 方法，但是其他代码还是可以正常执行的，比如 console.log 等，不会直接 return 掉。

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
promise.then 其实是有两个参数的，第一个参数是 fulfilled 状态的回调函数，第二个参数是 rejected 状态的回调函数，我们平时使用的时候一般只传第一个参数，第二个参数不传。而 .catch 方法其实就相当于 .then(null,onRejected)。

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

# Promise.all/Promise.allSettled/Promise.race/Promise.any
https://zh.javascript.info/promise-api
## Promise.all
所有成功才成功，一个失败就失败
Promise.all 方法接收一个 promise 数组，返回一个新的 promise 对象，当所有 promise 都成功时，返回一个包含所有 promise 结果的数组，如果有一个 promise 失败，则返回第一个失败的 promise 的错误。

```js
Promise.all([promise1, promise2, promise3]).then(results => {
    console.log(results);
}).catch(error => {
    console.log(error);
});
```

## Promise.allSettled
所有都结束才成功，无论某个成功还是失败


## Promise.race
一个成功就成功，一个失败就失败

## Promise.any
一个成功就成功，所有失败才失败

# async/await
https://zh.javascript.info/async-await
async/await 是 promise 的语法糖，是用一种更舒服的方式来表达 promise。
- async 声明的函数返回的是一个 promise 对象，因此可以继续使用 then 方法添加回调函数。
- await 只能在 async 函数中使用，await 实际上会暂停函数的执行，直到 promise 状态变为 settled，然后以 promise 的结果继续执行。这个行为不会耗费任何 CPU 资源，因为 JavaScript 引擎可以同时处理其他任务：执行其他脚本，处理事件等。
相比于 promise.then，它只是获取 promise 的结果的一个更优雅的语法。并且也更易于读写。
当然，现在浏览器中也支持顶层的 await，如果使用旧版本浏览器，也想使用顶层 await 的话，可以将 async 函数包裹在一个立即执行函数中。

- 注意：
无论 await 后面跟的是 promise 还是非 promise，是同步的还是异步的，都会等 await 语句执行完毕后，再把后面的代码放到微任务队列中执行。

## async/await 错误处理
如果一个 promise 正常 resolve，await promise 返回的就是其结果。但是如果 promise 被 reject，它将 throw 这个 error，就像在这一行有一个 throw 语句那样。

```js
async function f() {
    await Promise.reject(new Error("Whoops!"));
}

f().catch(err => alert(err)); // 显示错误
```

同时，可以显式使用 try catch 来捕获错误。

```js
async function f() {
    try {
        let response = await fetch('http://no-such-url');
    } catch(err) {
        alert(err); // 显示错误
    }
}
```




