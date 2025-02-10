
// // bind 是改变 this 空间后，返回新的函数：之前遇到过，美颜插件要做监听，监听了xxxx.bind(this)，其实 off 的时候就失效了，应该先 bind(this) 保存下来。

// // apply 和 call 都会立即执行函数，第一个参数都是 thisArg 上下文对象，apply 的第二个参数是数组，可以把参数都传进去，call 的话要一个个传进去。

// Function.prototype.myCall = function (ctx = window, ...args) {
//     if (ctx === Function.prototype) {
//         return undefined; // 防止 Function.prototype.myCall() 直接调用
//     }
//     ctx = ctx || window;
//     const fnSymbol = Symbol();
//     ctx[fnSymbol] = this;
//     const result = ctx[fnSymbol](...args);
//     delete ctx[fnSymbol];
//     return result;
// }

// Function.prototype.myApply = function (ctx = window, args = []) {
//     if (ctx === Function.prototype) {
//         return undefined; // 防止 Function.prototype.myCall() 直接调用
//     }
//     ctx = ctx || window;
//     const fnSymbol = Symbol();
//     ctx[fnSymbol] = this;
//     let result;
//     if (Array.isArray(args)) {
//         result = ctx[fnSymbol](...args);
//     } else {
//         result = ctx[fnSymbol]();
//     }
//     delete ctx[fnSymbol];
//     return result;
// }

// Function.prototype.myBind = function (ctx, ...args) {
//     if (this === Function.prototype) {
//         throw new TypeError('Error');
//     }
//     const _this = this;

//     return function F(...bindArgs) {
//         if (this instanceof F) {
//             return new _this(...args, ...bindArgs);
//         }
//         return _this.apply(ctx, args.concat(bindArgs));
//     }
// }

// function Person(name, age) {
//     this.name = name;
//     this.age = age;
// }

// // 使用bind预设name为"John"
// const JohnDoe = Person.myBind(null, "John");

// // 使用new调用JohnDoe时，它实际上是在调用Person函数
// const person1 = new JohnDoe(25);

// console.log(person1.name); // 输出 "John"
// console.log(person1.age);  // 输出 25

Function.prototype.myApply2 = function (ctx, args) {
    if (typeof ctx === Function.prototype) {
        return undefined;
    }
    ctx = ctx || window;
    const fnSymbol = Symbol();
    console.log(this);
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

Function.prototype.myCall2 = function (ctx, ...args) {
    if (typeof ctx === Function.prototype) {
        return undefined;
    }
    ctx = ctx || window;
    const fnSymbol = Symbol();
    ctx[fnSymbol] = this;
    const result = ctx[fnSymbol](...args);
    delete ctx[fnSymbol];
    return result;
}


Function.prototype.myBind2 = function (ctx, ...args) {
    if (this === Function.prototype) {
        throw new TypeError('Error');
    }

    const _this = this;
    return function F(...newArgs) {
        if (this instanceof F) {
            return new _this(...args, ...newArgs);
        }
        return _this.apply(ctx, args.concat(newArgs));
    }
}

function test(txt1, txt2, txt3) {
    console.log({
        txt1,
        thisTxt1: this.txt1,
        txt2,
        thisTxt2: this.txt2,
        txt3,
        thisTxt3: this.txt3
    });
}

var txt1 = 'window.111'
var txt2 = 'window.222'
var txt3 = 'window.333'

const Test = {
    txt2: 'object.222',
    txt3: 'object.333'
}

test();
test.call(Test);
test.myCall2(Test);
test.apply(Test);
test.myApply2(Test);
test.call(Test, 'call.111','call.222');
test.myCall2(Test, 'call.111','call.222');
test.apply(Test, ['apply.111','apply.222','apply.333']);
test.myApply2(Test, ['apply.111','apply.222','apply.333']);

const newBindTest = test.myBind2(null, 'null.111');
newBindTest('null.222');
const newBindTest2 = test.myBind2(Test, 'newBindTest.222');
newBindTest2('newBindTest.333');
console.log(new newBindTest2('newBindTest.444') );
// const testBind = test.myBind2(null, '111');
// testBind('222', '333');
