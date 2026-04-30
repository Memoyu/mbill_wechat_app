<script setup lang="ts">
import { useCategoryStore } from '@/store'

const props = defineProps<{
  type: number
  height: number
}>()

const categoryStore = useCategoryStore()

const list = ref(props.type === 0 ? categoryStore.expends : categoryStore.incomes)
</script>

<template>
  <scroll-view scroll-y :style="{ height: `${height}px` }">
    <view class="flex flex-wrap justify-center gap-4 p-4">
      <view v-for="item in list" :key="item.categoryId" class="inline-block">
        <view class="h-80px w-60px flex flex-col items-center rounded-lg bg-indigo-50 p-2">
          <wd-img :width="30" round :height="30" :src="item.icon" />
          <view class="category-item-title">
            {{ item.name }}
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="sass" scoped>
</style>
