## 参考资料
https://zh.javascript.info/event-loop
https://juejin.cn/post/6844904077537574919#heading-50

## 事件循环
1. 执行宏任务（比如执行一段 js 本身就是一个宏任务）
2. 执行宏任务过程中遇到微任务，放到 microtask queue
3. 宏任务执行完毕，按照顺序执行完 microtask queue 中的微任务, 如果执行过程中碰到宏任务，放到 macrotasks queue 中, 如果微任务执行过重碰到微任务，继续放到当前 microtask queue 中执行，直到整个 microtask queue 执行完毕
--------------------------------
附加：
4. 执行浏览器 UI 渲染线程
5. 检查是否有 web worker 任务，有则执行
--------------------------------
6. 执行下一个宏任务

## 宏任务和微任务
- macrotasks: 
    - setTimeout: 接受两个参数，第一个参数表示待执行的代码，第二个参数表示延迟时间，单位是毫秒。然而，这个延迟时间并不是精确的，而是最小延迟时间，也就是说，如果当前宏任务队列中没有其他宏任务，那么这个宏任务会立即执行，而不是等到延迟时间到达。但是，如果当前宏任务队列中已经有其他宏任务，那么这个宏任务会等到当前宏任务队列中的其他宏任务执行完毕后，再执行。
    - setInterval：和 setTimeout 类似，但是会每隔一段时间执行一次。
    - setImmediate(nodejs)：在当前事件循环完成后立即执行的任务。
    - requestAnimationFrame（高优先级）：在浏览器渲染下一帧之前执行的任务，比如元素attribute改变引起，会略晚于微任务的执行，但是比其他宏任务要早。
    - I/O：I/O 操作，比如文件读写、网络请求等。
    - UI rendering：UI 渲染，比如页面重绘、重排等。
- microtasks: 
    - process.nextTick（nodejs）: 所有微任务中优先级最高的
    - Promise.then
    - queueMicrotask(): 将回调函数添加到微任务队列中
    - MutationObserver: 监听 dom 的变化，当 dom 发生变化时，会触发回调函数。https://zh.javascript.info/mutation-observer

- 个人理解：
宿主环境提供的方法是宏任务，例如setTimeout, setInterval。这些都是浏览器或者Node环境实现的。js引擎自身提供的是微任务，例如Promise。基本上平时接触道德除了Promise都是宏任务。欢迎指正。

### 注意：
1. 微任务队列执行中产生的新的微任务，会立即添加到当前微任务队列中执行
2. 首次整个脚本的执行也可以看作是一次宏任务
3. new Promise 的回调函数会立即执行，而 Promise.then 的回调函数会放到微任务队列中执行
4. Promise 中的状态一旦改变就不会再改变了，因此一旦 resolve 或 reject 后，后面的 resolve 或 reject 就不会再执行了（但是其他的内容还是可以正常执行的，比如 console.log 等，不会直接return 掉）
5. async/await 是 promise 的语法糖，await 之后的代码可以理解为 promise.then 的回调函数，

## 例子
以下代码的执行顺序
```js
console.log(1);

setTimeout(() => console.log(2));

Promise.resolve().then(() => console.log(3));

Promise.resolve().then(() => setTimeout(() => console.log(4)));

Promise.resolve().then(() => console.log(5));

setTimeout(() => console.log(6));

console.log(7);
```
### 解析：
输出结果为：1 7 3 5 2 6 4。
1. 立即输出数字 1 和 7，因为简单的 console.log 调用没有使用任何队列。
2. 然后，主代码流程执行完成后，开始执行微任务队列。
3. 其中有命令行：console.log(3); setTimeout(...4); console.log(5)。
4. 输出数字 3 和 5，setTimeout(() => console.log(4)) 将 console.log(4) 调用添加到了宏任务队列的尾部。
5. 现在宏任务队列中有：console.log(2); console.log(6); console.log(4)。
6. 当微任务队列为空后，开始执行宏任务队列。并输出 2、6 和 4。
7. 最终，我们的到的输出结果为：1 7 3 5 2 6 4。

```js
console.log(1);
// 第一行立即执行，它输出 `1`。
// 到目前为止，宏任务队列和微任务队列都是空的。

setTimeout(() => console.log(2));
// `setTimeout` 将回调添加到宏任务队列。
// - 宏任务队列中的内容：
//   `console.log(2)`

Promise.resolve().then(() => console.log(3));
// 将回调添加到微任务队列。
// - 微任务队列中的内容：
//   `console.log(3)`

Promise.resolve().then(() => setTimeout(() => console.log(4)));
// 带有 `setTimeout(...4)` 的回调被附加到微任务队列。
// - 微任务队列中的内容：
//   `console.log(3); setTimeout(...4)`

Promise.resolve().then(() => console.log(5));
// 回调被添加到微任务队列
// - 微任务队列中的内容：
//   `console.log(3); setTimeout(...4); console.log(5)`

setTimeout(() => console.log(6));
// `setTimeout` 将回调添加到宏任务队列
// - 宏任务队列中的内容：
//   `console.log(2); console.log(6)`

console.log(7);
// 立即输出 7
```


## Nodejs 中的事件循环
Node11 之前是 libuv 实现的，Node11 之后是 N-API 实现的。
所以在 node11 之后，Nodejs 的事件循环和浏览器的事件循环是一样的。执行一个宏任务，执行完之后，执行所有微任务，执行完之后，执行下一个宏任务。
在 node11 之前，Nodejs 的事件循环和浏览器的事件循环是不一样的。一口气执行完所有宏任务，然后执行所有微任务，然后执行下一个宏任务。


从 api 的实现来看，nodejs 的宏任务新增 setImmediate， 微任务新增 process.nextTick。
##