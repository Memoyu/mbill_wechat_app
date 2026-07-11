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

const { proxy } = getCurrentInstance() as any
const scrollHeight = ref(props.height)
const rows = ref<GridSelectItem[][]>([])
const rowIndex = ref(-1)
const childs = ref()
const childHeight = ref(0)

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
  scrollHeight.value = nh
})

watch(() => props.data, (data) => {
  initSelectData(data)
}, { deep: true })

function initSelectData(data: GridSelectData) {
  // console.log(list, 'list')
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
  let map = itemMaps[sid]
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

  // console.log(sid, 'init sid')
  map = itemMaps[sid]
  if (!map)
    return

  console.log(map, 'init selected')

  // 初始化选中项
  const { ridx, item, parent } = map
  childs.value = parent.childs
  rowIndex.value = ridx
  calcChildHeight(ridx)
  const isTop = hasTop.value && innerTops.value.findIndex(t => t.id === sid) > -1
  selectedItem(item, isTop)
}

function handleTopItemTap(item: GridSelectItem) {
  selectedItem(item, true)
}

function handleRowItemTap(item: GridSelectItem, rowIdx: number) {
  if (item.childs && item.childs.length > 0) {
    childs.value = item.childs
    // 获取子项集合高度
    calcChildHeight(rowIdx)
  }
  else {
    // 子节点为空时，收起展开内容
    rowIdx = -1
  }

  rowIndex.value = rowIdx
  selectedItem(item)
}

function handleChildItemTap(item: GridSelectItem) {
  selectedItem(item)
}

function selectedItem(select: GridSelectItem, isTop = false) {
  selected.value = select.id
  const { parent } = itemMaps[select.id]

  // 为常用项时，则不选中父项
  if (isTop) {
    topId.value = select.id
    rowIndex.value = -1
    parentId.value = undefined
  }
  else {
    currentId.value = select.id
    topId.value = undefined
    parentId.value = parent.id
  }

  emit('change', { id: select.id, select, parent })
}

/**
 * 计算子项集合高度
 * @param rowIdx column index
 */
function calcChildHeight(rowIdx: any) {
  nextTick(() => {
    uni.createSelectorQuery().in(proxy).select(`#GRID-CHILDS-${rowIdx}`).boundingClientRect((view: any) => {
      console.log(view, 'boundingClientRect')
      childHeight.value = view?.height ?? 0
    }).exec()
  })
}

function getChildContentHeight(rowIdx: number) {
  return rowIndex.value === rowIdx && childs.value && childs.value.length > 0 ? `${childHeight.value}px` : '0px'
}
</script>

<template>
  <scroll-view scroll-y :style="{ height: `${scrollHeight}px` }">
    <view class="p-2">
      <!-- 常用项 -->
      <view v-if="hasTop">
        <view class="font-semibold">
          常用
        </view>
        <view :style="itemsBoxStyle">
          <view
            v-for="top in innerTops" :key="`top-${top.id}`"
            class="my-2"
            @tap="handleTopItemTap(top)"
          >
            <picker-item :item="top" :selected="topId" />
          </view>
        </view>
        <view class="mt-3 font-semibold">
          全部
        </view>
      </view>
      <!-- 列表项 -->
      <view v-for="(items, rowIdx) in rows" :key="rowIdx" class="flex flex-col">
        <view :style="itemsBoxStyle">
          <view
            v-for="item in items" :key="item.id"
            class="my-2"
            @tap="handleRowItemTap(item, rowIdx)"
          >
            <picker-item :item="item" :selected="parentId" />
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
                @tap="handleChildItemTap(child)"
              >
                <picker-item :item="child" :selected="currentId" />
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
