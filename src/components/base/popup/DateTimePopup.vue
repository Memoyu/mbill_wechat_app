<script setup lang="ts">
import type { DateTimeType } from 'wot-design-uni/components/wd-datetime-picker-view/types'

const props = withDefaults(defineProps<{
  date: number
  type?: DateTimeType
}>(), {
  type: 'datetime',
})
const emit = defineEmits(['change', 'update:date'])
const show = defineModel<boolean>()
const innerDate = ref(Date.now())

watch(() => props.date, (val) => {
  if (val) {
    innerDate.value = val
  }
})

function handleDateChange(val) {

}

function handleConfirmClick() {
  emit('change', { value: innerDate.value })
  emit('update:date', innerDate.value)
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
    custom-style="border-radius: 16px 16px 0 0;"
    @close="() => show = false"
  >
    <view class="datetime-picker-toolbar">
      <!-- 取消按钮 -->
      <view class="datetime-picker-action datetime-picker-action-cancel" @click="() => show = false">
        取消
      </view>
      <!-- 确定按钮 -->
      <view class="datetime-picker-action" @click="handleConfirmClick">
        完成
      </view>
    </view>
    <wd-datetime-picker-view v-model="innerDate" :type="type" @change="handleDateChange" />
  </wd-popup>
</template>

<style lang="scss" scoped>
.datetime-picker-toolbar {
  position: relative;
  display: flex;
  font-size: var(--wot-picker-toolbar-fs, var(--wot-fs-title, 16px));
  height: var(--wot-picker-toolbar-height, 54px);
  line-height: var(--wot-picker-action-height, 16px);
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.datetime-picker-action {
  display: block;
  border: none;
  outline: none;
  font-size: var(--wot-picker-toolbar-fs, var(--wot-fs-title, 16px));
  color: var(--wot-picker-toolbar-finish-color, var(--wot-color-theme, #4d80f0));
  background: transparent;
  padding: 24px 15px 14px;
}

.datetime-picker-action-cancel {
  color: var(--wot-picker-toolbar-cancel-color, #666666);
}
</style>
