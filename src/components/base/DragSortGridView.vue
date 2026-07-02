<script lang="ts" setup>
import lodash from 'lodash'
import { omit, toFixed } from '@/utils'

interface DragSortBaseItem {
  [key: string]: any
  drag_id: string
}

interface DragSortShowItem extends DragSortBaseItem {
  x: number
  y: number
  disabled: boolean
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
  gap?: number
  column?: number
  hasAdd?: boolean
  initHeight?: number
}>(), {
  gap: 5,
  column: 3,
  hasAdd: true,
  initHeight: 75,
})
const emit = defineEmits(['change', 'add'])
const ADD_DRAG_ID = 'add-item'
const COM_INTERNAL_ARGS = ['x', 'y', 'drag_id', 'disabled']
const { proxy } = getCurrentInstance() as any

const { vibrate } = useVibrate()

const sorting = ref(false)
const sortChanged = ref(false)
const showList = ref<DragSortShowItem[]>([])
const sortList = ref<DragSortBaseItem[]>([])
const targetId = ref('')
const currentId = ref('')
const animation = ref(false)

const areaHeight = ref(200)
const itemWidth = ref(80)
const itemHeight = ref(props.initHeight)

const addIconSize = computed(() => {
  const size = toFixed(Math.min(itemWidth.value, itemHeight.value) * 0.42)
  return `${Math.max(size, 20)}px`
})

watch(() => props.list, (newList) => {
  const list = lodash.cloneDeep(newList)
  initList(list)
  calculateItemSize()
}, { immediate: true, deep: true })

/**
 * 初始化列表
 * 对传入的列表数据与showList做差异更新
 * @param list 列表数据
 */
function initList(list: any[]) {
  // 添加固定项
  if (props.hasAdd) {
    list.push({
      [props.keyProp]: ADD_DRAG_ID,
      disabled: true,
    })
  }

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
      })
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
  const dragId = item[props.keyProp]
  // 避免初始为0, 0 坐标后更新为实际坐标导致的ui闪烁问题
  const [x, y] = getPosition(dragId)
  // console.log(x, y, 'x, y')
  return {
    ...item,
    y,
    x,
    drag_id: dragId,
  } as DragSortShowItem
}

/**
 * 初始化列表项的尺寸
 */
function calculateItemSize() {
  setTimeout(() => {
    uni.createSelectorQuery().in(proxy).select('.dragGridSortBox').boundingClientRect((box: any) => {
      if (!box)
        return
      // console.log(box, 'dragGridSortBox')

      uni.createSelectorQuery().in(proxy).select('.dragGridSlotContent').boundingClientRect((content: any) => {
        // console.log(content, 'dragGridSlotContent')
        // 更新项的宽度和高度
        if (content) {
          itemHeight.value = content.height
        }
        itemWidth.value = toFixed((box.width - ((props.column - 1) * props.gap)) / props.column)

        // 更新列表项坐标数据
        showList.value.map((item) => {
          const [x, y] = getPosition(item.drag_id)
          item.x = x
          item.y = y
          return item
        })

        // 更新可拖动区域的高度
        areaHeight.value = Math.ceil(showList.value.length / props.column) * (itemHeight.value + props.gap)
      }).exec()
    }).exec()
  }, 0)
}

function handleDragStart(item: DragSortShowItem) {
  // 控制动画启用，避免重新加载数据时页面动画难看
  animation.value = true
  currentId.value = item.drag_id
  sorting.value = true
  sortChanged.value = false
  // 震动反馈
  vibrate()
}

function handleTouchEnd() {
  animation.value = false
  if (!sorting.value || currentId.value === '')
    return

  // console.log('touch end', showList.value)
  sorting.value = false

  const [x, y] = getPosition(currentId.value)

  // 获取showList item，加偏移量
  const showIndex = getListIndex(currentId.value, showList.value)
  const item = showList.value[showIndex]
  item.x += 0.001
  item.y += 0.001

  // DOM 更新循环结束之后执行延迟回调，恢复原位
  nextTick(() => {
    item.x = x
    item.y = y

    if (sortChanged.value) {
      let endList = lodash.cloneDeep(sortList.value)
      // 去除添加项
      if (props.hasAdd) {
        endList = endList.slice(0, -1)
      }
      emit('change', endList.map(item => omit(item, COM_INTERNAL_ARGS)))
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
  // console.log(targetIndex.value, currentIndex.value)

  if (targetId.value !== currentId.value && currentId.value !== '' && targetId.value !== '') {
    const targetIndex = getListIndex(targetId.value)
    const targetItem = showList.value[targetIndex]
    if (!targetItem.disabled) {
    // console.log(targetIndex.value, 'target')
      const newList = sortList.value
      const currentIndex = getListIndex(currentId.value)
      const elementToMove = newList.splice(currentIndex, 1)[0]
      newList.splice(targetIndex, 0, elementToMove)

      showList.value.forEach((item) => {
      // 当前项通过手动拖动已经到了指定位置，因此需要重新排序其他项的高度
        if (item.drag_id !== elementToMove.drag_id) {
          // 根据新数组的位置重新置y值
          const [x, y] = getPosition(item.drag_id)
          item.x = x
          item.y = y
          // console.log(item.y)
        }
      })

      sortChanged.value = true
    }
  }
}

function handleAddItemTap() {
  emit('add')
}

/**
 * 获取指定项的坐标数据
 * @param dragId 拖动项的id
 * @returns [x, y]
 */
function getPosition(dragId: string) {
  const index = getListIndex(dragId)

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

/**
 * 获取与当前拖动项排序互换的目标项
 * @param e 事件对象
 * @returns 互换的目标项下标
 */
function getTargetIndex(e: any) {
  const list = sortList.value
  const { x, y } = e.detail
  // x 手指按下拖动，产生的位置，超出了item的宽度，那么就改变下标，包括y轴。
  const currentX = Math.floor((x + itemWidth.value / 2) / itemWidth.value)
  const currentY = Math.floor((y + itemHeight.value / 2) / itemHeight.value)
  // target：通过计算横排数量，偏移量（ x，y ），得出下标位置
  const target = Math.min(currentY * props.column + currentX, list.length - 2) // 滑到了哪个位置

  // console.log(target, 'target')
  return list[target].drag_id
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
  <view class="dragGridSortBox">
    <movable-area
      class="drag-movable-area"
      :style="{
        height: `${areaHeight}px`,
      }"
    >
      <view v-show="sorting" class="drag-grid-overlay" />
      <movable-view
        v-for="item in showList"
        :key="item.drag_id"
        class="drag-movable-item"
        :style="{
          height: `${itemHeight}px`,
          width: `${itemWidth}px`,
          zIndex: currentId === item.drag_id ? 10 : 1,
        }"
        :class="[currentId === item.drag_id ? 'drag-movable-item--active' : '']"
        :animation="animation"
        :x="item.x"
        :y="item.y"
        direction="all"
        :out-of-bounds="true"
        :disabled="item.disabled || !sorting "
        @change="handleSortChange"
        @longpress.stop="handleDragStart(item)"
        @touchend.stop="handleTouchEnd"
      >
        <view v-if="item.drag_id !== ADD_DRAG_ID" class="dragGridSlotContent">
          <slot name="content" :grid-item="{ ...item }" />
        </view>
        <view v-else class="drag-add-item" @tap.stop="handleAddItemTap">
          <text class="iconfont icon-plus" :style="{ fontSize: addIconSize }" />
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

.drag-grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 9;
}

.drag-movable-item {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
}

.drag-add-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
