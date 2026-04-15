<script lang="ts" setup>
import lodash from 'lodash'
import { useTouch } from 'wot-design-uni'

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
  expand?: boolean
}>(), {
  expand: false,
  gap: 5,
})
const emit = defineEmits(['change'])

const { vibrate } = useVibrate()
const touch = useTouch()

const scrollHeight = ref(300)
const sorting = ref(false)
const sortChanged = ref(false)
const showList = ref([])
const cloneList = ref([])
const expandeds = ref({})
const scrollTop = ref(0)
const targetIndex = ref(-1)
const currentIndex = ref(-1)
const oldIndex = ref(-1)

const areaHeight = ref(80)

const dragDirection = ref<'upward' | 'down'>()

const { proxy } = getCurrentInstance() as any

// 展开/收起当前项
function setExpanded(item) {
  expandeds[item.drag_id] = !getExpanded(item)
}

// 获取当前项的展开状态
function getExpanded(item) {
  return expandeds[item.drag_id] ?? false
}

// 获取当前项的高度
function getItemHeight(item) {
  return getExpanded(item) ? item.maxHeight : item.minHeight
}

watch(() => props.list, (l) => {
  updatePosition(l)
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
  // 获取原始项高度
  (props.expand
    ? uni.createSelectorQuery().in(proxy).selectAll('.dragSlotTitle')
    : uni.createSelectorQuery().in(proxy).selectAll('.dragSlotContent')).boundingClientRect((ts: UniApp.NodeInfo[]) => {
    // console.log(ts, props.expand, 'init height')
    if (ts) {
      // 初始赋值选项的最高、最低高度
      for (let i = 0; i < ts.length; i++) {
        const height = ts[i].height
        cloneList.value[i].minHeight = height
        cloneList.value[i].maxHeight = height
      }

      // 如果是需要展开的，则获取内容的高度
      if (props.expand) {
        // 获取内容的高度
        uni.createSelectorQuery().in(proxy).selectAll('.dragSlotContent').boundingClientRect((cs: UniApp.NodeInfo[]) => {
          // console.log(cs, 'max height')
          if (cs) {
            for (let i = 0; i < cs.length; i++) {
              cloneList.value[i].maxHeight = cs[i].height + cloneList.value[i].minHeight
            }
          }
          updatePosition(cloneList.value)
        }).exec()
      }
      else {
        updatePosition(cloneList.value)
      }
    }
  }).exec()
}

function updatePosition(arr: any[]) {
  const newList = lodash.cloneDeep(arr)

  const temp = newList.map((item, index) => {
    const y = getItemY(index, newList)
    const data = {
      ...item,
      y,
      x: 0,
      drag_id: item[props.keyProp],
    }

    let drag_key = `slot-${Math.random()}-${index}-${getExpanded(data)}`
    // 如果x轴和y轴没变，那么不用更新key来刷新状态
    if (y === item.y) {
      if (currentIndex.value !== index) {
        // 非当前点击的下标和目标下标的下标不需要生成新的key
        drag_key = item.drag_key
      }
    }
    // 判断拖动位置的元素是那个
    data.drag_key = drag_key

    // data.drag_key = `${data.drag_id}-${index}-${getExpanded(data)}`

    // console.log(data.drag_key, 'drag_key')
    return data
  })
  // console.log(showList.value)
  // console.log(cloneList.value)
  showList.value = temp
  const last = temp[temp.length - 1]
  areaHeight.value = last.y + getItemHeight(last)

  cloneList.value = lodash.cloneDeep(temp)
}

function handleTap(index) {
  // console.log('组件展开', item)
  setExpanded(showList.value[index])
  updatePosition(showList.value)
}

function handleDragStart(index) {
  currentIndex.value = index
  oldIndex.value = index
  sorting.value = true
  sortChanged.value = false
  // 震动反馈
  vibrate()
}

function handleTouchStart(index, event: TouchEvent) {
  touch.touchStart(event)
}

function handleTouchMove(event: TouchEvent) {
  touch.touchMove(event)
  dragDirection.value = touch.deltaY.value > 0 ? 'down' : 'upward'
}

function handleTouchEnd() {
  if (!sorting.value)
    return
  sorting.value = false

  if (targetIndex.value >= 0 && currentIndex.value >= 0 && targetIndex.value !== currentIndex.value) {
    cloneList.value.splice(targetIndex.value, 0, ...cloneList.value.splice(currentIndex.value, 1))
  }
  else {
    // 在没有项与项之间的位置调换时，给一个微量偏移处理
    showList.value[currentIndex.value].y += 0.001
  }

  updatePosition(cloneList.value)

  if (sortChanged.value) {
    const endList = showList.value.map(item => omit(item))
    emit('change', endList)
    sortChanged.value = false
  }

  oldIndex.value = -1
  currentIndex.value = -1
  targetIndex.value = -1
}

// 省略初始化时添加的 x，y和key等参数
function omit(obj, args = ['x', 'y', 'drag_key', 'drag_id', 'maxHeight', 'minHeight']) {
  if (!args)
    return obj
  const newObj = {}
  const isString = typeof args === 'string'
  const keys = Object.keys(obj).filter((item) => {
    if (isString) {
      return item !== args
    }
    return !args.includes(item)
  })

  keys.forEach((key) => {
    if (obj[key] !== undefined)
      newObj[key] = obj[key]
  })
  return newObj
}

function handleSortChange(e: any) {
  // console.log(e)
  if (e.detail.source !== 'touch' || !sorting.value) {
    return
  }

  const { y } = e.detail
  // console.log(y, e, 'handleSortChange')
  // const currentY = Math.floor((y + minHeight.value / 2) / minHeight.value)

  targetIndex.value = getTargetIndex(e)
  // console.log(targetIndex.value, currentIndex.value)
  if (targetIndex.value !== oldIndex.value && oldIndex.value >= 0 && targetIndex.value >= 0) {
    // console.log(targetIndex.value, 'target')

    const replaceList = lodash.cloneDeep(cloneList.value)
    const newList = lodash.cloneDeep(cloneList.value)
    const elementToMove = newList.splice(currentIndex.value, 1)[0]
    newList.splice(targetIndex.value, 0, elementToMove)

    replaceList.splice(targetIndex.value, 0, ...replaceList.splice(currentIndex.value, 1))

    showList.value.forEach((item, index) => {
      // 当前项通过手动拖动已经到了指定位置，因此需要重新排序其他项的高度
      if (index !== currentIndex.value) {
        // 找到所有项在新数组中的位置
        const newIndex = newList.findIndex(newItem => newItem.drag_id === item.drag_id)
        // 根据新数组的位置重新置y值
        item.y = getItemY(newIndex, replaceList)
        // console.log(item.y)
      }
    })

    oldIndex.value = targetIndex.value
    sortChanged.value = true
  }
}

// 获取当前的位置
function getItemY(index, list = showList.value) {
  // 通过计算重新算换 偏移单位。
  let y = 0
  // 如果是 单项数据时，不需要通过getItemHeight来排，而是需要根据每个item的高度自动填充
  for (let i = 0; i < list.length; i++) {
    if (index === i)
      break
    y += getItemHeight(list[i]) + props.gap
  }
  // console.log(y, 'y')
  return y
}

function getTargetIndex(e) {
  const list = cloneList.value
  const { x, y } = e.detail
  // 列表的情况, 无需考虑leo_x轴;  通过leo_y轴和列表的高度来判断;
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
      <!-- item.drag_key -->
      <movable-view
        v-for="(item, index) in showList"
        :key="item.drag_key"
        class="drag-movable-item"
        :style="{
          height: `${getItemHeight(item)}px`,
          zIndex: currentIndex === index ? 10 : 1,
        }"
        :class="[currentIndex === index ? 'drag-movable-item--active' : '']"
        animation
        :x="item.x"
        :y="`${item.y}px`"
        direction="vertical"
        :out-of-bounds="true"
        :disabled="!sorting"
        @change="handleSortChange"
        @tap="handleTap(index)"
        @longpress="handleDragStart(index)"
        @touchstart="handleTouchStart(index, $event)"
        @touchmove="handleTouchMove" @touchend="handleTouchEnd"
      >
        <view class="dragSlotTitle">
          <slot name="title" :item="item" :index="index" />
        </view>
        <view class="dragSlotContent">
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
  // transition: height 0.3s ease-in-out;
  overflow: hidden;
  border-radius: 10px;
  @apply: bg-gray-300/[0.3] dark:bg-[#292929];
}

.drag-movable-item--active {
  @apply: bg-gray-200 dark:bg-[#565657];
}

.drag-item-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
  padding: 0;
  box-sizing: border-box;
  background-color: gainsboro;
  margin-top: 5px;
}
</style>
