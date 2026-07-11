<script lang="ts" setup>
defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  title: string
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
}>(), {
  showCancel: true,
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
    lock-scroll
    custom-class="rounded-3xl w-90vw overflow-hidden"
    position="center"
    :model-value="modelValue"
    transition="fade-up"
    @close="show = false"
    @after-enter="emit('after-enter')"
  >
    <view v-if="modelValue" class="flex flex-col overflow-hidden">
      <!-- 标题 -->
      <view class="px-6 pt-6 text-center">
        <text class="text-lg text-gray-800 font-semibold">{{ title }}</text>
      </view>

      <!-- 内容插槽 -->
      <slot />

      <!-- 按钮组 -->
      <view class="mt-4 flex">
        <view
          v-if="showCancel"
          class="flex-1 border-t border-gray-100 py-4 text-center text-base text-gray-600 transition-colors hover:bg-gray-50"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="handleCancel()"
        >
          {{ cancelText }}
        </view>
        <view v-if="showCancel" class="w-[1px] bg-gray-100" />
        <view
          class="flex-1 border-t border-gray-100 py-4 text-center text-base text-indigo-500 font-medium transition-colors"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="handleConfirm()"
        >
          {{ confirmText }}
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<style scoped>
:deep(.wd-popup) {
  overflow: hidden;
}
</style>
