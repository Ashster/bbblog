// https://juejin.cn/post/6844903809206976520#heading-18

function mockJsonParse(str) {
    // 基础类型
    // “null” => null
    // "true" => true
    // "false" => false
    // "111" => 111
    // "'abc'"=> 'abc'
    // 数组类型
    // "[1,2,3,4,5]" => [1,2,3,4,5]
    // 对象类型
    // "{"a":1,"b":[1,2,3,4,5],"c":{"d":222}}" => { a: 1, b: [ 1, 2, 3, 4, 5 ], c: { d: 222 } }
    if (str === 'null') return null;
    if (str === 'true') return true;
    if (str === 'false') return false;
    if (/^\d+$/.test(str)) return Number(str);
    if (/^".*"$/.test(str)) return str.slice(1, -1);


    // 辅助函数，找到对应的括号匹配
    function findClosingBracket(str, start, openChar, closeChar) {
        let count = 1;
        let i = start;
        while (i < str.length && count > 0) {
            if (str[i] === openChar) count++;
            if (str[i] === closeChar) count--;
            i++;
        }
        return i - 1;
    }
    // 辅助函数，分割顶层元素
    function splitTopLevel(str, separator) {
        const result = [];
        let start = 0;
        let i = 0;
        while (i < str.length) {
            let char = str[i];
            if (char === '"') {
                // 跳过字符串的内容
                i = str.indexOf('"', i + 1) + 1;
                continue;
            }
            if (char === '{') {
                i = findClosingBracket(str, i + 1, '{', '}') + 1;
                continue;
            }
            if (char === '[') {
                i = findClosingBracket(str, i + 1, '[', ']') + 1;
                continue;
            }
            if (char === separator) {
                result.push(str.slice(start, i));
                start = i + 1;
            }
            i++;
        }
        if (start < str.length) {
            result.push(str.slice(start));
        }
        return result;
    }

    // 处理数组
    if (str[0] === '[') {
        if (str === '[]') return [];
        const elements = splitTopLevel(str.slice(1, -1), ',');
        return elements.map(item => mockJsonParse(item));
    }

    // 处理对象
    if (str[0] === '{') {
        if (str === '{}') return {};
        // 不能直接采用 split(',') 来匹配，这样对于 obj 嵌套 obj / array 会分坏的，只能采用括号匹配
        const pairs = splitTopLevel(str.slice(1, -1), ',');
        const obj = {};
        pairs.forEach(pair => {
            let colonIndex = pair.indexOf(':');
            let key = pair.slice(0, colonIndex).trim();
            let value = pair.slice(colonIndex + 1).trim();
            const cleanKey = key.slice(1, -1);
            obj[cleanKey] = mockJsonParse(value);
        })
        return obj;
    }
}

function mockJsonStringify(value) {
    // 基础类型 =》 转变成 string
    // [1,2,3,4,5] => "[1,2,3,4,5]"
    // {a: 1} => "{"a": 1}"
    // function => 当作为对象属性时，该属性会被一起忽略；当作为数组元素时，会转换为 null
    // undefiend => 当作对象属性时，会被忽略；作为数组元素时，转换成 null
    // Symbol => 同上
    // NaN => null
    // Infinity => null
    // -Infinity => null
    // 处理特殊类型
    if (value === undefined) return undefined;
    if (typeof value === 'function') return undefined;
    if (typeof value === 'symbol') return undefined;
    if (Number.isNaN(value)) return 'null';
    if (value === Infinity || value === -Infinity) return 'null';

    // 处理基础类型
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return `"${value}"`;

    // 处理数组
    if (Array.isArray(value)) {
        const newArray = value.map(item => {
            const result = mockJsonStringify(item);
            // 数组中的 undefined/function/symbol 会被转换为 null
            return result === undefined ? 'null' : result;
        });
        return '[' + newArray.join(',') + ']';
    }

    // 处理对象
    if (typeof value === 'object') {
        const pairs = Object.entries(value).filter(([_, val]) => {
            // 过滤掉值为 undefined function symbol 的属性
            const result = mockJsonStringify(val);
            return result !== undefined;
        }).map(([key, val]) => {
            return `"${key}":${mockJsonStringify(val)}`;
        })
        return '{' + pairs.join(',') + '}';
    }
}

// const testStr = [1, 2, 3, 4, 5];
// console.log(JSON.stringify(testStr), JSON.parse(JSON.stringify(testStr)));
// console.log(mockJsonStringify(testStr));
// const testObj = {
//     a: 1,
//     b: [1, 2, 3, 4, 5],
//     c: {
//         d: 222
//     }
// }
// console.log(JSON.stringify(testObj), JSON.parse(JSON.stringify(testObj)));
// console.log(mockJsonStringify(testObj));
// const testFunc = function test() {
//     return 111;
// }
// // function 会被 json stringify 过滤掉
// console.log(JSON.stringify(testFunc));
// console.log(mockJsonStringify(testFunc));

const testCases = {
    func: function () { return 1; },
    sym: Symbol('test'),
    undef: undefined,
    nan: NaN,
    infinity: Infinity,
    negInfinity: -Infinity,
    normalValue: 123,
    arr: [1, undefined, function () { }, Symbol(), null],
    obj: {
        a: 1,
        b: undefined,
        c: function () { },
        d: Symbol(),
        e: null
    }
};

console.log(mockJsonStringify(testCases));
// console.log(JSON.stringify(testCases))

console.log(mockJsonParse(mockJsonStringify(testCases)));
console.log(JSON.parse(JSON.stringify(testCases)));