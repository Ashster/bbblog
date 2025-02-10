<template>
  <div class="virtual-list" ref="listRef" @scroll="onScroll">
    <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>
    <div class="virtual-list-content" :style="{ transform: getTransform }">
      <div
        v-for="item in visibleData"
        :key="item.id"
        :data-index="item.id"
        class="list-item"
        ref="items"
      >
        <slot :item="item">
          {{ item.name }}
          <div :style="{ height: item.height + 'px' }">
            内容高度不定 {{ item.height }}px
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'

// 生成测试数据，每项高度随机
const listData = new Array(10000).fill(null).map((_, index) => ({
  id: index,
  name: `Item ${index}`,
  height: Math.random() * 100 + 50 // 随机高度50-150px
}))

const listRef = ref(null)
const items = ref([])
const positions = ref([]) // 存储每项的位置信息
const start = ref(0) // 起始索引
const end = ref(0) // 结束索引
const bufferSize = 5 // 缓冲区大小
const viewportHeight = 600 // 可视区域高度
const estimatedItemHeight = 100 // 预估项目高度
const scrollTop = ref(0)

// 添加高度缓存Map
const heightCache = ref(new Map())
// 添加平均高度计算
const averageHeight = ref(estimatedItemHeight)
// 添加已测量项数量
const measuredCount = ref(0)

// 优化后的初始化位置信息
const initPositions = () => {
  positions.value = listData.map((_, index) => {
    // 优先使用缓存的高度
    const cachedHeight = heightCache.value.get(index)
    const height = cachedHeight || averageHeight.value
    const top = index === 0 ? 0 : positions.value[index - 1]?.bottom || 0
    return {
      index,
      height,
      top,
      bottom: top + height
    }
  })
}

// 获取可视区域数据
const visibleData = computed(() => {
  return listData.slice(start.value, end.value + 1)
})

// 计算总高度
const totalHeight = computed(() => {
  const lastItem = positions.value[positions.value.length - 1]
  return lastItem ? lastItem.bottom : 0
})

// 获取偏移量
const getTransform = computed(() => {
  return `translate3d(0, ${start.value >= 1 ? positions.value[start.value].top : 0}px, 0)`
})

// 二分查找获取索引
const binarySearch = (list, value) => {
  let start = 0
  let end = list.length - 1
  let tempIndex = null

  while (start <= end) {
    let midIndex = Math.floor((start + end) / 2)
    let midValue = list[midIndex].bottom

    if (midValue === value) {
      return midIndex + 1
    } else if (midValue < value) {
      start = midIndex + 1
    } else if (midValue > value) {
      if (tempIndex === null || tempIndex > midIndex) {
        tempIndex = midIndex
      }
      end = midIndex - 1
    }
  }
  return tempIndex
}

// 优化更新位置信息的方法
const updateItemsPosition = () => {
  const nodes = items.value
  let totalMeasuredHeight = 0
  
  nodes.forEach(node => {
    const rect = node.getBoundingClientRect()
    const index = parseInt(node.dataset.index)
    const currentHeight = rect.height
    
    // 只在高度发生变化时更新
    if (!heightCache.value.has(index) || heightCache.value.get(index) !== currentHeight) {
      heightCache.value.set(index, currentHeight)
      
      // 更新已测量数量和平均高度
      if (!heightCache.value.has(index)) {
        measuredCount.value++
        totalMeasuredHeight = Array.from(heightCache.value.values()).reduce((sum, height) => sum + height, 0)
        averageHeight.value = totalMeasuredHeight / measuredCount.value
      }
      
      // 更新当前项的位置信息
      positions.value[index].height = currentHeight
      positions.value[index].bottom = positions.value[index].top + currentHeight
      
      // 更新后续项的位置
      for (let i = index + 1; i < positions.value.length; i++) {
        const cachedHeight = heightCache.value.get(i) || averageHeight.value
        positions.value[i].top = positions.value[i - 1].bottom
        positions.value[i].height = cachedHeight
        positions.value[i].bottom = positions.value[i].top + cachedHeight
      }
    }
  })
}

// 优化滚动处理，添加节流
const onScroll = (() => {
  let ticking = false
  return () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (!listRef.value) return
        scrollTop.value = listRef.value.scrollTop
        
        // 计算起始索引
        start.value = binarySearch(positions.value, scrollTop.value)
        // 计算结束索引
        end.value = binarySearch(positions.value, scrollTop.value + viewportHeight)
        
        // 动态调整缓冲区大小
        const dynamicBufferSize = Math.ceil(viewportHeight / averageHeight.value * 0.3)
        const finalBufferSize = Math.max(bufferSize, dynamicBufferSize)
        
        // 添加缓冲区
        start.value = Math.max(0, start.value - finalBufferSize)
        end.value = Math.min(listData.length - 1, end.value + finalBufferSize)

        // 更新位置信息
        nextTick(() => {
          updateItemsPosition()
        })
        
        ticking = false
      })
      ticking = true
    }
  }
})()

// 添加ResizeObserver监听列表项大小变化
onMounted(() => {
  initPositions()
  onScroll()
  
  // 创建ResizeObserver实例
  const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
      const index = parseInt(entry.target.dataset.index)
      const height = entry.contentRect.height
      
      if (heightCache.value.get(index) !== height) {
        heightCache.value.set(index, height)
        nextTick(() => {
          updateItemsPosition()
        })
      }
    })
  })
  
  // 监听可视区域内的列表项
  const observeItems = () => {
    items.value.forEach(item => {
      resizeObserver.observe(item)
    })
  }
  
  nextTick(() => {
    observeItems()
  })
  
  // 在组件卸载时清理
  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<style scoped>
.virtual-list {
  height: 600px;
  overflow-y: auto;
  position: relative;
  border: 1px solid #e8e8e8;
}

.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  will-change: transform;
}

.list-item {
  padding: 10px;
  border-bottom: 1px solid #e8e8e8;
  box-sizing: border-box;
}
</style>
