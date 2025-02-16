<https://www.ruanyifeng.com/blog/2017/05/websocket.html>

## 1. 什么是 WebSocket

WebSocket 是一种网络通信协议，和 HTTP 协议一样，都是基于 TCP 协议的。但是 WebSocket 是全双工通信的，而 HTTP 是半双工通信的。

WebSocket 协议在 2011 年由 IETF 标准化为 RFC 6455 ，后由 W3C 定为国际标准。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。

在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

## 2. WebSocket 与 HTTP 协议

WebSocket 协议和 HTTP 协议一样，都是基于 TCP 协议的。但是 WebSocket 协议是全双工通信的，而 HTTP 协议是半双工通信的。

在没有 WebSocket 之前，浏览器和服务器之间的通信都是通过 HTTP 协议进行的，聊天室这种频繁的请求-响应模式，只能采用轮询的方式进行。

短轮询（Short Polling）：

- 实现方式：客户端定期发送 HTTP 请求到服务器，询问是否有新数据。
- 特点：每次请求都是独立的，服务器立即返回响应，无论是否有新数据。
- 缺点：可能会导致大量无效请求，因为每次请求都需要建立和关闭连接，增加了网络和服务器的负担。

之后出现了长轮询技术，它通过服务器端等待请求，直到有数据可发送，然后立即发送，再断开连接，从而实现了一种类似 WebSocket 的通信模式。

- 实现方式：客户端发送请求后，服务器保持连接打开，直到有新数据可用或超时才返回响应。
- 特点：如果有新数据，服务器立即返回响应；如果没有新数据，服务器会保持连接一段时间，直到有数据或超时。
- 优点：减少了无效请求的次数，因为服务器只在有新数据时才返回响应。
- 缺点：虽然比短轮询更高效，但仍然需要频繁建立和关闭连接。
- 长轮询一般超时时间为 几秒到几十秒甚至几分钟不等，主要是看业务需求。

而 WebSocket 协议则是在一次握手后，就可以进行双向数据传输，直到连接断开。

- 在浏览器环境中，websocket 提供一系列的 callback 函数，用于处理连接、数据接收、错误等事件。
  - onopen：连接建立时触发
  - onmessage：接收到服务器发送的数据时触发
  - onerror：发生错误时触发
  - onclose：连接关闭时触发
- 同时，websocket 还提供了 send 方法，用于向服务器发送数据。
- bufferedAmount：缓冲区中的字节数，用于指示发送缓冲区中未发送的数据量。
- readyState：表示 WebSocket 的连接状态，有四种状态：
  - CONNECTING：连接正在建立中
  - OPEN：连接已建立，可以进行通信
  - CLOSING：连接正在关闭中
  - CLOSED：连接已关闭
- 在 Node.js 环境中，则提供了 WebSocket 类，用于创建和管理 WebSocket 连接。

## 3. 为什么 websocket 有 onerror, onclose 事件，我们一般还需要采用心跳包来检测连接状态？

- 因为 websocket 的 onerror, onclose 事件在浏览器中并不总是可靠，可能会出现误报。
- 而心跳包则是一种简单有效的方式，用于检测连接状态。

1. 检测连接状态：
onclose 和 onerror 事件只能在连接已经断开或发生错误时触发，而心跳机制可以主动检测连接的健康状态，及时发现潜在的问题
2. 网络波动：
在某些网络环境下，连接可能会因为网络波动而中断，但不会立即触发 onclose 或 onerror。心跳机制可以帮助检测这种情况，并在必要时重新建立连接。
3. 防止中间设备超时：
在某些网络环境下，中间设备（如防火墙、路由器等）可能会因为长时间没有收到数据而关闭连接。心跳机制可以帮助检测这种情况，并在必要时重新建立连接。
4. 保持连接活跃：
心跳机制可以确保连接在长时间不活动的情况下仍然保持活跃，避免因为长时间没有数据传输而导致连接被误认为已断开。
5. 应用层的需求：
在某些应用场景中，需要确保连接的稳定性和可靠性，心跳机制可以帮助实现这一点。
6. 网络分区：
网络分区（Network Partition）可能导致客户端和服务器之间的连接中断，但由于分区的性质，双方都没有意识到连接已经断开。心跳机制可以检测到这种情况，因为 ping 消息无法到达对方。

- 心跳包的实现方式：
  - 客户端定期发送 ping 消息到服务器，服务器收到后立即返回 pong 消息。
  - 如果客户端在一定时间内没有收到 pong 消息，则认为连接已断开，并重新建立连接。
  - 如果服务器在一定时间内没有收到 ping 消息，则认为连接已断开，并重新建立连接。

## 4. 项目中的 WebSocket 实现与重连机制

WebSocket 重连时机：
1、手机设备网络发生变化时，如 wifi 切换 4g，切换成功后重新建立连接
2、从无网络连接到连上网，重新建立连接
3、ping 失败，但是当前仍可以正常连网（小程序需要在前台），重新建立连接
4、userSig 过期，为避免重新登录再次被踢，重新建立连接
5、收到 REST API kick 通知时断开连接并强制重连

其中主要 NetMonitor 检测网络变化，
在 web 浏览器中的话主要就是采用 addEventListner 的 online 和 offline 事件来检测网络变化
在小程序中则是采用 wx.onNetworkStatusChange 来检测网络变化
在 RN 中则是采用 NetInfo 来检测网络变化

重连逻辑：
主域名和备用域名轮流重连，重连三次后，如果仍然失败，会在网络监听模块 netMonitor 中进行网络状态检测，如果检测到确实是断网了，则断开链接。如果检测到非断网，则继续重连。

## 5. web worker 优化

web worker 是用来解决 js 单线程可能造成的性能问题，在 js 主线程外开辟了单独的 worker 线程

### web worker 本身的限制

- 同源限制，必须与主线程的脚本文件同源，也就是必须和页面文档同源
- 不能访问 DOM，不能访问 window 对象（这也是为了不破坏 js 单线程操作 dom 的初衷）
- 通信联系，worker 线程不能直接访问主线程的 DOM 和 window 对象，需要通过 postMessage 和 onMessage 进行通信
- 脚本限制，worker 线程不能执行类似于 alert() 之类的方法，但是可以通过 XMLHttpRequest 来发送 AJAX 请求
- 文件限制，worker 线程不能读取本机文件，也就是不能使用 file://

### web worker 的创建

采用 web worker 来处理 websocket 的连接和数据发送，可以避免 websocket 的阻塞问题。
（1）首先要检测当前环境是否支持 web worker & 用户云控是否开启了 web worker
（2）web worker 的创建：

- 创建一个独立的线程，用于处理 websocket 的连接和数据发送
- 主线程的视角

    ```js
    const worker = new Worker('worker.js');

    // 实际使用
    // 一般先有一段本地 worker string，然后通过 new Blob 的方式生成文件 以及 后续生成文件对应的 url
    const blob = new Blob([workerString], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    // 这个 worker string 大概长这样, 这里是用来处理 
    const workerString = `
        onmessage = function(event) {
            console.log('Received message:', event.data);
            if(event.data.type === 'start') {// start 是自己定义的，这些 cmd 都是自己定义的，主线程通过 postMessage 发送的
                // 开始连接
                // 在这里去 new websocket
                // 也就是把 websocket 的连接和数据发送交给 worker 线程去处理
                const ws = new WebSocket('event.data.url');
                ws.onopen = function() {
                    postMessage({ type: 'onOpen' });
                }
                ws.onmessage = function(event) {
                    postMessage({ type: 'onMessage', data: event.data });
                }
            } else if(event.data.type === 'sendMessage') {
                
            } else if(event.data.type === 'close') {

            }
        }
    `;

    // 主线程监听 worker 线程的 onMessage 事件
    worker.onmessage = function(event) {
        console.log('Received message:', event.data);
        if(event.data.type === 'onOpen') {
            // 连接成功
            // 这里调用通用的 onOpen 事件
            this.onOpen();
        } else if(event.data.type === 'onMessage') {
            // 收到消息
            // 这里调用通用的 onMessage 事件
            this.onMessage(event.data.data);
        }
    }

    // 主线程 postMessage 发送指令, 通知 worker 线程开始连接
    worker.postMessage({ type: 'start', url: 'ws://localhost:8080' });

    // 一些主线程监听事件，在上面的 worker.onmessage 调用

    // 主线程关闭 worker 线程
    worker.terminate();
    ```

- worker 线程的视角

    ```js
    onmessage = function(event) {
        console.log('Received message:', event.data);
        if(event.data.type === 'start') {
            // 开始连接
            const ws = new WebSocket(event.data.url);
            ws.onopen = function() {
                postMessage({ type: 'onOpen' });
            }
            ws.onmessage = function(event) {
                postMessage({ type: 'onMessage', data: event.data });
            }
        } else if(event.data.type === 'sendMessage') {
            // 发送消息
            ws.send(event.data.message);
        } else if(event.data.type === 'close') {
            // 关闭连接
            ws.close();
        }
    }
    ```

- 还有一个用来做定时器的线程 workertimer，用于处理心跳包的定时器

    ```js
    const timer = new Worker('workertimer.js');

    // 定时器线程的视角
    let interval = -1;
    onmessage = function(event) {
        console.log('Received message:', event.data);
        if(event.data.type === 'start') {
            if(interval > 0){

            }
            // 开始定时器
            interval = setInterval(function() {
                postMessage("");
            }, 1000);
            postMessage(interval);
        } else if(event.data.type === 'stop') {
            // 停止定时器
            clearInterval(interval);
            interval = -1;
        }
    }

    // 这个定时器会 1s 会调一次到主线程
    ```

### shared worker

- 前面提到 web worker 是独立的，通过深度拷贝或者转移所有权来传递，资料本身都不会被其他线程共享。
- 但是 shared worker 是共享的，可以被多个页面共享
- 通过 MessagePort 来进行通信与共享
- shared worker 也是有一些场景的，比如单点登录中，一个退出登录了，其他的也都要退出

```js
const worker = new SharedWorker('worker.js');

// 主线程
worker.port.onmessage = function(event) {
    console.log('Received message:', event.data);
}

// 发送消息
worker.port.postMessage('Hello, Shared Worker!');
```

### websocket 握手升级

websocket 的握手升级是基于 http 的，所以需要先建立 http 连接，然后通过 http 的 upgrade 头来升级为 websocket 连接。

- 升级过程
客户端发送一个 HTTP 请求，包含以下特殊的头部：

```js
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

服务器如果支持 WebSocket，会返回一个 101 状态码的响应：

```js
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

主要区别

- 客户端的请求头中包含 Upgrade: websocket 和 Connection: Upgrade，表示客户端希望升级到 WebSocket 协议。
- 服务器返回的响应头中包含 Upgrade: websocket 和 Connection: Upgrade，表示服务器已经成功升级到 WebSocket 协议。
- 服务器返回的响应头中包含 Sec-WebSocket-Accept，表示服务器已经成功升级到 WebSocket 协议。
- 握手成功后，客户端和服务器之间的通信就变成了 WebSocket 协议，可以进行双向数据传输。


websocket vs http:
- websocket 是全双工通信的，而 http 是半双工通信的
- http 是无状态的请求响应模式，每次通信都需要客户端发起
- websocket 中采用帧来传输数据，而 http 中采用流来传输数据

### SSE
https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html
SSE 是 Server-Sent Events 的缩写，是一种单向的通信协议，只能从服务器向客户端发送数据，不能从客户端向服务器发送数据。
也就是专门的服务端的推送技术。
他只能单向通信，不能和 websocket 一样双向通信。

- SSE 使用 HTTP 协议，现有的服务器软件都支持。WebSocket 是一个独立协议。
- SSE 属于轻量级，使用简单；WebSocket 协议相对复杂。
- SSE 默认支持断线重连，WebSocket 需要自己实现。
- SSE 一般只用来传送文本，二进制数据需要编码后传送，WebSocket 默认支持传送二进制数据。
- SSE 支持自定义发送的消息类型。

SSE 本质上就是 HTTP 协议，不需要像 websocket 一样进行协议升级，因为他本来就是 http 长连接。

服务端必须配置协议头：
```js
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

客户端使用 EventSource 对象来接收 SSE 数据：
```js
const eventSource = new EventSource('http://localhost:8080/sse');

eventSource.onmessage = function(event) {
    console.log('Received message:', event.data);
}
```
