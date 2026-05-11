<script setup lang="ts">
const emit = defineEmits(['confirm'])
const show = defineModel<boolean>()

function handleConfirmTap() {
  emit('confirm')
  show.value = false
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
    custom-style="border-radius: 16px 16px 0 0;"
    @close="() => show = false"
  >
    <view class="mbill-popup-toolbar">
      <!-- 取消按钮 -->
      <view class="mbill-popup-action mbill-popup-action-cancel" @tap="() => show = false">
        取消
      </view>
      <!-- 确定按钮 -->
      <view class="mbill-popup-action" @tap="handleConfirmTap">
        完成
      </view>
    </view>
    <slot />
  </wd-popup>
</template>

<style lang="scss" scoped>
.mbill-popup-toolbar {
  position: relative;
  display: flex;
  font-size: 16px;
  height: 54px;
  line-height: 16px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.mbill-popup-action {
  display: block;
  border: none;
  outline: none;
  font-size: 16px;
  color: #4d80f0;
  background: transparent;
  padding: 24px 15px 14px;
}

.mbill-popup-action-cancel {
  color: #666666;
}
</style>
