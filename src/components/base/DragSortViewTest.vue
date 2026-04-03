<script lang="ts" setup>
import lodash from 'lodash'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
const props = defineProps<{
  keyProp: string
  list: any[]
  height: number
}>()
const emit = defineEmits(['change'])

const { vibrate } = useVibrate()

const scrollHeight = ref(300)
const sorting = ref(false)
const sortChanged = ref(false)
const listPos = ref([])
const scrollTop = ref(0)
const targetIndex = ref(-1)
const currentIndex = ref(-1)
const oldIndex = ref(-1)
const maxItems = 7
const paddingY = 10
const minHeight = ref(50)
const itemWidth = ref(80)

const { proxy } = getCurrentInstance() as any

function getItemHeight(item) {
  return item.collapsed ? item.height : minHeight.value
}

const areaHeight = computed(() => {
  return listPos.value.reduce((acc, cur) => acc + cur.height, 0)
})

watch(() => props.list, (l) => {
  initPosition(l)
}, { immediate: true, deep: true })

watch(() => props.height, (h) => {
  scrollHeight.value = h
})

onMounted(() => {
  nextTick(() => {
    calculateItemSize()
  })
})

function calculateItemSize() {
  uni.createSelectorQuery()
    .in(proxy)
    .selectAll('.drag-item-box')
    .boundingClientRect((res: UniApp.NodeInfo[]) => {
      if (res) {
        listPos.value.forEach((item, index) => {
          item.height = res[index].height
        })
      }
    })
    .exec()
}

function initPosition(arr: any[]) {
  listPos.value = arr.map((item, index) => {
    return {
      ...item,
      collapsed: false,
      height: minHeight.value,
      y: index * minHeight.value,
      x: 0,
    }
  })
  // console.log(listPos.value)
}

function updatePosition(arr: any[]) {
  let totalHeight = 0
  listPos.value = arr.map((item, index) => {
    const y = totalHeight
    totalHeight += getItemHeight(item)
    return {
      ...item,
      y,
      x: 0,
    }
  })
}

function handleDragStart(index) {
  // console.log(index)
  currentIndex.value = index
  oldIndex.value = index
  sorting.value = true
  sortChanged.value = false
  // 震动反馈
  vibrate()
}

function handleTouchStart(index) {
  const item = listPos.value[index]
  // console.log('组件展开', item)
  item.collapsed = !item.collapsed
  updatePosition(listPos.value)
}

function handleTouchEnd() {
  if (!sorting.value)
    return
  sorting.value = false

  if (targetIndex.value > -1 && targetIndex.value !== oldIndex.value) {
    listPos.value[oldIndex.value].y = targetIndex.value * getItemHeight(listPos.value[oldIndex.value])
  }
  else {
    // 在没有项与项之间的位置调换时，给一个微量偏移处理
    listPos.value[oldIndex.value].y += 0.001
  }
  // console.log(targetIndex.value, listPos.value)
  nextTick(() => {
    oldIndex.value = -1
    currentIndex.value = -1
    targetIndex.value = -1
    updatePosition(listPos.value.sort((item1, item2) => item1.y - item2.y))
    if (sortChanged.value) {
      emit('change', [...listPos.value])
      sortChanged.value = false
    }
  })
}

function handleSortChange(e: any) {
  // console.log(e)
  if (e.detail.source !== 'touch' || !sorting.value) {
    return
  }

  const { y } = e.detail
  console.log(y, e, 'handleSortChange')
  const currentY = Math.floor((y + minHeight.value / 2) / minHeight.value)
  targetIndex.value = Math.min(currentY, listPos.value.length - 1)
  // console.log(targetIndex.value, currentIndex.value)
  if (targetIndex.value !== currentIndex.value && targetIndex.value >= 0) {
    const newList = lodash.cloneDeep(listPos.value)
    const elementToMove = newList.splice(oldIndex.value, 1)[0]
    newList.splice(targetIndex.value, 0, elementToMove)

    listPos.value.forEach((item, index) => {
      // 当前项通过手动拖动已经到了指定位置，因此需要重新排序其他项的高度
      if (index !== oldIndex.value) {
        // 找到所有项在新数组中的位置
        const newIndex = newList.findIndex(newItem => newItem[props.keyProp] === item[props.keyProp])
        // 根据新数组的位置重新置y值
        item.y = newIndex * getItemHeight(item)
        // console.log(item.y)
      }
    })

    nextTick(() => {
      currentIndex.value = targetIndex.value
      // TODO：暂时禁用滚动，目前会存在选中项漂移情况
      // scrollList()
    })

    sortChanged.value = true
  }
}
</script>

<template>
  <scroll-view
    scroll-y
    class="relative"
    :scroll-top="scrollTop"
    scroll-with-animation
    :enhanced="true"
    :style="{ height: `${scrollHeight}px` }"
  >
    <movable-area
      class="drag-movable-area"
      :style="{
        height: `${areaHeight}px`,
      }"
    >
      <movable-view
        v-for="(item, index) in listPos"
        :key="`${item[keyProp]}-${index}`"
        class="drag-movable-item"
        :style="{
          height: `${getItemHeight(item)}px`,
          zIndex: oldIndex === index ? 10 : 1,
        }"
        :x="item.x"
        :y="`${item.y}px`"
        direction="vertical"
        out-of-bounds
        :disabled="!sorting"
        @change="handleSortChange"
        @longpress="handleDragStart(index)"
        @touchstart="handleTouchStart(index)"
        @touchend="handleTouchEnd"
      >
        <view class="drag-item-box" :class="[oldIndex === index ? 'drag-item-box--active' : '']">
          <slot name="content" :item="item" :index="index" />
        </view>
      </movable-view>
    </movable-area>
  </scroll-view>
</template>

<style lang="scss" scoped>
.drag-movable-area {
  position: relative;
  width: 100%;
}

.drag-movable-item {
  width: 100%;
  transition: background-color 0.2s;
  overflow: hidden;
}

.drag-item-box {
  width: 100%;
  position: relative;
  padding: 0;
  box-sizing: border-box;
  background-color: aquamarine;
  margin-top: 5px;
}

.drag-item-box--active {
  @apply: bg-indigo-400 dark:bg-indigo-600;
}
</style>
