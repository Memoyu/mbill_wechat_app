<script lang="ts" setup>
import dayjs from 'dayjs'
import { useBillStore, useLedgerPickerStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const emit = defineEmits(['showLedgers'])

const billStore = useBillStore()
const ledgerPickerStore = useLedgerPickerStore()

const ledgerName = computed(() => {
  // console.log(ledgerPickerStore.selectedLedgerNames)
  return ledgerPickerStore.selectedLedgerNames.join(', ')
})

watch (() => ledgerPickerStore.selectedLedgers, (ledgers) => {
  billStore.loadIndexBills({
    ledgerIds: ledgers,
    beginDate: dayjs().add(-30, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  })
}, { immediate: true, deep: true })

function handleNavigateTo(path: string) {
  uni.navigateTo({ url: path })
}
</script>

<template>
  <view class="fixed bottom-8 left-0 right-0 z-4 mx-auto w-90% flex animate-fade-in-up animate-duration-400 animate-ease-out">
    <view
      class="flex flex-1 items-center justify-between rounded-full bg-white px-3.5 py-2.5 shadow-lg"
      :style="{ boxShadow: '0 8px 24px -6px rgba(0,0,0,0.12), 0 4px 8px -4px rgba(0,0,0,0.08)' }"
    >
      <view class="flex items-center gap-3">
        <!-- 账本按钮 -->
        <view
          class="index-navbar-action"
          hover-class="index-navbar-action-hover"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="emit('showLedgers')"
        >
          <text class="iconfont icon-book text-gray-600" />
          <text class="max-w-[80px] truncate text-sm text-gray-600"> {{ ledgerName }} </text>
        </view>

        <view
          class="index-navbar-action"
          hover-class="index-navbar-action-hover"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="handleNavigateTo('/pages/statis/index')"
        >
          <text class="iconfont icon-statis text-gray-600" />
          <text class="text-sm text-gray-600">统计</text>
        </view>
      </view>

      <view
        class="flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1.5 transition-colors"
        hover-class="bg-indigo-500/15 scale-95"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="handleNavigateTo('/pages/bill/edit')"
      >
        <text class="i-carbon-add text-indigo-500" />
        <text class="text-sm text-indigo-500 font-medium">添加</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.index-navbar-action {
  @apply: flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 transition-colors;
}
.index-navbar-action-hover {
  @apply: bg-gray-100/80 scale-95;
}
</style>
