
### 笔试知识点
#### 柯里化 curry https://leetcode.cn/problems/curry/description/
核心：参数长度还不够时，携带上递归上一次的参数，继续递归。

```javascript
var curry = function(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...args2) => curried(...args, ...args2);
  }
};
```

```javascript
const __ = Symbol('PLACE_HOLDER');

function placeholder(fn, ...args) {
  const curried = function (...newArgs) {
    const argsArray = [];
    let newArgsIndex = 0;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === __ && newArgsIndex < newArgs.length) {
        argsArray.push(newArgs[newArgsIndex++]);
      } else {
        argsArray.push(args[i]);
      }
    }

    while (newArgsIndex < newArgs.length) {
      argsArray.push(newArgs[newArgsIndex++]);
    }

    if (argsArray.findIndex(x => x === __) === -1 && argsArray.length >= fn.length) {
      return fn(...argsArray);
    }
    return placeholder(fn, ...argsArray);
  }
  return curried;
}

function g(a, b, c) {
  return a + b + c;
}

console.log(g(1, 2, 3));
console.log(placeholder(g, __, 1, 2)(3)); // 输出 6
console.log(placeholder(g, __, 1)(2)(3)); // 输出 6
```

#### LRU [https://leetcode.cn/problems/lru-cache/description/?company_slug=tencent](https://leetcode.cn/problems/lru-cache/description/?company_slug=tencent)
双向链表 + hash：put 和 get 过的插到最前面，满了删最后面

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
  put(key, value) {
      if (this.map.has(key)) {
        this.map.delete(key);
      } else if (this.map.size >= this.capacity) {
        this.map.delete(this.map.keys().next().value);
      }
      this.map.set(key, value);
  }
} 
```

```javascript

let Node = function (key, value) {
  this.key = key;
  this.value = value;
  this.prev = null;
  this.next = null;
}

/**
* @param {number} capacity
*/
var LRUCache = function (capacity) {
  this.capacity = capacity;
  this.count = 0;
  this.hashMap = {};
  this.head = new Node('head', 'head');
  this.tail = new Node('tail', 'tail');
  this.head.next = this.tail;
  this.tail.prev = this.head;
};

LRUCache.prototype.print = function (...args) {
  let node = this.head.next;
  let str = 'head';
  let a = 1;
  while (node !== null && a < 100) {
    str += ` -> ${node.value}`;
    node = node.next;
    a ++;
  }
  console.log(str);

  node = this.tail.prev;
  str = 'tail';
  a = 1;
  while (node !== null && a < 100) {
    str = `${node.value} <- ` + str;
    node = node.prev;
    a ++;
  }
  console.log(str);
  console.log('\n');
};

/** 
* @param {number} key
* @return {number}
*/
LRUCache.prototype.get = function (key) {
  const node = this.hashMap[key];
  if (!node) return -1;
  this.remove(node);
  this.putToHead(node);
  return node.value;
};

/** 
* @param {number} key 
* @param {number} value
* @return {void}
*/
LRUCache.prototype.put = function (key, value) {
  if (this.hashMap[key]) {
    this.hashMap[key].value = value;
    this.get(key);
  } else {
    const node = new Node(key, value);
    this.putToHead(node);
  }
};

LRUCache.prototype.remove = function (node) {
  delete this.hashMap[node.key];
  node.prev.next = node.next;
  node.next.prev = node.prev;
  this.count--;
};

LRUCache.prototype.putToHead = function (node) {
  if (this.count + 1 > this.capacity) {
    this.remove(this.tail.prev);
  }
  node.next = this.head.next;
  this.head.next = node;

  node.next.prev = node;
  node.prev = this.head;
  this.hashMap[node.key] = node;
  this.count++;
  if (this.count === 1) {
    this.tail.prev = node;
    node.next = this.tail;
  }
};

let lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
console.warn(lRUCache.get(1));    // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
console.warn(lRUCache.get(2));    // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
console.warn(lRUCache.get(1));    // 返回 -1 (未找到)
console.warn(lRUCache.get(3));    // 返回 3
console.warn(lRUCache.get(4));    // 返回 4
```

#### 排序
快速排序：随机找一个 n，比 n 小的放在左边，其他放在右边，然后左边和右边继续这个步骤

归并排序：注意归并时要是有序的才能排，所以先一层层递归到只有一个元素，回调时在排

splice: `array.splice(start[, deleteCount[, item1[, item2[, ...]]]])`

slice 不会删除：`array.slice([begin[, end]])`

```javascript
const arr = [3, 11, 1, 2, 4, 6, 5, 12];
let res = arr.slice().sort((a, b) => a - b);
console.log(JSON.stringify(res));

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  let middleIndex = Math.floor(arr.length / 2);
  let middle = arr.splice(middleIndex, 1)[0];
  let left = [], right = [];

  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] < middle) left.push(arr[i]);
    else right.push(arr[i]);
  }

  return quickSort(left).concat([middle], quickSort(right));
}

res = quickSort(arr.slice());
console.log(res);

function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  let middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle, arr.length);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while(leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex++]);
    } else result.push(right[rightIndex++]);
    console.log(result);
  }
  
  while(leftIndex < left.length) {
    result.push(left[leftIndex++]);
  }

  while(rightIndex < right.length) {
    result.push(right[rightIndex++])
  }

  return result;
}

res = mergeSort(arr.slice());
console.log(res);
```

#### 扁平化数组 flat [https://leetcode.cn/problems/flatten-deeply-nested-array/](https://leetcode.cn/problems/flatten-deeply-nested-array/)
```javascript
/**
 * @param {Array} arr
 * @param {number} depth
 * @return {Array}
 */
var flat = function (arr, n) {
    const result = [];
    for (let item of arr) {
        if (Array.isArray(item) && n > 0) {
            result.push(...flat(item, n - 1));
        } else result.push(item);
    }
    return result;
};
```

#### KMP 字符串匹配 [https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/description/)
```javascript
function kmp(text, pattern) {
    const next = buildNext(pattern);
    let i = 0, j = 0, ans = [];
    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
        } else if (j > 0) j = next[j - 1];
        else i++;

        if (j === pattern.length) {
            ans.push(i - j);
            j = next[j - 1];
        }
    }
    return ans;
}

function buildNext(pattern) {
    const table = [0];
    let prefixLen = 0, i = 1;
    while (i < pattern.length) {
        if (pattern[prefixLen] === pattern[i]) {
            table[i++] = ++prefixLen;
        } else if (prefixLen === 0) table[i++] = 0;
        else prefixLen = table[prefixLen - 1]; //继续比较
    }
    return table;
}

```

#### 树的遍历
[https://leetcode.cn/problems/binary-tree-preorder-traversal/description/](https://leetcode.cn/problems/binary-tree-preorder-traversal/description/)

[https://leetcode.cn/problems/binary-tree-inorder-traversal/description/](https://leetcode.cn/problems/binary-tree-inorder-traversal/description/)

[https://leetcode.cn/problems/binary-tree-postorder-traversal/description/](https://leetcode.cn/problems/binary-tree-postorder-traversal/description/)

```javascript
var preorderTraversal = function (root) {
  if (!root) return [];
  return [root.val, ...preorderTraversal(root.left), ...preorderTraversal(root.right)];
};

var inorderTraversal = function(root) {
    if (!root) return [];
    return [...inorderTraversal(root.left), root.val, ...inorderTraversal(root.right)]
};

var postorderTraversal = function(root) {
  if (!root) return [];
  return [postorderTraversal(root.left), postorderTraversal(root.right), root.val].flat();
};
```

```javascript
var preorderTraversal = function (root) {
    const stack = [root], ans = [];
    while (root && stack.length > 0) {
        const node = stack.pop();
        ans.push(node.val);
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    return ans;
};

var inorderTraversal = function(root) {
    const stack = [], result = [];
    let node = root;
    while (node || stack.length) {
        while (node) {
            stack.push(node);
            node = node.left;
        }
        node = stack.pop();
        result.push(node.val);
        node = node.right;
    }
    return result;
};

var postorderTraversal = function(root) {
    const stack = [], result = [];
    let node = root, lastVisitNode = null;
    while (node || stack.length > 0) {
        while (node) {
            stack.push(node);
            node = node.left;
        }
        node = stack[stack.length - 1];
        if (!node.right || lastVisitNode === node.right) {
            result.push(stack.pop().val);
            lastVisitNode = node;
            node = null;
        } else {
            node = node.right;
        }
    }
    return result;
};
```

层序遍历 序列化 + 反序列化 [https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/description/?company_slug=tencent](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/description/?company_slug=tencent)

```javascript
/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
    const queue = [root];
    let str = '';
    while (queue.length) {
        const node = queue.shift();
        if (node === null) {
            str += ',#';
            continue;
        }
        str += `,${node.val}`;
        queue.push(node.left);
        queue.push(node.right);
    }
    return str.slice(1);
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    const list = data.split(',');
    const rootValue = list.shift();
    const root = rootValue === '#' ? null : new TreeNode(rootValue);
    const queue = [root];
    while (list.length) {
        const node = queue.shift();
        const leftValue = list.shift();
        const rightValue = list.shift();
        node.left = leftValue === '#' ? null : new TreeNode(leftValue);
        node.right = rightValue === '#' ? null : new TreeNode(rightValue);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    return root;
};

```

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
    if (!root) return 'null';
    return root.val + ',' + serialize(root.left) + ',' + serialize(root.right);
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    const nums = data.split(',');
    return dfs(nums);
};

function dfs(nums) {
    const num = nums.shift();
    if (num === 'null') {
        return null;
    }
    const root = new TreeNode(num);
    root.left = dfs(nums);
    root.right = dfs(nums);
    return root;
}

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
```

#### 全排列
[https://leetcode.cn/problems/combinations/](https://leetcode.cn/problems/combinations/) ⬇️

```javascript
function dfs(nums, k, index, current, result) {
    if (current.length === k) {
        result.push(current.slice());
        return;
    }
    for (let i = index; i < nums.length; i++) {
        current.push(nums[i])
        dfs(nums, k, i + 1, current, result);
        current.pop();
    }
}
```

[https://leetcode.cn/problems/permutations/](https://leetcode.cn/problems/permutations/) ⬇️

```javascript
function dfs(nums, current, result, hash = new Map()) {
    if (current.length === nums.length) {
        result.push([...current]);
        return;
    }
    for (let i = 0; i < nums.length; ++i) {
        if (!hash.has(nums[i])) {
            current.push(nums[i]);
            hash.set(nums[i], 1);
            dfs(nums, current, result, hash)
            hash.delete(nums[i]);
            current.pop();
        }
    }
}
```

[https://leetcode.cn/problems/permutations-ii/](https://leetcode.cn/problems/permutations-ii/) ⬇️

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function(nums) {
    const result = [];
    dfs(nums, [], result, Array(nums.length).fill(false));
    return result;
};

function dfs(nums, current, result, used) {
    if (current.length === nums.length) {
        result.push([...current]);
        return;
    }
    const set = new Set();
    for (let i = 0; i < nums.length; ++i) {
        if (!set.has(nums[i]) && !used[i]) {
            current.push(nums[i]);
            used[i] = true;
            set.add(nums[i]);
            dfs(nums, current, result, used)
            used[i] = false;
            current.pop();
        }
    }
}
```

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function(nums) {
    const result = [];
    function permute(current, retains) {
        if (current.length === nums.length) {
            result.push(current);
            return;
        }
        for (let i = 0; i < retains.length; ++i) {
            if (i > 0 && retains[i] === retains[i - 1]) {
                continue;
            }
            const newRetains = retains.slice();
            const num = newRetains.splice(i, 1);
            permute(current.concat(num), newRetains);
        }
    }
    permute([], nums.sort((a, b) => a - b));
    return result;
};
```

#### 手写 JSON.parse
```javascript
function myJSONParse(jsonString) {
  let index = 0;
  const value = parseValue();

  // 主解析函数，根据不同情况分发到对应的解析函数
  function parseValue() {
      skipWhitespace();
      if (jsonString[index] === '{') {
          return parseObject();
      } else if (jsonString[index] === '[') {
          return parseArray();
      } else if (jsonString[index] === '"') {
          return parseString();
      } else if (jsonString[index] === 't' || jsonString[index] === 'f') {
          return parseBoolean();
      } else if (jsonString[index] === 'n') {
          return parseNull();
      } else {
          return parseNumber();
      }
  }

  // 解析对象
  function parseObject() {
      let obj = {};
      index++; // 跳过 '{'
      skipWhitespace();
      while (jsonString[index] !== '}') {
          let key = parseString();
          skipWhitespace();
          index++; // 跳过 ':'
          let value = parseValue();
          obj[key] = value;
          skipWhitespace();
          if (jsonString[index] === ',') {
              index++; // 跳过 ','
              skipWhitespace();
          }
      }
      index++; // 跳过 '}'
      return obj;
  }

  // 解析数组
  function parseArray() {
      let array = [];
      index++; // 跳过 '['
      skipWhitespace();
      while (jsonString[index] !== ']') {
          let value = parseValue();
          array.push(value);
          skipWhitespace();
          if (jsonString[index] === ',') {
              index++; // 跳过 ','
              skipWhitespace();
          }
      }
      index++; // 跳过 ']'
      return array;
  }

  // 解析字符串
  function parseString() {
      let result = '';
      index++; // 跳过开头的 '"'
      while (jsonString[index] !== '"') {
          result += jsonString[index++];
      }
      index++; // 跳过结束的 '"'
      return result;
  }

  // 解析布尔值
  function parseBoolean() {
      if (jsonString.startsWith('true', index)) {
          index += 4;
          return true;
      } else {
          index += 5;
          return false;
      }
  }

  // 解析 null
  function parseNull() {
      index += 4;
      return null;
  }

  // 解析数字
  function parseNumber() {
      let start = index;
      if (jsonString[index] === '-') {
          index++;
      }
      while (jsonString[index] >= '0' && jsonString[index] <= '9') {
          index++;
      }
      if (jsonString[index] === '.') {
          index++;
          while (jsonString[index] >= '0' && jsonString[index] <= '9') {
              index++;
          }
      }
      return parseFloat(jsonString.slice(start, index));
  }

  // 跳过空白字符
  function skipWhitespace() {
      while (jsonString[index] === ' ' || jsonString[index] === '\n' || jsonString[index] === '\t' || jsonString[index] === '\r') {
          index++;
      }
  }

  return value;
}

// 测试用例
try {
  console.assert(JSON.stringify(myJSONParse('{"name":"John", "age":30, "city":"New York"}')) === JSON.stringify({name: "John", age: 30, city: "New York"}), 'Test case 1 failed');
  console.assert(JSON.stringify(myJSONParse('{"name":"John", "age":30, "address":{"city":"New York", "zipcode":"10021"}}')) === JSON.stringify({name: "John", age: 30, address: {city: "New York", zipcode: "10021"}}), 'Test case 2 failed');
  console.assert(JSON.stringify(myJSONParse('["apple", "banana", "cherry"]')) === JSON.stringify(["apple", "banana", "cherry"]), 'Test case 3 failed');
  console.assert(JSON.stringify(myJSONParse('[{"id":1, "name":"John"}, {"id":2, "name":"Jane"}]')) === JSON.stringify([{id: 1, name: "John"}, {id: 2, name: "Jane"}]), 'Test case 4 failed');
  console.assert(JSON.stringify(myJSONParse('{"name":"John", "age":null, "isStudent":false, "grades":[90, 80, 85], "address":{}}')) === JSON.stringify({name: "John", age: null, isStudent: false, grades: [90, 80, 85], address: {}}), 'Test case 5 failed');
  console.assert(JSON.stringify(myJSONParse('{}')) === JSON.stringify({}), 'Test case 6 failed for empty object');
  console.assert(JSON.stringify(myJSONParse('[]')) === JSON.stringify([]), 'Test case 6 failed for empty array');
  console.assert(JSON.stringify(myJSONParse('{"text":"Hello \\"World\\" \\\\ \\/ \\b \\f \\n \\r \\t"}')) === JSON.stringify({text: 'Hello "World" \\ / \b \f \n \r \t'}), 'Test case 7 failed');
  console.log("All tests passed!");
} catch (e) {
  console.error("Test failed: ", e);
}

```



#### 设计模式 - 发布订阅
#### 设计模式 - 工厂模式


### 框架知识点
－ Vue 响应式原理，属性传递

－ react 基本语法

### 简历知识点
#### HTML/CSS
+ 块级元素、行内元素
+ 居中的方法：flex、绝对定位、text-align: center、表格
+ flex: 1 是 flex-grow 为 １[https://www.zhangxinxu.com/wordpress/2019/12/css-flex-deep/](https://www.zhangxinxu.com/wordpress/2019/12/css-flex-deep/) [https://juejin.cn/post/7339042131467747368](https://juejin.cn/post/7339042131467747368)
+ BFC 块格式化上下文，可以解决高度塌陷（块级元素与第一个元素 margin 取了较大值）[掌握外边距折叠 - CSS：层叠样式表 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)[区块格式化上下文 - CSS：层叠样式表 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_display/Block_formatting_context)
+ 标准盒模型 <font style="color:rgb(44, 62, 80);">content-box（width 包含 content），怪异盒模型 borer-box（width 包含 border padding content）</font>
+ opacity: 0、visibility: hidden、display: none

#### 浏览器
+ 输入 url 发生了什么：解析 url -> DNS -> IP -> TCP 联立联系 -> HTTP 请求 -> 响应 -> HTML/CSS/JS
+ 缓存：memory cache，disk cache
+ XSS 攻击，插入脚本执行黑客的操作
+ CSRF，利用 cookie, session 信息，朝黑客的网站发请求

#### HTTP
+ 状态码：1xx, 2xx, 3xx, 4xx, 5xx

#### JS 事件循环
宏任务：script, setTimeout, setInterval，setInterval, requestAnimationFrame

微任务：promise, MutationObserver，nextTick(node)

先执行一个宏任务、然后执行所有的微任务、然后执行下一个宏任务......（表现为先把一开始的 script 同步代码会执行完）

nodejs 中，宏任务会一次性执行完，nextTick 在微任务中优先级最高

题目集合：[https://juejin.cn/post/6959043611161952269](https://juejin.cn/post/6959043611161952269)

#### 手写 Promise [https://juejin.cn/post/6850037281206566919](https://juejin.cn/post/6850037281206566919)
```javascript
class Promise {
  status = 'pending';
  value = null;
  reason = null;
  resolveFns = [];
  rejectFns = [];

  constructor(fn) {
    let resolve = (value) => {
      if (this.status !== 'pending') {
        this.resolveFns = [];
        return;
      }
      this.status = 'fulfilled';
      this.value = value;
      this.resolveFns.forEach(fn => {
        fn(value);
      });
      this.resolveFns = [];
    }
    let reject = (reason) => {
      if (this.status !== 'pending') {
        this.rejectFns = [];
        return;
      }
      this.status = 'rejected';
      this.reason = reason;
      this.rejectFns.forEach(fn => {
        fn(reason);
      });
      this.rejectFns = [];
    }
    try {
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(thenFn) {
    return new Promise((resolve, reject) => {
      let handleValue = (value) => {
        try {
          if (typeof thenFn === 'function') {
            const result = thenFn(value);
            resolve(result);
          } else resolve(value);
        } catch (e) {
          reject(e);
        }
      }
      if (this.status === 'fulfilled') {
        setTimeout(() => handleValue(this.value), 0);
      } else if (this.status === 'pending') {
        this.resolveFns.push(handleValue);
      }
    })
  }

  catch(catchFn) {
    return new Promise((resolve, reject) => {
      let handleError = (reason) => {
        try {
          if (typeof catchFn === 'function') {
            const result = catchFn(reason);
            resolve(result);
          } else resolve(reason);
        } catch (e) {
          reject(e);
        }
      }
      if (this.status === 'rejected') {
        setTimeout(() => handleError(this.reason), 0);
      } else if (this.status === 'pending') {
        this.rejectFns.push(handleError);
      }
    })
  }

  static all(promiseList) {
    return new Promise((resolve, reject) => {
      let result = [];
      let count = 0;
      for (let i = 0; i < promiseList.length; i ++) {
        promiseList[i].then((data) => {
          result[i] = data;
          count ++;
          if (count === promiseList.length) {
            resolve(result);
          }
        }).catch(e => {
          reject(e);
        })
      }
    })
  }

  static allSettled(promiseList) {
    return new Promise((resolve, reject) => {
      let result = [];
      let count = 0;
      for (let i = 0; i < promiseList.length; i ++) {
        promiseList[i].then((data) => {
          result[i] = {
            status: 'fulfilled',
            value: data
          };
          count ++;
          if (count === promiseList.length) {
            resolve(result);
          }
        }).catch(e => {
          result[i] = {
            status: 'rejected',
            value: e
          };
          count ++;
          if (count === promiseList.length) {
            resolve(result);
          }
        })
      }
    })
  }

  static race(promiseList) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promiseList.length; i ++) {
        promiseList[i].then((data) => {
          resolve(data);
        }).catch(e => {
          reject(e);
        })
      }
    })
  }

  static any(promiseList) {
    return new Promise((resolve, reject) => {
      let count = 0;
      for (let i = 0; i < promiseList.length; i ++) {
        promiseList[i].then((data) => {
          resolve(data);
        }).catch(e => {
          count ++;
          if (count === promiseList.length) {
            reject(e);
          }
        })
      }
    })
  }
}

const p1 = new Promise((resolve, reject) => {
  console.log('create a promise');
  resolve('成功了');
})

console.log("after new promise");

const p2 = p1.then(data => {
  console.log(data)
  throw new Error('失败了')
})

const p3 = p2.then(data => {
  console.log('success', data)
}, err => {
  console.log('failed', err)
})

```

```javascript
function promiseRetry(fn, retries, delay) {
  let tryCount = 0;
  return new Promise((resolve, reject) => {
    function call() {
      fn().then(resolve).catch((e) => {
        tryCount ++;
        console.log(`retrying...${tryCount}/${retries}`);
        if (tryCount === retries) {
          reject(e);
        } else {
          setTimeout(() => {
            call();
          }, delay)
        }
      })
    }
    call();
  });
}

function myFn() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) resolve('success!');
    else reject('failed!');
  })
}

promiseRetry(myFn, 3, 500).then(console.log).catch(console.error);

```

#### 防抖（取消上一次） [https://leetcode.cn/problems/debounce/description/](https://leetcode.cn/problems/debounce/description/)
```javascript
var debounce = function(fn, t) {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, t)
    }
};
```

#### 节流（取消本次/储存本次） [https://leetcode.cn/problems/throttle/](https://leetcode.cn/problems/throttle/)
```javascript
var throttle = function(fn, t) {
    let startTime = 0;
    let nextCall = null;
    return function(...args) {
        if (!startTime) {
            fn(...args);
            startTime = Date.now();
        } else {
            if (Date.now() < startTime + t) {
                clearTimeout(nextCall);
                nextCall = setTimeout(() => {
                    fn(...args);
                    startTime = Date.now();
                }, startTime + t - Date.now());
            } else {
                fn(...args);
                startTime = Date.now();
            }
        }
    }
};
```

#### apply, call, bind
bind 是改变 this 空间后，返回新的函数：之前遇到过，美颜插件要做监听，监听了xxxx.bind(this)，其实 off 的时候就失效了，应该先 bind(this) 保存下来。

apply 和 call 都会立即执行函数，第一个参数都是 thisArg 上下文对象，apply 的第二个参数是数组，可以把参数都传进去，call 的话要一个个传进去。

```javascript
Function.prototype.myCall = function (ctx = window, ...args) {
  if (ctx === Function.prototype) {
    return undefined; // 防止 Function.prototype.myCall() 直接调用
  }
  ctx = ctx || window;
  const fnSymbol = Symbol();
  ctx[fnSymbol] = this;
  const result = ctx[fnSymbol](...args);
  delete ctx[fnSymbol];
  return result;
}

Function.prototype.myApply = function (ctx = window, args = []) {
  if (ctx === Function.prototype) {
    return undefined; // 防止 Function.prototype.myCall() 直接调用
  }
  ctx = ctx || window;
  const fnSymbol = Symbol();
  ctx[fnSymbol] = this;
  let result;
  if (Array.isArray(args)) {
    result = ctx[fnSymbol](...args);
  } else {
    result = ctx[fnSymbol]();
  }
  delete ctx[fnSymbol];
  return result;
}

Function.prototype.myBind = function (ctx, ...args) {
  if (this === Function.prototype) {
    throw new TypeError('Error');
  }
  const _this = this;

  return function F(...bindArgs) {
    if (this instanceof F) {
      return new _this(...args, ...bindArgs);
    }
    return _this.apply(ctx, args.concat(bindArgs));
  }
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 使用bind预设name为"John"
const JohnDoe = Person.myBind(null, "John");

// 使用new调用JohnDoe时，它实际上是在调用Person函数
const person1 = new JohnDoe(25);

console.log(person1.name); // 输出 "John"
console.log(person1.age);  // 输出 25
```

#### 科里化
核心：参数长度还不够时，携带上递归上一次的参数，继续递归。

```javascript
var curry = function(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...args2) => curried(...args, ...args2);
  }
};
```

#### 深拷贝
js 基础类型、null 是 object、typeof 和 instanceof 的区别

weakMap：对键值对是弱引用，如果没有其他地方来引用这些键值对，那么则可以被 GC。比如虚拟 DOM、对象之间的关联。key 必须是对象或者非全局注册的符号。

```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (hash.has(obj)) return hash.get(obj);

  let cloneObj = obj instanceof Array ? [] : {};
  hash.set(obj, cloneObj);

  const keys = Object.keys(obj);
  for (let key of keys) {
    cloneObj[key] = deepClone(obj[key], hash);
  }
  return cloneObj;
}

function isObject(obj) {
  return obj && (typeof obj === 'object') && !(obj instanceof Array);
}

function deepMerge(target, source) {
  if (!isObject(target) || !isObject(source)) {
    return target;
  }

  const keys = Object.keys(source);
  for (let key of keys) {
    const sourceObject = source[key];
    const targetObject = target[key];
    if (isObject(sourceObject) && isObject(targetObject)) {
      target[key] = deepMerge(targetObject, sourceObject);
    } else {
      target[key] = deepClone(sourceObject);
    }
  }
  return target;
}

const a = {
  foo: "bar",
  bar: {
    a: "aaa",
    b: "bbb",
    c: ['ccc', 'ddd']
  }
}

const b = deepClone(a);

a.foo = 'foo';
a.bar.c[1] = 'eee';

console.log(a);
console.log(b);

const c = {
  foo: 'c1',
  bar: {
    c: ['1', '2']
  }
}

const d = {
  foo: 'd1',
  bar: {
    c: ['2', '1'],
    d: 1
  }
}

console.log(c);
deepMerge(c, d);
console.log(c);
```

#### TS 知识点
```typescript
class A {
  @log()
  add(a: number, b: number) {
    return a + b;
  }
}

function log() {
  return function (target: any, name: string, descriptor: any) {
    console.log('start add');
    const origin = descriptor.value;
    descriptor.value = function (...args: any) {
      const res = origin.call(this, ...args);
      console.log('res', res);
      return res * 2;
    }
  }
}

(new A()).add(1, 2);
```

#### 实现瀑布流
1. 定义两列数组 + 记录高度
2. 挨个加载图片，push 到数组里

#### <font style="color:rgb(50, 50, 50);">WebRTC 工作流程</font>
1. 设备相关 推荐先获取设备
    1. navigator.permissions.query({ name: "camera" })
    2. const authStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    3. authStream.getTracks() track.stop();
2. 做一个信令的竞速连接
3. 然后双方建立 peerConnection
4. 操作音视频 addTracks、信令操作
5. 收到 track 事件，做渲染
6. track 的 mute，替换处理
7. 关闭 pc，释放所有的引用

#### 打包工具 esbuild, Rollup
esbuild: config -> build，dev 的话就 watch context，然后 tsc 生成 dts

rollup: 用的比较少, iife 会生成 umd