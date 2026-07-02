<script setup lang="ts">
import type { ActionGroup } from '@/typings'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  title: string
  items: ActionGroup[]
}>()
const emit = defineEmits(['action'])
const show = defineModel<boolean>()

function handleCancelClick() {
  show.value = false
}

function handleActionClick(item: any) {
  // console.log(item)
  show.value = false
  item.action()
  emit('action', item.value)
}
</script>

<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :close-on-click-modal="true"
    :safe-area-inset-bottom="true"
    custom-class="rounded-t-3xl relative"
    lock-scroll
    lazy-render
    root-portal
    @close="handleCancelClick"
  >
    <view class="overflow-hidden">
      <!-- 标题栏 -->
      <view class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <text class="line-clamp-1 text-base font-semibold">{{ title }}</text>
        <view
          class="flex-shrink-0 rounded-full px-3 py-1 text-sm text-gray-400"
          hover-class="bg-gray-50"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="handleCancelClick"
        >
          关闭
        </view>
      </view>

      <!-- 操作按钮列表 -->
      <view class="py-4">
        <view v-for="(item, index) in items" :key="index" class="mb-6">
          <view v-if="item.title && item.title.length > 0" class="mb-2 px-6">
            <text class="text-sm text-gray-400">{{ item.title }}</text>
          </view>
          <view class="grid grid-cols-4 gap-6 px-6">
            <view
              v-for="action in item.actions"
              :key="action.text"
              class="flex flex-col items-center gap-2"
              hover-class="opacity-60"
              :hover-start-time="0"
              :hover-stay-time="200"
              @tap="handleActionClick(action)"
            >
              <view
                class="h-12 w-12 flex items-center justify-center rounded-3"
                :class="[action.type === 'danger' ? 'bg-red-50' : action.type === 'warning' ? 'bg-yellow-50' : 'bg-gray-50']"
              >
                <view class="text-xl" :class="[action.icon, action.type === 'danger' ? 'text-red-500' : action.type === 'warning' ? 'text-yellow-500' : 'text-gray-500']" />
              </view>
              <text
                class="whitespace-nowrap text-xs"
                :class="[action.type === 'danger' ? 'text-red-700' : action.type === 'warning' ? 'text-yellow-700' : 'text-gray-700']"
              >
                {{ action.text }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped></style>
