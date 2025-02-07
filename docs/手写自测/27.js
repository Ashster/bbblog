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
        }
    }

    reject(reason) {
        if (this.PromiseState === MyPromise.PENDING) {
            this.PromiseState = MyPromise.REJECTED;
            this.PromiseResult = reason;
        }
    }

    then(onResolvedCallback, onRejectedCallback) {
        if (this.PromiseState === MyPromise.FULFILLED) {
            let newFunc = () => {
                setTimeout(() => {
                    onResolvedCallback(this.PromiseResult);
                })
            };
            newFunc();
        } else if (this.PromiseState === MyPromise.REJECTED) {
            let newFunc = () => {
                setTimeout(() => {
                    onRejectedCallback(this.PromiseResult);
                })
            };
            newFunc();
        } else {
            this.onResolvedCallbackList.push(() => {
                setTimeout(() => {
                    onResolvedCallback(this.PromiseResult);
                })
            });
            this.onRejectedCallbackList.push(() => {
                setTimeout(() => {
                    onRejectedCallback(this.PromiseResult);
                })
            })
        }
    }
}


const test = new MyPromise((resolve, reject) => {
    // 1. test 同步调用
    resolve(1);
    // reject('error reason1')
    // 2. test 异步调用
    // setTimeout(() => {
    //     resolve(2);
    //     console.log(111);
    // }, 0);
}).then((value) => {
    console.log(111, value);
});

console.log(test);