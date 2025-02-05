# KMP 算法

https://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html

## 什么是 KMP 算法
KMP 算法是一种字符串匹配算法，用于在一个文本串中查找一个模式串的出现位置。

## 前缀 & 后缀
- 前缀: 包含第一个字符，不包含最后一个字符。
- 后缀: 包含最后一个字符，不包含第一个字符。
比如 字符串 "aabaaf":
- 前缀: a, aa, aab, aaba, aabaa
- 后缀: f, af, aaf, baaf, abaaf

## 前缀表
前缀表是用来记录模式串中每个位置的最长公共前后缀的长度。最长公共前后缀其实就是最长相等前后缀。
前缀表是用来回退的，它记录了模式串与主串不匹配的时候，模式串应该从哪里开始重新匹配。
以 "aabaaf" 为例，前缀表为 [0, 1, 0, 1, 2, 0]。
a 0
aa 1
aab 0
aaba 1
aabaa 2
aabaaf 0
所以前缀表就是 [0, 1, 0, 1, 2, 0]

在算法的实际实现过程中，一般用 prefix / next 来表示前缀表。

    

