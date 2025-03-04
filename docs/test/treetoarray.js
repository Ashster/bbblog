const arr = [
    { id: 1, name: '部门1', pid: 0 },
    { id: 2, name: '部门2', pid: 1 },
    { id: 3, name: '部门3', pid: 1 },
    { id: 4, name: '部门4', pid: 3 },
    { id: 5, name: '部门5', pid: 4 },
];


const obj = {
    id: 1,
    name: "部门1",
    pid: 0,
    children: [
        {
            id: 2,
            name: "部门2",
            pid: 1,
            children: []
        },
        {
            id: 3,
            name: "部门3",
            pid: 1,
            children: [
                {
                    id: 4,
                    name: "部门4",
                    pid: 3,
                    children: [
                        {
                            id: 5,
                            name: "部门5",
                            pid: 4,
                            children: []
                        }
                    ]
                }
            ]
        }
    ]
}


function arrayToTree(array, pid) {
    let map = new Map();
    for (let item of array) {
        if (map.has(item.id)) {
            map.set(item.id, { ...map.get(item.id), ...item });
        } else {
            map.set(item.id, { ...item, children: [] });
        }
        if (map.has(item.pid)) {
            map.get(item.pid).children.push(map.get(item.id));
        } else {
            map.set(item.pid, { children: [map.get(item.id)] })
        }
    }
    return map.get(pid);
}

console.log(JSON.stringify(arrayToTree(arr, 0)));


function treeToArray(tree) {
    let res = [];
    res.push({ id: tree.id, name: tree.name, pid: tree.pid });
    if (tree.children && tree.children.length) {
        for (let child of tree.children) {
            res.push(...treeToArray(child));
        }
    }
    return res;
}

console.log(treeToArray(obj));

// 数组扁平化
function flatten(array) {
    let res = [];
    if (!Array.isArray(array)) {
        res.push(array);
        return res;
    }
    for (let item of array) {
        let value = flatten(item);
        if (Array.isArray(value)) {
            res.push(...value);
        } else {
            res.push(value);
        }
    }
    return res;
}

const test = [1, 2, [3, [4, 5, [6, [7], 8, [9, 0]]]]];

console.log(flatten(test));