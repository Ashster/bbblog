class MyPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(executor) {
        this.PromiseState = MyPromise.PENDING;
        this.PromiseResult = null;
        this.resolveCallbacks = [];
        this.rejectedCallbacks = [];
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
            this.resolveCallbacks.forEach(fn => {
                fn(this.PromiseResult);
            });
        }
    }
    reject(reason) {
        if (this.PromiseState === MyPromise.PENDING) {
            this.PromiseState = MyPromise.REJECTED;
            this.PromiseResult = reason;
            this.rejectedCallbacks.forEach(fn => {
                fn(this.PromiseResult);
            });
        }
    }
    then(onFulfilled, onRejected) {
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.PromiseState === MyPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled !== 'function') {
                            resolve(this.PromiseResult)
                        } else {
                            let x = onFulfilled(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            } else if (this.PromiseState === MyPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        if (typeof onRejected !== 'function') {
                            reject(this.PromiseResult);
                        } else {
                            let x = onRejected(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (error) {
                        reject(error);
                    }
                })
            } else if (this.PromiseState === MyPromise.PENDING) {
                this.resolveCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onFulfilled !== 'function') {
                                resolve(this.PromiseResult)
                            } else {
                                let x = onFulfilled(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                this.rejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onRejected !== 'function') {
                                reject(this.PromiseResult);
                            } else {
                                let x = onRejected(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (error) {
                            reject(error);
                        }
                    })
                })
            }
        });
        return promise2;
    }
    catch(onRejected) {
        return this.then(null, onRejected);
    }
    finally(callback) {
        return this.then(callback, callback);
    }
}


function resolvePromise(promise, x, resolve, reject) {
    if (x === promise) {
        throw new Error;
    } else if (x instanceof MyPromise) {
        x.then(
            y => {
                resolvePromise(promise, y, resolve, reject);
            },
            reason => {
                reject(reason);
            }
        );
    } else if (typeof x === 'object' || typeof x === 'function') {
        if (typeof x.then === 'function') {
            let then = null;
            try {
                then = x.then;
            } catch (error) {
                reject(error)
            }
            then(y => {
                resolvePromise(promise, y, resolve, reject);
            }, reason => {
                reject(reason);
            })
        } else {
            resolve(x);
        }
    } else {
        resolve(x);
    }
}

// const test1 = new MyPromise((resolve, reject) => {
//     console.log('111');
//     setTimeout(() => {
//         console.log('setTimeout 1000');
//         resolve('111-resolve');
//         reject('111-reject');
//     }, 1000)
// });

// test1.then((value) => {
//     console.log('promise.then fulfilled', value);
//     return 222;
// }, (error) => {
//     console.log('promise.then reject', error);
// }).then((value) => {
//     console.log('promise.then2 fulfilled', value);
//     throw new Error('2error test');
// }).catch((reason) => {
//     console.log('promise error reject', reason);
//     return 'catch success';
// }).then((reason) => {
//     console.log(reason);
// }).finally(() => {
//     console.log('finally');
//     console.log('-------------------');
// });

MyPromise.all = function (promiseList) {
    return new MyPromise((resolve, reject) => {
        if (!Array.isArray(promiseList)) {
            return reject(new TypeError('params must be iterable'));
        }
        let result = [];
        let count = 0;
        promiseList.forEach((item, index) => {
            if (item instanceof MyPromise) {
                item.then((value) => {
                    result[index] = value;
                    count++;
                    if (count === promiseList.length) {
                        resolve(result);
                    }
                }, (reason) => {
                    reject(reason);
                })
            } else {
                result[index] = item;
                count++;
                if (count === promiseList.length) {
                    resolve(result);
                }
            }
        });
    });
}

// const test2 = MyPromise.all([1, 2, 3, 4, 5]);
// test2.then((value) => {
//     console.log('promise all success', value);
// }, (reason) => {
//     console.log('promise all reject', reason);
// })

// const test3 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         console.log(333);
//         resolve(333);
//     }, 0)
// })

// const test4 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         console.log(444);
//         resolve(444);
//     }, 1000)
// })

// const test5 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         console.log(555);
//         resolve(555);
//     }, 2000)
// })

// MyPromise.all([test3, test4, test5]).then((value) => {
//     console.log('success', value);
// }).catch((reason) => {
//     console.log('fail', reason);
// })

function promiseRetry(promisefn, times, delay) {
    let total = 0;
    return new Promise((resolve, reject)=>{
        function call(){
            promisefn().then(value=>{
                resolve(value);
            }, reason=>{
                total++;
                if(total > times){
                    reject(reason);
                }else {
                    setTimeout(()=>call(), delay);
                }
            })
        }
        call();
    })

}

function testRetry() {
    return new Promise((resolve, reject) => {
        let random = Math.random();
        console.log('testRetry' + random);
        if (random > 0.5) {
            resolve('retry success' + random);
        } else {
            reject('retry fail' + random);
        }
    })
}

setTimeout(() => {
    promiseRetry(testRetry, 3, 10).then(value => {
        console.log(promiseRetry, value);
    }, reason => {
        console.log(promiseRetry, reason);
    });
}, 3000)
