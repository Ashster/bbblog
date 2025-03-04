// 手写 promise limit
// 最大并发量为 k，当并发量到达 k 的时候，必须等这个运行 queue 中的有反应了才能加入下一个

function promisePollLimit(fnList, k) {
    return new Promise((resolve, reject) => {
        let total = 0;
        let currentTotal = 0;
        let result = [];
        let callback = () => {
            while (total < fnList.length && currentTotal < k) {
                fnList[total]().then((value) => {
                    result.push({ state: 'fulfilled', value });
                }).catch((reason) => {
                    result.push({ state: 'rejected', reason });
                }).finally(() => {
                    currentTotal--;
                    if (result.length === fnList.length) {
                        resolve(result);
                    } else {
                        callback();
                    }
                });
                total++;
                currentTotal++;
            }
        }
        callback();
    })
}

let promise1 = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(111, Date.now());
        resolve(111);
    }, 1000)
})

let promise2 = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(222, Date.now());
        resolve(222);
    }, 2000)
})

let promise3 = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(333, Date.now());
        resolve(333);
    }, 3000)
})

// promisePollLimit([promise1, promise2, promise3], 3).then((value) => {
//     console.log(123, value);
// })

// 采用 await 来优化
function promiseLimit2(fnList, k) {
    return new Promise((resolve, reject) => {
        let totalCount = 0;
        let currentCount = 0;
        let result = [];
        let helper = async () => {
            while (totalCount < fnList.length && currentCount < k) {
                currentCount++;
                totalCount++;
                let res = await fnList[totalCount - 1]();
                currentCount--;
                result.push(res);
                if (result.length === fnList.length) {
                    resolve(result);
                } else {
                    helper();
                }
            }
        }
        helper();
    })
}

// promiseLimit2([promise1, promise2, promise3], 1).then((res) => {
//     console.log('limit2', res);
// })

// promise retry
// 重试次数为 k，每次需要的重试间隔在一个 array 中，比如 [100,200,300]
function promiseRetry(fn, timers) {
    return new Promise((resolve, reject) => {
        let next = () => {
            setTimeout(() => {
                fn().then(resolve).catch((error) => {
                    if (timers.length) {
                        next();
                    } else {
                        reject(error);
                    }
                });
            }, timers.shift())
        }
        next();
    });
}

function test() {
    return new Promise((resolve, reject) => {
        let random = Math.random();
        if (random > 0.5) {
            console.log('test success', random, Date.now());
            resolve(random);
        } else {
            console.log('test error', random, Date.now());
            reject(random);
        }
    })
}

// promiseRetry(test, [0, 1000, 2000]).then((value) => {
//     console.log('promise retry success', value);
// }).catch((error) => {
//     console.log('promise retry fail', error);
// });

// promise 模拟红绿灯变化
class TrafficLight {
    constructor() {
        this.isRunning = false;
        this.currentLight = 'red';
    }

    changeLight() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.currentLight = this.currentLight === 'red' ? 'green' : 'red';
                console.log(this.currentLight, Date.now());
                resolve();
            }, 1000);
        });
    }

    async start() {
        this.isRunning = true;
        while (this.isRunning) {
            await this.changeLight();
        }
    }

    stop() {
        this.isRunning = false;
    }
}

// const trafficLight = new TrafficLight();
// trafficLight.start();

// setTimeout(() => {
//     trafficLight.stop();
// }, 10000);


// js 手写 防抖截流
// 防抖，只触发一段时间内的最后一次，如果这段时间内高频的触发，只有最后一次才被执行
// 截流，一段时间内只触发一次，每次触发后会有一段冷却时间，过了这个时间才能再触发
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.call(this, ...args);
        }, delay);
    }
}

function testDebounce(value) {
    console.log(value, Date.now());
}

let newFunc = debounce(testDebounce, 100);

// setTimeout(() => {
//     newFunc(111);
// }, 50);
// setTimeout(() => {
//     newFunc(222);
// }, 50);
// setTimeout(() => {
//     newFunc(333);
// }, 50);
// setTimeout(() => {
//     newFunc(444);
// }, 50);

function throttle(fn, delay) {
    let lastTime = 0;
    let nextTimer = null;
    return function (...args) {
        let now = Date.now();
        let currDelay = Math.max(0, lastTime + delay - now);
        clearTimeout(nextTimer);
        nextTimer = setTimeout(() => {
            fn.call(this, ...args);
            lastTime = Date.now();
            nextTimer = null;
        }, currDelay);
    }
}

let newFunc2 = throttle(testDebounce, 100);

// setTimeout(() => {
//     newFunc2(111);
//     setTimeout(() => {
//         newFunc2(222);
//         setTimeout(() => {
//             newFunc2(333);
//             setTimeout(() => {
//                 newFunc2(444);
//             }, 20);
//         }, 100);
//     }, 20);
// }, 0);


// 手写 bind call apply
// 这些都是用来改变作用域的
// call 和 apply 类似，会采用第一个传入的参数作为作用域来执行函数
// 区别在于 call 接收很多个 args， apply 需要把 args 作为一个 argsArray 进行传入
// 而 bind 是利用 新的作用域 生成一个新的函数，不会立即执行

Function.prototype.myCall = function (context, ...args) {
    if (typeof context === Function.prototype) {
        return new Error('循环引用');
    }
    let ctx = context || window;
    let fnSymbol = Symbol();
    ctx[fnSymbol] = this; // this 其实就是当前的调用函数
    const result = ctx[fnSymbol](...args);
    delete ctx[fnSymbol];
    return result;
}

Function.prototype.myApply = function (context, args) {
    if (typeof context === Function.prototype) {
        throw new Error('循环引用');
    }
    let ctx = context || window;
    let fnSymbol = Symbol();
    ctx[fnSymbol] = this;
    let result;
    if (Array.isArray(args)) {
        result = ctx[fnSymbol](...args);
    } else {
        result = ctx[fnSymbol]();
    }
    delete ctx[fnSymbol];
    return result;
}

Function.prototype.myBind = function (context, ...args) {
    if (typeof context === Function.prototype) {
        throw new Error('循环引用');
    }
    const _this = this;
    return function F(...newArgs) {
        if (this instanceof F) {
            return new _this(...args, ...newArgs);
        }
        return _this.myCall(context, ...args, ...newArgs);
    }
}

var txt1 = '111';
var txt2 = '222';
var txt3 = '333';

function test(txt1, txt2, txt3) {
    console.log({
        txt1,
        thisTxt1: this.txt1,
        txt2,
        thisTxt2: this.txt2,
        txt3,
        thisTxt3: this.txt3,
    });
}

const TestObj = {
    txt1: 'TestObj>111',
    txt2: 'TestObj>222',
    txt3: 'TestObj>333',
}

// test();
// test.myCall(TestObj, 'props111', 'props222', 'props333');
// test.myApply(TestObj, ['props111', 'props222', 'props333']);
// let bindFunc = test.myBind(TestObj, 'props111');
// bindFunc('new2', 'new3');

// 实现 url 解析
const url = new URL('https://vue3js.cn/interview/JavaScript/bind_call_apply.html#%E4%B8%89%E3%80%81%E5%AE%9E%E7%8E%B0');
console.log(url);
// 手动实现解析 URL QUERY
function parseQuery(url){
    let queryObject = {};
    let queryStartIndex = url.indexOf('?');

    if(queryStartIndex === -1) return queryObject;

    const queryString = url.slice(queryStartIndex + 1);
    const queryPairs = queryString.split('&');
    queryPairs.forEach((pair)=>{
        const [key, value] = pair.split('=');
        queryObject[key] = value;
    })
    return queryObject;
}

console.log(parseQuery("https://juejin.cn/post/7411532842478321679?from=search-suggest#heading-11"));

// 手写 deepclone
function deepClone(obj){
    if(typeof obj !== 'object' || obj === null) return obj;
    // let result = Array.isArray(obj) ? [] : {};
    if(Array.isArray(obj)){
        return obj.map(item=>deepClone(item));
    }
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            result[key] = deepClone(obj[key]);
        }
    }
    return result;
}

let obj = {
    a: 1,
    b: {
        c: 2,
    },
};

console.log(deepClone(obj));

// deepclone 支持原型链拷贝
// hash 解决循环引用问题

function deepClone3(obj, hash = new WeakMap()){
    if(typeof obj !== 'object' || obj === null) return obj;
    if(hash.has(obj)) return hash.get(obj);
    let result = Array.isArray(obj) ? [] : {};
    hash.set(obj, result);
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            result[key] = deepClone3(obj[key], hash);
        }
    }
    return result;
}