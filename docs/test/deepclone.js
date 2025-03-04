// 1. 采用 hash 解决循环引用问题
// 2. 对于非 object 类型或者 null 类型，直接返回
// 3. 对于 date regexp map set 特殊类型 特殊处理
// 4. 对于 object 类型，区分 array 和 object ，分别设置为 [] / {}
// 5. 之后递归 obj 中每一个 value，继续 deepclone，放入初始值中
function deepClone(obj, hash = new WeakMap()) {
    // 新增 hash 解决循环引用情况
    // 处理基本类型和 null
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // 处理特殊对象类型
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Map) return new Map([...obj].map(([key, val]) => [key, deepClone(val, hash)]));
    if (obj instanceof Set) return new Set([...obj].map(val => deepClone(val, hash)));

    // 处理循环引用问题
    if (hash.has(obj)) {
        return hash.get(obj);
    }

    let newObj = Array.isArray(obj) ? [] : {};
    hash.set(obj, newObj);

    // 递归克隆所有属性
    Object.keys(obj).forEach(key => {
        newObj[key] = deepClone(obj[key], hash);
    });

    return newObj;
}

const testObj = {
    a: [1, 2, 3, { b: '111', c: [1, 2, 3, 4, 5] }],
    d: '222',
    e: { f: 'aaa' }
}

let newObj = deepClone(testObj);
console.log(testObj);
console.log(newObj);

newObj.a[3].b = 'new value';
newObj.a[3].c[4] = 'new value';

console.log(JSON.stringify(testObj));
console.log(JSON.stringify(newObj));
console.log('---------------------')

// 测试循环引用
const circularObj = { a: 1 };
circularObj.self = circularObj;
const clonedCircularObj = deepClone(circularObj);
console.log(clonedCircularObj.self === clonedCircularObj); // true

// 测试特殊对象类型
const specialObj = {
    date: new Date(),
    regexp: /test/,
    map: new Map([['key', 'value']]),
    set: new Set([1, 2, 3])
};
const clonedSpecialObj = deepClone(specialObj);
console.log(clonedSpecialObj.date instanceof Date); // true
console.log(clonedSpecialObj.regexp instanceof RegExp); // true
console.log(clonedSpecialObj.map instanceof Map); // true
console.log(clonedSpecialObj.set instanceof Set); // true