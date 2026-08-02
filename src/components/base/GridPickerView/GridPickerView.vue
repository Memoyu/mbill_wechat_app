<script setup lang="ts">
import { objToStyle } from '@/utils'

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
  height: number
  scrollHeight?: number
  column?: number
}>(), {
  column: 5,
})
const emit = defineEmits(['change'])
const selected = defineModel<string>()
defineExpose({
  // 对外提供初始化选中项方法，主要用于popup类型组件使用（弹窗完成后再初始化）
  initSelected,
})

// 数据项映射：id -> { ridx, item, parent }
const itemMaps: any = {}

const itmeHeight = ref(70)
const scrollHeight = ref(300)
const rows = ref<GridSelectItem[][]>([])
const rowIndex = ref(-1)
const childs = ref()

const innerTops = ref<GridSelectItem[]>([])
const currentId = ref()
const topId = ref()
const parentId = ref()

const itemsBoxStyle = computed(() => {
  const style = {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: `repeat(${props.column}, minmax(0, 1fr))`,
  }
  return `${objToStyle(style)}`
})

const hasTop = computed(() => {
  return innerTops.value && innerTops.value.length > 0
})

watch(() => props.height, (nh) => {
  itmeHeight.value = nh
}, { immediate: true })

watch(() => props.scrollHeight, (nh) => {
  scrollHeight.value = nh
}, { immediate: true })

watch(() => props.data, (data) => {
  initSelectData(data)
}, { immediate: true, deep: true })

watch(() => selected.value, (val) => {
  initSelected(val)
}, { immediate: true, deep: true })

function initSelectData(data: GridSelectData) {
  // console.log(list, 'list')
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
      itemMaps[ri.id] = { ridx, item: ri, parent: ri }
      ri.childs.forEach((ric) => {
        itemMaps[ric.id] = { ridx, item: ric, parent: ri }
      })
    })
    ridx++
    rs.push(ris)
  }
  rows.value = rs

  initSelected(selected.value || '')
}

/**
 * 初始化选中项
 * @param sid 选中项id
 */
function initSelected(sid: string) {
  // console.log(itemMaps, 'itemMaps')
  const map = itemMaps[sid]
  if (!map) {
    if (hasTop.value) {
      sid = innerTops.value[0].id
    }
    else {
      const list = props.data.list
      if (!list.length)
        return
      sid = list[0].id
    }
  }

  // console.log(map, 'init selected')
  // 初始化选中项
  const isTop = hasTop.value && innerTops.value.findIndex(t => t.id === sid) > -1
  selectedItem(sid, false, isTop)
}

/**
 * 常用项点击
 * @param item 常用项
 */
function handleTopItemTap(item: GridSelectItem) {
  selectedItem(item.id, true)
}

/**
 * 列表项点击
 * @param item 列表项
 */
function handleListItemTap(item: GridSelectItem) {
  // console.log(item, rowIdx, 'selected item')
  selectedItem(item.id)
}

/**
 * 选中项处理
 * @param id 选中项id
 * @param isEmit 是否触发emit
 * @param isTop 是否常用项
 */
function selectedItem(id: string, isEmit = true, isTop = false) {
  const map = itemMaps[id]
  if (!map)
    return

  selected.value = id
  const { item, parent } = map
  let rowIdx = map.ridx

  if (parent.childs && parent.childs.length > 0) {
    childs.value = parent.childs
  }
  else {
    // 子节点为空时，收起展开内容
    rowIdx = -1
  }

  // 为常用项时，则不选中父项
  if (isTop) {
    rowIdx = -1
    topId.value = id
    parentId.value = undefined
  }
  else {
    currentId.value = id
    topId.value = undefined
    parentId.value = parent.id
  }
  rowIndex.value = rowIdx

  isEmit && emit('change', { id, select: item, parent })
}

function getChildContentHeight(rowIdx: number) {
  const itemH = itmeHeight.value + 8 * 2 // 上下间8px间距
  const row = Math.ceil(childs.value.length / props.column)
  console.log(row, row * itemH, 'row')
  return rowIndex.value === rowIdx && childs.value && childs.value.length > 0 ? `${row * itemH}px` : '0px'
}
</script>

<template>
  <scroll-view scroll-y :style="{ height: `${scrollHeight}px` }">
    <view class="p-2 space-y-3">
      <!-- 常用项 -->
      <view v-if="hasTop">
        <view class="font-semibold">
          常用
        </view>
        <view :style="itemsBoxStyle">
          <view
            v-for="top in innerTops" :key="`top-${top.id}`"
            @tap="handleTopItemTap(top)"
          >
            <picker-item :height="itmeHeight" :item="top" :selected="topId" />
          </view>
        </view>
        <view class="mt-3 font-semibold">
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
              <picker-item :height="itmeHeight" :item="item" :selected="parentId" />
            </view>
          </view>

          <view
            class="grid-select-childs-box rounded-lg bg-gray-200"
            :style="{ height: getChildContentHeight(rowIdx) }"
          >
            <view :id="`GRID-CHILDS-${rowIdx}`" class="p-2" :style="{ display: rowIndex === rowIdx ? '' : 'none' }">
              <view :style="itemsBoxStyle">
                <view
                  v-for="child in childs" :key="child.id"
                  @tap="handleListItemTap(child)"
                >
                  <picker-item :height="itmeHeight" :item="child" :selected="currentId" />
                </view>
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
