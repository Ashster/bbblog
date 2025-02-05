<template>
  <div>
    <!-- 基础对象测试 -->
    <div>
      <h3>1. 基础对象测试</h3>
      <p>user: {{ user }}</p>
      <button @click="testModifyProp">测试修改已存在属性</button>
      <button @click="testAddProp">测试添加新属性</button>
      <button @click="testDeleteProp">测试删除属性</button>
    </div>

    <!-- 数组测试 -->
    <div>
      <h3>2. 数组测试</h3>
      <p>list: {{ list }}</p>
      <button @click="testArrayIndex">测试数组索引修改</button>
      <button @click="testArrayPush">测试数组push</button>
      <button @click="testArrayLength">测试修改数组长度</button>
    </div>

    <!-- 对象引用测试 -->
    <div>
      <h3>3. 对象引用测试</h3>
      <p>nested: {{ nested }}</p>
      <p>nested.obj.value: {{ nested.obj.value }}</p>
      <button @click="testReplaceObject">测试替换对象</button>
      <button @click="testModifyAfterReplace">测试替换后修改</button>
      <button @click="testRefReplaceObject">测试替换 ref 对象</button>
      <button @click="testRefModifyAfterReplace">测试替换 ref 对象后修改</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

// 1. 基础对象测试
const user = reactive({
  name: 'John',
  age: 25
})

function testModifyProp() {
  // ✅ 修改已存在属性会触发响应
  user.name = 'Jane'
}

function testAddProp() {
  // ✅ Vue 3 中添加新属性会触发响应
  user.title = 'Developer'
}

function testDeleteProp() {
  // ✅ Vue 3 中删除属性会触发响应
  delete user.age
}

// 2. 数组测试
const list = reactive([1, 2, 3])

function testArrayIndex() {
  // ✅ Vue 3 中通过索引修改数组会触发响应
  list[1] = 4
}

function testArrayPush() {
  // ✅ 数组方法会触发响应
  list.push(4)
}

function testArrayLength() {
  // ✅ Vue 3 中修改数组长度会触发响应
  list.length = 1
}

// 3. 对象引用测试
const nested = ref({
  obj: {
    value: 'test'
  }
})

function testReplaceObject() {
  // ✅ 替换对象会触发响应
  // nested.obj = { value: 'new' }
  nested.value.obj = { value: 'new' }
  console.log('对象已替换')
}

function testModifyAfterReplace() {
  // 尝试修改替换后的对象属性
  nested.value.obj.value = 'modified after replace'
  console.log('当前值:', nested.value.obj.value)
  // 值是修改成功了，但是并不会触发 watch(() => nested.obj,
}

function testRefReplaceObject() {
  // ✅ 替换响应式对象会触发响应
  nested.value.obj = ref({ value: 'new' }).value;
  console.log('响应式对象已替换')
}

function testRefModifyAfterReplace() {
  // 尝试修改替换后的对象属性
  nested.value.obj.value = 'modified after replace'
  console.log('当前值:', nested.value.obj.value)
}

// 监听变化
watch(
  () => ({ ...user }),
  (newVal, oldVal) => {
    console.log('user changed:', { newVal, oldVal })
  },
  { deep: true }
)

watch(
  () => [...list],
  (newVal, oldVal) => {
    console.log('list changed:', { newVal, oldVal })
  }
)

watch(
  () => nested.value.obj,
  (newVal, oldVal) => {
    console.log('nested.obj changed:', { newVal, oldVal })
  },
  { deep: true }
)
</script>

<style>
button {
  margin: 5px;
  padding: 5px 10px;
}

div {
  margin: 10px 0;
}
</style>
