<script lang="ts" setup>
import lodash from 'lodash'
import { s } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'
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
  expand?: boolean
}>(), {
  gap: 5,
  expand: false,
})
const emit = defineEmits(['change'])
const COM_INTERNAL_ARGS = ['x', 'y', 'drag_key', 'drag_id', 'height', 'expand']

const { vibrate } = useVibrate()
const touch = useTouch()

const scrollHeight = ref(400)
const scrollTop = ref(0)
const areaHeight = ref(400)

const sorting = ref(false)
const sortChanged = ref(false)
const showList = ref([])
const cloneList = ref([])
const targetId = ref('')
const currentId = ref('')

const initHeights = ref({})

const dragDirection = ref<'upward' | 'down'>()

const { proxy } = getCurrentInstance() as any

// 展开/收起当前项
function setExpand(item) {
  item.expand = !(item.expand ?? false)
  setItemHeight(item)
}

function setItemHeight(item) {
  uni.createSelectorQuery().in(proxy).selectAll('.dragListSlot').boundingClientRect((res: UniApp.NodeInfo[]) => {
    // console.log(res)
    if (!res)
      return
    const index = res.findIndex(r => r.id === `#drag-content-${item.drag_id}`)
    // console.log(res[index], 'item')
    item.height = item.expand ? res[index].height : initHeights[item.drag_id]
    const i = getListIndex(item.drag_id)
    cloneList.value[i].height = item.height
    // console.log(item)
    updateExpandPosition(item.expand)
  }).exec()
}

function updateExpandPosition(expand) {
  // console.log(list)
  cloneList.value.map((item, index) => {
    const y = getPosition(index)
    // console.log(y, 'y')
    item.y = y
    return item
  })

  showList.value.map((item) => {
    const index = getListIndex(item.drag_id)
    const y = cloneList.value[index].y
    item.y = y
    return item
  })

  // 根据是否展开决定
  if (expand) {
    const last = cloneList.value[cloneList.value.length - 1]
    areaHeight.value = last.y + getItemHeight(last)
  }
  else {
    // 延迟执行，等待收起动画结束，不然动item会卡位置
    setTimeout(() => {
      const last = cloneList.value[cloneList.value.length - 1]
      areaHeight.value = last.y + getItemHeight(last)
      // console.log('收起')
    }, 500)
  }
}

// 获取当前项的高度
function getItemHeight(item) {
  return item.height
}

watch(() => props.list, (newList) => {
  // console.log(newList, 'list change')
  initList(newList)
  calculateItemSize()
}, { immediate: true })

watch(() => props.height, (h) => {
  scrollHeight.value = h
})

function calculateItemSize() {
  // 不加setTimeout算出来的宽度会不准，不明觉厉
  setTimeout(() => {
    const list = showList.value;
    // 获取原始项高度
    (props.expand
      ? uni.createSelectorQuery().in(proxy).selectAll('.dragSlotTitle')
      : uni.createSelectorQuery().in(proxy).selectAll('.dragSlotContent')).boundingClientRect((res: UniApp.NodeInfo[]) => {
      // console.log(res, 'init height')
      if (res) {
      // 初始赋值选项的最高、最低高度
        for (let i = 0; i < res.length; i++) {
          initHeights[list[i].drag_id] = res[i].height
          list[i].height = res[i].height
        }

        updatePosition(list)
      }
    }).exec()
  }, 0)
}

function initList(list: any[]) {
  // console.log(list)
  showList.value = list.map((item, index) => {
    const dragId = item[props.keyProp]
    const data = {
      ...item,
      expand: item.expand ?? false,
      y: 0,
      x: 0,
      drag_id: dragId,
      drag_key: dragId,
    }

    return data
  })

  cloneList.value = lodash.cloneDeep(showList.value)
}

function updatePosition() {
  showList.value.map((item, index) => {
    const y = getPosition(index, showList.value)
    // console.log(y, 'y')
    item.y = y
    return item
  })

  cloneList.value = lodash.cloneDeep(showList.value)
  // console.log(showList.value, cloneList.value, 'initPosition')

  const last = showList.value[showList.value.length - 1]
  if (last) {
  // console.log(last, 'last')
    areaHeight.value = last.y + getItemHeight(last)
  }
}

function handleTap(item) {
  if (!props.expand)
    return
  // console.log('组件展开', item)
  setExpand(item)
}

function handleDragStart(item) {
  sorting.value = true
  sortChanged.value = false
  currentId.value = item.drag_id
  // 震动反馈
  // vibrate()
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
  if (!sorting.value || currentId.value === '')
    return

  // console.log('touch end', showList.value)
  sorting.value = false
  const currentIndex = getListIndex(currentId.value)
  if (targetId.value !== '' && targetId.value !== currentId.value) {
    const targetIndex = getListIndex(targetId.value)
    cloneList.value.splice(targetIndex, 0, ...cloneList.value.splice(currentIndex, 1))
    const y = getPosition(targetIndex)
    cloneList.value[currentIndex].y = y
    const i = getListIndex(currentId.value, showList.value)
    showList.value[i].y = y
    // console.log('调换', lodash.cloneDeep(showList.value))
  }
  else {
    // console.log('偏移')
    const y = getPosition(currentIndex)
    const item = showList.value[getListIndex(currentId.value, showList.value)]
    // 增加偏移量
    item.y += 0.001
    // DOM 更新循环结束之后执行延迟回调，恢复原位
    nextTick(() => {
      item.y = y
    })
    // console.log(y, currentId.value, targetId.value, item, showList.value, cloneList.value, 'showList.value[currentIndex]')
  }

  if (sortChanged.value) {
    const endList = cloneList.value.map(item => omit(item, COM_INTERNAL_ARGS))
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
  // console.log(targetId.value, currentId.value)
  if (targetId.value !== currentId.value && currentId.value !== '' && targetId.value !== '') {
    // console.log(targetIndex.value, 'target')
    const newList = cloneList.value
    const targetIndex = getListIndex(targetId.value)
    const currentIndex = getListIndex(currentId.value)
    const elementToMove = newList.splice(currentIndex, 1)[0]
    newList.splice(targetIndex, 0, elementToMove)

    showList.value.forEach((item) => {
      // 当前项通过手动拖动已经到了指定位置，因此需要重新排序其他项的高度
      if (item.drag_id !== elementToMove.drag_id) {
      // 找到所有项在新数组中的位置
        const newIndex = getListIndex(item.drag_id, newList)
        // 根据新数组的位置重新置y值
        item.y = getPosition(newIndex, newList)
      // console.log(item.y)
      }
    })

    sortChanged.value = true
  }
}

// 获取当前的位置
function getPosition(index, list = cloneList.value) {
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

  let target = ''
  let currentH = 0
  const currentIndex = getListIndex(currentId.value)

  for (let i = 0; i < list.length; i++) {
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
      if (currentH > (y + getItemHeight(list[currentIndex]) - nextH)) {
        target = list[i].drag_id
        break
      }
    }
    else {
      // 往上拖拽时 ---- 当前活动的下标( 也就是拖动的顶部 )碰到上一个元素时； 赋值下标
      const item = list[i - 1]
      const theH = item ? (getItemHeight(item) + props.gap) / 5 : 0 // 下一个下标的5/1；位置触发
      if (currentH > (y + theH)) {
        target = list[i].drag_id
        break
      }
    }
  }

  // console.log(target, 'target')
  return target
}

// 获取当前项指定drag_id的索引
function getListIndex(drag_id, list = cloneList.value) {
  return list.findIndex(item => item.drag_id === drag_id)
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
        v-for="item in showList"
        :key="item.drag_key"
        class="drag-movable-item"
        :style="{
          height: `${item.height}px`,
          zIndex: currentId === item.drag_id ? 10 : 1,
        }"
        :class="[currentId === item.drag_id ? 'drag-movable-item--active' : '']"
        animation
        :x="item.x"
        :y="item.y"
        direction="vertical"
        :out-of-bounds="true"
        :disabled="!sorting"
        @change="handleSortChange"
        @tap.stop="handleTap(item)"
        @longpress="handleDragStart(item)"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend.stop="handleTouchEnd"
      >
        <view :id="`#drag-content-${item.drag_id}`" class="dragListSlot">
          <view class="dragSlotTitle">
            <slot name="title" :list-item="{ ...item }" />
          </view>
          <view class="dragSlotContent">
            <slot name="content" :list-item="{ ...item }" />
          </view>
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
