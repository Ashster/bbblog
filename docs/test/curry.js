// 函数柯里化
// 本质上是把一个简单的问题给复杂化，具有更高的专有性
// 比如一个正则匹配函数，第一个函数传 reg，第二个参数传 value
// 如果我们要多次匹配同一个正则规则，并且这个正则规则又很长，每次调用都要写这一串
// 这个时候采用柯里化对这个通用正则匹配函数进行二次封装，传入第一个匹配规则，这样后续只需要传入第二个 value 就好，简化函数调用
// 柯里化的定义就是接受一部分函数，
function curry(fn, len = fn.length) {
    return _curry.call(this, fn, len);
}

function _curry(fn, len, ...args) {
    return function (...params) {
        let _args = [...args, ...params];
        if (_args.length >= len) {
            return fn.call(this, ..._args);
        } else {
            return _curry.call(this, fn, len, ..._args);
        }
    }
}

function sum(a, b, c) {
    console.log({
        a, b, c
    })
    return a + b + c;
}

let currySum = curry(sum);

currySum(1)(2)(3);
currySum(1, 2)(3);
currySum(1)(2, 3);
currySum(1, 2, 3);

console.log('-----------------------');

// lodash 中的高级 curry，支持 placeholder 占位符
// 需要新增一个 placeholder 参数，传递占位符号
// 还有一个新的 placeholders 参数，表示各个占位符在实际参数中的位置
function curryWithPlaceholder(fn, len = fn.length, placeholder = curry) {
    return _curryWithPlaceholder.call(this, fn, len, placeholder, [], []);
}

function _curryWithPlaceholder(fn, len, placeholder, args, placeholders) {
    return function (...params) {
        // copy 一份，避免后续被污染
        let _args = args.slice();
        let _placeholders = placeholders.slice();
        params.forEach((arg) => {
            // 如果当前不是placeholder 且之前存在 placeholder
            // 用当前 arg 就填补第一个 placeholder
            if (arg !== placeholder && placeholders.length) {
                let index = placeholders.shift();
                _placeholders.splice(_placeholders.indexOf(index), 1);
                _args[index] = arg;
            } else if (arg !== placeholder && !placeholders.length) {
                // 当前不是 placeholder 且 之前也不是 placeholder
                // 直接添加进入参数列表
                _args.push(arg);
            } else if (arg === placeholder && placeholders.length) {
                // 当前是占位符且之前也有占位符
                // 直接删除原来占位符的位置，用新的占位符顶上
                placeholders.shift();
            } else if (arg === placeholder && !placeholders.length) {
                // 如果现在是占位符，之前没有占位符
                _args.push(arg);
                _placeholders.push(_args.length - 1);
            }
        });
        if (_args.length >= len && _args.slice(0, len).indexOf(placeholder) === -1) {
            return fn.call(this, ..._args);
        } else {
            return _curryWithPlaceholder.call(this, fn, len, placeholder, _args, _placeholders);
        }
    }
}

let _ = {};
let currySum2 = curryWithPlaceholder(sum, 3, _);
currySum2(1,2,3);
currySum2(1,_)(2)(3);
currySum2(_)(2)(1)(3);
currySum2(_, 1)(2, 3);
