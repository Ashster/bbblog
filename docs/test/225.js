function bigSum(str1, str2) {
    let sum = '';
    let carry = 0;
    while (str1.length || str2.length) {
        let curr1 = str1.length ? str1.shift() : 0;
        let curr2 = str2.length ? str2.shift() : 0;
        let currSum = (curr1 + curr2 + carry) % 10;
        carry = Math.floor((curr1 + curr2 + carry) / 10);
        sum = currSum + sum;
    }
}