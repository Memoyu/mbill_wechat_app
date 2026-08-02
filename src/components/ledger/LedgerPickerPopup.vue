<script setup lang="ts">
import type { ILedger } from '@/api/types/ledger'
import lodash from 'lodash'
import { useLedgerStore } from '@/store'

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
const selecteds = defineModel<string[]>()
const visible = defineModel<boolean>('visible')

const ledgerStore = useLedgerStore()
const ledgers = computed(() => ledgerStore.ledgers)

const isAllSelected = ref()
const innerSelecteds = ref<string[]>([])

watch(() => selecteds.value, (newValue) => {
  innerSelecteds.value = lodash.cloneDeep(newValue)
}, { immediate: true, deep: true })

watch(() => visible.value, (newValue) => {
  if (newValue)
    innerSelecteds.value = lodash.cloneDeep(selecteds.value)
}, { immediate: true })

function handleAfterEnter() {
  // console.log('handleAfterEnter')
}

function handleConfirm() {
  selecteds.value = innerSelecteds.value
  emit('confirm', ledgers.value.filter(ledger => isSelected(ledger)))
}

function isSelected(ledger: ILedger) {
  return innerSelecteds.value.includes(ledger.ledgerId) || false
}

function handleAllSelectClick() {
  if (isAllSelected.value) {
    innerSelecteds.value = []
  }
  else {
    innerSelecteds.value = ledgerStore.ledgers.map(l => l.ledgerId)
  }
  isAllSelected.value = !isAllSelected.value
}

function handleLedgerClick(ledger: ILedger) {
  // console.log(ledger, 'ledger')
  if (isSelected(ledger)) {
    innerSelecteds.value = innerSelecteds.value.filter(id => id !== ledger.ledgerId)
  }
  else {
    innerSelecteds.value.push(ledger.ledgerId)
  }
}
</script>

<template>
  <bottom-popup v-model="visible" title="账本选择" @confirm="handleConfirm" @after-enter="handleAfterEnter">
    <template #action>
      <view
        class="px-3 py-1 text-base text-gray-400"
        hover-class="bg-gray-50"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="handleAllSelectClick"
      >
        <text>{{ isAllSelected ? '取消全选' : '全选' }}</text>
      </view>
    </template>
    <!-- 目录列表 -->
    <view class="px-2">
      <scroll-view scroll-y class="max-h-[50vh]">
        <view class="p-2 space-y-3">
          <view
            v-for="ledger in ledgers" :key="ledger.ledgerId"
          >
            <view
              class="relative flex items-center gap-3 border rounded-xl p-4 transition-all"
              hover-class="scale-97 origin-center"
              :hover-start-time="0"
              :hover-stay-time="200"
              @tap="handleLedgerClick(ledger)"
            >
              <view class="min-w-0 flex flex-1 items-center gap-3">
                <view
                  class="truncate text-sm"
                  :class="[
                    isSelected(ledger) ? 'text-indigo-500 font-medium' : 'text-gray-700',
                  ]"
                >
                  {{ ledger.name }}
                </view>
              </view>

              <!-- 选中遮罩层 -->
              <view
                class="absolute inset-0 z-10 rounded-2xl transition-all duration-200"
                :class="[
                  isSelected(ledger)
                    ? 'bg-indigo-500/10 ring-2 ring-indigo-500'
                    : 'bg-transparent',
                ]"
              >
                <!-- 选中状态的 check 图标 -->
                <view
                  v-if="isSelected(ledger)"
                  class="absolute bottom-3 right-3 h-5 w-5 flex animate-fade-in animate-duration-200 items-center justify-center rounded-full bg-indigo-500 shadow-sm"
                >
                  <text class="iconfont icon-check text-xs text-white" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
