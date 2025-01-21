// 对 setTimeout Promise化的封装
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// 以下两种方式效果相同
// 1. 使用 async/await 来实现
await sleep(1000);
console.log('1000ms后执行');

await sleep(1000);
console.log('2000ms后执行');

await sleep(1000);
console.log('3000ms后执行');

// 2. 使用 Promise.then() 来实现
await sleep(1000).then(() => {
    console.log('1000ms后执行');
    return sleep(1000);
}).then(() => {
    console.log('2000ms后执行');
    return sleep(1000);
}).then(() => {
    console.log('3000ms后执行');
});

console.log('--------------------------------');

// Promise retry 重试函数
// 写法一，只采用 promise 的写法，不使用 async/await
function retry(fn, times, delays) {
    return new Promise((resolve, reject) => {
        let currentTimes = 0;
        function attempt() {
            fn().then(resolve).catch(error => {
                currentTimes++;
                if (currentTimes >= times) {
                    reject(error);
                } else {
                    setTimeout(() => attempt(), delays[currentTimes]);
                }
            });
        }
        attempt();
    });
}

const mockAPI = () => {
    return new Promise((resolve, reject) => {
        let _random = Math.random();
        console.log(_random);
        if (_random > 0.5) {
            resolve('success');
        } else {
            reject('error');
        }
    });
}

const testRetry = async () => {
    retry(mockAPI, 3, [100, 100, 100]).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    });
}

await testRetry();

console.log('--------------------------------');

// 写法二，使用 async/await 来实现
async function retry2(fn, times, delays) {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < times; i++) {
            try {
                const result = await fn();
                return resolve(result);
            } catch (error) {
                await sleep(delays[i]);
            }
        }
    });
}

const testRetry2 = async () => {
    retry2(mockAPI, 3, [100, 100, 100]).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    });
}

await testRetry2();