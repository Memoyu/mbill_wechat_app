<script setup lang="ts">
import type { IAccount } from '@/api/types/account'
import type { ICategory } from '@/api/types/category'
import type { ILedger } from '@/api/types/ledger'
import type { ITag } from '@/api/types/tag'
import type { ActionItem } from '@/typings'
import dayjs from 'dayjs'
import lodash from 'lodash'

export interface IBillFilter {
  type?: number
  beginDate?: string
  endDate?: string
  ledgers?: string[]
  categories?: string[]
  accounts?: string[]
  tags?: string[]
  amountMin?: number
  amountMax?: number
}

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
}>()
const emit = defineEmits(['confirm'])
const show = defineModel<boolean>()

const mounted = ref(false)
const filter = ref<IBillFilter>({
  ledgers: [],
  categories: [],
  accounts: [],
  tags: [],
})
const cloneFilter = ref<IBillFilter>(lodash.cloneDeep(filter.value))
const showDatePicker = ref(false)
const dateType = ref<string>('')
const pickerDate = ref<number>(dayjs().valueOf())
const pickerDateType = ref<number>(0) // 选择的时间范围类型 0: 起始 1: 截止
const showLedgerPicker = ref(false)
const ledgerName = ref<string>('')
const showCategoryPicker = ref(false)
const categoryName = ref<string>('')
const showAccountPicker = ref(false)
const accountName = ref<string>('')
const showTagPicker = ref(false)
const tagName = ref<string>('')

const actions: ActionItem[] = [
  {
    text: '重置',
    icon: 'reset',
    type: 'warning',
    action: () => {
      filter.value = {
        ledgers: [],
        categories: [],
        accounts: [],
        tags: [],
      }
      dateType.value = ''
      ledgerName.value = ''
      categoryName.value = ''
      accountName.value = ''
      tagName.value = ''
    },
  },
]

watch(() => show.value, (val) => {
  if (val) {
    mounted.value = true
    filter.value = lodash.cloneDeep(cloneFilter.value)
  }
})

function handleAfterEnter() {
  // console.log('handleAfterEnter')
}

function handleDateTypeChange() {
  filter.value.beginDate = ''
  filter.value.endDate = ''
}

function handleConfirm() {
  show.value = false
  const temp = lodash.cloneDeep(filter.value)
  // 如果选择了时间标签，则计算时间范围
  let beginDate = dayjs()
  const endDate = dayjs()
  if (dateType.value) {
    if (dateType.value === '0') {
      beginDate = dayjs().add(-7, 'day')
    }
    else if (dateType.value === '1') {
      beginDate = dayjs().add(-1, 'month')
    }
    else if (dateType.value === '2') {
      beginDate = dayjs().add(-3, 'month')
    }
    else if (dateType.value === '3') {
      beginDate = dayjs().add(-6, 'month')
    }
    temp.beginDate = dayjs(beginDate).format('YYYY-MM-DD')
    temp.endDate = dayjs(endDate).format('YYYY-MM-DD')
  }
  // console.log(temp, 'handleConfirm')
  cloneFilter.value = lodash.cloneDeep(temp)
  emit('confirm', temp)
}

function handleDateRange(type: number) {
  dateType.value = ''
  pickerDateType.value = type
  let now = dayjs().valueOf()
  if (type === 0) {
    // 起始
    if (filter.value.beginDate) {
      now = dayjs(filter.value.beginDate).valueOf()
    }
    else {
      filter.value.beginDate = dayjs(now).format('YYYY-MM-DD')
    }
  }
  else {
    // 截止
    if (filter.value.endDate) {
      now = dayjs(filter.value.endDate).valueOf()
    }
    else {
      filter.value.endDate = dayjs(now).format('YYYY-MM-DD')
    }
  }
  pickerDate.value = now
  showDatePicker.value = true
}

function handleDatePickerConfirm({ value }: { value: number }) {
  const date = dayjs(value).format('YYYY-MM-DD')
  if (pickerDateType.value === 0) {
    filter.value.beginDate = date
  }
  else {
    filter.value.endDate = date
  }
}

function handleLedgerConfirm(ledgers: ILedger[]) {
  // console.log(ledgers)
  showLedgerPicker.value = false
  ledgerName.value = ledgers.map(ledger => ledger.name).join(', ')
}

function handleCategoryConfirm(categories: ICategory[]) {
  // console.log(categories)
  showCategoryPicker.value = false
  categoryName.value = categories.map(ca => ca.name).join(', ')
}

function handleAccountConfirm(accounts: IAccount[]) {
  // console.log(accounts)
  showAccountPicker.value = false
  accountName.value = accounts.map(ac => ac.name).join(', ')
}
function handleTagConfirm(tags: ITag[]) {
  // console.log(tags)
  showTagPicker.value = false
  tagName.value = tags.map(t => t.name).join(', ')
}
</script>

<template>
  <!-- 筛选条件 -->
  <bottom-popup v-model="show" height="70vh" title="筛选条件" :actions="actions" @confirm="handleConfirm">
    <view class="mb-3 flex flex-col p-3 space-y-2">
      <!-- 账单类型 -->
      <view>
        <view class="filter-content-title">
          账单类型
        </view>
        <wd-radio-group v-model="filter.type" allow-uncheck type="button">
          <wd-radio :value="0">
            支出
          </wd-radio>
          <wd-radio :value="1">
            收入
          </wd-radio>
        </wd-radio-group>
      </view>

      <!-- 账单时间 -->
      <view>
        <view class="filter-content-title">
          出账日期
        </view>
        <wd-radio-group v-model="dateType" allow-uncheck type="button" @change="handleDateTypeChange">
          <wd-radio value="0">
            近1周
          </wd-radio>
          <wd-radio value="1">
            近1月
          </wd-radio>
          <wd-radio value="2">
            近3月
          </wd-radio>
          <wd-radio value="3">
            近6月
          </wd-radio>
        </wd-radio-group>
        <view class="flex items-center justify-between">
          <wd-input v-model="filter.beginDate" placeholder="起始时间" readonly @tap="handleDateRange(0)" />
          <view class="px-4">
            -
          </view>
          <wd-input v-model="filter.endDate" placeholder="截止时间" readonly @tap="handleDateRange(1)" />
        </view>
      </view>

      <!-- 所属账本 -->
      <view>
        <view class="filter-content-title">
          所属账本
        </view>
        <view class="rounded-sm bg-[var(--wot-input-bg)] p-3" @tap="showLedgerPicker = true">
          <text v-if="!ledgerName || ledgerName.length <= 0" class="text-[#b1b4bf]">账本</text>
          <text v-else class="line-clamp-1">{{ ledgerName }}</text>
        </view>
      </view>

      <!-- 账单分类 -->
      <view>
        <view class="filter-content-title">
          账单分类
        </view>
        <view class="rounded-sm bg-[var(--wot-input-bg)] p-3" @tap="showCategoryPicker = true">
          <text v-if="!categoryName || categoryName.length <= 0" class="text-[#b1b4bf]">分类</text>
          <text v-else class="line-clamp-1">{{ categoryName }}</text>
        </view>
      </view>

      <!-- 账单账户 -->
      <view>
        <view class="filter-content-title">
          账单账户
        </view>
        <view class="rounded-sm bg-[var(--wot-input-bg)] p-3" @tap="showAccountPicker = true">
          <text v-if="!accountName || accountName.length <= 0" class="text-[#b1b4bf]">账户</text>
          <text v-else class="line-clamp-1">{{ accountName }}</text>
        </view>
      </view>

      <!-- 账单标签 -->
      <view>
        <view class="filter-content-title">
          账单标签
        </view>
        <view class="rounded-sm bg-[var(--wot-input-bg)] p-3" @tap="showTagPicker = true">
          <text v-if="!tagName || tagName.length <= 0" class="text-[#b1b4bf]">标签</text>
          <text v-else class="line-clamp-1">{{ tagName }}</text>
        </view>
      </view>

      <!-- 金额区间 -->
      <view>
        <view class="filter-content-title">
          账单金额
        </view>
        <view class="flex items-center justify-between">
          <wd-input v-model="filter.amountMin" type="number" placeholder="最小金额" />
          <view class="px-4">
            -
          </view>
          <wd-input v-model="filter.amountMax" type="number" placeholder="最大金额" />
        </view>
      </view>
    </view>
  </bottom-popup>

  <!-- 日期选择器 -->
  <wd-datetime-picker v-if="mounted" v-model="pickerDate" v-model:visible="showDatePicker" type="date" @confirm="handleDatePickerConfirm" />

  <!-- 账本选择器 -->
  <ledger-list-picker v-if="mounted" v-model="filter.ledgers" v-model:visible="showLedgerPicker" @confirm="handleLedgerConfirm" />

  <!-- 分类选择器 -->
  <category-list-picker v-if="mounted" v-model="filter.categories" v-model:visible="showCategoryPicker" @confirm="handleCategoryConfirm" />

  <!-- 账户选择器 -->
  <account-list-picker v-if="mounted" v-model="filter.accounts" v-model:visible="showAccountPicker" @confirm="handleAccountConfirm" />

  <!-- 账户选择器 -->
  <tag-list-picker v-if="mounted" v-model="filter.tags" v-model:visible="showTagPicker" @confirm="handleTagConfirm" />
</template>

<style lang="scss" scoped>
.filter-content-title {
  @apply font-bold pb-2;
}
</style>
