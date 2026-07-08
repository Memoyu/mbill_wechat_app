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
const model = defineModel<string>()
defineExpose({
  // 对外提供初始化选中项方法，主要用于popup类型组件使用（弹窗完成后再初始化）
  initSelected,
})

// 数据项映射：id -> { ridx, pid }
const itemMaps = {}

const { proxy } = getCurrentInstance() as any
const scrollHeight = ref(props.height)
const rows = ref<GridSelectItem[][]>([])
const rowIndex = ref(-1)
const childs = ref()
const childHeight = ref(0)

const innerTops = ref<GridSelectItem[]>([])

const selectedId = ref()

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
  innerTops.value = data.tops

  const rs: GridSelectItem[][] = []
  const list = data.list ?? []
  let ridx = 0
  // 构建行列数据，以及选中项
  for (let i = 0; i < list.length; i += props.column) {
    const ris = list.slice(i, i + props.column)
    ris.forEach((ri) => {
      itemMaps[ri.id] = { ridx, pid: ri.id }
      ri.childs.forEach((ric) => {
        itemMaps[ric.id] = { ridx, pid: ri.id }
      })
    })
    ridx++
    rs.push(ris)
  }
  rows.value = rs

  initSelected(model.value)
}

/**
 * 初始化选中项
 * @param sid 选中项id
 */
function initSelected(sid: string) {
  // console.log(itemMaps, 'itemMaps')
  const map = itemMaps[sid]

  const list = props.data.list
  let parent
  let ridx = 0
  // 默认选中项为空
  if (!map) {
    // 有常用，则选中常用第一个
    if (hasTop.value) {
      selectedId.value = innerTops.value[0].id
      return
    }
    else {
      // 默认选中lsit第一个
      parent = list[0]
      sid = parent.id
    }
  }
  else {
    ridx = map.ridx
    const pid = map.pid
    parent = list.find(item => item.id === pid)
  }

  console.log(map, ridx, parent, 'init selected')

  selectedId.value = sid
  childs.value = parent.childs
  rowIndex.value = ridx
  calcChildHeight(ridx)
}

function handleCommonItemTap(item: GridSelectItem) {
  // 收起展开内容
  rowIndex.value = -1
  selectedItem(item)
}

function handleItemTap(item: GridSelectItem, rowIdx: number) {
  if (item.childs && item.childs.length > 0) {
    childs.value = item.childs
    // 获取子项集合高度
    calcChildHeight(rowIdx)
  }
  else {
    // 收起展开内容
    rowIdx = -1
  }
  rowIndex.value = rowIdx
  selectedItem(item)
}

function handleChildItemTap(item: GridSelectItem) {
  selectedItem(item)
}

function selectedItem(item: GridSelectItem) {
  selectedId.value = item.id
  model.value = selectedId.value
  emit('change', item)
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
            v-for="top in innerTops" :key="`common-${top.id}`"
            class="my-2"
            @tap="handleCommonItemTap(top)"
          >
            <picker-item :item="top" :selected-id="selectedId" />
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
            @tap="handleItemTap(item, rowIdx)"
          >
            <picker-item :item="item" :selected-id="selectedId" />
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
                <picker-item :item="child" :selected-id="selectedId" />
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
