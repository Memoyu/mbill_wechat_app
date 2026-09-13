<script setup lang="ts">
import type { IBill, IBillPageItem } from '@/api/types/bill'
import { searchBill } from '@/api/bill'
import { useFilterBillStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  bill?: IBill
  excludes?: string[]
}>(), {
  excludes: () => [],
})
const emit = defineEmits(['confirm'])
const show = defineModel<boolean>()

const filterBillStore = useFilterBillStore()

const showFilter = ref(false)
const search = ref('')
const filter = computed(() => filterBillStore.filter)

const selecteds = ref<string[]>([])
const bills = ref<IBillPageItem[]>([])
const paging = ref()
const showPaging = ref(false)

watch(() => show.value, (val) => {
  if (val) {
    showPaging.value = true
  }
})

function handleAfterEnter() {
  // console.log('handleAfterEnter')
}

function handleConfirm() {
  emit('confirm', selecteds.value)
  show.value = false
  // 完成后清空选中
  selecteds.value = []
}

function handleQuery(page: number, size: number) {
  // console.log('handleQuery', page, size)
  const excludeBillIds = [...props.excludes]
  if (props.bill) {
    excludeBillIds.push(props.bill.billId)
  }

  searchBill({
    keyword: search.value,
    beginDate: filter.value.beginDate,
    endDate: filter.value.endDate,
    type: filter.value.type,
    ledgerIds: filter.value.ledgers,
    categoryIds: filter.value.categories,
    accountIds: filter.value.accounts,
    tagIds: filter.value.tags,
    excludeBillIds,
    size,
    page,
  }).then((res) => {
    paging.value.completeByTotal (res.items, res.total)
  }).catch((res) => {
    paging.value.complete(false)
  })
}

function handleSearch() {
  // console.log('handleSearch')
  paging.value.reload()
}

function handleFilterConfirm(filter: any) {
  // console.log('handleFilterConfirm', filter)
  handleSearch()
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
    <view class="h-[60vh] w-full">
      <z-paging v-if="showPaging" ref="paging" v-model="bills" :fixed="false" :default-page-size="15" :refresher-enabled="false" @query="handleQuery">
        <view class="px-2 space-y-2">
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
      </z-paging>
    </view>
  </center-popup>

  <!-- 筛选弹窗 -->
  <bill-filter-popup v-model="showFilter" @confirm="handleFilterConfirm" />
</template>

<style lang="scss" scoped>
.filter-content-title {
  @apply font-bold pb-2;
}
</style>
