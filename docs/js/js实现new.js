// js 早期的思想时函数式编程，没有直接的类的概念
// 在 ES6 之前，是采用构造函数来构建类，采用 prototype 原型链的概念来弥补类
// 在 ES6 之后，推出了 class 语法可以直接声明类

// ES6 之前的构造函数其实就是一个普通函数 + this 指针
// 下面就是个构造函数的例子
function Parent(name, sex) {
    this.name = name;
    this.sex = sex;
}
// 这样的构造函数或者采用 ES6 的 class 语法声明的类，就可以通过 new 来进行构建
// new 是通过构造函数创建一个对象实例的呢？
// 1. 根据 构造函数的 prototype 创造一个新的 object
// 2. 用这个新 object 作为 this，来执行 constructor 构造函数，为这个新 object 进行构造
// 3. 如果构造函数执行结果就是一个对象，直接返回这个对象；否则返回第一步创建的 object
//----------------------------------------------------------------------------


// https://juejin.cn/post/7127869568533561358
// 构造器函数
let Parent = function (name, age) {
    this.name = name;
    this.age = age;
};
Parent.prototype.sayName = function () {
    console.log(this.name);
};

// js new 的原理
// 0. 传入一个构造函数 + 构造所需的参数
// 1. 根据构造函数的 prototype 创建新对象
// 2. 将创建的新对象作为 this 上下文，apply 给构造函数，执行构造函数
// 3. 如果构造函数运行后没有返回对象，就返回这个 new 出来的对象，否则返回构造函数返回的结果

function newMethod2(Constructor, ...args) {
    let child = Object.create(Constructor.prototype);
    let res = Constructor.apply(child, args);
    return typeof res === 'object' ? res : child;
}

//自己定义的new方法
let newMethod = function (Parent, ...rest) {
    // 1.以构造器的prototype属性为原型，创建新对象；
    let child = Object.create(Parent.prototype);
    // 2.将this和调用参数传给构造器执行
    let result = Parent.apply(child, rest);
    // 3.如果构造器没有手动返回对象，则返回第一步的对象
    return typeof result === 'object' ? result : child;
};

//创建实例，将构造函数Parent与形参作为参数传入
const child = newMethod2(Parent, 'echo', 26);
// const child = newMethod(Parent, 'echo', 26);
child.sayName() //'echo';

//最后检验，与使用new的效果相同
console.log(child instanceof Parent)//true
console.log(child.hasOwnProperty('name'))//true
console.log(child.hasOwnProperty('age'))//true
console.log(child.hasOwnProperty('sayName'))//false
