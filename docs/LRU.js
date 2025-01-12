// LRU（Least Recently Used）缓存是一种缓存淘汰策略，用于管理有限容量的缓存。
// 当缓存达到其容量限制时，LRU策略会移除最久未使用的缓存项，以便为新的数据腾出空间。
// 这个策略的核心思想是“最近使用的优先保留，最久未使用的优先淘汰”。
// 两种实现方式：
// 1. 仅使用 js map 哈希表来实现，这种方式是利用了 js 中 map 是有序的特性来实现的。
// 当内存超出限制需要删除的使用，map.keys().next()，也就是迭代器的第一个元素，就是要删除的最久未使用的节点
// 当map中已有的节点又被访问需要更新时，会在 map 中先 delete 删除这个元素，之后 set 到最后面这个新的节点
// 时间复杂度： O(1)
// 空间复杂度： O(n）
// 2. 使用 js map + 双向链表来实现
// map 中仅用于存储节点 + 快速的查找指定节点，查找存储的复杂度都是 O(1)
// 双向链表用于节点的顺序维护，每个节点都有一个 prev 和 一个 next 来维护顺序，
// 这样当节点重新被访问需要移动位置的时候可以快速的移动到尾部，时间复杂度也是 O(1)
// 时间复杂度： O(1)
// 空间复杂度： O(n）
// 两种方案优缺点：
// 1. 在操纵不频繁 + 数据量不大的时候，仅使用 map 更简单
// 2. 在数据量大+频繁的写操作下，单独使用 map 需要不停的更新 Map 的内部结构，
// 频繁的删除和插入也会造成垃圾回收的负担，因为每次删除都会让旧的键值对成为垃圾
// 3. 而使用 map + 双向链表，在高频+大数据量情况下更具有优势，不会导致每次操作都触发 map 的频繁变更
// 4. 通过双向链表的特性直接调整链表节点的指针，减少对 map 的写操作

// 方案 1 实现
class LRUCache1 {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();
    }
    get(key) {
        if (this.map.has(key)) {
            const value = this.map.get(key);
            this.map.delete(key);
            this.map.set(key, value);
            return value;
        } else {
            return -1;
        }
    }
    put(key, value){
        if(this.map.has(key)){
            this.map.delete(key);
        } else if(this.map.size >= this.capacity){
            const oldestKey = this.map.keys().next().value;
            this.map.delete(oldestKey);
        }
        this.map.set(key, value);
    }
}


// 方案 2 实现

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
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
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this._remove(this.cache.get(key));
        } else if (this.cache.size >= this.capacity) {
            const oldest = this.tail.prev;
            this._remove(oldest);
            this.cache.delete(oldest.key);
        }
        const _newNode = new Node(key, value);
        this._add(_newNode);
        this.cache.set(key, _newNode);
    }

    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        const node = this.cache.get(key);
        this._remove(node);
        this._add(node);
        return node.value;
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

