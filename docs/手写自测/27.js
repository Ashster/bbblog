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
        executor(this.resolve.bind(this), this.reject.bind(this));
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
                    let value = onResolved(this.PromiseResult);
                    resolve(value);
                });
            } else if (this.PromiseState === MyPromise.REJECTED) {
                setTimeout(() => {
                    let reason = onRejected(this.PromiseResult);
                    reject(reason);
                });
            } else {
                this.onResolvedCallbackList.push(() => {
                    setTimeout(() => {
                        onResolved(this.PromiseResult);
                    })
                });
                this.onRejectedCallbackList.push(() => {
                    setTimeout(() => {
                        onRejected(this.PromiseResult);
                    })
                })
            }
        })
    }
}


const test = new MyPromise((resolve, reject) => {
    // 1. test 同步调用
    // resolve(1);
    // reject('error reason1')
    // 2. test 异步调用
    setTimeout(() => {
        resolve(2);
        console.log(111);
    }, 0);
}).then((value) => {
    console.log(111, value);
}).then((value) => {
    console.log(222, value)
})

console.log(test);