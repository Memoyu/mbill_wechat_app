<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
}>(), {
  showCancel: false,
  confirmText: '完成',
  cancelText: '取消',
})
const emit = defineEmits<{
  (e: 'after-enter'): void
  (e: 'confirm', check: (pass: boolean) => void): void
  (e: 'cancel'): void
}>()
const show = defineModel<boolean>()

function handleCancel() {
  emit('cancel')
  show.value = false
}

function handleConfirm() {
  emit('confirm', (pass) => {
    if (!pass)
      return

    show.value = false
  })
}
</script>

<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :hide-when-close="false"
    :close-on-click-modal="true"
    :safe-area-inset-bottom="true"
    root-portal
    lazy-render
    custom-class="rounded-t-3xl relative h-60vh"
    @close="() => show = false"
    @after-enter="emit('after-enter')"
  >
    <view class="h-full overflow-auto">
      <view
        class="sticky left-0 right-0 top-0 z-10 border-b border-gray-100 bg-white px-4 py-3"
      >
        <view class="flex items-center justify-between">
          <text class="line-clamp-1 text-base font-semibold">
            {{ title }}
          </text>
          <view class="flex items-center space-x-6">
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
        <slot name="title" />
      </view>
      <slot />
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.bottom-popup-action-btn {
  @apply flex-shrink-0 rounded-full px-3 py-1 text-base;
}
</style>
