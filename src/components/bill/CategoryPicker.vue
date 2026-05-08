<script setup lang="ts">
import { it } from 'node:test'
import { useCategoryStore } from '@/store'

const props = withDefaults(defineProps<{
  type: number
  height: number
  column?: number
}>(), {
  column: 4,
})

const { proxy } = getCurrentInstance() as any
const categoryStore = useCategoryStore()

const categories = ref(props.type === 0 ? categoryStore.expends : categoryStore.incomes)
const group = ref(getColumnList())
const childs = ref()
const childIndex = ref(0)
const expand = ref(false)
const childHeight = ref(0)
const selected = ref()

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
  <scroll-view scroll-y :style="{ height: `${height}px` }">
    <view class="py-3">
      <view v-for="(items, index) in group" :key="index" class="mb-2 flex flex-col" :class="{}">
        <wd-row :gutter="10" justify="space-between">
          <wd-col v-for="item in items" :key="item.categoryId" :span="6" @tap="handleCategoryGroupTap(item, index)">
            <view class="flex flex-col items-center rounded-lg py-3">
              <wd-img :width="30" round :height="30" :src="item.icon" />
              <view class="category-item-title">
                {{ item.name }}
              </view>
            </view>
          </wd-col>
        </wd-row>
        <view

          class="childs-category-box mx-3 rounded-lg bg-gray-200"
          :style="{ height: childIndex === index && childs && childs.length > 0 && expand ? `${childHeight}px` : '0px' }"
        >
          <view :id="`CATEGORY-CHILDS-${index}`" class="p-2">
            <view class="grid grid-cols-4 gap-2">
              <view
                v-for="item in childs" :key="item.categoryId"
                class="flex flex-col items-center rounded-lg py-3"
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
}

.category-item-title {
  font-size: 12px;
}
</style>
