<script setup lang="ts">
const props = defineProps<{
  value: string
}>()
const emit = defineEmits(['change', 'update:value'])
const show = defineModel<boolean>()
const innerValue = ref()
const ledgers = ref([{
  ledgerId: '2323234341',
  name: '日常账本字符222222233333333',
}, {
  ledgerId: '2323234342',
  name: '学习账单',
}, {
  ledgerId: '2323234343',
  name: '开店账单',
}, {
  ledgerId: '2323234344',
  name: '开店账单',
}, {
  ledgerId: '2323234345',
  name: '开店账单',
}, {
  ledgerId: '2323234346',
  name: '开店账单',
}, {
  ledgerId: '2323234347',
  name: '开店账单',
}, {
  ledgerId: '2323234348',
  name: '开店账单',
}, {
  ledgerId: '2323234349',
  name: '开店账单',
}, {
  ledgerId: '2323234350',
  name: '开店账单',
}])

watch(() => props.value, (val) => {
  if (val) {
    innerValue.value = val
  }
})

function handleConfirmClick() {
  const ledger = ledgers.value.find(item => item.ledgerId === innerValue.value)
  emit('change', ledger)
  emit('update:value', innerValue.value)
  show.value = false
}

function handleCancelClick() {
  show.value = false
  // 恢复初始值
  innerValue.value = props.value
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
    custom-style="height: 60%;border-radius: 16px 16px 0 0;"
    @close="handleCancelClick"
  >
    <view class="relative">
      <view class="ledger-picker-toolbar">
        <!-- 取消按钮 -->
        <view class="ledger-picker-action ledger-picker-action-cancel" @click="handleCancelClick">
          取消
        </view>
        <!-- 确定按钮 -->
        <view class="ledger-picker-action" @click="handleConfirmClick">
          完成
        </view>
      </view>
      <view class="relative flex flex-col gap-4 p-3">
        <view class="grid grid-cols-2 gap-3">
          <ledger-box v-for="leg in ledgers" :key="leg.ledgerId" :data="leg" />
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.ledger-picker-toolbar {
  position: sticky;
  left: 0;
  top: 0;
  z-index: 5;
  display: flex;
  font-size: 16px;
  height: 54px;
  line-height: 16px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-radius: 16px 16px 0 0;
  @apply: bg-white;
}

.ledger-picker-action {
  display: block;
  border: none;
  outline: none;
  font-size: 16px;
  color: #4d80f0;
  background: transparent;
  padding: 24px 15px 14px;
}

.ledger-picker-action-cancel {
  color: #666666;
}
</style>
