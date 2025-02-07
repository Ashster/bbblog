// 快速排序
function quickSort(array) {
    if (array.length <= 1) {
        return array;
    }
    let pivot = array[0];
    let left = [];
    let right = [];
    for (let i = 1; i < array.length; i++) {
        array[i] < pivot ? left.push(array[i]) : right.push(array[i]);
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]))


// 归并排序
function mergeSort(array) {
    if (array.length <= 1) {
        return array;
    }
    let mid = array.length >> 1;
    let left = array.slice(0, mid);
    let right = array.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [];
    while (left.length && right.length) {
        left[0] < right[0] ? result.push(left.shift()) : result.push(right.shift());
    }
    return result.concat(left, right);
}

console.log(mergeSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));


// buildHeap 堆排序
// 求第 K 大的元素，创建一个容量为 k 的小顶堆，堆顶的元素是最小的。
// 当堆满了之后，后面想要进来的元素直接和堆顶比较，如果比堆顶大，就直接代替堆顶，之后重新 heapify 堆
// 这样，当所有元素都进行完之后，堆内的就是 top k 的元素
// 堆顶正好是 第 k 个 大的元素
// 堆可以理解为是一颗完全二叉树
// 小顶堆中，根节点必须比左右子树小，每个节点都是
// 大顶堆中，根节点必须比左右子树大，每个节点都是
// 我们本身可以不创建 堆 结构，而是通过数组下标来模拟堆的位置
// 用数组模拟堆，一个节点下标为 i
// 则他的左右节点下标分别为 2*i+1 和 2*i+2
// 最后一个非叶子节点下标是 Math.floor(length / 2) - 1
// parent 节点的下标是 (i-1) >> 1
// buildHeap 其实就是可以从 最后一个非 叶子节点的位置开始
// 自下而上创立小顶堆， 每次添加一个元素后都进行 heapify

function buildHeap(array, heapsize) {
    for (let i = ((heapsize) >> 1) - 1; i >= 0; i--) {
        heapify(array, i, heapsize);
    }
    return array;
}

function heapify(array, index, heapsize) {
    let left = 2 * index + 1;
    let right = 2 * index + 2;
    let largest = index; // 记录目前的最大位置
    // 构建小顶堆为例
    if (left < heapsize && array[left] < array[largest]) {
        largest = left;
    }
    if (right < heapsize && array[right] < array[largest]) {
        largest = right;
    }
    if (largest !== index) {
        // 需要调整
        swap(array, largest, index);
        // 调整后继续看下 largest 这棵树 heapify
        heapify(array, largest, heapsize);
    }
}

function swap(array, index1, index2) {
    [array[index1], array[index2]] = [array[index2], array[index1]];
}

const heap = buildHeap([10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 10);
console.log(heap);


// 
