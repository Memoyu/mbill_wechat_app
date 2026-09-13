<script setup lang="ts">
import type { IAccount } from '@/api/types/account'
import type { ICategory } from '@/api/types/category'
import type { ILedger } from '@/api/types/ledger'
import type { ITag } from '@/api/types/tag'
import type { IBillFilter } from '@/store'
import type { ActionItem } from '@/typings'
import dayjs from 'dayjs'
import lodash from 'lodash'
import { useFilterBillStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  noShow?: number[]
}>(), {
})
const emit = defineEmits(['confirm'])
const show = defineModel<boolean>()

const filterBillStore = useFilterBillStore()
// const filter = computed(() => filterBillStore.filter)
const filter = ref<IBillFilter>(filterBillStore.filter)

const mounted = ref(false)
const showDate = ref(false)
const showLedger = ref(false)
const showCategory = ref(false)
const showAccount = ref(false)
const showTag = ref(false)

const pickerDate = ref<number>(dayjs().valueOf())
const pickerDateType = ref<number>(0) // 选择的时间范围类型 0: 起始 1: 截止

const actions: ActionItem[] = [
  {
    text: '重置',
    icon: 'reset',
    type: 'warning',
    action: () => {
      filter.value = { ...filterBillStore.reset() }
    },
  },
]

watch(() => show.value, (val) => {
  if (val) {
    mounted.value = true
    filter.value = lodash.cloneDeep(filterBillStore.filter)
  }
})

function handleAfterEnter() {
  // console.log('handleAfterEnter')
}

function handleDateTypeChange() {
  const date = filterBillStore.dateRange(filter.value.dateType)
  filter.value = { ...filter.value, ...date }
}

function handleConfirm() {
  show.value = false
  const temp = lodash.cloneDeep(filter.value)

  // console.log(temp, 'handleConfirm')
  filterBillStore.update(temp)
  emit('confirm', temp)
}

function handleDateRange(type: number) {
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
  showDate.value = true
}

function handleDatePickerConfirm({ value }: { value: number }) {
  filter.value.dateType = ''
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
  showLedger.value = false
  filter.value.ledgerNames = ledgers.map(ledger => ledger.name).join(', ')
}

function handleCategoryConfirm(categories: ICategory[]) {
  // console.log(categories)
  showCategory.value = false
  filter.value.categoryNames = categories.map(ca => ca.name).join(', ')
}

function handleAccountConfirm(accounts: IAccount[]) {
  // console.log(accounts)
  showAccount.value = false
  filter.value.accountNames = accounts.map(ac => ac.name).join(', ')
}
function handleTagConfirm(tags: ITag[]) {
  // console.log(tags)
  showTag.value = false
  filter.value.tagNames = tags.map(t => t.name).join(', ')
}

function showItem(index: number) {
  if (!props.noShow)
    return true
  return !props.noShow.includes(index)
}
</script>

<template>
  <!-- 筛选条件 -->
  <bottom-popup v-model="show" height="70vh" title="筛选条件" :actions="actions" @confirm="handleConfirm">
    <view class="mb-3 flex flex-col p-3 space-y-2">
      <!-- 账单类型 -->
      <view v-if="showItem(0)">
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
      <view v-if="showItem(1)">
        <view class="filter-content-title">
          出账日期
        </view>
        <wd-radio-group v-model="filter.dateType" allow-uncheck type="button" @change="handleDateTypeChange">
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
      <view v-if="showItem(2)">
        <view class="filter-content-title">
          所属账本
        </view>
        <view class="rounded-sm bg-[var(--wot-input-bg)] p-3" @tap="showLedger = true">
          <text v-if="!filter.ledgerNames || filter.ledgerNames.length <= 0" class="text-[#b1b4bf]">账本</text>
          <text v-else class="line-clamp-1">{{ filter.ledgerNames }}</text>
        </view>
      </view>

      <!-- 账单分类 -->
      <view v-if="showItem(3)">
        <view class="filter-content-title">
          账单分类
        </view>
        <view class="rounded-sm bg-[var(--wot-input-bg)] p-3" @tap="showCategory = true">
          <text v-if="!filter.categoryNames || filter.categoryNames.length <= 0" class="text-[#b1b4bf]">分类</text>
          <text v-else class="line-clamp-1">{{ filter.categoryNames }}</text>
        </view>
      </view>

      <!-- 账单账户 -->
      <view v-if="showItem(4)">
        <view class="filter-content-title">
          账单账户
        </view>
        <view class="rounded-sm bg-[var(--wot-input-bg)] p-3" @tap="showAccount = true">
          <text v-if="!filter.accountNames || filter.accountNames.length <= 0" class="text-[#b1b4bf]">账户</text>
          <text v-else class="line-clamp-1">{{ filter.accountNames }}</text>
        </view>
      </view>

      <!-- 账单标签 -->
      <view v-if="showItem(5)">
        <view class="filter-content-title">
          账单标签
        </view>
        <view class="rounded-sm bg-[var(--wot-input-bg)] p-3" @tap="showTag = true">
          <text v-if="!filter.tagNames || filter.tagNames.length <= 0" class="text-[#b1b4bf]">标签</text>
          <text v-else class="line-clamp-1">{{ filter.tagNames }}</text>
        </view>
      </view>

      <!-- 金额区间 -->
      <view v-if="showItem(6)">
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
  <wd-datetime-picker v-if="mounted" v-model="pickerDate" v-model:visible="showDate" type="date" @confirm="handleDatePickerConfirm" />

  <!-- 账本选择器 -->
  <ledger-list-picker v-if="mounted" v-model="filter.ledgers" v-model:visible="showLedger" @confirm="handleLedgerConfirm" />

  <!-- 分类选择器 -->
  <category-list-picker v-if="mounted" v-model="filter.categories" v-model:visible="showCategory" @confirm="handleCategoryConfirm" />

  <!-- 账户选择器 -->
  <account-list-picker v-if="mounted" v-model="filter.accounts" v-model:visible="showAccount" @confirm="handleAccountConfirm" />

  <!-- 账户选择器 -->
  <tag-list-picker v-if="mounted" v-model="filter.tags" v-model:visible="showTag" @confirm="handleTagConfirm" />
</template>

<style lang="scss" scoped>
.filter-content-title {
  @apply font-bold pb-2;
}
</style>
