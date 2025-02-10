// 手写 promise
class MyPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    constructor(executor) {
        this.PromiseState = MyPromise.PENDING;
        this.PromiseResult = null;
        this.onResolvedCallbackList = [];
        this.onRejectedCallbackList = [];
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error);
        }
    }

    resolve(value) {
        if (this.PromiseState === MyPromise.PENDING) {
            this.PromiseState = MyPromise.FULFILLED;
            this.PromiseResult = value;
            this.onResolvedCallbackList.forEach((callback) => {
                callback(this.PromiseResult);
            })
        }
    }

    reject(reason) {
        if (this.PromiseState === MyPromise.PENDING) {
            this.PromiseState = MyPromise.REJECTED;
            this.PromiseResult = reason;
        }
        this.onRejectedCallbackList.forEach((callback) => {
            callback(this.PromiseResult);
        })
    }

    then(onResolved, onRejected) {
        const promise = new MyPromise((resolve, reject) => {
            if (this.PromiseState === MyPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        let value = onResolved(this.PromiseResult);
                        resolve(value);
                    } catch (error) {
                        reject(error);
                    }
                });
            } else if (this.PromiseState === MyPromise.REJECTED) {
                setTimeout(() => {
                    let reason = onRejected(this.PromiseResult);
                    reject(reason);
                });
            } else {
                this.onResolvedCallbackList.push(() => {
                    try {
                        let value = onResolved(this.PromiseResult);
                        resolve(value);
                    } catch (error) {
                        reject(error);
                    }
                });
                this.onRejectedCallbackList.push(() => {
                    setTimeout(() => {
                        let reason = onRejected(this.PromiseResult);
                        reject(reason);
                    });
                })
            }
        });
        return promise;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }
}


// const test = new MyPromise((resolve, reject) => {
//     // 1. test 同步调用
//     // resolve(1);
//     // reject('error reason1')
//     // 2. test 异步调用
//     setTimeout(() => {
//         resolve(2);
//         console.log(111);
//     }, 0);
// }).then((value) => {
//     console.log(111, value);
//     return 333;
// }).then((value) => {
//     console.log(222, value);
//     throw Error('ww');
// }).catch((error) => {
//     console.log(error);
//     console.log(test);
// })

// console.log(test);


// 手写 promise.all
// 首先 promise.all 会接受一个 promiseList 作为参数，返回一个新的 promise 作为结果
// promiseList 中的所有都 resolve 了才会最终 resolve
// 有一个 reject 了就会被 reject
MyPromise.all = (promiseList) => {
    // 判断是否是迭代器
    let res = new Array(promiseList.length);
    let count = 0;
    return new MyPromise((resolve, reject) => {
        if (promiseList && typeof promiseList[Symbol.iterator] !== 'function') {
            return reject(new TypeError('unable iterable'));
        }
        promiseList.forEach((promiseItem, index) => {
            promiseItem.then((value) => {
                res[index] = value;
                count++;
                if (count === promiseList.length) {
                    resolve(res);
                }
            }).catch((error) => {
                reject(error);
            })
        })
    })
}

let promise1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 1000)
});

let promise2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(2);
    }, 2000)
});

let promise3 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(3);
    }, 3000)
});

// MyPromise.all([promise1, promise2, promise3]).then((value) => {
//     console.log(value);
// })


// // 手写 promise.race
// // 有一个成功就成功，一个失败就失败

// MyPromise.race = (promiseList) => {
//     return new Promise((resolve, reject) => {
//         if (promiseList && typeof promiseList[Symbol.iterator] !== 'function') {
//             return reject(new TypeError('params must be iterable'));
//         }
//         for (let i = 0; i < promiseList.length; i++) {
//             promiseList[i].then((item) => {
//                 resolve(item);
//             }).catch((error) => {
//                 reject(error);
//             })
//         }
//     })
// }

// MyPromise.race([promise1, promise2, promise3]).then((value) => {
//     console.log('promise.race -->', value);
// })


// // 手写 promise.any
// // 所有失败才失败，一个成功就成功
// MyPromise.any = (promiseList) => {
//     return new MyPromise((resolve, reject) => {
//         if (promiseList && typeof promiseList[Symbol.iterator] !== 'function') {
//             return reject(new TypeError('type error'));
//         }
//         let errors = [];
//         for (let i = 0; i < promiseList.length; i++) {
//             promiseList[i].then((value) => {
//                 resolve(value);
//             }).catch((error) => {
//                 errors.push(error);
//                 if (errors.length === promiseList.length) {
//                     reject(errors);
//                 }
//             })
//         }
//     })
// };

// MyPromise.any([promise1, promise2, promise3]).then((value) => {
//     console.log('promise.any -->', value);
// }, (error) => {
//     console.log('error', error);
// }).catch((error) => {
//     console.log('error', error);
// })

// // 手写 promise.allSettled
// // 没有失败状态
// // 结果为所有的响应合集
// MyPromise.allSettled = (promiseList) => {
//     return new MyPromise((resolve, reject) => {
//         let count = 0;
//         let resultList = new Array(promiseList.length);
//         for (let i = 0; i < promiseList.length; i++) {
//             promiseList[i].then((value) => {
//                 resultList[i] = {
//                     state: 'fulfilled',
//                     result: value
//                 }
//                 count++;
//                 if (count === promiseList.length) {
//                     resolve(resultList);
//                 }
//             }).catch((error) => {
//                 resultList[i] = {
//                     state: 'rejected',
//                     reason: error
//                 }
//                 count++;
//                 if (count === promiseList.length) {
//                     resolve(resultList);
//                 }
//             })
//         }
//     })
// }

// MyPromise.allSettled([promise1, promise2, promise3]).then((value) => {
//     console.log('promise.allsettled -->', value);
// }, (error) => {
//     console.log('error', error);
// }).catch((error) => {
//     console.log('error', error);
// })


// promise polling 手写
// 有一串 promise，最大并发量为 k，控制 promise 的调度
function promisePollLimit(promiseList, k) {
    return new Promise(async (resolve, reject) => {
        let result = [];
        let counter = 0;
        while (counter <= k && promiseList.length) {
            let newPromise = promiseList.shift();
            counter++;
            let res = await newPromise;
            result.push(res);
            counter--;
        }
        resolve(result);
    })
}
promisePollLimit([promise1, promise2, promise3], 1).then((value) => console.log(value));


function promiseRetry(fn, count, delay) {
    let currentCount = 0;
    return new Promise((resolve, reject) => {
        function call() {
            fn().then(resolve).catch((e) => {
                if (currentCount === count) {
                    reject(e);
                } else {
                    setTimeout(() => {
                        call();
                    }, delay);
                }
            })
        }
        call();
    })
}

function test(){
    return new Promise((resolve, reject)=>{
        if(Math.random() > 0.5) resolve('success!');
        else reject('failed!');
    });
}

promiseRetry(test, 3, 1000).then(value => {
    console.log(value);
}).catch(error => {
    console.log(error);
})