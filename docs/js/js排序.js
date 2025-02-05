// 参考资料
// https://juejin.cn/post/6844903444365443080

// 对于评述算法优劣术语的说明
// 稳定：如果a原本在b前面，而a=b，排序之后a仍然在b的前面；
// 不稳定：如果a原本在b的前面，而a=b，排序之后a可能会出现在b的后面；
// 内排序：所有排序操作都在内存中完成；
// 外排序：由于数据太大，因此把数据放在磁盘中，而排序通过磁盘和内存的数据传输才能进行；
// 时间复杂度: 一个算法执行所耗费的时间。
// 空间复杂度: 运行完一个程序所需内存的大小。



// 1. 冒泡排序
// 时间复杂度：O(n^2)
// 空间复杂度：O(1)
// 稳定性：稳定, 稳定性是指，如果两个元素相等，那么他们的相对位置在排序后不会改变
// 最好情况：O(n) 完全正序或者交换一次之后完全正序时
// 最坏情况：O(n^2) 完全反序时
// 平均情况：O(n^2)
// 思路：
// 1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
// 2. 对每一对相邻元素做同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
// 3. 针对所有的元素重复以上的步骤，除了最后一个。
// 4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

function bubbleSort(arr) {
    console.time('bubbleSort');
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    console.timeEnd('bubbleSort');
    return arr;
}

console.log(bubbleSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));

// 改进冒泡排序
// 1. 设置一个最后交换的标志位，标志位之后的说明已经有序，下次不需要再比较

function bubbleSort2(arr) {
    console.time('bubbleSort2');
    let i = arr.length - 1;
    while (i > 0) {
        let lastExchangeIndex = 0;
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                lastExchangeIndex = j;
            }
        }
        i = lastExchangeIndex;
    }
    console.timeEnd('bubbleSort2');
    return arr;
}

console.log(bubbleSort2([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));

// 改进冒泡排序 2
// 每次冒泡都正向和反向各冒泡一次，这样一次冒泡都可以找到最大值和最小值两个最值
function bubbleSort3(arr) {
    console.time('bubbleSort3');
    let low = 0;
    let high = arr.length - 1;
    while (low < high) {
        for (let j = low; j <= high; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
        high--;
        for (let j = high; j >= low; j--) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
        low++;
    }
    console.timeEnd('bubbleSort3');
    return arr;
}

console.log(bubbleSort3([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));

// 2. 选择排序
// 选择排序也被称为最稳定的一种排序，这里的稳定不是下面说的这种稳定性，而是嘲讽的说无论如何他的时间复杂度都是 O(n^2)
// 时间复杂度：O(n^2)
// 空间复杂度：O(1)
// 最大最小时间复杂度都是 O(n^2)， 因为总要在 n 个元素中进行 n 次选择才能完成
// 稳定性：不稳定，稳定性是指，如果两个元素相等，那么他们的相对位置在排序后不会改变。
// 不稳定性 这个在选择排序的时候是有可能的，因为每次选择到一个最值之后，会把原本那个位置上的元素和最值位置进行交换，所以有可能导致次序混乱
// 思路：
// 1. 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
// 2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
// 3. 重复第二步，直到所有元素均排序完毕。

function selectSort(arr) {
    console.time('selectSort');
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        // 找到最小的元素，和当前的 i 位置的元素交换
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    console.timeEnd('selectSort');
    return arr;
}

console.log(selectSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));

// 3. 插入排序
// 时间复杂度 O(n^2)
// 最好情况：O(n) 完全正序时
// 最坏情况：O(n^2) 完全反序时
// 空间复杂度 O(1)
// 稳定性：稳定, 也就是如果两个元素相等，那么他们的相对位置在排序后不会改变
// 思路:
// 1. 从第一个元素开始，该元素可以认为已经被排序
// 2. 取出下一个元素，在已经排序的元素序列中从后向前扫描
// 3. 如果该元素（已排序）大于新元素，将该元素移到下一位置
// 4. 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置
// 5. 将新元素插入到该位置后
// 6. 重复步骤 2~5

function insertSort(arr) {
    console.time('insertSort');
    for (let i = 0; i < arr.length; i++) {
        let target = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > target) {
            // 向后挪，给前面要插入的地方让位置
            arr[j + 1] = arr[j];
            j--;
        }
        // 这个时候的 j 就找到了第一个小于等于 target 的位置，target 放在的后面
        arr[j + 1] = target;
    }
    console.timeEnd('insertSort');
    return arr;
}

console.log(insertSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));

// 插入排序优化
// 二分查找插入位置
function insertSort2(arr) {
    console.time('insertSort2');
    for (let i = 0; i < arr.length; i++) {
        let target = arr[i];
        let left = 0;
        let right = i - 1;
        while (left <= right) {
            let mid = left + ((right - left) >> 1);
            if (arr[mid] > target) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // 这个时候 left 就是要插入的位置，left 之后的元素后移一位
        for (let j = i - 1; j >= left; j--) {
            arr[j + 1] = arr[j];
            if (j === left) {
                arr[j] = target;
            }
        }
    }
    console.timeEnd('insertSort2');
    return arr;
}

console.log(insertSort2([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));

// 4. 希尔排序
// https://juejin.cn/post/6879358434480193543
// 希尔排序是插入排序的改进版，插入排序在处理大规模无序数组时效率较低，希尔排序通过将数组分组，对每个分组进行插入排序，逐步缩小分组的大小，最终完成排序。
// 希尔排序是首次提出时间复杂度低于 O(n^2) 的排序算法
// 时间复杂度：O(nlogn)
// 空间复杂度：O(1)
// 稳定性：不稳定
// 思路：
// 1. 选择 gap，一般 gap 是数组长度的一半，然后每次 gap 减半，直到 gap 为 1（或者gap为循环的 3k+1）
// 2. 对每个 gap 进行插入排序
// 3. 重复 1 和 2 直到 gap 为 1

function shellSort(arr) {
    console.time('shellSort');
    let gap = arr.length >> 1;
    while (gap > 0) {
        for (let i = gap; i < arr.length; i++) {
            let target = arr[i];
            let j = i - gap;
            while (j >= 0 && arr[j] > target) {
                arr[j + gap] = arr[j];
                j -= gap;
            }
            arr[j + gap] = target;
        }
        gap = gap >> 1;
    }
    console.timeEnd('shellSort');
    return arr;
}

console.log(shellSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));


// 5. 归并排序
// 时间复杂度：O(nlogn)
// 空间复杂度：O(n)
// 稳定性：稳定
// 思路：
// 1. 将数组分成两半，对每一半进行排序
// 2. 将两半合并，合并的时候，如果左边小于等于右边，那么左边先放入结果，否则右边先放入结果
// 3. 重复 1 和 2 直到数组有序

function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    let mid = arr.length >> 1;
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [];
    while (left.length && right.length) {
        result.push(left[0] <= right[0] ? left.shift() : right.shift());
    }
    return result.concat(left, right);
}

// 6. 快速排序
// 时间复杂度：O(nlogn)
// 空间复杂度：O(logn)
// 最好情况：O(nlogn) 每次基准元素都能将数组分成两半
// 最坏情况：O(n^2) 每次基准元素都只比前一个元素大 1，这样每次只能将数组分成一小半
// 稳定性：不稳定，因为根据基准元素放在左边或者右边，会导致相同元素的相对位置变化
// 思路：
// 1. 选择一个基准元素，将数组分成两半，小于基准元素的放在左边，大于等于基准元素的放在右边
// 2. 对左右两半进行递归排序
// 3. 重复 1 和 2 直到数组有序

function quickSort(arr) {
    if (arr.length <= 1) return arr;
    let pivot = arr[0];
    let left = [];
    let right = [];
    for (let i = 1; i < arr.length; i++) {
        arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
    }
    return quickSort(left).concat(pivot, quickSort(right));
}

console.log(quickSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));

// 7. 堆排序
// 时间复杂度：O(nlogn)
// 空间复杂度：O(1)
// 稳定性：不稳定
// 思路：
// 1. 构建最大堆
// 2. 将堆顶元素与最后一个元素交换，然后调整堆
// 3. 重复 2 直到堆为空

// 手写一个堆排序，包括堆构建
// https://leetcode.cn/problems/top-k-frequent-elements/submissions/596590578/


// 扩展资料：什么是堆？大顶堆、小顶堆
// https://github.com/sisterAn/JavaScript-Algorithms/issues/60

// 题目
// 215. 数组中的第K个最大元素
// https://leetcode.cn/problems/kth-largest-element-in-an-array/description/

// 堆排序与构建
function buildHeap(array, length) {
    // 根据 array 自下而上创建一颗小顶堆
    for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {
        heapify(array, i, length);
    }
}

// 多加一个 heapsize 确定找的边界
function heapify(array, i, heapsize) {
    // 从左到右，自上而下的调整节点
    // 调整的是以 i 为 root 的这个小堆分支
    // 而更往上的分支循环在 buildHeap 中
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    let largest = i;
    // 按大顶堆来思考，所以要保证 root 是最大的
    // 按小顶堆来思考的话，这里就要保证 root 是最小的
    if (left < heapsize && array[left] < array[largest]) {
        largest = left;
    }
    if (right < heapsize && array[right] < array[largest]) {
        largest = right;
    }
    if (largest !== i) {
        swap(array, i, largest);
        // 交换完之后继续看下面这颗小树
        heapify(array, largest, heapsize);
    }
}

function swap(nums, i1, i2) {
    let temp = nums[i1];
    nums[i1] = nums[i2];
    nums[i2] = temp;
}

let arr = [9, 8, 7, 6, 5, 4, 3, 2, 1];
buildHeap(arr, arr.length);
console.log(arr);






