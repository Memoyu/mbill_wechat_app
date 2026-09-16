<script setup lang="ts">
import type { ActionItem } from '@/typings'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  title?: string
  showBtn?: boolean
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
  height?: string
  autoHeight?: boolean
  actions?: ActionItem[]
}>(), {
  showBtn: true,
  showCancel: false,
  confirmText: '完成',
  cancelText: '取消',
  height: '60vh',
})
const emit = defineEmits<{
  (e: 'after-enter'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
const show = defineModel<boolean>()

const innerActions = ref<ActionItem[]>([])

watch(() => props.actions, (val) => {
  innerActions.value = val ?? []
}, { immediate: true })

function handleCancel() {
  emit('cancel')
  show.value = false
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :hide-when-close="false"
    :close-on-click-modal="true"
    :safe-area-inset-bottom="true"
    lazy-render
    custom-class="rounded-t-3xl relative"
    :custom-style="(height && !autoHeight ? `height: ${height}` : '')"
    @close="() => show = false"
    @after-enter="emit('after-enter')"
  >
    <view
      class="sticky left-0 right-0 top-0 z-10 border-b border-gray-100 bg-white py-3"
    >
      <view class="flex items-center justify-between px-4">
        <text class="line-clamp-1 text-base font-semibold">
          {{ title }}
        </text>
        <view class="flex items-center space-x-4">
          <!-- 操作插槽 -->
          <slot name="action" />
          <view v-if="showBtn" class="flex items-center space-x-4">
            <!-- 自定义按钮 -->
            <view
              v-for="(action, index) in innerActions" :key="index + action.text"
              class="bottom-popup-action-btn text-gray-400"
              :class="[action.type === 'danger' ? 'text-red-500' : action.type === 'warning' ? 'text-yellow-500' : 'text-gray-500']"
              :hover-class="action.type === 'danger' ? 'bg-red-50' : action.type === 'warning' ? 'bg-yellow-50' : 'bg-gray-50'"
              :hover-start-time="0"
              :hover-stay-time="200"
              @tap="action.action && action.action()"
            >
              {{ action.text }}
            </view>

            <!-- 取消按钮 -->
            <view
              v-if="showCancel"
              class="bottom-popup-action-btn text-gray-400"
              hover-class="bg-gray-50"
              :hover-start-time="0"
              :hover-stay-time="200"
              @tap="handleCancel"
            >
              {{ cancelText }}
            </view>
            <!-- 确定按钮 -->
            <view
              class="bottom-popup-action-btn text-indigo-500"
              hover-class="bg-gray-50"
              :hover-start-time="0"
              :hover-stay-time="200"
              @tap="handleConfirm"
            >
              {{ confirmText }}
            </view>
          </view>
        </view>
      </view>
      <slot name="title" />
    </view>
    <slot />
  </wd-popup>
</template>

<style lang="scss" scoped>
.bottom-popup-action-btn {
  @apply rounded-full px-3 py-1 text-base;
}
</style>
