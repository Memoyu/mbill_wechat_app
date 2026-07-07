<script lang="ts" setup>
import type { ILedger } from '@/api/types/ledger'
import dayjs from 'dayjs'
import { useLedgerStore } from '@/store'
import { getDateFormat } from '@/utils/date'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationBarTitleText: '新增账单',
    navigationStyle: 'custom',
  },
})

const typeOptions = ['支出', '收入']
const amountValue = ref('')
const tempCursor = ref(amountValue.value.length)

const isLedgersShow = ref(false)
const isDateTimeShow = ref(false)
const isAccountShow = ref(false)
const isTagShow = ref(false)
const categoryPickerHeight = ref(0)
const activeType = ref(0)
const currentLedger = ref()
const currentLedgerId = ref()

const categoryId = ref('13159366956548101')
const dateTime = ref(Date.now())
const remark = ref('')
const tags = ref<string[]>([])
const accountId = ref()
const accountName = ref('虚拟账户-支付宝')
const address = ref('广东省广州市广州市天河区人民政府(天府路西)')

const ledgerStore = useLedgerStore()

const showAddress = computed(() => {
  return address.value.length > 12 ? `···${address.value.substring(address.value.length - 12)}` : address.value
})

watch(() => tags.value, (newTags, oldTags) => {
  if (oldTags.length < 1 || newTags.length < 1) {
    initFixedHeight()
  }
})

onMounted(() => {
  currentLedger.value = ledgerStore.ledgers[4]
  currentLedgerId.value = currentLedger.value.ledgerId
  initFixedHeight()
})

function initFixedHeight() {
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((top: any) => {
      const topHeight = top.height
      uni.createSelectorQuery().select('#BOTTOM_INPUT').boundingClientRect((bottom: any) => {
        categoryPickerHeight.value = systemInfo.windowHeight - (topHeight + bottom.height)
        // console.log(topHeight, bottom.height, categoryPickerHeight.value, 'categoryPickerHeight')
      }).exec()
    }).exec()
  })
}

function handlePressKeyboard(key: any, value: string) {
  // console.log(key, value)

}

function handleLedgerChange(ledger: ILedger) {
  currentLedger.value = ledger
}

function handleDateTimeChange(dateTime: any) {
  console.log(dateTime, 'select date time')
  dateTime.value = dateTime
}

function handleTagSelectTap() {
  if (tags.value.length > 0) {
    tags.value = []
    return
  }
  tags.value = ['服装鞋帽', '美妆护肤', '数码电子', '日用百货', '图书文具', '母婴用品', '宠物用品']
}
</script>

<template>
  <page-meta :page-style="`overflow:${isLedgersShow || isDateTimeShow || isAccountShow || isTagShow ? 'hidden' : 'visible'};`" />
  <draw-background1 />
  <!-- 导航栏 -->
  <nav-bar id="TOP_NAVBAR">
    <template #title>
      <view class="w-full flex justify-between">
        <!-- 账本按钮 -->
        <view class="flex items-center" @tap="isLedgersShow = true">
          <wd-icon class="flex-shrink-0" name="caret-down" />
          <text class="line-clamp-1 ml-2">{{ currentLedger?.name }}</text>
        </view>
      </view>
    </template>
    <template #prefix-action>
      <view class="mt-4 max-w-max rounded-full bg-gray-200/50 px-3 py-1">
        <mbill-segmented v-model="activeType" :options="typeOptions" />
      </view>
    </template>
  </nav-bar>
  <!-- 账单分类 -->
  <view class="">
    <wd-swiper
      v-model:current="activeType" :list="['0', '1']"
      :indicator="false" :autoplay="false" :height="categoryPickerHeight"
    >
      <template #default="{ item }">
        <category-view :select-id="categoryId" :type="item === '0' ? 0 : 1" :height="categoryPickerHeight" />
      </template>
    </wd-swiper>
  </view>

  <view id="BOTTOM_INPUT" class="absolute bottom-0 left-0 right-0">
    <!-- 标签 -->
    <view v-if="tags && tags.length > 0" class="hide-view-scrollbar flex overflow-x-auto px-2 py-1 space-x-2">
      <view v-for="tag in tags" :key="tag" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs">
        {{ tag }}
      </view>
    </view>
    <!-- 账单属性 -->
    <view class="bill-attr-box hide-view-scrollbar">
      <view class="bill-attr-box-item" @tap="isDateTimeShow = true">
        <!-- 日期 -->
        <wd-icon name="calendar-line" size="20px" />
        <text class="ml-1">{{ `${getDateFormat(dateTime)} ${dayjs(dateTime).format('HH:MM')}` }}</text>
      </view>
      <view class="bill-attr-box-item" @tap="isAccountShow = true">
        <!-- 账户 -->
        <wd-img :width="22" round :height="22" src="https://wot-ui.cn/assets/panda.jpg" />
        <text class="ml-1">{{ accountName }}</text>
      </view>
      <view class="bill-attr-box-item" @tap="isTagShow = true">
        <!-- 标签 -->
        <wd-icon name="tag" size="20px" />
        <text class="ml-1">标签</text>
      </view>
      <view class="bill-attr-box-item" @tap="isTagShow = true">
        <!-- 地点 -->
        <wd-icon name="location" size="20px" />
        <text class="ml-1">{{ showAddress }}</text>
      </view>
    </view>
    <!-- 账单总额、备注 -->
    <view class="flex items-center justify-between px-2 py-1 space-x-xl">
      <view class="w-full shrink-1">
        <!-- 备注 -->
        <wd-input v-model="remark" compact type="text" placeholder="账单备注" />
      </view>
      <view>
        <!-- 总金额 -->
        <wd-text :text="amountValue" mode="price" type="success" size="17px" />
      </view>
    </view>

    <!-- 键盘输入框 -->
    <view class="py-1">
      <amount-input v-model="amountValue" v-model:cursor="tempCursor" />
    </view>
    <!-- 金额键盘 -->
    <keyboard v-model="amountValue" v-model:cursor="tempCursor" @press="handlePressKeyboard" />
    <view class="pb-safe" />
  </view>

  <!-- 账本弹窗 -->
  <ledger-popup v-model="isLedgersShow" v-model:value="currentLedgerId" single @change="handleLedgerChange" />
  <!-- 日期弹窗 -->
  <date-time-popup v-model="isDateTimeShow" v-model:date="dateTime" @change="handleDateTimeChange" />
  <!-- 账户弹窗 -->
  <account-picker-popup v-model="isAccountShow" v-model:account="accountId" />
  <!-- 标签弹窗 -->
  <tag-picker-popup v-model="isTagShow" v-model:tags="tags" />
</template>

<style lang="scss" scoped>
.bill-attr-box {
  white-space: nowrap;
  @apply: flex items-center px-2 py-1 gap-2 overflow-x-auto;
  &-item {
    @apply: flex items-center justify-center py-1.5 px-2.5 bg-indigo-200/40 rounded-full;
  }
}
</style>
