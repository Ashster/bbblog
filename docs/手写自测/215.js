// 手写 new
// 需要先创建一个空对象,将构造函数的原型指向空对象
// 将构造函数指向空对象作为 this 运行
// 如果运行结果为 obj 就返回她，否则返回创造的空对象

var name = '222';

function newObj(fn, ...args) {
    let obj = Object.create(fn.prototype);
    let res = fn.call(obj, ...args);
    return typeof res === 'object' ? res : obj;
}

function Person(name) {
    this.name = name;
    this.callMyName3 = () => {
        console.log(this);
        console.log(this.name);
    }
}

Person.prototype.callMyName = function () {
    console.log(this.name);
}

Person.prototype.callMyName2 = () => {
    console.log(this);
    console.log(this.name);
}

let obj = newObj(Person, '111');
console.log(obj);
obj.callMyName();
obj.callMyName2();
obj.callMyName3();

console.log(this);

Promise.prototype.MyAll = function (promiseList) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promiseList.length; i++) {
            
        }
    });
}