<script lang="ts" setup>
defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  title?: string
  content?: string
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
  danger?: boolean
}>(), {
  showCancel: true,
  confirmText: '完成',
  cancelText: '取消',
  danger: false,
})
const emit = defineEmits<{
  (e: 'after-enter'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
const show = defineModel<boolean>()
</script>

<template>
  <center-popup
    v-model="show" :title="title"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    :show-cancel="showCancel"
    :danger="danger"
    @confirm="emit('confirm')"
    @cancel="emit('cancel')"
    @after-enter="emit('after-enter')"
  >
    <view class="flex items-center justify-center px-3">
      <text class="text-center">{{ content }}</text>
    </view>
  </center-popup>
</template>

<style lang="scss" scoped>

</style>
