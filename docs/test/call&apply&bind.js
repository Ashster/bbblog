Function.prototype.myCall = function (target, ...args) {
    if (typeof target === Function.prototype) {
        return undefined;// 避免循环引用
    }
    let context = target || window;
    let key = Symbol();
    context[key] = this;// this 这个时候指向函数本身
    let res = context[key](...args);
    delete context[key]
    return res;
}

Function.prototype.myApply = function (target, args) {
    if (typeof target === Function.prototype) {
        return undefined;
    }
    let context = target || window;
    let symbolKey = Symbol();
    context[symbolKey] = this;
    let res;
    if (Array.isArray(args)) {
        res = context[symbolKey](...args);
    } else {
        res = context[symbolKey]();
    }
    return res;
}

Function.prototype.myBind = function (target, args) {
    if (typeof target === Function.prototype) {
        return new TypeError('循环引用');
    }
    let _this = this;// 记录 this 函数本身
    return function F(...args2) {
        if(this instanceof F){
            // 构造函数
            return new _this(...args, ...args2);
        } else {
            return _this.call(target, ...args, ...args2);
        }
    }
}

const obj = {
    a: 1,
    b: 2,
    c: 3
}
function test(a, b, c) {
    console.log({
        a: this.a,
        b: this.b,
        c: this.c,
    })
}

test(1, 2, 3);
test.myCall(obj, 4, 5, 6);
test.myApply(obj, [1, 2, 3]);
const test2 = test.bind(obj);
test2();
