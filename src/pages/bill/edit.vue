<script lang="ts" setup>
import { useLedgerStore } from '@/store'
import { objToStyle } from '@/utils'
import { systemInfo } from '@/utils/systemInfo'

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
const categoryPickerHeight = ref(0)
const currentType = ref(0)
const currentLedger = ref()
const currentLedgerId = ref(currentLedger.value?.ledgerId)

const ledgerStore = useLedgerStore()

const segmentStyle = computed(() => {
  const style = {
    borderRadius: '18px',
  }
  return `${objToStyle(style)}`
})

onMounted(() => {
  currentLedger.value = ledgerStore.ledgers[0]

  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((top: UniApp.NodeInfo) => {
      const topHeight = top.height
      uni.createSelectorQuery().select('#BOTTOM_INPUT').boundingClientRect((bottom: UniApp.NodeInfo) => {
        categoryPickerHeight.value = systemInfo.windowHeight - (topHeight + bottom.height)
        console.log(topHeight, bottom.height, categoryPickerHeight.value, 'categoryPickerHeight')
      }).exec()
    }).exec()
  })
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
  <nav-bar id="TOP_NAVBAR">
    <template #title>
      <view class="w-full flex justify-between">
        <!-- 账本按钮 -->
        <view class="flex items-center" @tap="isLedgersShow = true">
          <wd-icon class="flex-shrink-0" name="arrow-down" />
          <text class="line-clamp-1 ml-2">{{ currentLedger?.name }}</text>
        </view>
      </view>
    </template>
    <template #action>
      <view class="mt-4 flex">
        <view class="relative flex rounded-full bg-gray-200/50 p-1 px-2">
          <view
            class="absolute bottom-2 z--1 h-2 w-8 rounded-full bg-indigo-300 transition-all duration-300"
            :style="{ left: (currentType === 0 ? '15px' : '63px') }"
          />
          <view class="px-2 py-1" @tap="currentType = 0">
            支出
          </view>
          <view class="px-2 py-1" @tap="currentType = 1">
            收入
          </view>
        </view>
      </view>
    </template>
  </nav-bar>
  <view class="" :style="{ height: `${categoryPickerHeight}px` }">
    <wd-swiper
      v-model:current="currentType" :list="['0', '1']"
      :indicator="false" :autoplay="false" :height="categoryPickerHeight"
    >
      <template #default="{ item }">
        <view class="p-3">
          <category-picker :type="item === '0' ? 0 : 1" :height="categoryPickerHeight" />
        </view>
      </template>
    </wd-swiper>
  </view>

  <view id="BOTTOM_INPUT" class="absolute bottom-0 left-0 right-0">
    <amount-input v-model="amountValue" v-model:cursor="tempCursor" />
    <keyboard v-model="amountValue" v-model:cursor="tempCursor" @press="handlePressKeyboard" />
    <view class="pb-safe" />
  </view>

  <!-- 账本弹窗 -->
  <ledger-popup v-model="isLedgersShow" v-model:value="currentLedgerId" @change="handleLedgerChange" />
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
