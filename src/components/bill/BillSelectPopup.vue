<script setup lang="ts">
import type { IBillFilter } from './BillFilterPopup.vue'
import type { IBill, IBillPageItem } from '@/api/types/bill'
import dayjs from 'dayjs'
import { getBillPage } from '@/api/bill'
import { formatFloat } from '@/utils'
import { getBillColor } from '@/utils/bill'

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
const emit = defineEmits(['confirm'])
const show = defineModel<boolean>()

const showFilter = ref(false)
const search = ref('')
const query = ref<IBillFilter>({
  beginDate: dayjs().add(-1, 'month').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
})
const selecteds = ref<string[]>([])
const bills = ref<IBillPageItem[]>([])

function handleAfterEnter() {
  // console.log('handleAfterEnter')
}

function handleConfirm() {
  emit('confirm', selecteds.value)
}

function handleSearch() {
  // console.log('handleSearch')
  getBillPage({
    beginDate: query.value.beginDate,
    endDate: query.value.endDate,
    type: query.value.type,
    ledgerIds: query.value.ledgers,
    categoryIds: query.value.categories,
    accountIds: query.value.accounts,
    tagIds: query.value.tags,
  }).then((res) => {
    bills.value = res.items
  })
}

function handleConfirmFilter(filter: any) {
  // console.log('handleConfirmFilter', filter)
  query.value = filter
}

function handleSelectBill(bill: IBillPageItem) {
  if (isSelected(bill)) {
    selecteds.value = selecteds.value.filter(id => id !== bill.billId)
  }
  else {
    selecteds.value.push(bill.billId)
  }
}

function isSelected(bill: IBillPageItem) {
  return selecteds.value.includes(bill.billId)
}
</script>

<template>
  <!-- 账单列表 -->
  <center-popup v-model="show" title="关联账单" @confirm="handleConfirm" @after-enter="handleAfterEnter">
    <template #title>
      <wd-search v-model="search" variant="filled" placeholder="账单关键字" cancel-txt="搜索" @cancel="handleSearch">
        <template #input-suffix>
          <wd-icon name="filter" size="20px" @tap="showFilter = true" />
        </template>
      </wd-search>
    </template>

    <view class="">
      <scroll-view scroll-y class="h-[60vh]">
        <view class="flex flex-col gap-2.5 p-3">
          <view v-for="b in bills" :key="b.billId" class="relative list-item-box rounded-lg" @tap.stop="handleSelectBill(b)">
            <bill-item :bill="b" />
            <view
              class="absolute inset-0 z-2 overflow-hidden rounded-md transition-all duration-200"
              :class="[isSelected(b) ? 'bg-indigo-500/10 ring-2 ring-indigo-500' : 'bg-transparent']"
            >
              <view
                v-if="isSelected(b)"
                class="absolute h-5 w-5 flex animate-fade-in animate-duration-200 items-end justify-end rounded-full bg-indigo-500 shadow-sm -left-2 -top-2"
              />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </center-popup>

  <!-- 筛选弹窗 -->
  <bill-filter-popup v-model="showFilter" @confirm="handleConfirmFilter" />
</template>

<style lang="scss" scoped>
.filter-content-title {
  @apply font-bold pb-2;
}
</style>
