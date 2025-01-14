## 参考资料
https://zh.javascript.info/event-loop

## 事件循环
1. 执行宏任务（比如执行一段 js 本身就是一个宏任务）
2. 执行宏任务过程中遇到微任务，放到 microtask queue
3. 宏任务执行完毕，按照顺序执行完 microtask queue 中的微任务, 如果执行过程中碰到宏任务，放到 macrotasks queue 中
4. 执行下一个宏任务

## 宏任务和微任务
- macrotasks: setTimeout, setInterval, setImmediate, requestAnimationFrame, I/O, UI rendering
- microtasks: process.nextTick, Promises, queueMicrotask, MutationObserver


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
