<script lang="ts" setup>
import lodash from 'lodash'
import { systemInfo } from '@/utils/systemInfo'

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
  itemHeight?: string
  column?: number
  direction?: 'all' | 'vertical' | 'horizontal'
  swapMode?: boolean
}>(), {
  column: 1,
  itemHeight: 'auto',
  direction: 'vertical',
  swapMode: true,
})
const emit = defineEmits(['change'])

const { vibrate } = useVibrate()
const { proxy } = getCurrentInstance() as any

const scrollHeight = ref(300)
const dragViewRef = ref<HTMLElement | null>(null)
const showList = ref([])
const cloneList = ref([])
const width = ref('100%')
const itemMaxHeight = ref('auto')
const viewMaxHeight = ref(80)
const disabled = ref(true)
const activeIndex = ref(-1)
const moveToIndex = ref(-1)
const oldIndex = ref(-1)
const oldPosition = ref({ pos_y: 0 })
const scrollInfo = ref({
  pos_x: 0,
  pos_y: 0,
})

const dragDirection = ref<'upward' | 'down'>()

const isList = computed(() => {
  return props.column === 1
})

const getItemHeight = computed(() => {
  const value = props.itemHeight === 'auto' ? Number.parseFloat(itemMaxHeight.value) : Number.parseFloat(props.itemHeight)
  // this.$emit('getItemHeight', value)
  console.log(value)
  return value
})

const getItemWidth = computed(() => {
  // 获取item的宽度
  const w = getRealWidth(width.value)
  return Number.parseFloat((Number.parseFloat(w) / props.column).toFixed(2))
})

// 给item设置高度和宽度
const getItemStyle = computed(() => {
  const itemHeightWidth = {
    width: `${getItemWidth.value}px`,
    height: `${getItemHeight.value}px`,
  }
  // this.$emit('getItemStyle', itemHeightWidth)
  return itemHeightWidth
})

const placeholderTopValue = computed(() => {
  let height = 0
  try {
    if (showList.value && showList[activeIndex.value]) {
      height = -showList[activeIndex.value].height
    }
  }
  catch (e) {
    console.log('eee', e)
  }
  return height
})

watch(() => props.height, (h) => {
  scrollHeight.value = h
})

watch(() => props.list, (newList) => {
  // 只有在列表的情况下才处理
  if (!isList.value)
    return
  let list = lodash.cloneDeep(newList) || []
  // 先拿到新增数据，因为是从父级侦听获取数据，并且是向后添加数据，所以需要使用剪切
  if (list.length > showList.value.length) {
    list.splice(0, showList.value.length)
    list = [...showList.value, ...list]
    initList(list, true)
  }
  else {
    // 如果小于显示长度 说明刷新或者删除了说明元素，这个时候应该更新列表
    nextTick(() => {
      initList(list, true)
    })
  }
})

onMounted(() => {
  showList.value = lodash.cloneDeep(props.list) || []
})

function initList(list, changeHeight = false) {
  console.log(list, 'list')
  const newList = lodash.cloneDeep(list)
  // 给每个item添加一x，y和key
  showList.value = newList.map((item, index) => {
    const [pos_x, pos_y] = getPosition(index)
    const data = {
      ...item,
      pos_x,
      pos_y,
      dropId: index + 1,
    }
    let item_key = `slot${Math.random()}${index}`
    // 如果x轴和y轴没变，那么不用更新key来刷新状态
    if (pos_x === item?.pos_x && pos_y === item?.pos_y) {
      if (activeIndex.value !== index) {
        // 非当前点击的下标和目标下标的下标不需要生成新的key
        item_key = item.item_key
      }
    }
    // 判断拖动位置的元素是那个
    data.item_key = item_key
    return data
  })

  cloneList.value = lodash.cloneDeep(showList.value)

  if (changeHeight && itemMaxHeight.value === 'auto') {
    // 获取到最高的item
    nextTick(() => {
      setTimeout(() => {
        const query = uni.createSelectorQuery().in(proxy)
        query.selectAll('.slotContent').boundingClientRect((data) => {
          console.log(data, 'data')
          const domList = JSON.parse(JSON.stringify(data))
          let max = 0
          let vmh = 0

          for (let i = 0; i < domList.length; i++) {
            const height = domList[i].height
            if (isList.value) {
              cloneList.value[i].height = height
            }
            vmh += height
            if (height > max) {
              max = height
            }
          }
          viewMaxHeight.value = vmh // 内容区域总高度
          itemMaxHeight.value = `${max}px`
          initList(cloneList.value)
        }).exec()
      }, 100)
    })
  }
}

function getPosition(index, list = cloneList.value) {
  // 通过计算重新算换 偏移单位。
  const pos_x = (index % props.column) * getItemWidth.value
  let pos_y = 0
  if (isList.value) {
    // 如果是 单项数据时，不需要通过getItemHeight来排，而是需要根据每个item的高度自动填充
    for (let i = 0; i < list.length; i++) {
      if (index === i)
        break
      pos_y += list[i].height
    }
  }
  else {
    // 根据最高的item来决定整体的高度
    pos_y = Math.floor(index / props.column) * getItemHeight.value
  }
  console.log(pos_x, pos_y)
  return [pos_x, pos_y]
}

// 获取实际的宽度
function getRealWidth(w) {
  let width = `${w}`
  if (width.includes('%')) {
    const windowWidth = systemInfo.windowWidth
    width = (windowWidth * (Number.parseFloat(width) / 100)).toString()
  }
  return width
}

// 长按事件
function controlLongpress(index) {
  disabled.value = false
  // 哪个开始活动
  activeIndex.value = index
  // 记录一下旧的下标
  oldIndex.value = index
}

function handleDragStart(enent, index) {
  // // 哪个开始活动
  // this.activeIndex = index;
  // // 记录一下旧的下标
  // this.oldIndex = index;
  // this.$emit('pressStart', { enent, data: this.cloneList[index] })
}

// 拖拽中
function handleMoving(e) {
  if (e.detail.source !== 'touch')
    return
  const { x, y } = e.detail
  const pos_x = x
  let pos_y = y
  if (isList.value) {
    // 如果是列表需要添加滚动产生的边距
    pos_y = pos_y + scrollInfo.value.pos_y
    oldPosition.value.pos_y = pos_y
  }
  changeListPosition({ pos_x, pos_y })
}

// 改变列表位置
function changeListPosition({ pos_x = 0, pos_y = 0 }) {
  // x 手指按下拖动，产生的位置，超出了item的宽度，那么就改变下标，包括y轴。
  const currentX = Math.floor((pos_x + getItemWidth.value / 2) / getItemWidth.value)
  const currentY = Math.floor((pos_y + getItemHeight.value / 2) / getItemHeight.value)
  // moveToIndex：通过计算横排数量，偏移量（ leo_x，leo_y ），得出下标位置
  moveToIndex.value = Math.min(currentY * props.column + currentX, cloneList.value.length - 1) // 滑到了哪个位置
  // 如果是列表的情况 -- 触碰元素的边缘就检测到下标
  if (isList.value) {
    // 列表的情况, 无需考虑leo_x轴;  通过leo_y轴和列表的高度来判断;
    let currentH = 0
    for (let i = 0; i < cloneList.value.length; i++) {
      currentH += cloneList.value[i].height
      if (dragDirection.value === 'down') {
        // 往下的情况下 ---- 当前活动的下标的高度( 也就是拖动的底部 )碰到下一个元素时； 赋值下标
        /*
          下一个下标的5/1；位置触发
          如果到了最后一个时，让下一个触发的高度变成当前拖动到指定位置的高度，避免照成到达了底部后下标位置有差异的问题；
        **/
        const nextH = cloneList.value[i + 1] ? cloneList.value[i + 1].height / 5 : currentH
        if (currentH > (pos_y + cloneList.value[activeIndex.value].height - nextH)) {
          moveToIndex.value = i
          break
        }
      }
      else {
        // 往上拖拽时 ---- 当前活动的下标( 也就是拖动的顶部 )碰到上一个元素时； 赋值下标
        const theH = cloneList.value[i - 1] ? cloneList.value[i - 1].height / 5 : 0 // 下一个下标的5/1；位置触发
        if (currentH > (pos_y + theH)) {
          moveToIndex.value = i
          break
        }
      }
    }
  }
  if (oldIndex.value !== moveToIndex.value && oldIndex.value !== -1 && moveToIndex.value !== -1) {
    // 排序替换
    const newList = lodash.cloneDeep(cloneList.value) // cloneList的数据会比showList优先变化
    const replaceList = lodash.cloneDeep(cloneList.value) // cloneList的数据会比showList优先变化
    const splicItem = newList.splice(activeIndex.value, 1)[0] // 删除指定下标，并且返回删除的数据
    newList.splice(moveToIndex.value, 0, splicItem) // 被移入的下标数据替换成刚刚删除的下标数据
    if (props.swapMode) {
      if (isList.value) {
        // 需要先吧高度先替换掉---
        replaceList.splice(moveToIndex.value, 0, ...replaceList.splice(activeIndex.value, 1))
      }
      // 替换位置
      showList.value.forEach((item, index) => {
        if (index !== activeIndex.value) {
          const itemIndex = newList.findIndex(val => val.dropId === item.dropId)
          // 在修改轴和y轴时，需要先吧height改变，因为列表的y轴就是根据height赋值的。
          const position = getPosition(itemIndex, replaceList)
          if (index === 7) {
            console.log('itemIndex', itemIndex)
            console.log('position[1]', position[1])
          }
          item.pos_x = position[0]
          item.pos_y = position[1]
        }
      })
    }
    else {
      // 两点换位
      replaceList[activeIndex.value].height = showList.value[moveToIndex.value].height
      replaceList[moveToIndex.value].height = showList.value[activeIndex.value].height

      showList.value.forEach((item, index) => {
        if (isList.value) {
          if (dragDirection.value === 'down') {
            if (index > activeIndex.value && index < moveToIndex.value) {
              // 在这个期间的高度和y都需要变化
              [item.pos_x, item.pos_y] = getPosition(index, replaceList)
            }
          }
          else if (index < activeIndex.value && index > moveToIndex.value) {
            // 在这个期间的高度和y都需要变化
            [item.pos_x, item.pos_y] = getPosition(index, replaceList)
          }
        }
        // 说明需要把不需要换位的下标替回来
        if (index === oldIndex.value) {
          [item.pos_x, item.pos_y] = getPosition(oldIndex.value, replaceList)
        }
        // 当前移动的下标和目标下标互换位置
        if (index === moveToIndex.value) {
          [item.pos_x, item.pos_y] = getPosition(activeIndex.value, replaceList)
        }
      })
    }
    oldIndex.value = moveToIndex.value
  }

  // const list = this.deepCopy(this.showList)
  // this.$emit('handleMoving', { list, pos_x, pos_y })
}

function handleDragEnd(e) {
  setTimeout(() => {
    scrollInfo.value = { pos_x: 0, pos_y: 0 }
    if (disabled.value)
      return // 为点击不能出发
    if (moveToIndex.value !== -1 && activeIndex.value !== -1 && moveToIndex.value !== activeIndex.value) {
      // 拖动了的话，并且目标位置和活动位置不一样，才来这里
      if (props.swapMode) {
        cloneList.value.splice(moveToIndex.value, 0, ...cloneList.value.splice(activeIndex.value, 1))
      }
      else {
        const active = cloneList.value[activeIndex.value] // 当前下标
        const move = cloneList.value[moveToIndex.value] // 目标下标
        // 替换
        cloneList.value[activeIndex.value] = move
        cloneList.value[moveToIndex.value] = active
      }
    }
    initList(cloneList.value)
    const endList = showList.value.map(item => omit(item))
    const list = lodash.cloneDeep(cloneList.value)
    // this.$emit('update:list', endList) // vue3 的更新方法
    // this.$emit('getList', endList) // 更新列表
    // this.$emit('handleDragEnd', { list }) // 结束拖拽

    activeIndex.value = -1
    oldIndex.value = -1
    moveToIndex.value = -1
    disabled.value = true
  })

  // 省略初始化时添加的 x，y和key等参数
  function omit(obj, args = ['pos_x', 'pos_y', 'dropId', 'height']) {
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
}

// 显示占位
function showPlaceholder(i) {
  // 位于底部或者指定位置等于活动位置时,都不会显示占位
  let isShow = false
  if (moveToIndex.value > activeIndex.value) {
    // 指定下标位置大于活动下标，i-1; 目的是为了用指定位置的下一级判断占位
    if (moveToIndex.value === (i - 1)) {
      isShow = true
    }
  }
  else if (moveToIndex.value === activeIndex.value) {
    return false // 位置不变时
  }
  else if (moveToIndex.value < activeIndex.value) {
    if (moveToIndex.value === i) {
      isShow = true
    }
  }
  return isShow
}
</script>

<template>
  <view id="drag-view" ref="dragViewRef" class="drag-view">
    <scroll-view
      scroll-y
      class="relative"
      scroll-with-animation
      :enhanced="true"
      :style="{ height: `${scrollHeight}px` }"
    >
      <movable-area
        class="drag-movable-area"
        :style="{
          height: `${scrollHeight}px`,
        }"
      >
        <movable-view
          v-for="(item, index) in showList"
          :key="item.item_key" class="drag-movable-item" :animation="true" :direction="direction"
          :damping="20" :x="item.pos_x" :y="item.pos_y" :disabled="disabled" out-of-bounds
          :style="[{ 'z-index': activeIndex === index ? 9 : 1 }, { top: activeIndex === index ? `${scrollInfo.pos_y}px` : 0 }, getItemStyle, isList ? { height: `${item.height}px` } : {}]"
          @longpress="controlLongpress(index)"
          @touchstart="handleDragStart($event, index)"
          @change="handleMoving"
          @touchend="handleDragEnd"
        >
          <view ref="slotContent" class="slotContent">
            <slot :data="{ ...item, index, activeIndex, moveToIndex }" name="content" />
          </view>
          <view v-if="showPlaceholder(index)" class="placeholder" :style="{ height: `${showList[activeIndex]?.height}px`, top: `${placeholderTopValue}px` }">
            <slot name="placeholder" />
          </view>
        </movable-view>
      </movable-area>
    </scroll-view>
  </view>
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
</style>
