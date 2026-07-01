/**
 * 拖拽排序列表
 * showList 作为渲染的数据列表，主要包含坐标、高度、展开状态等展示相关属性
  * sortList 作为排序后的数据列表，主要用做顺序的基准，更新后不触发渲染
 */
<script lang="ts" setup>
import { useTouch } from '@wot-ui/ui/composables/useTouch'
import { omit } from '@/utils'

interface DragSortBaseItem {
  [key: string]: any
  drag_id: string
}

interface DragSortShowItem extends DragSortBaseItem {
  x: number
  y: number
  height: number
  minHeight: number
  maxHeight: number
  expand: boolean
}

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
  safeArea?: number
}>(), {
  gap: 5,
  expand: false,
  safeArea: 0,
})
const emit = defineEmits(['change'])
const COM_INTERNAL_ARGS = ['x', 'y', 'drag_id', 'height', 'expand']
const { proxy } = getCurrentInstance() as any

const { vibrate } = useVibrate()
const touch = useTouch()

const scrollHeight = ref(400)
const scrollTop = ref(0)
const areaHeight = ref(400)

const sorting = ref(false)
const sortChanged = ref(false)
const showList = ref<DragSortShowItem[]>([])
const sortList = ref<DragSortBaseItem[]>([])
const targetId = ref('')
const currentId = ref('')
const animation = ref(false)

const initHeights: any = {}

const dragDirection = ref<'upward' | 'down'>()

const computedAreaHeight = computed(() => {
  if (props.safeArea === 0)
    return areaHeight.value
  const movableHeight = scrollHeight.value - props.safeArea
  const height = areaHeight.value > movableHeight ? areaHeight.value + props.safeArea : areaHeight.value
  return height
})

watch(() => props.list, (newList) => {
  // console.log(newList, 'list change')
  initList(newList)
  calculateItemSize()
}, { immediate: true, deep: true })

watch(() => props.height, (h) => {
  scrollHeight.value = h
})

/**
 * 初始化列表
 * 对传入的列表数据与showList做差异更新
 * @param list 列表数据
 */
function initList(list: any[]) {
  sortList.value = list.map((item) => {
    return {
      ...item,
      drag_id: item[props.keyProp],
    } as DragSortBaseItem
  })

  const oldItemMap = new Map(showList.value.map(item => [item.drag_id, item]))
  const newItemIds = new Set(list.map(item => item[props.keyProp]))

  // 清除不在新列表中的项目
  for (let i = showList.value.length - 1; i >= 0; i--) {
    const item = showList.value[i]
    if (!newItemIds.has(item.drag_id)) {
      showList.value.splice(i, 1)
    }
  }

  // 更新现有项目和添加新项目
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const dragId = item[props.keyProp]
    const oldItem = oldItemMap.get(dragId)

    if (oldItem) {
      // 更新现有项目的数据，保留内部状态
      Object.assign(oldItem, item, {
        drag_id: dragId,
        x: oldItem.x,
        y: oldItem.y,
        height: oldItem.height,
        expand: oldItem.expand ?? item.expand ?? false,
      })
      console.log(oldItem, 'oldItem')
    }
    else {
      const newItem = initShowItem(item)
      if (i < showList.value.length) {
        showList.value.splice(i, 0, newItem)
      }
      else {
        showList.value.push(newItem)
      }
    }
  }
  // console.log(showList.value, 'showList.value')
}

/**
 * 初始化列表项
 * @param item 初始化列表项
 */
function initShowItem(item: any) {
  // console.log(item)
  return {
    ...item,
    y: 0,
    x: 0,
    height: 0,
    minHeight: 0,
    maxHeight: 0,
    drag_id: item[props.keyProp],
    expand: item.expand ?? false,
  } as DragSortShowItem
}

/**
 * 初始化列表项的尺寸
 */
function calculateItemSize() {
  // 不加setTimeout算出来的宽度会不准，不明觉厉
  setTimeout(() => {
    let minHeight = 100;
    // 获取原始项高度
    (props.expand
      ? uni.createSelectorQuery().in(proxy).select('.dragListSlotTitle')
      : uni.createSelectorQuery().in(proxy).select('.dragListSlotContent')).boundingClientRect((top: any) => {
      // console.log(res, 'init height')

      if (top) {
        minHeight = top.height!
      }
      setTimeout(() => {
        uni.createSelectorQuery().in(proxy).selectAll('.dragListSlotBox').boundingClientRect((boxs: any) => {
          if (!boxs)
            return

          showList.value.map((item) => {
            const index = boxs.findIndex((r: { id: string }) => r.id === `#drag-content-${item.drag_id}`)
            item.minHeight = minHeight
            item.maxHeight = boxs[index].height
            item.height = getItemHeight(item.drag_id)
            console.log(item.minHeight, item.maxHeight, item.height, 'item height')

            // 更新列表项坐标数据
            item.y = getPosition(item.drag_id)
            return item
          })
          // console.log(showList.value, sortList.value, 'calculateItemSize')
          updateAreaHeight()
        }).exec()
      }, 0)
    }).exec()
  }, 0)
}

function handleTap(item: DragSortShowItem) {
  if (!props.expand)
    return
  // console.log('组件展开', item)
  setExpand(item)
}

function handleDragStart(item: DragSortShowItem) {
  // 控制动画启用，避免重新加载数据时页面动画难看
  animation.value = true
  sorting.value = true
  sortChanged.value = false
  currentId.value = item.drag_id
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
  animation.value = false
  if (!sorting.value || currentId.value === '')
    return

  // console.log('touch end', showList.value)
  sorting.value = false

  // 获取showList item，加偏移量
  const y = getPosition(currentId.value)
  const showIndex = getListIndex(currentId.value, showList.value)
  const item = showList.value[showIndex]
  item.y += 0.001

  // DOM 更新循环结束之后执行延迟回调，恢复原位
  nextTick(() => {
    item.y = y
    if (sortChanged.value) {
      const endList = sortList.value.map(item => omit(item, COM_INTERNAL_ARGS))
      emit('change', endList)
      sortChanged.value = false
    }
  })

  // console.log('偏移', currentId.value, targetId.value, sortList.value, showList.value)

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
    const newList = sortList.value
    const targetIndex = getListIndex(targetId.value)
    const currentIndex = getListIndex(currentId.value)
    const elementToMove = newList.splice(currentIndex, 1)[0]
    newList.splice(targetIndex, 0, elementToMove)

    showList.value.forEach((item) => {
      // 当前项通过手动拖动已经到了指定位置，因此需要重新排序其他项的高度
      if (item.drag_id !== elementToMove.drag_id) {
        // 根据新数组的位置重新置y值
        item.y = getPosition(item.drag_id, newList)
        // console.log(item.y)
      }
    })

    sortChanged.value = true
  }
}

/**
 * 设置当前项的展开状态
 * @param item 当前项
 */
function setExpand(item: DragSortShowItem) {
  item.expand = !(item.expand ?? false)

  // uni.createSelectorQuery().in(proxy).selectAll('.dragListSlot').boundingClientRect((res: any) => {
  //   // console.log(res)
  //   if (!res)
  //     return
  //   const index = res.findIndex((r: { id: string }) => r.id === `#drag-content-${item.drag_id}`)
  //   item.maxHeight = res[index].height
  //   // console.log(res[index], 'item')
  //   item.height = getItemHeight(item.drag_id)
  //   updateExpandPosition(item.expand)
  // }).exec()
}

/**
 * 更新展开/收起项后所有项的位置
 * @param expand 是否展开
 */
function updateExpandPosition(expand: boolean) {
  showList.value.map((item) => {
    item.y = getPosition(item.drag_id)
    return item
  })

  // 根据是否展开决定
  if (expand) {
    updateAreaHeight()
  }
  else {
    // 延迟执行，等待收起动画结束，不然动item会卡位置
    setTimeout(() => {
      updateAreaHeight()
      // console.log('收起')
    }, 500)
  }
}

/**
 * 更新可拖动区域的高度
 */
function updateAreaHeight() {
  const last = sortList.value[sortList.value.length - 1]
  if (last) {
    const index = showList.value.findIndex(item => item.drag_id === last.drag_id)
    const showItem = showList.value[index]
    areaHeight.value = showItem.y + showItem.height
  }
  // console.log(last, areaHeight.value, 'areaHeight.value')
}

/**
 * 获取与当前拖动项排序互换的目标项
 * @param e 事件对象
 * @returns 目标下标
 */
function getTargetIndex(e: { detail: { x: any, y: any } }) {
  const list = sortList.value
  const { x, y } = e.detail

  let target = ''
  let currentH = 0

  for (let i = 0; i < list.length; i++) {
    currentH += getItemHeight(list[i].drag_id) + props.gap
    if (dragDirection.value === 'down') {
      // 往下的情况下 ---- 当前活动的下标的高度( 也就是拖动的底部 )碰到下一个元素时； 赋值下标
      /*
          下一个下标的5/1；位置触发
          如果到了最后一个时，让下一个触发的高度变成当前拖动到指定位置的高度，避免照成到达了底部后下标位置有差异的问题；
        **/
      const item = list[i + 1]
      const nextH = item ? getItemHeight(item.drag_id) / 5 : currentH
      // console.log(y, currentH, nextH, i, 'nextH')
      if (currentH > (y + getItemHeight(currentId.value) - nextH)) {
        target = list[i].drag_id
        break
      }
    }
    else {
      // 往上拖拽时 ---- 当前活动的下标( 也就是拖动的顶部 )碰到上一个元素时； 赋值下标
      const item = list[i - 1]
      const theH = item ? (getItemHeight(item.drag_id) + props.gap) / 5 : 0 // 下一个下标的5/1；位置触发
      if (currentH > (y + theH)) {
        target = list[i].drag_id
        break
      }
    }
  }

  // console.log(target, 'target')
  return target
}

/**
 * 获取指定项的坐标数据
 * @param dragId 当前项的id
 * @param list 列表
 * @returns 索引
 */
function getPosition(dragId: string, list = sortList.value) {
  // 先获取id在对应list下的索引
  const index = getListIndex(dragId)
  // 通过计算重新算换 偏移单位。
  let y = 0
  // 如果是 单项数据时，不需要通过getItemHeight来排，而是需要根据每个item的高度自动填充
  for (let i = 0; i < list.length; i++) {
    if (index === i)
      break
    y += getItemHeight(list[i].drag_id) + props.gap
  }
  // console.log(y, 'y')
  return y
}

/**
 * 获取指定项的高度
 * @param dragId 当前项的id
 * @returns 高度
 */
function getItemHeight(dragId: string) {
  const index = showList.value.findIndex(item => item.drag_id === dragId)
  const item = showList.value[index]
  return item.expand ? item.maxHeight : item.minHeight
}

/**
 * 获取指定项在指定列表中的索引
 * @param dragId 当前项的id
 * @param list 列表
 * @returns 索引
 */
function getListIndex(dragId: string, list = sortList.value) {
  return list.findIndex(item => item.drag_id === dragId)
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
        height: `${computedAreaHeight}px`,
      }"
    >
      <movable-view
        v-for="item in showList"
        :key="item.drag_id"
        class="drag-movable-item"
        :style="{
          height: `${item.height}px`,
          zIndex: currentId === item.drag_id ? 10 : 1,
          //transition: `height ${(item.expand ? 0.5 : 0.3)}s ease-in-out`,
        }"
        :class="[currentId === item.drag_id ? 'drag-movable-item--active' : '']"
        :animation="animation"
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
        <view :id="`#drag-content-${item.drag_id}`" class="dragListSlotBox">
          <view class="dragListSlotTitle">
            <slot name="title" :list-item="{ ...item }" />
          </view>
          <view class="dragListSlotContent">
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
  overflow: hidden;
  border-radius: 10px;
  @apply: bg-gray-300/[0.3] dark:bg-[#292929];
}

.drag-movable-item--active {
  @apply: bg-gray-200 dark:bg-[#565657];
}
</style>
