<script setup lang="ts">
defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
const props = withDefaults(defineProps<{
  option: {
    list: any[]
    tops?: any[]
  }
  value: string
  idKey?: string
  scrollHeight?: string
  itmeHeight?: number
  column?: number
}>(), {
  idKey: 'id',
  column: 5,
  itmeHeight: 68,
  scrollHeight: '40vh',
})
const emit = defineEmits(['change', 'update:value'])

const { proxy } = getCurrentInstance() as any

const scrollTarget = ref(0)

// 数据项映射：id -> { ridx, item, parent }
const itemMaps: any = {}

const itmeHeight = ref(70)
const rows = ref<any[][]>([])
const rowIndex = ref(-1)
const rowChilds = ref<any[][]>([])
const rowChildHeights = ref<number[]>([])
const tops = ref<any[]>([])

const currentId = ref(props.value)
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

watch(() => props.option, (op) => {
  // console.log(op)
  if (!op || !op.list || op.list.length === 0)
    return

  // 常用
  tops.value = op.tops
  // 全部
  const dataList = op.list
  const rs: any[][] = []
  let ridx = 0
  // 构建行列数据，以及选中项
  for (let i = 0; i < dataList.length; i += props.column) {
    const ris = dataList.slice(i, i + props.column)
    ris.forEach((ri) => {
      itemMaps[ri[props.idKey]] = { ridx, item: ri }
      ri.childs.forEach((ric) => {
        itemMaps[ric[props.idKey]] = { ridx, item: ric, parent: ri }
      })
    })
    ridx++
    rs.push(ris)
    // 初始化每行子项集合
    rowChilds.value.push([])
    rowChildHeights.value.push(0)
  }
  rows.value = rs

  initSelected()
}, { immediate: true, deep: true })

watch(() => props.value, (newValue) => {
  if (!newValue)
    return

  selectedItem(newValue)
  scrollToTarget(newValue)
}, { immediate: true })

/**
 * 初始化选中项, 默认选中第一项
 */
function initSelected() {
  if (props.value)
    return

  let selected = props.value
  if (hasTop.value) {
    selected = tops.value[0][props.idKey]
  }
  else {
    const list = props.option.list ?? []
    if (!list.length)
      return
    selected = list[0][props.idKey]
  }
  console.log('initSelected', selected)
  selectedItem(selected)
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
function handleTopItemTap(item: any) {
  selectedItem(item[props.idKey])
}

/**
 * 列表项点击
 * @param item 列表项
 */
function handleListItemTap(item: any) {
  selectedItem(item[props.idKey])
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
  currentParentId.value = currentParent[props.idKey]

  // console.log(id, item, parent, 'base picker selected')
  emit('update:value', id)
  emit('change', { id, select: item, parent })
}

/**
 * 获取子项内容高度
 * @param rowIdx 行索引
 * @returns 子项内容高度
 */
function calcChildContentHeight(childs: any[]) {
  // console.log(rowIdx, rowIndex.value, childs.value, 'getChildContentHeight')
  if (!childs || childs.length < 1)
    return 0

  const row = Math.ceil(childs.length / props.column)
  let ih = row * itmeHeight.value + 16 // 16 为padding(p-2)
  ih = ih + ((row - 1) * 8) // 加上行间隔
  // console.log(row, ih, 'row')
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
          <view v-for="top in tops" :key="`top-${top[props.idKey]}`" @tap="handleTopItemTap(top)">
            <grid-picker-view-item
              :height="itmeHeight"
              :item="top"
              :is-selected="top[props.idKey] === currentId"
            />
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
            <view v-for="item in items" :id="`ITEM-${item[props.idKey]}`" :key="item[props.idKey]" @tap="handleListItemTap(item)">
              <grid-picker-view-item
                :height="itmeHeight"
                :expand="item[props.idKey] === currentParentId"
                :is-selected="item[props.idKey] === currentId"
                :item="item"
              />
            </view>
          </view>

          <view class="transition-all duration-300 ease-in-out">
            <view v-if="rowIdx === rowIndex" class="rounded-lg bg-gray-200 p-2" :style="{ ...itemsBoxStyle, height: `${rowChildHeights[rowIdx]}px` }">
              <view v-for="child in rowChilds[rowIdx]" :id="`ITEM-${child[props.idKey]}`" :key="child[props.idKey]" @tap="handleListItemTap(child)">
                <grid-picker-view-item
                  :height="itmeHeight"
                  :is-selected="child[props.idKey] === currentId"
                  :item="child"
                />
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
