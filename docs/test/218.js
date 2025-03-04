// 发布订阅
// on 监听事件，返回一个 callback
// emit 触发事件
// off 移除事件
// once 只触发一次事件

class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    on(event, callback) {
        if (this.events.has(event)) {
            this.events.set(event, [...this.events.get(event), callback]);
        } else {
            this.events.set(event, [callback]);
        }
    }
    emit(event, ...args) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                callback(...args);
            });
        }
    }
    off(event, callback) {
        let target = this.events.get(event);
        if (Array.isArray(target)) {
            let targetIndex = target.findIndex(fn => fn === callback);
            if (targetIndex !== -1) {
                let newCallbacks = target.filter((_, index) => index !== targetIndex);
                this.events.set(event, newCallbacks);
            }
        }
    }
    once(event, callback) {
        if (this.events.has(event)) {
            let listeners = this.events.get(event);
            let index = listeners.findIndex(fn => fn === callback);
            if (index !== -1) {
                this.off(event, callback);
            }
        }
        const onceCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        }
        this.on(event, onceCallback);
    }
}

let eventEmitter = new EventEmitter();
function callback1(a, b, c) {
    console.log('callback1', a, b, c)
}
function callback2(a, b) {
    console.log('callback2', a, b)
}

eventEmitter.on('event1', callback1);
eventEmitter.on('event1', callback2);
eventEmitter.emit('event1', 1, 2, 3);
eventEmitter.off('event1', callback2);
eventEmitter.emit('event1', 4, 5, 6);
eventEmitter.once('event1', callback1);
eventEmitter.emit('event1', 7, 8, 9);
eventEmitter.emit('event1', 10, 11, 12);

Function.prototype.myApply = function (ctx, args = []) {
    if (typeof ctx === Function.prototype) {
        return Error('循环引用');
    }
    let symbolKey = Symbol();
    ctx = ctx || window;
    ctx[symbolKey] = this;
    let res;
    if (Array.isArray(args)) {
        res = ctx[symbolKey](...args);
    } else {
        res = ctx[symbolKey]();
    }
    delete ctx[symbolKey];
    return res;
}

Function.prototype.myCall = function (ctx, ...args) {
    if (typeof ctx === Function.prototype) {
        return Error('循环引用');
    }
    let symbolKey = Symbol();
    ctx = ctx || window;
    ctx[symbolKey] = this;
    let res = ctx[symbolKey](...args);
    delete ctx[symbolKey];
    return res;
}

Function.prototype.myBind = function (ctx, ...args) {
    if (typeof ctx === Function.prototype) {
        return Error('循环引用');
    }
    ctx = ctx || window;
    let _this = this; // 用 this 来表示 fn 本身
    return function F(...args2) {
        if (this instanceof F) {// 判断当前函数是否被当成构造函数使用
            return new _this(...args, ...args2);
        } else {
            return _this.call(ctx, ...args, ...args2);
        }
    }
}

function test1(a, b, c) {
    console.log(this.a, this.b, this.c);
    console.log(a, b, c);
}

const Test = {
    a: '111',
    b: '222',
    c: '333'
}

test1.myApply(Test, ['arg1', 'arg2', 'arg3']);
test1.myCall(Test, 'arg-call-1', 'arg-call-2', 'arg-call-3');
let newFunc = test1.bind(Test, 1);
newFunc(2, 3);


// 防抖
// 在一段连续的高频操作时，只触发最后一次
// 场景：输入搜索，窗口 resize
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
            clearTimeout(timer);
            timer = null;
        }, delay);
    }
}

// throttle 
// 一段时间内只触发第一次
function throttle(fn, delay) {
    let timer = null;
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
            lastTime = now;
            fn.apply(this, args);
            if (timer) {
                clearTimeout(timer);
            }
            timer = null;
        } else {
            // 存储当前冻结时间段内的最后一个,如果后面没有了，就可以在最后被触发
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fn.apply(this, args);
                clearTimeout(timer);
                timer = null;
            }, delay);
        }
    }
}

function handleInput(value) {
    console.log('输入处理', value, Date.now());
}

let newFunc1 = debounce(handleInput, 100);

setTimeout(() => {
    newFunc1(111);
    setTimeout(() => {
        newFunc1(222);
        setTimeout(() => {
            newFunc1(333);
        }, 10)
    }, 10)
}, 10)

let newFunc2 = throttle(handleInput, 10);

setTimeout(() => {
    newFunc2(1110);
    setTimeout(() => {
        newFunc2(2220);
        setTimeout(() => {
            newFunc2(3330);
        }, 5)
    }, 5)
}, 5)

console.log([1, 2, 3].map(parseInt));
// 1 NaN NaN
// 这个相当于 parseInt(1,0) 0在进制位被忽略，按十进制处理，
// parseInt(2,1) 进制位必须大于等于2，所以无效，NaN
// parseInt(3,2) 二进制，但是出现了3，错误，NaN

console.log(0.1 + 0.2);
console.log(0.3);
console.log(0.1 + 0.2 === 0.3);

// 全排列
// [1,2,3]
// [1,2,3] [1,3,2] [2,1,3] [2,3,1] [3,2,1] [3,1,2]
// 有顺序之分
