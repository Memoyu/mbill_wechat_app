<script lang="ts" setup>
import lodash from 'lodash'
import { omit, toFixed } from '@/utils'

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
  gap?: number
  column?: number
  hasAdd?: boolean
}>(), {
  gap: 5,
  column: 3,
  hasAdd: true,
})
const emit = defineEmits(['change', 'tapItem'])
const ADD_DRAG_ID = 'add-item'
const COM_INTERNAL_ARGS = ['x', 'y', 'drag_key', 'drag_id', 'width', 'height', 'disabled']

const { vibrate } = useVibrate()

const sorting = ref(false)
const sortChanged = ref(false)
const showList = ref([])
const cloneList = ref([])
const targetIndex = ref(-1)
const currentIndex = ref(-1)
const oldIndex = ref(-1)

const areaHeight = ref(200)
const itemWidth = ref(80)
const itemHeight = ref(80)

const { proxy } = getCurrentInstance() as any

watch(() => props.list, (newList) => {
  console.log('grid 更新', newList)
  const list = lodash.cloneDeep(newList)

  if (props.hasAdd) {
    list.push({
      [props.keyProp]: ADD_DRAG_ID,
      disabled: true,
    })
  }

  updatePosition(list)
  calculateItemSize()
}, { immediate: true, deep: true })

onMounted(() => {
  calculateItemSize()
})

function calculateItemSize() {
  nextTick(() => {
    const list = cloneList.value
    uni.createSelectorQuery().in(proxy).select('.dragSortBox').boundingClientRect((box: UniApp.NodeInfo) => {
      if (box) {
      // console.log(res)
        const w = box.width
        itemWidth.value = toFixed((w - ((props.column - 1) * props.gap)) / props.column)
      }
      uni.createSelectorQuery().in(proxy).selectAll('.dragSlotContent').boundingClientRect((contents: UniApp.NodeInfo[]) => {
        if (contents) {
          const maxHeight = Math.max(...contents.map(c => c.height))
          itemHeight.value = maxHeight
          updatePosition(list)
        }
      }).exec()
    }).exec()
  })
}

function updatePosition(list: any[]) {
  showList.value = list.map((item, index) => {
    const [x, y] = getPosition(index, list)
    const data = {
      ...item,
      y,
      x,
      drag_id: item[props.keyProp],
    }

    let drag_key = `slot-${Math.random()}-${index}`
    // 如果x轴和y轴没变，那么不用更新key来刷新状态
    if (y === item.y && x === item.x) {
      if (currentIndex.value !== index) {
        // 非当前点击的下标和目标下标的下标不需要生成新的key
        drag_key = item.drag_key
      }
    }
    // 判断拖动位置的元素是那个
    data.drag_key = drag_key

    // console.log(data.drag_key, 'drag_key')
    return data
  })
  cloneList.value = lodash.cloneDeep(showList.value)
  // console.log(showList.value)
  // console.log(cloneList.value)
  nextTick(() => {
    areaHeight.value = Math.ceil(showList.value.length / props.column) * (itemHeight.value + props.gap)
  // console.log(areaHeight.value, 'areaHeight')
  })
}

function handleDragStart(index) {
  currentIndex.value = index
  oldIndex.value = index
  sorting.value = true
  sortChanged.value = false
  // 震动反馈
  // vibrate()
}

function handleTouchEnd() {
  if (!sorting.value)
    return
  sorting.value = false

  if (targetIndex.value >= 0 && currentIndex.value >= 0 && targetIndex.value !== currentIndex.value) {
    cloneList.value.splice(targetIndex.value, 0, ...cloneList.value.splice(currentIndex.value, 1))
    // console.log(cloneList.value, '调换')
  }
  else {
    // 在没有项与项之间的位置调换时，给一个微量偏移处理
    showList.value[currentIndex.value].y += 0.001
    showList.value[currentIndex.value].x += 0.001
  }

  updatePosition(cloneList.value)

  if (sortChanged.value) {
    let endList = lodash.cloneDeep(showList.value)
    // 去除添加项
    if (props.hasAdd) {
      endList = endList.slice(0, -1)
    }
    endList = endList.map(item => omit(item, COM_INTERNAL_ARGS))
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
  const targetItem = showList.value[targetIndex.value]
  if (targetIndex.value !== oldIndex.value && oldIndex.value >= 0 && targetIndex.value >= 0 && !targetItem.disabled) {
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
        const [x, y] = getPosition(newIndex, newList)
        item.x = x
        item.y = y
        // console.log(item.y)
      }
    })

    oldIndex.value = targetIndex.value
    sortChanged.value = true
  }
}

// 获取当前的位置
function getPosition(index, list = showList.value) {
  const h = (index % props.column)
  let x = toFixed(h * itemWidth.value)
  if (x > 0) {
    x += h * props.gap
  }

  // 通过计算重新算换 偏移单位。
  const v = Math.floor(index / props.column)
  let y = v * itemHeight.value
  if (y > 0) {
    y += v * props.gap
  }
  // console.log(y, 'y')
  return [x, y]
}

function getTargetIndex(e) {
  const list = cloneList.value
  const { x, y } = e.detail

  let target = -1

  // x 手指按下拖动，产生的位置，超出了item的宽度，那么就改变下标，包括y轴。
  const currentX = Math.floor((x + itemWidth.value / 2) / itemWidth.value)
  const currentY = Math.floor((y + itemHeight.value / 2) / itemHeight.value)
  // target：通过计算横排数量，偏移量（ x，y ），得出下标位置
  target = Math.min(currentY * props.column + currentX, list.length - 1) // 滑到了哪个位置

  // console.log(target, 'target')
  return target
}
</script>

<template>
  <view class="dragSortBox">
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
          height: `${itemHeight}px`,
          width: `${itemWidth}px`,
          zIndex: currentIndex === index ? 10 : 1,
        }"
        :class="[currentIndex === index ? 'drag-movable-item--active' : '']"
        animation
        :x="item.x"
        :y="item.y"
        direction="all"
        :out-of-bounds="true"
        :disabled="item.disabled || !sorting "
        @change="handleSortChange"
        @longpress="handleDragStart(index)"
        @touchend.stop="handleTouchEnd"
      >
        <view v-if="item.drag_id !== ADD_DRAG_ID" class="dragSlotContent">
          <slot name="content" :grid-item="{ ...item, index }" />
        </view>
        <view v-else class="drag-add-item">
          <text class="iconfont icon-plus" :style="{ fontSize: '30px' }" />
        </view>
      </movable-view>
    </movable-area>
  </view>
</template>

<style lang="scss" scoped>
.drag-movable-area {
  position: relative;
  width: 100%;
}

.drag-movable-item {
  width: 100%;
  // transition: height 0.3s ease-in-out;
  overflow: hidden;
  border-radius: 10px;
  @apply: bg-gray-300/[0.3] dark:bg-[#292929];
}

.drag-movable-item--active {
  @apply: bg-gray-500 dark:bg-[#565657];
}

.drag-add-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
