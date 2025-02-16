// minimax 题目，复杂对象扁平化
function flattenObject(obj) {
    const result = {};
    const helper = (obj, prefix) => {
        if (obj === null) {
            return;
        }
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                helper(obj[i], prefix + '[' + i + ']')
            }
        } else if (typeof obj === 'object') {
            for (let key in obj) {
                helper(obj[key], prefix ? prefix + '.' + key : key);
            }
        } else {
            result[prefix] = obj;
        }
    }
    helper(obj, '');
    console.log(result);
    return result;
}

let obj = {
    a: [1, 2, { b: '11', c: { d: '22' } }, [1, 2, 3]],
    f: '11'
}

flattenObject(obj);

// 其他手写，扁平数组
function flatArray(array) {
    return array.reduce((acc, cur) => {
        return acc.concat(Array.isArray(cur) ? flatArray(cur) : cur)
    }, []);
}

console.log(flatArray([1, 2, [3, 4, [5, [6, 7]]]]))

// 手写 instanceof
function isInstanceof(obj1, obj2) {
    // 不用 Object.getPrototypeOf(obj1) 也可以用 __proto__，不过浏览器严格模式下访问不到，不推荐
    while (obj1) {
        console.log(Object.getPrototypeOf(obj1), obj1.__proto__)
        if (Object.getPrototypeOf(obj1) === obj2.prototype) {
            return true;
        } else {
            obj1 = Object.getPrototypeOf(obj1);
        }
    }
    return false;
}

console.log(isInstanceof([1, 2, 3], Object));

// 手写 obj deepcopy 深拷贝
function deepCopy(obj) {
    
}