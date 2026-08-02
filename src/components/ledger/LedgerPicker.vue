<script setup lang="ts">
import type { ILedger } from '@/api/types/ledger'
import { useDialog, useToast } from '@wot-ui/ui'
import { useLedgerPickerStore, useLedgerStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  value?: string
  single?: boolean
}>(), {
  single: false,
})
const emit = defineEmits(['change'])
const show = defineModel<boolean>()

const dialog = useDialog()
const toast = useToast()
const ledgerStore = useLedgerStore()
const ledgerPickerStore = useLedgerPickerStore()

const currentLedgerId = ref()

watch(() => props.value, (val) => {
  currentLedgerId.value = val
})

const ledgers = computed(() => {
  return ledgerStore.ledgers
})

const isAllSelected = computed(() => {
  return ledgerPickerStore.isAllSelected
})

function handleLedgerItemClick(item: ILedger) {
  // console.log('点击')
  if (props.single) {
    currentLedgerId.value = item.ledgerId
    emit('change', item)
  }
  else {
    ledgerPickerStore.toggleLedgerSelection(item.ledgerId)
    emit('change', ledgerPickerStore.selectedLedgers)
  }
}

function handleCancelClick() {
  show.value = false
}

function handleAllSelectClick() {
  ledgerPickerStore.selectAllLedgers()
}

function handleScanClick() {
  uni.scanCode({
    success(res) {
      // console.log(`条码类型：${res.scanType}`)
      // console.log(`条码内容：${res.result}`)
      ledgerStore.joinLedger(dialog, toast, res.result)
    },
    fail(e) {
      console.log(`扫码错误：${e}`)
    },
  })
}

function handleManageClick() {
  // 账本管理页
  uni.navigateTo({
    url: '/pages/ledger/index',
  })
}

function isSelected(ledger: ILedger) {
  if (props.single) {
    return currentLedgerId.value === ledger.ledgerId
  }
  else {
    return ledgerPickerStore.isLedgerSelected(ledger.ledgerId)
  }
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
    lazy-render
    @close="handleCancelClick"
  >
    <view class="h-full overflow-auto">
      <!-- 标题栏 -->
      <view
        class="sticky left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3"
      >
        <text class="text-base font-semibold">账本</text>

        <view class="flex items-center space-x-4">
          <view v-if="!single" class="title-icon-box" @tap="handleAllSelectClick">
            <wd-icon v-if="isAllSelected" name="close" />
            <wd-icon v-else name="check" />
            <text class="ml-2">{{ isAllSelected ? '取消全选' : '全选' }}</text>
          </view>

          <view class="title-icon-box" @tap="handleScanClick">
            <wd-icon name="scan" />
          </view>
          <view class="title-icon-box" @tap="handleManageClick">
            <wd-icon name="more" />
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
                  isSelected(leg)
                    ? 'bg-indigo-500/10 ring-2 ring-indigo-500'
                    : 'bg-transparent',
                ]"
              >
                <!-- 选中状态的 check 图标 -->
                <view
                  v-if="isSelected(leg)"
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
  @apply: flex items-center justify-center rounded-full bg-gray-50 py-2 px-4;
}
.title-icon {
  @apply: text-20px text-gray-700;
}
</style>
