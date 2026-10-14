<script setup lang="ts">
export interface GridPickerOption {
  list: GridPickerOptionItem[]
  tops?: GridPickerOptionItem[]
}

export interface GridPickerOptionItem {
  id: string
  name: string
  icon?: string
  childs: GridPickerOptionItem[]
}

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
const props = withDefaults(defineProps<{
  option: GridPickerOption
  scrollHeight?: string
  itmeHeight?: number
  column?: number
}>(), {
  column: 5,
  itmeHeight: 68,
  scrollHeight: '40vh',
})
const emit = defineEmits(['change'])
const selected = defineModel<string>()

const { proxy } = getCurrentInstance() as any

const scrollTarget = ref(0)

// 数据项映射：id -> { ridx, item, parent }
const itemMaps: any = {}

const itmeHeight = ref(70)
const rows = ref<GridPickerOptionItem[][]>([])
const rowIndex = ref(-1)
const rowChilds = ref<GridPickerOptionItem[][]>([])
const rowChildHeights = ref<number[]>([])

const tops = ref<GridPickerOptionItem[]>([])
const currentId = ref()
const currentParentId = ref()

const itemsBoxStyle = computed(() => {
  return {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: `repeat(${props.column}, minmax(0, 1fr))`,
  }
})

const hasTop = computed(() => tops.value && tops.value.length > 0)

watch(() => props.itmeHeight, (nh) => {
  itmeHeight.value = nh
}, { immediate: true })

watch(() => props.option, (option) => {
  console.log(option)
  if (!option)
    return
  // 常用
  tops.value = option.tops || []

  // 全部
  const list = option.list || []
  const rs: GridPickerOptionItem[][] = []
  let ridx = 0
  // 构建行列数据，以及选中项
  for (let i = 0; i < list.length; i += props.column) {
    const ris = list.slice(i, i + props.column)
    ris.forEach((ri) => {
      itemMaps[ri.id] = { ridx, item: ri }
      ri.childs.forEach((ric) => {
        itemMaps[ric.id] = { ridx, item: ric, parent: ri }
      })
    })
    ridx++
    rs.push(ris)
    // 初始化每行子项集合
    rowChilds.value.push([])
    rowChildHeights.value.push(0)
  }
  rows.value = rs
}, { immediate: true, deep: true })

watch(() => selected.value, (newValue) => {
  // console.log(newValue, 'base picker watch selected')
  selectedItem(newValue)
  scrollToTarget(selected.value)
}, { immediate: true })

/**
 * 初始化选中项, 默认选中第一项
 */
function initSelected() {
  if (selected.value)
    return

  if (hasTop.value) {
    selected.value = tops.value[0].id
  }
  else {
    const list = props.option.list ?? []
    if (!list.length)
      return
    selected.value = list[0].id
    // 初始化，且为非常用项时才需要滚动到位置
    scrollToTarget(selected.value)
  }
}

function scrollToTarget(id: string) {
  nextTick(() => {
    setTimeout(() => {
      uni.createSelectorQuery().in(proxy).select(`#ITEM-${id}`).boundingClientRect((item: any) => {
        console.log(item, `ITEM-${id}`)

        if (item && item.bottom > 0)
          scrollTarget.value = item.bottom + (item.height ?? 0)
      }).exec()
    }, 350)
  })
}

/**
 * 常用项点击
 * @param item 常用项
 */
function handleTopItemTap(item: GridPickerOptionItem) {
  selected.value = item.id
}

/**
 * 列表项点击
 * @param item 列表项
 */
function handleListItemTap(item: GridPickerOptionItem) {
  selected.value = item.id
}

/**
 * 选中项处理
 * @param id 选中项id
 */
function selectedItem(id: string) {
  const map = itemMaps[id]
  if (!map)
    return

  const { item, parent } = map
  let rowIdx = map.ridx

  // 赋值子项集合，确定展开row
  const currentParent = parent || item
  if (currentParent.childs && currentParent.childs.length > 0) {
    rowChilds.value[rowIdx] = currentParent.childs
    rowChildHeights.value[rowIdx] = calcChildContentHeight(currentParent.childs)
  }
  else {
    // 子节点为空时，收起展开内容
    rowIdx = -1
  }
  rowIndex.value = rowIdx
  currentId.value = id
  currentParentId.value = currentParent.id

  // console.log(id, item, parent, 'base picker selected')
  emit('change', { id, select: item, parent })
}

/**
 * 获取子项内容高度
 * @param rowIdx 行索引
 * @returns 子项内容高度
 */
function calcChildContentHeight(childs: GridPickerOptionItem[]) {
  // console.log(rowIdx, rowIndex.value, childs.value, 'getChildContentHeight')
  if (!childs || childs.length < 1)
    return 0

  const row = Math.ceil(childs.length / props.column)
  let ih = row * itmeHeight.value + 16 // 16 为padding(p-2)
  ih = ih + ((row - 1) * 8) // 加上行间隔
  console.log(row, ih, 'row')
  return ih
}
</script>

<template>
  <scroll-view scroll-y :style="{ height: scrollHeight }" :scroll-top="scrollTarget" class="relative">
    <view class="p-2">
      <!-- 常用项 -->
      <view v-if="hasTop">
        <view class="pb-2 font-semibold">
          常用
        </view>
        <view :style="itemsBoxStyle">
          <view v-for="top in tops" :key="`top-${top.id}`" @tap="handleTopItemTap(top)">
            <grid-picker-view-item :height="itmeHeight" :item="top" :selected="currentId" />
          </view>
        </view>
        <view class="mt-3 pb-2 font-semibold">
          全部
        </view>
      </view>
      <!-- 列表项 -->
      <view class="space-y-3">
        <view v-for="(items, rowIdx) in rows" :key="rowIdx" class="flex flex-col space-y-3">
          <view :style="itemsBoxStyle">
            <view v-for="item in items" :id="`ITEM-${item.id}`" :key="item.id" @tap="handleListItemTap(item)">
              <grid-picker-view-item :height="itmeHeight" :expand="item.id === currentParentId" :item="item" :selected="currentId" />
            </view>
          </view>

          <view class="transition-all duration-300 ease-in-out">
            <view v-if="rowIdx === rowIndex" class="rounded-lg bg-gray-200 p-2" :style="{ ...itemsBoxStyle, height: `${rowChildHeights[rowIdx]}px` }">
              <view v-for="child in rowChilds[rowIdx]" :id="`ITEM-${child.id}`" :key="child.id" @tap="handleListItemTap(child)">
                <grid-picker-view-item :height="itmeHeight" :item="child" :selected="currentId" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
</style>
