<script lang="ts" setup>
import lodash from 'lodash'
import { useTouch } from 'wot-design-uni'
import { omit } from '@/utils'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
const props = withDefaults(defineProps<{
  keyProp: string
  list: any[]
  height: number
  gap?: number
}>(), {
  gap: 5,
})
const emit = defineEmits(['change'])
const COM_INTERNAL_ARGS = ['x', 'y', 'drag_key', 'drag_id', 'height']

const { vibrate } = useVibrate()
const touch = useTouch()

const scrollHeight = ref(300)
const sorting = ref(false)
const sortChanged = ref(false)
const showList = ref([])
const cloneList = ref([])
const scrollTop = ref(0)
const targetIndex = ref(-1)
const currentIndex = ref(-1)
const oldIndex = ref(-1)

const areaHeight = ref(props.height)

const dragDirection = ref<'upward' | 'down'>()

const { proxy } = getCurrentInstance() as any

// 获取当前项的高度
function getItemHeight(item) {
  return item.height
}

watch(() => props.list, (newList) => {
  // console.log(newList, 'list change')
  updatePosition(newList)
  calculateItemSize()
}, { immediate: true })

watch(() => props.height, (h) => {
  scrollHeight.value = h
})

onMounted(() => {
  nextTick(() => {
    calculateItemSize()
  })
})

function calculateItemSize() {
  const list = cloneList.value
  // 获取原始项高度

  uni.createSelectorQuery().in(proxy).selectAll('.dragSlotContent').boundingClientRect((ts: UniApp.NodeInfo[]) => {
    // console.log(ts, 'init height')
    if (ts) {
      // 初始赋值选项的最高、最低高度
      for (let i = 0; i < ts.length; i++) {
        list[i].height = ts[i].height
      }

      updatePosition(list)
    }
  }).exec()
}

function updatePosition(list: any[]) {
  console.log(list)
  showList.value = list.map((item, index) => {
    const y = getPosition(index, list)
    // console.log(y, 'y')
    const data = {
      ...item,
      y,
      x: 0,
      drag_id: item[props.keyProp],
    }

    // let drag_key = `slot-${Math.random()}-${index}`
    let drag_key = `slot-${Math.random()}-${index}`
    // 如果x轴和y轴没变，那么不用更新key来刷新状态
    if (y === item.y) {
      if (currentIndex.value !== index) {
        // 非当前点击的下标和目标下标的下标不需要生成新的key
        drag_key = item.drag_key
      }
    }
    // 判断拖动位置的元素是那个
    data.drag_key = drag_key

    return data
  })
  // console.log(showList.value)
  // console.log(cloneList.value)

  // console.log(showList.value, 'showList')
  cloneList.value = lodash.cloneDeep(showList.value)
  nextTick(() => {
    const last = showList.value[showList.value.length - 1]
    // console.log(last, 'last')
    areaHeight.value = last.y + getItemHeight(last)
  })
}

function handleDragStart(index) {
  currentIndex.value = index
  oldIndex.value = index
  sorting.value = true
  sortChanged.value = false
  // 震动反馈
  vibrate()
}

function handleTouchStart(event: TouchEvent) {
  touch.touchStart(event)
  // console.log('touch start')
}

function handleTouchMove(event: TouchEvent) {
  touch.touchMove(event)
  dragDirection.value = touch.deltaY.value > 0 ? 'down' : 'upward'
}

function handleTouchEnd() {
  if (!sorting.value)
    return

  // console.log('touch end')
  sorting.value = false
  if (targetIndex.value >= 0 && currentIndex.value >= 0 && targetIndex.value !== currentIndex.value) {
    cloneList.value.splice(targetIndex.value, 0, ...cloneList.value.splice(currentIndex.value, 1))
    // console.log('调换', cloneList.value)
  }
  else {
    // console.log('偏移')
    // 在没有项与项之间的位置调换时，给一个微量偏移处理
    showList.value[currentIndex.value].y += 0.001
  }

  updatePosition(cloneList.value)

  if (sortChanged.value) {
    const endList = showList.value.map(item => omit(item, COM_INTERNAL_ARGS))
    emit('change', endList)
    sortChanged.value = false
  }

  oldIndex.value = -1
  currentIndex.value = -1
  targetIndex.value = -1
}

function handleSortChange(e: any) {
  // console.log(e)
  if (e.detail.source !== 'touch' || !sorting.value) {
    return
  }

  targetIndex.value = getTargetIndex(e)
  // console.log(targetIndex.value, currentIndex.value)
  if (targetIndex.value !== oldIndex.value && oldIndex.value >= 0 && targetIndex.value >= 0) {
    // console.log(targetIndex.value, 'target')
    const newList = lodash.cloneDeep(cloneList.value)
    const elementToMove = newList.splice(currentIndex.value, 1)[0]
    newList.splice(targetIndex.value, 0, elementToMove)

    showList.value.forEach((item, index) => {
      // 当前项通过手动拖动已经到了指定位置，因此需要重新排序其他项的高度
      if (index !== currentIndex.value) {
        // 找到所有项在新数组中的位置
        const newIndex = newList.findIndex(newItem => newItem.drag_id === item.drag_id)
        // 根据新数组的位置重新置y值
        item.y = getPosition(newIndex, newList)
        // console.log(item.y)
      }
    })

    oldIndex.value = targetIndex.value
    sortChanged.value = true
  }
}

// 获取当前的位置
function getPosition(index, list = showList.value) {
  // 通过计算重新算换 偏移单位。
  let y = 0
  // 如果是 单项数据时，不需要通过getItemHeight来排，而是需要根据每个item的高度自动填充
  for (let i = 0; i < list.length; i++) {
    if (index === i)
      break
    y += list[i].height + props.gap
  }
  // console.log(y, 'y')
  return y
}

function getTargetIndex(e) {
  const list = cloneList.value
  const { x, y } = e.detail

  let target = -1
  let currentH = 0
  for (let i = 0; i < cloneList.value.length; i++) {
    currentH += getItemHeight(list[i]) + props.gap
    if (dragDirection.value === 'down') {
      // 往下的情况下 ---- 当前活动的下标的高度( 也就是拖动的底部 )碰到下一个元素时； 赋值下标
      /*
          下一个下标的5/1；位置触发
          如果到了最后一个时，让下一个触发的高度变成当前拖动到指定位置的高度，避免照成到达了底部后下标位置有差异的问题；
        **/
      const item = list[i + 1]
      const nextH = item ? getItemHeight(item) / 5 : currentH
      // console.log(y, currentH, nextH, i, 'nextH')
      if (currentH > (y + getItemHeight(list[currentIndex.value]) - nextH)) {
        target = i
        break
      }
    }
    else {
      // 往上拖拽时 ---- 当前活动的下标( 也就是拖动的顶部 )碰到上一个元素时； 赋值下标
      const item = list[i - 1]
      const theH = item ? (getItemHeight(item) + props.gap) / 5 : 0 // 下一个下标的5/1；位置触发
      if (currentH > (y + theH)) {
        target = i
        break
      }
    }
  }

  // console.log(target, 'target')
  return target
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
        v-for="(item, index) in showList"
        :key="item.drag_key"
        class="drag-movable-item"
        :style="{
          height: `${item.height}px`,
          zIndex: currentIndex === index ? 10 : 1,
        }"
        :class="[currentIndex === index ? 'drag-movable-item--active' : '']"
        animation
        :x="item.x"
        :y="item.y"
        direction="vertical"
        :out-of-bounds="true"
        :disabled="!sorting"
        @change="handleSortChange"
        @longpress="handleDragStart(index)"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend.stop="handleTouchEnd"
      >
        <view class="dragSlotContent">
          <slot name="content" :item="{ ...item, index }" />
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
  transition: height 0.3s ease-in-out;
  overflow: hidden;
  border-radius: 10px;
  @apply: bg-gray-300/[0.3] dark:bg-[#292929];
}

.drag-movable-item--active {
  @apply: bg-gray-200 dark:bg-[#565657];
}
</style>
