function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }
    return Object.keys(obj).reduce((result, key) => {
        result[key] = deepClone(obj[key]);
        return result;
    }, {})
}

function camelToSnake(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}


let obj = {
    'ABC': 1,
    'ABC2': {
        'ABC3': 2,
        'ABC4': [{ 'BAA': 11 }, 222]
    },
};

console.log(JSON.stringify(obj));
console.log(JSON.stringify(deepClone(obj)));