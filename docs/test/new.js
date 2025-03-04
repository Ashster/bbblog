// new
// 采用构造函数的原型来创建一个新的 object
// 将新的object作为this运行构造函数
// 返回构造函数执行结果/返回创造出来的新的 object
function myNew(fn, ...args) {
    let newObj = Object.create(fn.prototype);
    let result = fn.call(newObj, ...args);
    return typeof result === 'object' ? result : newObj;
}

function Person(name, age) {
    this.name = name;
    this.age = age;
}

let test = myNew(Person, 'xiaoming', 15);
console.log(test);
console.log(test instanceof Person);