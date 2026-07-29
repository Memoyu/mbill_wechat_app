<script setup lang="ts">
import type { IBill, ISelectBillGroup } from '@/api/types/bill'
import dayjs from 'dayjs'
import { formatFloat } from '@/utils'
import { getBillColor } from '@/utils/bill'
import { getDateFormat, getWeekday } from '@/utils/date'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  bill: IBill
}>()
const emit = defineEmits([''])
const show = defineModel<boolean>()

const dateOptions = ref([
  {
    label: '全部时间',
    value: '',
  },
  {
    label: '最近一周',
    value: '7',
  },
  {
    label: '最近一个月',
    value: '30',
  },
  {
    label: '最近三个月',
    value: '90',
  },
  {
    label: '自定义',
    value: '-1',
  },
])
const ledgerOptions = ref([])
const accountOptions = ref([])
const categoryOptions = ref([])

const date = ref('')
const ledgerId = ref('')
const accountId = ref('')
const categoryId = ref('')
const search = ref('')

const selectedIds = ref<string[]>([])
const billGroup = ref<ISelectBillGroup[]>([])

function handleDateChange() {
}

function handleLedgerChange() {
}

function handleAccountChange() {
}

function handleCategoryChange() {
}

function handleConfirm() {

}

function handleSearch() {
  console.log('handleSearch')
}

function handleBillItem() {
  console.log('handleBillItem')
}
</script>

<template>
  <!-- 退款列表 -->
  <center-popup v-model="show" title="关联账单" @confirm="handleConfirm">
    <view>
      <wd-search v-model="search" variant="filled" placeholder="账单关键字" cancel-text="搜索" @cancel="handleSearch" />
      <scroll-view scroll-y class="min-h-[40vh]">
        <view v-for="g in billGroup" :key="g.date" class="mt-5">
          <view class="flex items-center justify-between">
            <view class="flex">
              <view class="font-bold">
                {{ getDateFormat(g.date) }}
              </view>
              <view class="ml-2 text-gray">
                {{ getWeekday(g.date) }}
              </view>
            </view>
          </view>
          <view class="mt-2 list-item-box rounded-lg">
            <view v-for="b in g.items" :key="b.billId">
              <view class="text-sm" @tap="handleBillItem">
                <view class="mb-2 flex items-center justify-between">
                  <!-- 分类 -->
                  <view class="flex items-center">
                    <bill-icon :icon="bill.category.icon" :text="bill.category.name" />
                    <text class="ml-2">{{ bill.category.name }}</text>
                  </view>
                  <!-- 金额 -->
                  <text class="font-bold" :style="{ color: getBillColor(bill.type) }">{{ formatFloat(bill.amount) }}</text>
                </view>

                <view class="ml-9 flex flex-col text-xs text-gray-500 space-y-1">
                  <!-- 账户 -->
                  <view class="flex items-center justify-between">
                    <text>{{ bill.account.name }}</text>
                    <text>{{ dayjs(bill.date).format('HH:mm') }}</text>
                  </view>

                  <!-- 备注 -->
                  <text v-if="bill.remark" class="line-clamp-1">{{ bill.remark }}</text>

                  <!-- 地址 -->
                  <view v-if="bill.address" class="flex items-center">
                    <wd-icon name="location" />
                    <text class="line-clamp-1 ml-2">{{ bill.address }}</text>
                  </view>

                  <!-- 标签 -->
                  <view v-if="bill.tags && bill.tags.length > 0" class="hide-view-scrollbar mt-2 flex overflow-x-auto space-x-2">
                    <view v-for="tag in bill.tags" :key="tag.tagId" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs">
                      {{ tag.name }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </center-popup>
</template>

<style lang="scss" scoped>

</style>
