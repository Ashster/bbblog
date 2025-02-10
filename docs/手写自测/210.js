// 手写 new
// 1. 创建一个 prototype 为构造函数原型的空对象
// 2. 以这个空对象为 this，执行构造函数
// 3. 如果构造函数返回的是一个对象，就返回这个对象，否则返回 object

function newObj(Parent, ...args) {
    let obj = Object.create(Parent.prototype);
    let res = Parent.call(obj, ...args);
    return typeof res === 'object' ? res : obj;
}

function testParentConstructor(a, b) {
    this.a = a;
    this.b = b;
}

console.log(newObj(testParentConstructor, 1, 2));

// 手写自测 2
// LRU 缓存
// 最近最少使用策略
// 因为查找的时间需要 O(1)
// 所以需要采用 Map 来存储节点
// 因为删除过期节点的时间也需要时O(1)
// 所以需要双向链表
// 首先有一个 map，一个maxSize, 一个 get 方法，获取 LRU Cache；一个 put 方法，存储
// 对于 get，先检查 map 里有没有，如果有的话就把它从原来的链表位置解除，放在 map 的最后也就是新位置
// 对于 put，先检查 map 满了没有，如果满了就需要先把map 的第一个删除，然后把新的添加在最后面

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache1 {
    constructor(capacity) {
        this.map = new Map();
        this.capacity = capacity;
        this.head = new Node(null, null);
        this.tail = new Node(null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    _remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    _add(node) {
        // 在头节点添加
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }
    put(key, value) {
        if (this.map.get(key)) {
            // 如果已经有了，就拿出来放在最新位置
            this._remove(this.map.get(key));
        }
        if (this.map.size >= this.capacity) {
            // 如果内存不够，就移除最后一个
            let oldest = this.tail.prev;
            this._remove(oldest);
            this.map.delete(oldest.key);
        }
        // 在头部放入新元素
        let newNode = new Node(key, value);
        this.map.set(key, newNode);
        this._add(newNode);
    }
    get(key) {
        if (this.map.get(key)) {
            // 删除老位置，放在最头部
            let target = this.map.get(key);
            this._remove(target);
            this._add(target);
            return target.value;
        } else {
            return -1;
        }
    }
}

// test1
const LRUTest = new LRUCache1(2);
// test2
// const LRUTest = new LRUCache(2);

// common test
LRUTest.put(1, 1);
LRUTest.put(2, 2);
console.log(LRUTest.get(2)); // 返回 2
console.log(LRUTest.get(1)); // 返回 1
// 之后内部顺序应该为 head -> 1 -> 2 -> tail
// 再存入一个新的，将 tail 的 2 删除
LRUTest.put(3, 3);
// 之后顺序应该为 head -> 3 -> 1 -> tail
console.log(LRUTest.get(2)); // 返回 -1, 未找到