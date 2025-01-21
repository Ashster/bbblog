// leetcode:
// Promise pool: https://leetcode.cn/problems/promise-pool/solutions/2380417/promise-dui-xiang-chi-by-leetcode-soluti-5v7u/
// 

// promise retry
function promiseRetry(fn, count, delay){
    let currentCount = 0;
    return new Promise((resolve, reject)=>{
        function call(){
            fn().then(resolve).catch((e)=>{
                currentCount++;
                if(currentCount === count){
                    reject(e);
                }else{
                    setTimeout(()=>{
                        call();
                    }, delay);
                }
            });
        }
        call();
    })
}

function test(){
    return new Promise((resolve, reject)=>{
        if(Math.random() > 0.5) resolve('success!');
        else reject('failed!');
    });
}

Promise.prototype.myAll = function(promiseList){
    return new Promise((resolve, reject)=>{
        let result = [];
        promiseList.forEach((promise, index)=>{
            promise.then((data)=>{
                result[index] = data;
                if(result.length === promiseList.length){
                    resolve(result);
                }
            }).catch((e)=>{
                reject(e);
            });
        })
    });
}


const promiseList = [test(), test(), test()];
Promise.myAll(promiseList).then(console.log).catch(console.error);
promiseRetry(test, 3, 500).then(console.log).catch(console.error);