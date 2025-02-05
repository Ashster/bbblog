// 1. 冒泡排序，相邻元素两两交换，每一次排序之后可以确定一个最值放在最后面
// 时间复杂度 0(n^2)
// 空间复杂度 0(1) 原地交换排序，不占用额外的空间
// 稳定，不会出现相同的值排序后相对位置改变的现象

function bubbleSort(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }
    }
    return array;
}

console.log('bubbleSort->', bubbleSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));

// 2. 选择排序
// 每一轮在无序区域里选出一个最大的，和无序区域的最后一个进行交换
// 时间复杂度 O(n^2)
// 空间复杂地 O(1) 原地排序
// 不稳定，可能会出相同的值排序之后相对位置变化
function selectSort(array) {
    for (let i = 0; i < array.length - 1; i++) {
        let maxIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[maxIndex] > array[j]) {
                arrayIndex = j;
            }
        }
        [array[i], array[maxIndex]] = [array[maxIndex], array[i]];
    }
    return array;
}
console.log('selectSort->', selectSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));

// 3. 插入排序
// 分为有序无序两半
// 每次将无序队列的第一个拿出来在有序队列中一一对比，找到插入位置
// 时间复杂度 O(n^2)
// 空间复杂地 O(1) 原地排序
// 稳定
function insertSort(array) {
    for (let i = 0; i < array.length; i++) {
        let j = i - 1;
        let temp = array[i];
        while (j >= 0 && temp < array[j]) {
            array[j + 1] = array[j];
            j--;
        }
        // 找到 array[i+1] 该插入的位置
        array[j + 1] = temp;
    }
    return array;
}
console.log('insertSort->', insertSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));


// 4. 快速排序
// 时间复杂度 0(nlogn)
// 空间复杂度 O(n)
// 非原地排序
// 需要取一个pivot基准，比基准小的放左边，比基准大的放右边，递归
function quickSort(array) {
    if (array.length <= 1) {
        return array;
    }
    let pivot = array[0];
    let left = [];
    let right = [];
    for (let i = 1; i < array.length; i++) {
        if (array[i] < pivot) {
            left.push(array[i]);
        } else {
            right.push(array[i]);
        }
    }
    return [...quickSort(left), pivot, ...quickSort(right)]
}
console.log('quickSort->', quickSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));

// 5. 归并排序
// 一半一半排序
// 也是采用递归
// 时间复杂度 0(nlogn)
// 空间复杂度 O(n)也不是原地排序
function mergeSort(array) {
    let left = 0;
    let right = array.length - 1;
    let mid = left + (right - left) >> 1;
    return merge(mergeSort(array.slice(left, mid)), mergeSort(array.slice(mid + 1, right)));
}

function merge(left, right) {
    let res = [];
    while (left.length && right.length) {
        left[0] < right[0] ? res.push(left.shift()) : res.push(right.shift());
    }
    return res.concat(left, right);
}

console.log('mergeSort->', mergeSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));


// 手写一个快速排序
// 快速排序就是寻找一个 pivot 基准
// 然后将比基准小的放左边，比基准大的放右边
