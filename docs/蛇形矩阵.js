// 蛇形矩阵
// 从数字 1 开始，按照蛇形顺序，依次填充矩阵
// 其实就是按照每次对角线来
// 比如这样填充
// 1 2 6 7
// 3 5 8 11
// 4 9 10 12


function snakeMatrix(m, n) {
    const matrix = new Array(m).fill(0).map(() => new Array(n).fill(0));
    let num = 1;
    // 沿着对角线遍历
    // 一个 m * n 的矩阵，共有 m + n - 1 条对角线
    // 对角线从 0 开始，到 m + n - 2 结束
    // 对于偶数序号的对角线，从左下角到右上角遍历
    // 对于奇数序号的对角线，从右上角到左下角遍历
    // 同一条对角线上的 i + j 是相同的，就是对角线的序号
    for (let i = 0; i < m + n - 1; i++) {
        if (i % 2 === 0) {
            let x = i < m ? i : m - 1;
            let y = i < m ? 0 : i - m + 1;
            while (x >= 0 && y < n) {
                matrix[x][y] = num++;
                x--;
                y++;
            }
        } else {
            let x = i < n ? 0 : i - n + 1;
            let y = i < n ? i : n - 1;
            while (x < m && y >= 0) {
                matrix[x][y] = num++;
                x++;
                y--;
            }
        }
    }
    console.log(matrix);
}

snakeMatrix(3, 4);

snakeMatrix(4, 2);

function deepClone(obj, hash = new WeakMap()) {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (hash.has(obj)) return hash.get(obj);
    let result = Array.isArray(obj) ? [] : {};
    hash.set(obj, result);
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            result[key] = deepClone(obj[key], hash);
        } else {
            result[key] = obj[key];
        }
    }
    console.log(result);
    return result;
}

deepClone({
    a: [1, 2, 3],
    b: {
        c: '11',
        d: ['kk']
    }
})