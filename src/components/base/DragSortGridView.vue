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
const emit = defineEmits(['change'])
const ADD_DRAG_ID = 'add-item'
const COM_INTERNAL_ARGS = ['x', 'y', 'drag_key', 'drag_id', 'width', 'height', 'disabled']

const { vibrate } = useVibrate()

const sorting = ref(false)
const sortChanged = ref(false)
const showList = ref([])
const cloneList = ref([])
const targetId = ref('')
const currentId = ref('')

const areaHeight = ref(200)
const itemWidth = ref(80)
const itemHeight = ref(80)

const { proxy } = getCurrentInstance() as any

watch(() => props.list, (newList, old) => {
  console.log('grid 更新', newList, old)
  const list = lodash.cloneDeep(newList)

  if (props.hasAdd) {
    list.push({
      [props.keyProp]: ADD_DRAG_ID,
      disabled: true,
    })
  }

  initList(list)
  calculateItemSize()
}, { immediate: true })

onMounted(() => {
  console.log('挂载')
})

function calculateItemSize() {
  setTimeout(() => {
    uni.createSelectorQuery().in(proxy).select('.dragSortBox').boundingClientRect((res: UniApp.NodeInfo) => {
      if (res) {
        // console.log(res)
        uni.createSelectorQuery().in(proxy).select('.dragSlotContent').boundingClientRect((cts: UniApp.NodeInfo) => {
          console.log(cts, 'dragSlotContent')
          if (cts) {
            itemHeight.value = cts.height
          }

          const w = res.width
          itemWidth.value = toFixed((w - ((props.column - 1) * props.gap)) / props.column)
          updatePosition(cloneList.value)
        }).exec()
      }
    }).exec()
  }, 0)
}

function initList(list: any[]) {
  showList.value = list.map((item, index) => {
    const dragId = item[props.keyProp]
    const data = {
      ...item,
      y: 0,
      x: 0,
      drag_id: dragId,
      drag_key: dragId,
    }
    return data
  })
  cloneList.value = lodash.cloneDeep(showList.value)
  // console.log(showList.value, cloneList.value, 'initList')
}

function updatePosition() {
  showList.value.map((item, index) => {
    const [x, y] = getPosition(index, showList.value)
    item.x = x
    item.y = y
    return item
  })
  cloneList.value = lodash.cloneDeep(showList.value)
  areaHeight.value = Math.ceil(showList.value.length / props.column) * (itemHeight.value + props.gap)
}

function handleDragStart(item) {
  currentId.value = item.drag_id
  sorting.value = true
  sortChanged.value = false
  // 震动反馈
  // vibrate()
}

function handleTouchEnd() {
  if (!sorting.value || currentId.value === '')
    return

  // console.log('touch end', showList.value)
  sorting.value = false
  console.log(currentId.value, targetId.value, showList.value, 'handleTouchEnd')
  const currentIndex = getListIndex(currentId.value)
  if (targetId.value !== '' && targetId.value !== currentId.value) {
    const targetIndex = getListIndex(targetId.value)
    cloneList.value.splice(targetIndex, 0, ...cloneList.value.splice(currentIndex, 1))
    const [x, y] = getPosition(targetIndex)
    cloneList.value[currentIndex].x = x
    cloneList.value[currentIndex].y = y

    const i = getListIndex(currentId.value, showList.value)
    showList.value[i].x = x
    showList.value[i].y = y
    // console.log('调换', lodash.cloneDeep(showList.value))
  }
  else {
    const [x, y] = getPosition(currentIndex)
    // console.log(x, y, 'handleTouchEnd xy')
    const item = showList.value[getListIndex(currentId.value, showList.value)]
    // 增加偏移量
    item.x += 0.001
    item.y += 0.001
    // console.log(lodash.cloneDeep(showList.value), 'handleTouchEnd')
    // DOM 更新循环结束之后执行延迟回调，恢复原位
    nextTick(() => {
      item.x = x
      item.y = y
      // console.log(lodash.cloneDeep(showList.value), 'handleTouchEnd')
    })

    // console.log(y, currentId.value, targetId.value, item, showList.value, cloneList.value, 'showList.value[currentIndex]')
  }

  if (sortChanged.value) {
    let endList = lodash.cloneDeep(cloneList.value)
    // 去除添加项
    if (props.hasAdd) {
      endList = endList.slice(0, -1)
    }
    endList = endList.map(item => omit(item, COM_INTERNAL_ARGS))
    emit('change', endList)
    sortChanged.value = false
  }

  currentId.value = ''
  targetId.value = ''
}

function handleSortChange(e: any) {
  // console.log(e)
  if (e.detail.source !== 'touch' || !sorting.value) {
    return
  }

  targetId.value = getTargetIndex(e)
  // console.log(targetIndex.value, currentIndex.value)

  if (targetId.value !== currentId.value && currentId.value !== '' && targetId.value !== '') {
    const targetIndex = getListIndex(targetId.value)
    const targetItem = showList.value[targetIndex]
    if (!targetItem.disabled) {
    // console.log(targetIndex.value, 'target')
      const newList = cloneList.value
      const currentIndex = getListIndex(currentId.value)
      const elementToMove = newList.splice(currentIndex, 1)[0]
      newList.splice(targetIndex, 0, elementToMove)

      showList.value.forEach((item) => {
      // 当前项通过手动拖动已经到了指定位置，因此需要重新排序其他项的高度
        if (item.drag_id !== elementToMove.drag_id) {
          // 找到所有项在新数组中的位置
          const newIndex = getListIndex(item.drag_id, newList)
          // 根据新数组的位置重新置y值
          const [x, y] = getPosition(newIndex, newList)
          item.x = x
          item.y = y
          // console.log(item.y)
        }
      })

      sortChanged.value = true
    }
  }
}

// 获取当前的位置
function getPosition(index, list = cloneList.value) {
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

  let target = ''

  // x 手指按下拖动，产生的位置，超出了item的宽度，那么就改变下标，包括y轴。
  const currentX = Math.floor((x + itemWidth.value / 2) / itemWidth.value)
  const currentY = Math.floor((y + itemHeight.value / 2) / itemHeight.value)
  // target：通过计算横排数量，偏移量（ x，y ），得出下标位置
  target = Math.min(currentY * props.column + currentX, list.length - 2) // 滑到了哪个位置

  // console.log(target, 'target')
  return list[target].drag_id
}

// 获取当前项指定drag_id的索引
function getListIndex(drag_id, list = cloneList.value) {
  return list.findIndex(item => item.drag_id === drag_id)
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
        v-for="item in showList"
        :key="item.drag_key"
        class="drag-movable-item"
        :style="{
          height: `${itemHeight}px`,
          width: `${itemWidth}px`,
          zIndex: currentId === item.drag_id ? 10 : 1,
        }"
        :class="[currentId === item.drag_id ? 'drag-movable-item--active' : '']"
        animation
        :x="item.x"
        :y="item.y"
        direction="all"
        :out-of-bounds="true"
        :disabled="item.disabled || !sorting "
        @change="handleSortChange"
        @longpress.stop="handleDragStart(item)"
        @touchend.stop="handleTouchEnd"
      >
        <view v-if="item.drag_id !== ADD_DRAG_ID" class="dragSlotContent">
          <slot name="content" :grid-item="{ ...item }" />
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
