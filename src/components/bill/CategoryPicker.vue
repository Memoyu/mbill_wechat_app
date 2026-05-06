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

const categoryStore = useCategoryStore()

const categories = ref(props.type === 0 ? categoryStore.expends : categoryStore.incomes)
const group = ref(getColumnList())
const childs = ref()
const childIndex = ref(0)

function getColumnList() {
  const list = []
  const cs = categories.value
  for (let i = 0; i < cs.length; i += props.column) {
    list.push(cs.slice(i, i + props.column))
  }
  console.log(list)
  return list
}
</script>

<template>
  <scroll-view scroll-y :style="{ height: `${height}px` }">
    <view class="py-3">
      <view v-for="(items, index) in group" :key="index" class="mb-2 flex flex-col">
        <wd-row :gutter="10" justify="space-between">
          <wd-col v-for="item in items" :key="item.categoryId" :span="6" @tap=" childs = item.childs; childIndex = index">
            <view class="flex flex-col items-center rounded-lg py-3">
              <wd-badge custom-class="badge" :value="11" shape="square">
                <wd-img :width="30" round :height="30" :src="item.icon" />
              </wd-badge>
              <view class="category-item-title">
                {{ item.name }}
              </view>
            </view>
          </wd-col>
        </wd-row>
        <view v-if="childIndex === index && childs && childs.length > 0" class="mx-3 my-2 rounded-lg bg-gray-200 p-2">
          <view class="grid grid-cols-4 gap-2">
            <view
              v-for="item in childs" :key="item.categoryId"
              class="flex flex-col items-center rounded-lg py-3"
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
  </scroll-view>
</template>

<style lang="scss" scoped>
:deep(.badge) {
  margin: 0 30px 20px 0;
  display: inline-block;
}
</style>
