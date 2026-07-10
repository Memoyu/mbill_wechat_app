<script lang="ts" setup>
import type { IAccount } from '@/api/types/account'
import type { IBill } from '@/api/types/bill'
import type { ILedger } from '@/api/types/ledger'
import type { ITag } from '@/api/types/tag'
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

const ledgerStore = useLedgerStore()

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

const bill = ref<IBill>({
  billId: '',
  type: 0,
  category: { categoryId: '', name: '', icon: '' },
  account: { accountId: '', name: '账户选择', icon: '' },
  amount: 0,
  date: new Date(),
  remark: '',
  tags: [],
  address: '',
})

const categoryId = ref('13159366956548101')
const dateTime = ref(Date.now())
const remark = ref('')
const tags = ref<ITag[]>([])

const showAddress = computed(() => {
  const address = bill.value.address
  return address.length > 12 ? `···${address.substring(address.length - 12)}` : address
})
const tagIds = computed(() => {
  return tags.value.map(tag => tag.tagId)
})

watch(() => tags.value, (newTags, oldTags) => {
  if (oldTags.length < 1 || newTags.length < 1) {
    initFixedHeight()
  }
})

onMounted(() => {
  currentLedger.value = ledgerStore.ledgers[0]
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

function handleTagSelectedChange(items: ITag[]) {
  console.log(items, 'tags')
  tags.value = items
}

function handleAccountSelectedChange(item: any) {
  console.log(item, 'handleAccountSelectedChange')
  const { account, parent } = item
  bill.value.account.accountId = account.id
  bill.value.account.icon = account.icon
  bill.value.account.name = account.name
  if (!parent) {
    bill.value.account.parent.accountId = parent.id
    bill.value.account.parent.name = parent.name
  }
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
        <category-view v-model="categoryId" :type="item === '0' ? 0 : 1" :height="categoryPickerHeight" />
      </template>
    </wd-swiper>
  </view>

  <view id="BOTTOM_INPUT" class="absolute bottom-0 left-0 right-0">
    <!-- 标签 -->
    <view v-if="tags && tags.length > 0" class="hide-view-scrollbar flex overflow-x-auto px-2 py-1 space-x-2">
      <view v-for="tag in tags" :key="tag.tagId" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs">
        {{ tag.name }}
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
        <bill-icon size="22px" :icon="bill.account.icon" :text="bill.account.name" />
        <text class="ml-1">{{ bill.account.parent ? `${bill.account.parent.name}-${bill.account.name}` : bill.account.name }}</text>
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
  <account-picker-popup v-model="isAccountShow" :account="bill.account.accountId" @change="handleAccountSelectedChange" />
  <!-- 标签弹窗 -->
  <tag-picker-popup v-model="isTagShow" :tags="tagIds" @change="handleTagSelectedChange" />
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
