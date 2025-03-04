// wx
// 一道题目是这样的
// 有一组成员，每个成员分别有 m1，m2, .... 的钱，组成 m 数组
// 他们出去郊游，需要租自行车，自行车的价格分别为 n1,n2,n3 ...., 组成 n 数组
// 同时，这个团队还有一笔共同的活动经费 S
// 问题一，当所有成员的钱可以互相借时，一共最多可以租多少辆自行车
// 问题二，成员之间不能相互借款，是否可以每人一辆车
// 问题三，请给出一个最佳租车方案，用最少的钱租到最多的车，尽可能保证每人都有车

// 问题一，成员可以相互借钱，最多可以租多少量车
// 思路：
// 1. 将可支配总金额进行 total，包括公共部分 s
// 2. 将租车价格进行排序，之后循环累加直到超出我的可支配总金额


function maxBikes(m, n, S) {
    // 计算总金额
    const totalMoney = m.reduce((sum, money) => sum + money, 0) + S;
    // 对自行车价格进行排序
    n.sort((a, b) => a - b);

    let count = 0;
    let spentMoney = 0;
    for (let price of n) {
        if (spentMoney + price <= totalMoney) {
            spentMoney += price;
            count++;
        } else {
            break;
        }
    }
    return count;
}

// 问题2，成员间不可以相互借钱，判断每人是否能租一辆车
// 采用的是贪心算法，让钱多的人租贵的车，钱少的人租便宜的车
// 思路：
// 1. 将成员的钱 和 自行车价格 都从小到大排序
// 2. 判断人 和 自行车 哪个多，如果自行车本来就不够，直接 return false
// 3. 之后直接对后面比人多的自行车进行截断，只去 前 m 个自行车的价格进行计算
// 4. 循环计算第 i 个 人买 第 i 个 车的差价，如果能买的起差价就是 0
// 5. 之后计算总差价，如果比 S 小就每个人都有车，否则就不行
function canEachRentBike(m, n, S) {
    if (m.length > n.length) {
        return false;
    }
    m.sort((a, b) => a - b);
    n.sort((a, b) => a - b);
    // 只需要最便宜的前 m 辆车的价格来赚差价
    let neededBikes = n.slice(0, m.length);
    let needTotal = 0;
    m.map((money, i) => {
        let need = neededBikes[i] - money;
        if (need > 0) {
            needTotal += need;
        }
    })
    return needTotal > S ? false : true;
}

// 问题3，请给出一个最佳租车方案，用最少的钱租到最多的车，尽可能保证每人都有车
// 返回一个包含总租车数、总花费、和分配方案的对象
// 优先考虑让每个人都能租到车
// 使用贪心策略，优先租 便宜车
// 合理分配公共资源，确保尽可能多的人租到车
// 最后使用剩余公共资源租更多的车
function optimalRentalPlan(m, n, S) {
    const result = {
        totalBikes: 0,
        totalCost: 0,
        allocation: [],
    }

    // 对价格和成员资金都进行从小到达排序，方便贪心
    m.sort((a, b) => a - b);
    n.sort((a, b) => a - b);
    let remainingMoney = S;
    let availableBikes = [...n];
    let allocation = new Array(m.length).fill(-1);

    // 让钱少的人优先买便宜车
    for (let i = 0; i < m.length; i++) {
        if (availableBikes.length) {
            const memberMoney = m[i];
            const bikePrice = availableBikes[0];

            if (memberMoney >= bikePrice) {
                allocation[i] = availableBikes.shift();
            } else {
                let needed = bikePrice - memberMoney;
                if (remainingMoney >= needed) {
                    remainingMoney -= needed;
                    allocation[i] = availableBikes.shift();
                }
            }
        }
    }

    // 使用剩余公共资金租更多的车
    while(remainingMoney > 0 && availableBikes.length > 0){
        if(remainingMoney >= availableBikes[0]){
            result.totalBikes++;
            remainingMoney -= availableBikes[0];
            availableBikes.shift();
        } else {
            break;
        }
    }

    result.totalBikes += allocation.filter(x=> x!== -1).length;
    result.allocation = allocation;
    result.totalCost = n.reduce((sum, price, index)=>{
        if(index < result.totalBikes) return sum + price;
        return sum;
    }, 0);
    return result;
}


const members = [100, 150, 200];  // 成员资金
const bikes = [220, 110, 140];    // 自行车价格
const publicFund = 150;           // 公共资金
console.log(maxBikes(members, bikes, publicFund)); // true
console.log(canEachRentBike(members, bikes, publicFund)); // true
console.log(optimalRentalPlan(members, bikes, publicFund)); // true
