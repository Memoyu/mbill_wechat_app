<script setup lang="ts">
import { getRect } from '@wot-ui/ui/common/util'

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
  idKey?: string
  scrollHeight?: string
  itmeHeight?: number
  column?: number
  showManage?: boolean
}>(), {
  idKey: 'id',
  showManage: true,
  column: 5,
  itmeHeight: 68,
  scrollHeight: '40vh',
})
const emit = defineEmits(['change', 'manage'])
const model = defineModel({ default: '' })

const $manage = 'manage'
const { proxy } = getCurrentInstance() as any

const scrollTop = ref(0)

// 数据项映射：id -> { ridx, item, parent }
const itemMaps: any = {}

const itmeHeight = ref(70)
const rows = ref<any[][]>([])
const rowIndex = ref(-1)
const rowChilds = ref<any[]>([])
const tops = ref<any[]>([])

const currentId = ref()
const currentParentId = ref()
const noScroll = ref(false)

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
  tops.value = [...op.tops]
  // 全部
  const dataList = [...op.list]
  if (props.showManage)
    dataList.push({ [props.idKey]: $manage, name: '编辑', icon: 'icon-plus' })
  const rs: any[][] = []
  let ridx = 0
  // 构建行列数据，以及选中项
  for (let i = 0; i < dataList.length; i += props.column) {
    const ris = dataList.slice(i, i + props.column)
    ris.forEach((ri) => {
      itemMaps[ri[props.idKey]] = { ridx, item: ri }
      ri.childs?.forEach((ric) => {
        itemMaps[ric[props.idKey]] = { ridx, item: ric, parent: ri }
      })
    })
    ridx++
    rs.push(ris)
  }
  rows.value = rs
  // console.log(rows.value, 'rows')
}, { immediate: true, deep: true })

watch(() => model.value, (newValue) => {
  if (!newValue)
    return

  updateActive(newValue)
  scrollIntoView()
}, { immediate: true })

onMounted(() => {
  nextTick(() => {
    initSelected()
  })
})

/**
 * 初始化选中项, 默认选中第一项
 */
function initSelected() {
  if (model.value)
    return

  let selected = model.value
  if (hasTop.value) {
    noScroll.value = true
    selected = tops.value[0][props.idKey]
  }
  else {
    const list = props.option.list ?? []
    if (!list.length)
      return
    selected = list[0][props.idKey]
  }
  // console.log('initSelected', selected)
  setActive(selected)
}

/**
 * 滚动选中项到可视区域居中
 */
function scrollIntoView() {
  if (noScroll.value)
    return

  nextTick(() => {
    // 延时让动画更顺畅点
    setTimeout(() => {
      Promise.all([
        getRect('#PICAKER-CONTAINER', false, proxy),
        getRect(`#ITEM-${currentId.value}`, false, proxy),
      ]).then(([containerRect, itemRect]) => {
        // item 相对于父容器的 top
        const relativeTop = itemRect.top - containerRect.top
        scrollTop.value = relativeTop - itemRect.height / 2
        // console.log('容器rect:', containerRect, 'item rect:', itemRect, '相对容器top:', relativeTop)
      })
    }, 800)
  })
  noScroll.value = false
}

/**
 * 列表项点击
 * @param item 列表项
 */
function handleItemTap(item: any) {
  const id = item[props.idKey]
  // 管理按钮不触发选中
  if (id === $manage) {
    emit('manage')
    return
  }

  noScroll.value = true
  setActive(id)
}

/**
 * 选中项处理
 * @param id 选中项id
 */
function setActive(id: string) {
  const { item, parent } = updateActive(id)

  // console.log(id, item, parent, 'base picker selected')
  model.value = id
  emit('change', { id, select: item, parent })
}

function updateActive(id: string) {
  const map = itemMaps[id]
  if (!map)
    return

  const { item, parent } = map
  let rowIdx = map.ridx

  // 赋值子项集合，确定展开row
  const currentParent = parent || item
  if (currentParent.childs && currentParent.childs.length > 0) {
    rowChilds.value = currentParent.childs
  }
  else {
    // 子节点为空时，收起展开内容
    rowIdx = -1
  }
  rowIndex.value = rowIdx
  currentId.value = id
  currentParentId.value = currentParent[props.idKey]

  return map
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
  <scroll-view
    id="PICAKER-CONTAINER"
    scroll-y
    :style="{ height: scrollHeight }"
    :scroll-top="scrollTop"
    scroll-with-animation
    class="relative"
  >
    <view class="p-2">
      <!-- 常用项 -->
      <view v-if="hasTop">
        <view class="pb-2 font-semibold">
          常用
        </view>
        <view :style="itemsBoxStyle">
          <view v-for="top in tops" :key="`top-${top[props.idKey]}`" @tap="handleItemTap(top)">
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
            <view v-for="item in items" :id="`ITEM-${item[props.idKey]}`" :key="`parent-${item[props.idKey]}`" @tap="handleItemTap(item)">
              <grid-picker-view-item
                :height="itmeHeight"
                :expand="item[props.idKey] === currentParentId"
                :is-selected="item[props.idKey] === currentId"
                :item="item"
                :css-icon="item[props.idKey] === $manage"
              />
            </view>
          </view>

          <view class="transition-all duration-300 ease-in-out">
            <view v-if="rowIdx === rowIndex" class="rounded-lg bg-gray-200 p-2" :style="{ ...itemsBoxStyle, height: `${calcChildContentHeight(rowChilds)}px` }">
              <view v-for="child in rowChilds" :id="`ITEM-${child[props.idKey]}`" :key="`child-${child[props.idKey]}`" @tap="handleItemTap(child)">
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
