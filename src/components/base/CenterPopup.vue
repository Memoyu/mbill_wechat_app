<script lang="ts" setup>
const props = defineProps<{
  title: string
  danger?: boolean
}>()

const emit = defineEmits<{
  (e: 'beforeConfirm', done: (pass: boolean) => void): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
const show = defineModel<boolean>()

function handleCancel() {
  emit('cancel')
  show.value = false
}

function handleConfirm() {
  emit('beforeConfirm', (pass) => {
    if (!pass)
      return

    emit('confirm')
    show.value = false
  })
}
</script>

<template>
  <wd-popup
    lock-scroll
    custom-class="rounded-3xl w-[300px] overflow-hidden"
    position="center"
    :model-value="modelValue"
    transition="fade-up"
    @close="show = false"
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
          class="flex-1 border-t border-gray-100 py-4 text-center text-base text-gray-600 transition-colors hover:bg-gray-50"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="handleCancel()"
        >
          取消
        </view>
        <view class="w-[1px] bg-gray-100" />
        <view
          class="flex-1 border-t border-gray-100 py-4 text-center text-base font-medium transition-colors"
          :class="[danger ? 'text-red-500' : 'text-indigo-500 ']"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="handleConfirm()"
        >
          确定
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
