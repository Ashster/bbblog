// 手写promise
// leetcode:
// https://leetcode.cn/problems/promise-pool/solutions/2380417/promise-dui-xiang-chi-by-leetcode-soluti-5v7u/
// 
// https://github.com/yuanyuanbyte/Blog/issues/125
// 1. Promise 是一个类，有三个状态：pending, fulfilled, rejected。
// 2. Promise 初始状态为 pending，当调用 resolve 时，状态变为 fulfilled，当调用 reject 时，状态变为 rejected。
// 3. Promise 的状态一旦改变，就不会再改变。后续再屌用 resolve / reject 也不会改变状态。
// 4. 直接打印 Promise 对象，会有以下情况：
    // Promise { <pending> }
        // [[Prototype]]: Promise
        // [[PromiseState]]: "pending"
        // [[PromiseResult]]: undefined
    // Promise { <fulfilled> }
        // [[Prototype]]: Promise
        // [[PromiseState]]: "fulfilled"
        // [[PromiseResult]]: 123(此处代表 value 值)
    // Promise { <rejected> }
        // [[Prototype]]: Promise
        // [[PromiseState]]: "rejected"
        // [[PromiseResult]]: "Error: 错误"（此处为 reason 值）
// 5. new Promise() 的参数是一个函数，函数有两个参数：resolve 和 reject。必须传入一个执行函数，否则会报错“Promise resolver undefined is not a function”。

// 实现基础的 new Promise() + resolve + reject
class MyPromise1 {
    static PENDING = "pending";
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";
    constructor(executor){
        this.PromiseState = MyPromise1.PENDING;
        this.PromiseResult = null;
        executor(this.resolve.bind(this), this.reject.bind(this));
    }
    resolve(value){
        if(this.PromiseState === MyPromise1.PENDING){
            this.PromiseState = MyPromise1.FULFILLED;
            this.PromiseResult = value;
        }
    }
    reject(reason){
        if(this.PromiseState === MyPromise1.PENDING){
            this.PromiseState = MyPromise1.REJECTED;
            this.PromiseResult = reason;
        }
    }
}

const promiseTest1 = new MyPromise1((resolve, reject)=>{
    resolve(123);
    reject("错误");
    console.log("执行函数 new Promise executor");
});

console.log(promiseTest1);
console.log('--------------------------------');


// 下一步，实现 then 方法
// promise.then(onFulfilled, onRejected) 接受两个参数：onFulfilled 和 onRejected。
// 1. 如果 onFulfilled 或 onRejected 不是函数，则忽略, 将 值 和 原因 继续向下传递。
// 2. 如何忽略？忽略不是不执行，而是要把 onFulfilled 和 onRejected 的值传递给下一个 then 方法。
// 3. onFulfilled 其实就是把 value 值传递给下一个方法。 也就是 value => value
// 4. onRejected 其实就是把 reason 值传递给下一个方法, 与 onFulfilled 不同的是，他需要 throw error。 也就是 reason => { throw reason }
// 错误处理
// Promise 的 executor 执行函数，如果执行函数中发生错误，则调用 reject 方法。
// 所以我们需要在 executor 中通过 try catch 捕获错误，并调用 reject 方法。
class MyPromise2 {
    static PENDING = "pending";
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";
    constructor(executor){
        this.PromiseState = MyPromise2.PENDING;
        this.PromiseResult = null;
        try{
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch(error){
            // 上面需要用 this.resolve.bind(this) 和 this.reject.bind(this) 来绑定 this 指向。
            // 因为上面的函数并不会被立即执行，所以需要用 bind 来绑定 this 指向。
            // 此处的 this.reject(error) 是立即用 reject 方法，所以不需要额外使用 bind 。
            this.reject(error);
        }
    }
    resolve(value){
        if(this.PromiseState === MyPromise2.PENDING){
            this.PromiseState = MyPromise2.FULFILLED;
            this.PromiseResult = value;
        }
    }
    reject(reason){
        if(this.PromiseState === MyPromise2.PENDING){
            this.PromiseState = MyPromise2.REJECTED;
            this.PromiseResult = reason;
        }
    }
    then(onFulfilled, onRejected){
        if(typeof onFulfilled !== "function"){
            onFulfilled = value => value;
        }
        if(typeof onRejected !== "function"){
            onRejected = reason => { throw reason };
        }
        if(this.PromiseState === MyPromise2.FULFILLED){
            onFulfilled(this.PromiseResult);
        }
        if(this.PromiseState === MyPromise2.REJECTED){
            onRejected(this.PromiseResult);
        }
    }
}


// 打印结果：
// 执行函数 new Promise2 executor
// 123
// undefined(这里因为还没有实现链式调用，而且目前.then 也没有实现异步，采用 then 方法之后无返回值，所以为 undefined)
const promiseTest2 = new MyPromise2((resolve, reject)=>{
    resolve(123);
    reject("错误");
    console.log("执行函数 new Promise2 executor");
}).then(value => {
    console.log(value);
}, reason => {
    console.log(reason);
});

console.log(promiseTest2);
console.log('--------------------------------');


// 实现 then 方法的异步调用
// 以上实现的代码，只能在 executor 中立即执行 resolve 或 reject 方法，所以 then 方法的调用是同步的。
// 如果想要实现 then 方法的异步调用，则需要使用 setTimeout 来实现。
// 实现思路：
// 1. 异步调用：在 then 方法中，如果 PromiseState 为 PENDING，则将 onFulfilled 和 onRejected 函数存储起来。
// 2. 多次调用： 为了保证多次 .then .catch 方法可以正常调用，需要在 pending 状态时用数组保存这些 callback 函数。
// 3. 当 resolve() 或 reject() 方法被调用时，遍历数组，调用 callback 函数。
// 4. 为了避免 resolve() 或 reject() 方法被调用时，callback 数组中的函数被直接同步执行，
// 而导致这些 then catch 方法的实际执行早于 excutor 函数调用 resolve/reject 之后的其他同步代码， 所以需要 setTimeout 来异步执行这些 callback 函数。

class MyPromise3 {
    static PENDING = "pending";
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";
    constructor(executor){
        this.PromiseState = MyPromise3.PENDING;
        this.PromiseResult = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        try{
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch(error){
            this.reject(error);
        }
    }
    resolve(value){
        if(this.PromiseState === MyPromise3.PENDING){
            this.PromiseState = MyPromise3.FULFILLED;
            this.PromiseResult = value;
            this.onFulfilledCallbacks.forEach(callback => callback(value));
        }
    }
    reject(reason){
        if(this.PromiseState === MyPromise3.PENDING){
            this.PromiseState = MyPromise3.REJECTED;
            this.PromiseResult = reason;
            this.onRejectedCallbacks.forEach(callback => callback(reason));
        }
    }
    then(onFulfilled, onRejected){
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
        onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason };
        if(this.PromiseState === MyPromise3.PENDING){
            this.onFulfilledCallbacks.push(
                ()=> setTimeout(()=>onFulfilled(this.PromiseResult))
            );
            this.onRejectedCallbacks.push(
                ()=> setTimeout(()=>onRejected(this.PromiseResult))
            );
        }
        if(this.PromiseState === MyPromise3.FULFILLED){
            setTimeout(() => {
                onFulfilled(this.PromiseResult);
            }, 0);
        }
        if(this.PromiseState === MyPromise3.REJECTED){
            setTimeout(() => {
                onRejected(this.PromiseResult);
            }, 0);
        }
    }
}

// 目前的实现仅支持 then 异步 + 多次调用，不支持链式调用，因为 then 方法没有返回值。

const promiseTest3 = new MyPromise3((resolve, reject)=>{
    setTimeout(() => {
        console.log("setTimeout 111");
        resolve(123);
        console.log("执行函数 new Promise3 executor");
    }, 1000);
});

promiseTest3.then(value => {
    console.log("then1");
    console.log(value);
}, reason => {
    console.log("onRejected1");
    console.log(reason);
});

promiseTest3.then(value => {
    console.log("then2");
    console.log(value);
    console.log('--------------------------------');
}, reason => {
    console.log("onRejected2");
    console.log(reason);
    console.log('--------------------------------');
})


// 目前实现的是 then 方法的异步调用，但是不支持链式调用，因为 then 方法没有返回值。
// 所以需要实现 then 方法的链式调用。
// 按照 Promise/A+ 规范 2.2.7，then 方法需要返回一个 Promise 对象。

// 实现思路：
// 1. 在 then 方法中返回一个新的 Promise 对象, 作为 promise2
// 

class MyPromise4 {
    static PENDING = "pending";
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";
    constructor(executor){
        this.PromiseState = MyPromise4.PENDING;
        this.PromiseResult = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        try{
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch(error){
            this.reject(error);
        }
    }
    resolve(value){
        if(this.PromiseState === MyPromise4.PENDING){
            this.PromiseState = MyPromise4.FULFILLED;
            this.PromiseResult = value;
            this.onFulfilledCallbacks.forEach(callback => callback(value));
        }
    }
    reject(reason){
        if(this.PromiseState === MyPromise4.PENDING){
            this.PromiseState = MyPromise4.REJECTED;
            this.PromiseResult = reason;
            this.onRejectedCallbacks.forEach(callback => callback(reason));
        }
    }
    then(onFulfilled, onRejected){
        let promise2 = new MyPromise4((resolve, reject) => {
            if(this.PromiseState === MyPromise4.FULFILLED){
                setTimeout(() => {
                    try{
                        if(typeof onFulfilled !== "function"){
                            resolve(this.PromiseResult);
                        } else {
                            let x = onFulfilled(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch(error){
                        reject(error);
                    }
                });
            } else if(this.PromiseState === MyPromise4.REJECTED){
                setTimeout(() => {
                    try{
                        if(typeof onRejected !== "function"){
                            reject(this.PromiseResult);
                        } else {
                            let x = onRejected(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch(error){
                        reject(error);
                    }
                });
            } else if(this.PromiseState === MyPromise4.PENDING){
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try{
                            if(typeof onFulfilled !== "function"){
                                resolve(this.PromiseResult);
                            } else {
                                let x = onFulfilled(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch(error){
                            reject(error);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try{
                            if(typeof onRejected !== "function"){
                                reject(this.PromiseResult);
                            } else {
                                let x = onRejected(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch(error){
                            reject(error);
                        }
                    });
                });
            }
        })
        return promise2;
    }
    catch(onRejected){
        return this.then(undefined, onRejected);
    }
    finally(callback){
        return this.then(callback, callback);
    }
}

function resolvePromise(promise2, x, resolve, reject){
    if(promise2 === x){
        // 如果 promise2 和 x 是同一个对象，则抛出错误。避免循环引用。
        return reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
    }

    if(x instanceof MyPromise4){
        // 如果 x 是 Promise 对象，则需要调用 x 的 then 方法，并根据 x 的状态来决定 promise2 的状态。
        // 此处会进行递归调用，直到是一个 value 或者 reason 为止。
        x.then(y => {
            resolvePromise(promise2, y, resolve, reject);
        }, reason => {
            reject(reason);
        });
    } else if(x !== null && (typeof x === "object" || typeof x === "function")){
        // 如果 x 是对象或函数，则需要判断 x 是否为 thenable 对象。
        let then;
        try{
            then = x.then;
        } catch(error){
            return reject(error);
        }
        if(typeof then === "function"){
            // 如果 then 是函数，则需要调用 then 方法，并根据 then 方法的返回值来决定 promise2 的状态。
            // 调用 then 方法时，会将当前返回的结果 x 作为作用域进行调用
            //  传递两个回调函数作为参数，
            //  第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
            //  如果 resolvePromise 和 rejectPromise 被调用，则后续的调用都会被忽略，确保状态的唯一性和不变性。
            let called = false;
            try{
                // 调用 then 方法，并根据 then 方法的返回值来决定 promise2 的状态。
                // then.call 方法的第一个参数是 x，第二个参数是 resolvePromise 方法，第三个参数是 rejectPromise 方法。
                // 递归调用 resolvePromise 方法， 直到是一个 value 或者 reason 为止。
                then.call(x, y => {
                    if(called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, reason => {
                    if(called) return;
                    called = true;
                    reject(reason);
                });
            } catch(error){
                if(called) return;
                called = true;
                reject(error);
            }
        } else {
            // 如果 x 不是 thenable 对象，则直接调用 resolve 方法。
            resolve(x);
        }
    } else {
        // 如果 x 是普通值，则直接调用 resolve 方法。
        resolve(x);
    }
}

const promiseTest4 = new MyPromise4((resolve, reject)=>{
    setTimeout(() => {
        resolve(123);
        reject("错误");
        console.log("执行函数 new Promise4 executor");
    }, 2000);
});

promiseTest4.then(value => {
    console.log("then1");
    console.log(value);
    return 456;
}, reason => {
    console.log("onRejected1");
    console.log(reason);
}).then(value => {
    console.log("then2");
    console.log(value);
    console.log('--------------------------------');
}, reason => {
    console.log("onRejected2");
    console.log(reason);
    console.log('--------------------------------');
});


// 手写 Promise.resolve()
// Promise.resolve(value) 返回一个以给定值解析后的 Promise 对象。
// 如果 value 是 Promise 对象，则直接返回 value。
// 如果 value 是 thenable 对象，则需要调用 then 方法，并根据 then 方法的返回值来决定 promise2 的状态。
// 如果 value 是普通值，则直接调用 resolve 方法。
MyPromise4.resolve = function(value){
    if(value instanceof MyPromise4){
        return value;
    } else if(value !== null && (typeof value === "object" || typeof value === "function")){
        if(value.then && typeof value.then === "function"){
            return new MyPromise4((resolve, reject) => {
                value.then(resolve, reject);
            });
        } else {
            return new MyPromise4((resolve) => {
                resolve(value);
            });
        }
    } else {
        return new MyPromise4((resolve) => {
            resolve(value);
        });
    }
}

setTimeout(() => {
    const promiseTest5 = MyPromise4.resolve('111');
    console.log(promiseTest5);
    promiseTest5.then(value => {
        console.log(value);
        console.log('--------------------------------');
    });
}, 3000);

// 手写 Promise.reject()
// Promise.reject(reason) 返回一个以给定值解析后的 Promise 对象。
// 无论 reason 是什么值，都会返回一个状态为 rejected 的 Promise 对象，没有 Promise.resolve() 那么复杂。
MyPromise4.reject = function(reason){
    return new MyPromise4((resolve, reject) => {
        reject(reason);
    });
}

setTimeout(() => {
    const promiseTest6 = MyPromise4.reject('222');
    console.log(promiseTest6);
    promiseTest6.catch(reason => {
        console.log(reason);
        console.log('--------------------------------');
    });
}, 4000);


// 手写 Promise.all()
// Promise.all(iterable) 返回一个 Promise 对象，该 Promise 对象在 iterable 参数内所有的 promise 都成功时返回成功，
// 只要有一个 promise 失败，则返回失败。
// 什么是 iterable 参数？
// iterable 参数是一个可迭代对象，比如数组、Set、Map 等。
// 下面是粗糙写法
MyPromise4.all = function(iterable){
    return new MyPromise4((resolve, reject) => {
        if(!Array.isArray(iterable)){
            return reject(new TypeError("Argument is not iterable"));
        }
        let result = [];
        let count = 0;
        for(let i = 0; i < iterable.length; i++){
            if(iterable[i] instanceof MyPromise4){
                iterable[i].then(value => {
                    result[i] = value;
                    count++;
                    if(count === iterable.length){
                        resolve(result);
                    }
                }, reason => {
                    reject(reason);
                });
            } else {
                result[i] = iterable[i];
                count++;
                if(count === iterable.length){
                    resolve(result);
                }
            }
        }
    });
}
// 下面是精确写法，利用已有的完美的 Promise.resolve() 方法，对每个 promise 二次包裹处理
MyPromise4.all2 = function(iterable){
    return new MyPromise4((resolve, reject) => {
        if(!Array.isArray(iterable)){
            return reject(new TypeError("Argument is not iterable"));
        }
        let result = [];
        let count = 0;
        for(let i = 0; i < iterable.length; i++){
            MyPromise4.resolve(iterable[i]).then(value => {
                result[i] = value;
                count++;
                if(count === iterable.length){
                    resolve(result);
                }
            }, reason =>{
                reject(reason);
            });
        }
    });
}

setTimeout(() => {
    const promiseTest7 = MyPromise4.all2([1, 2, 3, 4, 5]);
    promiseTest7.then(value => {
        console.log(promiseTest7);
        console.log(value);
        console.log('--------------------------------');
    });
}, 5000);

setTimeout(() => {
    const promiseTest8 = MyPromise4.all2([1, 2, 3, MyPromise4.reject('666'), 5]);
    promiseTest8.catch(reason => {
        console.log(promiseTest8);
        console.log(reason);
        console.log('--------------------------------');
    });
}, 6000);

// Promise.allSettled()
// Promise.allSettled(iterable) 返回一个 Promise 对象，该 Promise 对象在 iterable 参数内所有的 promise 都成功或失败时返回成功，
// 无论 iterable 参数内有多少个 promise 对象，Promise.allSettled() 都会返回一个包含所有 promise 结果的数组。
// 数组中的每个元素都是一个对象，包含 status 和 value 两个属性。

MyPromise4.allSettled = function(promiseList){
    return new MyPromise4((resolve, reject) => {
        if(!Array.isArray(promiseList)){
            return reject(new TypeError("Argument is not iterable"));
        }
        let result = [];
        let count = 0;
        for(let i = 0; i < promiseList.length; i++){
            MyPromise4.resolve(promiseList[i]).then(value => {
                result[i] = { status: 'fulfilled', value };
                count++;
                if(count === promiseList.length){
                    resolve(result);
                }
            }, reason => {
                result[i] = { status: 'rejected', reason };
                count++;
                if(count === promiseList.length){
                    resolve(result);
                }
            });
        }
    });
}

setTimeout(() => {
    const promiseTest8 = MyPromise4.allSettled([1, 2, 3, MyPromise4.reject('666'), 5]);
    promiseTest8.then(value => {
        console.log(promiseTest8);
        console.log(value);
        console.log('--------------------------------');
    });
}, 7000);

// Promise.race()
// Promise.race(iterable) 返回一个 Promise 对象，该 Promise 对象在 iterable 参数内第一个 promise 成功或失败时返回成功或失败。
// 无论 iterable 参数内有多少个 promise 对象，Promise.race() 都会返回第一个 promise 对象的结果。
MyPromise4.race = function(promiseList){
    return new MyPromise4((resolve, reject) => {
        if(!Array.isArray(promiseList)){
            return reject(new TypeError("Argument is not iterable"));
        }
        promiseList.forEach(promise => {
            MyPromise4.resolve(promise).then(resolve, reject);
        });
    });
}

setTimeout(() => {
    const promiseTest8 = MyPromise4.race([1, 2, 3, MyPromise4.reject('666'), 5]);
    promiseTest8.then(value => {
        console.log(promiseTest8);
        console.log(value);
        console.log('--------------------------------');
    });
}, 8000);

// Promise.any()
// Promise.any(iterable) 返回一个 Promise 对象，该 Promise 对象在 iterable 参数内第一个 promise 成功时返回成功，
// 如果 iterable 参数内所有的 promise 都失败，则返回失败。
MyPromise4.any = function(promiseList){
    return new MyPromise4((resolve, reject) => {
        let count = 0;
        promiseList.forEach(promise => {
            MyPromise4.resolve(promise).then(value=>{
                resolve(value);
            }, reason=>{
                count++;
                if(count === promiseList.length){
                    reject(new TypeError("All promises were rejected"));
                }
            });
        });
    });
}

setTimeout(() => {
    const promiseTest8 = MyPromise4.any([MyPromise4.reject('111'), MyPromise4.reject('222'), MyPromise4.reject('666')]);
    promiseTest8.then(value => {
        console.log(promiseTest8);
        console.log(value);
        console.log('--------------------------------');
    }).catch(reason => {
        console.log(promiseTest8);
        console.log(reason);
        console.log('--------------------------------');
    });
}, 9000);

// 