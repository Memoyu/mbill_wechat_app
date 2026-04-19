<script lang="ts" setup>
import { useLedgerStore } from '@/store'

definePage({
  style: {
    navigationBarTitleText: '新增账单',
    navigationStyle: 'custom',
  },
})

const billTypes = ['支出', '收入']
const amountValue = ref('')
const tempCursor = ref(amountValue.value.length)

const isLedgersShow = ref(false)
const currentType = ref(0)
const currentLedger = ref()

const ledgerStore = useLedgerStore()

onMounted(() => {
  currentLedger.value = ledgerStore.ledgers[0]
})
function handlePressKeyboard(key: any, value: string) {
  // console.log(key, value)

}

function handleLedgerChange(ledger: any) {
  currentLedger.value = ledger
}
</script>

<template>
  <page-meta :page-style="`overflow:${isLedgersShow ? 'hidden' : 'visible'};`" />
  <draw-background1 />
  <!-- 导航栏 -->
  <nav-bar>
    <template #title>
      <view class="w-full flex justify-between">
        <!-- 账本按钮 -->
        <view class="flex items-center" @tap="isLedgersShow = true">
          <wd-icon class="flex-shrink-0" name="arrow-down" />
          <text class="line-clamp-1 ml-2">{{ currentLedger?.name }}</text>
        </view>
      </view>
    </template>
  </nav-bar>
  <view class="flex justify-center">
    <view class="w-60%">
      <wd-segmented v-model:value="currentType" :custom-style="{ borderRadius: '18px' }" :options="billTypes">
        <template #label="{ option }">
          <view class="rounded-full bg-white">
            {{ option.value }}
          </view>
        </template>
      </wd-segmented>
    </view>
  </view>

  <view class="absolute bottom-0 left-0 right-0">
    <amount-input v-model="amountValue" v-model:cursor="tempCursor" />
    <keyboard v-model="amountValue" v-model:cursor="tempCursor" @press="handlePressKeyboard" />
    <view class="pb-safe" />
  </view>

  <!-- 账本弹窗 -->
  <ledger-popup v-model="isLedgersShow" v-model:value="ledger" @change="handleLedgerChange" />
</template>

<style lang="scss" scoped>
.amount-input-box {
  position: relative;
}
.amount-input-cursor {
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 1px;
  background-color: rebeccapurple;
  animation: blink 1s infinite;
}
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
