<script setup lang="ts">
import { objToStyle } from '@/utils'

export interface GridSelectItem {
  id: string
  name: string
  icon?: string
  childs: GridSelectItem[]
}

const props = withDefaults(defineProps<{
  list: GridSelectItem[]
  height: number
  column?: number
  selectId?: string
}>(), {
  column: 5,
})
const emit = defineEmits(['change'])

const { proxy } = getCurrentInstance() as any
const scrollHeight = ref(props.height)
const rows = ref<GridSelectItem[][]>([])
const rowIndex = ref(0)
const childs = ref()
const childHeight = ref(0)
const selected = ref()

const itemsBoxStyle = computed(() => {
  const style = {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: `repeat(${props.column}, minmax(0, 1fr))`,
  }
  return `${objToStyle(style)}`
})

watch(() => props.height, (nh) => {
  scrollHeight.value = nh
})

watch(() => props.list, (list) => {
  initRowList(list)
}, { deep: true })

function initRowList(list: GridSelectItem[]) {
  // console.log(list, 'list')
  const rs: GridSelectItem[][] = []
  const ls = list ?? []

  for (let i = 0; i < ls.length; i += props.column) {
    const ritems = ls.slice(i, i + props.column)
    rs.push(ritems)
  }
  rows.value = rs

  let index = 0
  let parent
  let cs
  rs.forEach((items, idx) => {
    items.forEach((item) => {
      if (item.id === props.selectId) {
        index = idx
        parent = item
        cs = item.childs
      }
      item.childs.forEach((child) => {
        if (child.id === props.selectId) {
          index = idx
          parent = child
          cs = item.childs
        }
      })
    })
  })

  console.log(index, parent, 'rowIndex')

  if (parent) {
    childs.value = cs
    handleItemTap(parent, index)
  }
}

function handleItemTap(item: GridSelectItem, rowIdx: any) {
  if (item.childs && item.childs.length > 0) {
    childs.value = item.childs
  }

  // 获取子项集合高度
  calcChildHeight(rowIdx)
  // 展开状态改变
  rowIndex.value = rowIdx

  selectedItem(item)
  emit('change', item)
}

function selectedItem(item: GridSelectItem) {
  selected.value = item.id
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
      <view v-for="(items, rowIdx) in rows" :key="rowIdx" class="flex flex-col">
        <view :style="itemsBoxStyle">
          <view
            v-for="item in items" :key="item.id"
            class="my-2"
            @tap="handleItemTap(item, rowIdx)"
          >
            <picker-item :item="item" :selected="selected" />
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
                :class="[selected.id === child.id ? 'grid-select-item-selected' : '']"
                @tap="handleItemTap(child, rowIdx)"
              >
                <picker-item :item="child" :selected="selected" />
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
