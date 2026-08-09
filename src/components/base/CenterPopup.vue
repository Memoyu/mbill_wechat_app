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
  showBtn?: boolean
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
  height?: string
}>(), {
  showBtn: true,
  showCancel: true,
  confirmText: '完成',
  cancelText: '取消',
})

const emit = defineEmits<{
  (e: 'after-enter'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
const show = defineModel<boolean>()

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
    lock-scroll
    lazy-render
    position="center"
    transition="fade-up"
    custom-class="relative rounded-3xl w-90vw"
    :custom-style="(height ? `height: ${height}` : '')"
    @close="show = false"
    @after-enter="emit('after-enter')"
  >
    <view class="h-full">
      <view class="sticky left-0 right-0 top-0 z-10 bg-white py-3">
        <!-- 标题 -->
        <view class="text-center">
          <text class="line-clamp-1 text-base font-semibold">{{ title }}</text>
        </view>
        <!-- 标题插槽 -->
        <slot name="title" />
      </view>

      <!-- 内容插槽 -->
      <view>
        <slot />
      </view>

      <!-- 按钮组 -->
      <view class="sticky bottom-0 left-0 right-0 z-10 bg-white">
        <view v-if="showBtn" class="mt-3 flex">
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
    </view>
  </wd-popup>
</template>

<style scoped>
:deep(.wd-popup) {
  overflow: hidden;
}
</style>
