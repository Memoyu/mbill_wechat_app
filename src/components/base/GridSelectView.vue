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
  hasIcon?: boolean
}>(), {
  column: 5,
  hasIcon: true,
})
const emit = defineEmits(['change'])

const { proxy } = getCurrentInstance() as any
const scrollHeight = ref(props.height)
const columns = ref()
const columnIndex = ref(0)
const childs = ref()
const childHeight = ref(0)
const expand = ref(false)
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
  initColumnList(list)
}, { deep: true })

function initColumnList(list) {
  const cols = []
  const ls = list ?? []
  // console.log(ls, 'ls')
  for (let i = 0; i < ls.length; i += props.column) {
    cols.push(ls.slice(i, i + props.column))
  }
  // console.log(cols)
  columns.value = cols
}

function handleColumnItemTap(item: any, index: number) {
  childs.value = item.childs
  nextTick(() => {
    uni
      .createSelectorQuery()
      .in(proxy)
      .select(`#GRID-CHILDS-${index}`)
      .boundingClientRect((view: UniApp.NodeInfo) => {
        // console.log(view, 'boundingClientRect')
        childHeight.value = view?.height ?? 0
      })
      .exec()
  })

  if (columnIndex.value !== index) {
    expand.value = true
  }
  else {
    // console.log(selected.value, item)
    expand.value = selected.value?.id === item.id ? !expand.value : true
  }

  selected.value = item
  columnIndex.value = index
  emit('change', item)
}

function handleItemTap(item: any) {
  selected.value = item
  emit('change', item)
}
</script>

<template>
  <scroll-view scroll-y :style="{ height: `${scrollHeight}px` }">
    <view class="p-2">
      <view v-for="(items, index) in columns" :key="index" class="flex flex-col">
        <view :style="itemsBoxStyle">
          <view
            v-for="item in items" :key="item.id"
            class="my-2"
            :class="[selected?.id === item.id ? 'grid-select-item-selected' : '']"
            @tap="handleColumnItemTap(item, index as number)"
          >
            <view v-if="hasIcon" class="grid-select-item-box-has-icon">
              <view :class="[item.childs && item.childs.length > 1 ? 'grid-select-parent-more' : '']">
                <wd-img :width="30" round :height="30" :src="item.icon" />
              </view>
              <view class="grid-select-item-title">
                {{ item.name }}
              </view>
            </view>
            <view
              v-else
              class="grid-select-item-box"
              :class="[item.childs && item.childs.length > 1 ? 'grid-select-parent-more' : '']"
            >
              <view class="grid-select-item-title">
                {{ item.name }}
              </view>
            </view>
          </view>
        </view>

        <view
          class="grid-select-childs-box rounded-lg bg-gray-200"
          :style="{ height: columnIndex === index && childs && childs.length > 0 && expand ? `${childHeight}px` : '0px' }"
        >
          <view :id="`GRID-CHILDS-${index}`" class="p-2">
            <view :style="itemsBoxStyle">
              <view
                v-for="item in childs" :key="item.id"
                :class="[selected.id === item.id ? 'grid-select-item-selected' : '']"
                @tap="handleItemTap(item)"
              >
                <view v-if="hasIcon" class="grid-select-item-box-has-icon">
                  <wd-img :width="30" round :height="30" :src="item.icon" />
                  <view class="grid-select-item-title">
                    {{ item.name }}
                  </view>
                </view>
                <view v-else class="grid-select-item-box">
                  <view class="grid-select-item-title">
                    {{ item.name }}
                  </view>
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
.grid-select-parent-more {
  position: relative;
  &:before {
    content: '';
    position: absolute;
    color: white;
    right: -6px;
    bottom: 0;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    z-index: 9;
    border: 3px solid white;
    @apply: bg-indigo-300;
  }
}

.grid-select-item-box {
  @apply: font-bold rounded-lg py-3 px-2 bg-indigo-300/20;
}

.grid-select-item-box-has-icon {
  @apply: flex flex-col items-center py-2;
}

.grid-select-item-title {
  font-size: 12px;
  @apply: line-clamp-1 text-nowrap text-center;
}

.grid-select-item-selected {
  @apply: rounded-lg bg-indigo-300/30;
}

.grid-select-childs-box {
  height: 0px;
  transition: height 0.3s ease-in-out;
  overflow: hidden;
}
</style>
