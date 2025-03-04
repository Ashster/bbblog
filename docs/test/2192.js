function test(array) {
    let res = [];
    const helper = (start, path) => {
        res.push(path.slice());
        for (let i = start; i < array.length; i++) {
            if ((i > start) && (array[i] === array[i - 1])) {
                continue;
            }
            path.push(array[i]);
            helper(i + 1, path);
            path.pop();
        }
    }
    helper(0, []);
    return res;
}

console.log(test([1, 2, 3, 4, 5]));