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

const itemHeight = computed(() => 100)

watch(() => props.list, (l) => {
  initPosition(l)
}, { immediate: true, deep: true })

watch(() => props.height, (h) => {
  scrollHeight.value = h
})

function initPosition(arr: any[]) {
  listPos.value = arr.map((item, index) => {
    return {
      ...item,
      active: false,
      y: index * itemHeight.value,
      x: 0,
    }
  })
  // console.log(listPos.value)
}

function handleDragStart(index) {
  // console.log(index)
  currentIndex.value = index
  oldIndex.value = index
  sorting.value = true
  sortChanged.value = false
  listPos.value[index].active = true
  // 震动反馈
  vibrate()
}

function handleDragEnd() {
  if (!sorting.value)
    return
  sorting.value = false

  if (targetIndex.value > -1 && targetIndex.value !== oldIndex.value) {
    listPos.value[oldIndex.value].y = targetIndex.value * itemHeight.value
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
    initPosition(listPos.value.sort((item1, item2) => item1.y - item2.y))
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
  const currentY = Math.floor((y + itemHeight.value / 2) / itemHeight.value)
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
        item.y = newIndex * itemHeight.value
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

function scrollList() {
  const middleIndex = (maxItems - 1) / 2
  if (targetIndex.value > middleIndex) {
    scrollTop.value = (targetIndex.value - middleIndex) * itemHeight.value
  }
  else {
    scrollTop.value = 0.1
    nextTick(() => {
      scrollTop.value = 0
    })
  }
  // console.log(scrollTop.value, 'scrollTop')
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
        height: `${listPos.length * itemHeight}px`,
      }"
    >
      <movable-view
        v-for="(item, index) in listPos"
        :key="`${item[keyProp]}-${index}`"
        class="drag-movable-item"
        :style="{
          height: `${itemHeight}px`,
          zIndex: oldIndex === index ? 10 : 1,
        }"
        :x="item.x"
        :y="`${item.y}px`"
        direction="vertical"
        out-of-bounds
        :disabled="!sorting"
        @change="handleSortChange"
        @longpress="handleDragStart(index)"
        @touchend="handleDragEnd"
      >
        <view class="drag-item-box">
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
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.drag-movable-item--active {
  @apply: bg-indigo-400 dark:bg-indigo-600;
}
.drag-item-box {
  width: 100%;
  position: relative;
  padding: 0;
  box-sizing: border-box;
}
</style>
