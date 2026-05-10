<script setup lang="ts">
import { useCategoryStore } from '@/store'

const props = withDefaults(defineProps<{
  type: number
  height: number
  column?: number
}>(), {
  column: 5,
})

const { proxy } = getCurrentInstance() as any
const categoryStore = useCategoryStore()

const categories = ref(props.type === 0 ? categoryStore.expends : categoryStore.incomes)
const scrollHeight = ref(props.height)
const group = ref(getColumnList())
const childs = ref()
const childIndex = ref(0)
const expand = ref(false)
const childHeight = ref(0)
const selected = ref()

const itemsBoxClass = computed(() => {
  return [
    'grid gap-2',
    `grid-cols-5`, // 固定写5列
  ]
})

watch(() => props.height, (nh) => {
  scrollHeight.value = nh
  console.log(scrollHeight.value, 'scrollHeight')
})

function getColumnList() {
  const list = []
  const cs = categories.value
  for (let i = 0; i < cs.length; i += props.column) {
    list.push(cs.slice(i, i + props.column))
  }
  console.log(list)
  return list
}

function handleCategoryGroupTap(item: any, index: number) {
  childs.value = item.childs
  nextTick(() => {
    uni
      .createSelectorQuery()
      .in(proxy)
      .select(`#CATEGORY-CHILDS-${index}`)
      .boundingClientRect((view: UniApp.NodeInfo) => {
        // console.log(view, 'boundingClientRect')
        childHeight.value = view?.height ?? 0
      })
      .exec()
  })

  if (childIndex.value !== index) {
    expand.value = true
  }
  else {
    expand.value = selected.value?.categoryId === item.categoryId ? !expand.value : true
  }

  selected.value = item
  childIndex.value = index
}

function handleCategoryItemTap(item: any) {
  selected.value = item
}
</script>

<template>
  <scroll-view scroll-y :style="{ height: `${scrollHeight}px` }">
    <view class="p-2">
      <view v-for="(items, index) in group" :key="index" class="flex flex-col">
        <view :class="itemsBoxClass">
          <view
            v-for="item in items" :key="item.categoryId"
            class="flex flex-col items-center rounded-lg py-2"
            :class="[selected?.categoryId === item.categoryId ? 'category-selected' : '']"
            @tap="handleCategoryGroupTap(item, index)"
          >
            <view :class="[item.childs && item.childs.length > 1 ? 'parent-category-icon' : '']">
              <wd-img :width="30" round :height="30" :src="item.icon" />
            </view>
            <view class="category-item-title">
              {{ item.name }}
            </view>
          </view>
        </view>

        <view
          class="childs-category-box rounded-lg bg-gray-200"
          :style="{ height: childIndex === index && childs && childs.length > 0 && expand ? `${childHeight}px` : '0px' }"
        >
          <view :id="`CATEGORY-CHILDS-${index}`" class="p-2">
            <view :class="itemsBoxClass">
              <view
                v-for="item in childs" :key="item.categoryId"
                class="flex flex-col items-center rounded-lg py-2"
                :class="[selected.categoryId === item.categoryId ? 'category-selected' : '']"
                @tap="handleCategoryItemTap(item)"
              >
                <wd-img :width="30" round :height="30" :src="item.icon" />
                <view class="category-item-title">
                  {{ item.name }}
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
.childs-category-box {
  height: 0px;
  transition: height 0.3s ease-in-out;
  overflow: hidden;
  margin-top: 5px;
}
.parent-category-icon {
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

.category-item-title {
  font-size: 12px;
}
.category-selected {
  @apply: bg-indigo-300/30;
}
</style>
