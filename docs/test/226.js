function combine(n, k) {
    // 从 1-n 里面选 k 个元素进行组合
    let res = [];
    const helper = (start, path) => {
        if (path.length === k) {
            res.push(path.slice());
            return;
        }
        for (let i = start; i <= n; i++) {
            path.push(i);
            helper(i + 1, path);
            path.pop();
        }
    }
    helper(1, []);
    console.log('combine res', res);
    return res;
}

combine(4, 2);

function quanpailie(array) {
    // 首先 sort， 避免重复
    array.sort((a, b) => a - b)
    let res = new Map();
    let used = new Array(array.length).fill(false);

    const helper = (used, path) => {
        if (path.length === array.length) {
            if (res.has(path.join(''))) return;
            res.set(path.join(''), path.slice());
            return;
        }
        for (let i = 0; i < array.length; i++) {
            if (used[i]) {
                continue;
            }
            // if (i > 0 && array[i] === array[i - 1]) {
            //     continue;// 去重复
            // }
            used[i] = true;
            path.push(array[i]);
            helper(used, path);
            used[i] = false;
            path.pop();
        }
    }
    helper(used, []);
    console.log([...res.values()]);
    return res;
}

quanpailie([1, 2, 3, 1]);

quanpailie([1, 1, 1]);