<script setup lang="ts">
import { useToast } from 'wot-design-uni'
import { useLedgerPickerStore, useLedgerStore } from '@/store'

const props = defineProps<{
  value: string
}>()
const emit = defineEmits(['change', 'update:value'])
const show = defineModel<boolean>()
const innerValue = ref()

const toast = useToast()
const ledgerStore = useLedgerStore()
const ledgerPickerStore = useLedgerPickerStore()

const ledgers = computed(() => {
  return ledgerStore.ledgers
})

const isAllSelected = computed(() => {
  return ledgerPickerStore.isAllSelected
})

watch(() => props.value, (val) => {
  if (val) {
    innerValue.value = val
  }
})

function handleLedgerItemClick(item) {
  console.log('点击')
  ledgerPickerStore.toggleLedgerSelection(item.ledgerId)
}

function handleCancelClick() {
  show.value = false
  // 恢复初始值
  innerValue.value = props.value
}

function handleAllSelectClick() {
  ledgerPickerStore.selectAllLedgers()
}

function handleScanClick() {
  // 扫码加入账本页
  uni.scanCode({
    success(res) {
      console.log(`条码类型：${res.scanType}`)
      console.log(`条码内容：${res.result}`)
    },
    fail(e) {
      toast.show(`错误： ${e}`)
    },
  })
}

function handleManageClick() {
  // 账本管理页
}
</script>

<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :close-on-click-modal="true"
    :safe-area-inset-bottom="true"
    custom-class="rounded-t-3xl relative h-60vh"
    lock-scroll
    @close="handleCancelClick"
  >
    <view class="h-full overflow-auto">
      <!-- 标题栏 -->
      <view
        class="sticky left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3"
      >
        <text class="text-base font-semibold">账本</text>

        <view class="flex items-center space-x-4">
          <view class="title-icon-box flex px-3" @click="handleAllSelectClick">
            <text v-if="isAllSelected" class="iconfont icon-close title-icon" />
            <text v-else class="iconfont icon-check title-icon" />
            <text class="ml-2 text-sm">{{ isAllSelected ? '取消全选' : '全选' }}</text>
          </view>

          <view class="title-icon-box" @click="handleScanClick">
            <view class="iconfont icon-scan title-icon" />
          </view>
          <view class="title-icon-box" @click="handleManageClick">
            <view class="iconfont icon-manage title-icon" />
          </view>
        </view>
      </view>
      <view class="relative p-3">
        <view class="grid grid-cols-2 gap-3">
          <ledger-box v-for="leg in ledgers" :key="leg.ledgerId" :data="leg" @tap="handleLedgerItemClick(leg)">
            <!-- 选中效果遮罩 -->
            <template #action>
              <view
                class="absolute inset-0 z-10 rounded-2xl transition-all duration-200"
                :class="[
                  ledgerPickerStore.isLedgerSelected(leg.ledgerId)
                    ? 'bg-indigo-500/10 ring-2 ring-indigo-500'
                    : 'bg-transparent',
                ]"
              >
                <!-- 选中状态的 check 图标 -->
                <view
                  v-if="ledgerPickerStore.isLedgerSelected(leg.ledgerId)"
                  class="absolute bottom-3 right-3 h-5 w-5 flex animate-fade-in animate-duration-200 items-center justify-center rounded-full bg-indigo-500 shadow-sm"
                >
                  <text class="iconfont icon-check text-xs text-white" />
                </view>
              </view>
            </template>
          </ledger-box>
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.title-icon-box {
  @apply:flex items-center justify-center rounded-full bg-gray-50 p-2;
}
.title-icon {
  @apply: text-20px text-gray-700;
}
</style>
