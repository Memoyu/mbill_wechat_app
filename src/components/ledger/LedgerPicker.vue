<script setup lang="ts">
import type { ILedger } from '@/api/types/ledger'
import { useLedgerPickerStore, useLedgerStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  value?: string
  single?: boolean
}>(), {
  single: false,
})
const emit = defineEmits(['change'])
const show = defineModel<boolean>()

const ledgerStore = useLedgerStore()
const ledgerPickerStore = useLedgerPickerStore()

const currentLedgerId = ref()

watch(() => props.value, (val) => {
  currentLedgerId.value = val
})

const ledgers = computed(() => ledgerStore.ledgers)
function handleLedgerItemClick(item: ILedger) {
  // console.log('点击')
  if (props.single) {
    currentLedgerId.value = item.ledgerId
    emit('change', item)
    show.value = false
  }
  else {
    ledgerPickerStore.toggleLedgerSelection(item.ledgerId)
    emit('change', ledgerPickerStore.selecteds)
  }
}

function handleCancelClick() {
  show.value = false
}

function handleAllSelectClick() {
  ledgerPickerStore.selectAllLedgers()
}

function handleScanClick() {
  uni.scanCode({
    success(res) {
      // console.log(`条码类型：${res.scanType}`)
      // console.log(`条码内容：${res.result}`)
      ledgerStore.joinLedger(res.result)
    },
    fail(e) {
      console.log(`扫码错误：${e}`)
    },
  })
}

function handleManageClick() {
  // 账本管理页
  uni.navigateTo({
    url: '/pages/ledger/index',
  })
}

function isSelected(ledger: ILedger) {
  if (props.single) {
    return currentLedgerId.value === ledger.ledgerId
  }
  else {
    return ledgerPickerStore.isLedgerSelected(ledger.ledgerId)
  }
}
</script>

<template>
  <bottom-popup
    v-model="show"
    :show-btn="false"
    title="账本"
  >
    <template #action>
      <view class="flex items-center space-x-4">
        <view v-if="!single" class="title-icon-box" @tap="handleAllSelectClick">
          <wd-icon name="check" />
          <text class="ml-2">全选</text>
        </view>

        <view class="title-icon-box" @tap="handleScanClick">
          <wd-icon name="scan" />
        </view>
        <view class="title-icon-box" @tap="handleManageClick">
          <wd-icon name="more" />
        </view>
      </view>
    </template>

    <view class="relative p-3">
      <view class="grid grid-cols-2 gap-3">
        <view v-for="leg in ledgers" :key="leg.ledgerId" class="relative rounded-xl" @tap="handleLedgerItemClick(leg)">
          <view class="mb-block-bg relative overflow-hidden rounded-xl transition-all duration-200">
            <!-- 账簿封面 -->
            <view class="aspect-[5/4] bg-gradient-to-br">
              <!-- 装饰元素容器 -->
              <view class="pointer-events-none absolute inset-0">
                <!-- 大圆形装饰 -->
                <view class="absolute right-0 top-0 z-[1] h-48 w-48 rounded-full bg-black/2" />
                <!-- 小圆形装饰 -->
                <view class="absolute bottom-0 left-0 z-[1] h-32 w-32 translate-y-16 rounded-full bg-black/3 -translate-x-16" />
                <view class="absolute left-20 top-16 z-[2] h-20 w-20">
                  <view class="absolute inset-0 border-[3px] border-white/8 rounded-full" />
                </view>
              </view>
            </view>

            <view class="absolute inset-0 flex flex-col p-3">
              <!-- 账本内容区域 -->
              <view class="relative h-full flex flex-col overflow-hidden">
                <!-- 账本名称 -->
                <text class="line-clamp-1 w-85% text-base text-gray-800 font-semibold">
                  {{ leg.name }}
                </text>

                <view class="mt-2">
                  <view class="flex items-baseline">
                    <view class="text-xs">
                      收入
                    </view>
                    <view class="ml-2 text-emerald font-bold">
                      {{ leg.income }}
                    </view>
                  </view>

                  <view class="flex items-baseline">
                    <view class="text-xs">
                      支出
                    </view>
                    <view class="ml-2 text-rose font-bold">
                      {{ leg.expend }}
                    </view>
                  </view>
                </view>
              </view>

              <!-- 底部内容区域 -->
              <view class="absolute bottom-3 left-3">
                <wd-avatar-group :max-count="3" size="25">
                  <wd-avatar
                    v-for="user in leg.users" :key="user.userId"
                    :text="user.nickname.slice(0, 1)"
                    :src="user.avatar"
                    bg-color="#eef2ff"
                  />
                </wd-avatar-group>
              </view>
            </view>
          </view>

          <checked-mask :value="isSelected(leg)" position="lt" />
        </view>
      </view>
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>
.title-icon-box {
  @apply: flex items-center justify-center rounded-full bg-gray-50 py-2 px-4;
}
.title-icon {
  @apply: text-20px text-gray-700;
}
</style>
