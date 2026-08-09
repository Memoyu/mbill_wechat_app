<script setup lang="ts">
export interface GridSelectData {
  list: GridSelectItem[]
  tops?: GridSelectItem[]
}

export interface GridSelectItem {
  id: string
  name: string
  icon?: string
  childs: GridSelectItem[]
}

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  data: GridSelectData
  height?: number
  scrollHeight?: number
  column?: number
}>(), {
  column: 5,
  height: 68,
})
const emit = defineEmits(['change'])
const selected = defineModel<string>()

// 数据项映射：id -> { ridx, item, parent }
const itemMaps: any = {}

const itmeHeight = ref(70)
const scrollHeight = ref(300)
const rows = ref<GridSelectItem[][]>([])
const rowIndex = ref(-1)
const childs = ref()

const innerTops = ref<GridSelectItem[]>([])
const currentId = ref()
const currentParentId = ref()

const itemsBoxStyle = computed(() => {
  return {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: `repeat(${props.column}, minmax(0, 1fr))`,
  }
})

const hasTop = computed(() => {
  return innerTops.value && innerTops.value.length > 0
})

watch(() => props.height, (nh) => {
  itmeHeight.value = nh
}, { immediate: true })

watch(() => props.scrollHeight, (nh) => {
  if (nh)
    scrollHeight.value = nh
}, { immediate: true })

watch(() => props.data, (data) => {
  initSelectData(data)
}, { immediate: true, deep: true })

watch(() => selected.value, (newValue) => {
  // console.log(newValue, 'base picker watch selected')
  if (!newValue) {
    initSelected()
    return
  }
  selectedItem(newValue)
}, { immediate: true, deep: true })

function initSelectData(data: GridSelectData) {
  // console.log(data, 'data')
  if (!data)
    return
  // 初始化常用项
  innerTops.value = data.tops || []

  const rs: GridSelectItem[][] = []
  const list = data.list ?? []
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
  }
  rows.value = rs
}

/**
 * 初始化选中项, 默认选中第一项
 */
function initSelected() {
  if (hasTop.value) {
    selected.value = innerTops.value[0].id
  }
  else {
    const list = props.data.list
    if (!list.length)
      return
    selected.value = list[0].id
  }
}

/**
 * 常用项点击
 * @param item 常用项
 */
function handleTopItemTap(item: GridSelectItem) {
  selected.value = item.id
}

/**
 * 列表项点击
 * @param item 列表项
 */
function handleListItemTap(item: GridSelectItem) {
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
    childs.value = currentParent.childs
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
function getChildContentHeight(rowIdx: number) {
  // console.log(rowIdx, rowIndex.value, childs.value, 'getChildContentHeight')
  if (!childs.value || childs.value.length < 1 || rowIndex.value !== rowIdx)
    return '0px'

  const row = Math.ceil(childs.value.length / props.column)
  let height = row * itmeHeight.value + 16 // 16 为padding(p-2)
  height = height + ((row - 1) * 8) // 加上行间隔
  // console.log(row, height, 'row')
  return `${height}px`
}
</script>

<template>
  <scroll-view scroll-y :style="{ height: `${scrollHeight}px` }">
    <view class="p-2">
      <!-- 常用项 -->
      <view v-if="hasTop">
        <view class="pb-2 font-semibold">
          常用
        </view>
        <view :style="itemsBoxStyle">
          <view
            v-for="top in innerTops" :key="`top-${top.id}`"

            @tap="handleTopItemTap(top)"
          >
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
            <view
              v-for="item in items" :key="item.id"
              @tap="handleListItemTap(item)"
            >
              <grid-picker-view-item :height="itmeHeight" :expand="item.id === currentParentId" :item="item" :selected="currentId" />
            </view>
          </view>

          <view
            class="grid-select-childs-box rounded-lg bg-gray-200"
            :style="{ height: getChildContentHeight(rowIdx) }"
          >
            <view class="p-2" :style="{ ...itemsBoxStyle, display: rowIndex === rowIdx ? '' : 'none' }">
              <view
                v-for="child in childs" :key="child.id"
                @tap="handleListItemTap(child)"
              >
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
.grid-select-childs-box {
  height: 0px;
  transition: height 0.3s ease-in-out;
  overflow: hidden;
}
</style>
