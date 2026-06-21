<script lang="ts" setup>
import type { IUpdateLedgerColor } from '@/api/types/ledger'
import { useDialog } from '@wot-ui/ui'
import { colorSystems, getColorSystem, getSystemName, gradients } from '@/constants/gradients'
import { useLedgerStore } from '@/store'

const props = defineProps<{
  ledgerId: string
}>()
const show = defineModel<boolean>()

const dialog = useDialog()
const ledgerStore = useLedgerStore()

// 获取当前卡盒的颜色
const currentColor = computed(() => {
  return ledgerStore.getLedgerColor(props.ledgerId)
})

function handleSelect(colorIndex: number) {
  ledgerStore.updateLedgerColor([{ ledgerId: props.ledgerId, color: colorIndex }])
}

const currentSystem = computed(() => getColorSystem(currentColor.value))

// 处理统一色系
function handleUnifyColors() {
  dialog
    .confirm({
      title: '统一色系',
      msg: `是否将所有账本统一为${getSystemName(currentSystem.value)}系？`,
    })
    .then(() => {
      const system = currentSystem.value
      const systemColors = [...colorSystems[system]]

      // 找到当前颜色在色系中的位置
      const currentColorIndex = systemColors.indexOf(currentColor.value)

      // 如果当前颜色不在目标色系中，从色系的第一个颜色开始
      const startIndex = currentColorIndex >= 0 ? currentColorIndex : 0

      ledgerStore.ledgers.forEach((ledger, index) => {
        // 从当前颜色开始，循环使用色系中的颜色
        const colorIndex = systemColors[(startIndex + index) % systemColors.length]
        ledgerStore.updateLedgerColor([{ ledgerId: ledger.ledgerId, color: colorIndex }])
      })
    })
}

// 处理渐变排布
function handleRainbowColors() {
  dialog
    .confirm({
      title: '设置彩虹色',
      msg: '是否将所有账本按顺序应用渐变色？',
    })
    .then(() => {
      const updates: IUpdateLedgerColor[] = []
      ledgerStore.ledgers.forEach((ledger, index) => {
        const colorIndex = index % gradients.length
        updates.push({ ledgerId: ledger.ledgerId, color: colorIndex })
      })
      ledgerStore.updateLedgerColor(updates)
    })
}

// 处理统一当前色
function handleUnifyAll() {
  dialog
    .confirm({
      title: '统一颜色',
      msg: '是否将所有账本统一为当前选中的颜色？',
    })
    .then(() => {
      const updates: IUpdateLedgerColor[] = []
      ledgerStore.ledgers.forEach((ledger) => {
        updates.push({ ledgerId: ledger.ledgerId, color: currentColor.value })
      })
      ledgerStore.updateLedgerColor(updates)
    })
}
</script>

<template>
  <wd-popup
    custom-class="rounded-t-3xl overflow-hidden"
    :model-value="show"
    position="bottom"
    :safe-area-inset-bottom="true"
  >
    <view class="overflow-hidden">
      <!-- 标题栏 -->
      <view class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <text class="text-base font-semibold">选择卡盒颜色</text>
        <view
          class="rounded-full px-4 py-1.5 text-sm text-gray-400 hover:bg-gray-50"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="show = false"
        >
          关闭
        </view>
      </view>

      <!-- 颜色网格 -->
      <view class="p-4">
        <!-- 操作按钮组 -->
        <view class="mb-4">
          <view class="grid grid-cols-3 gap-3">
            <view class="flex flex-col items-center" @tap="handleUnifyColors">
              <view
                class="mb-1 h-12 w-full flex items-center justify-center rounded-lg transition-colors"
                :class="[
                  currentSystem === 'warm'
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50',
                ]"
                hover-class="scale-95 transition-all origin-center"
                :hover-start-time="0"
                :hover-stay-time="200"
              >
                <text
                  class="i-carbon-split-discard text-lg"
                  :class="[currentSystem === 'warm' ? 'text-amber-500' : 'text-blue-500']"
                />
              </view>
              <text class="text-xs text-gray-700">{{ getSystemName(currentSystem) }}系</text>
            </view>

            <view class="flex flex-col items-center" @tap="handleRainbowColors">
              <view
                class="mb-1 h-12 w-full flex items-center justify-center rounded-lg bg-gray-50/80 transition-colors hover:bg-gray-100/80"
                hover-class="scale-95 transition-all origin-center"
                :hover-start-time="0"
                :hover-stay-time="200"
              >
                <text class="i-carbon-color-palette text-lg text-gray-500" />
              </view>
              <text class="text-xs text-gray-700">彩虹色</text>
            </view>

            <view class="flex flex-col items-center" @tap="handleUnifyAll">
              <view
                class="mb-1 h-12 w-full flex items-center justify-center rounded-lg bg-gray-50/80 transition-colors hover:bg-gray-100/80"
                hover-class="scale-95 transition-all origin-center"
                :hover-start-time="0"
                :hover-stay-time="200"
              >
                <text class="i-carbon-circle-solid text-lg text-gray-500" />
              </view>
              <text class="text-xs text-gray-700">统一颜色</text>
            </view>
          </view>
        </view>

        <!-- 颜色网格 -->
        <view class="grid grid-cols-4 gap-4">
          <view
            v-for="(gradient, index) in gradients"
            :key="index"
            class="relative aspect-square overflow-hidden rounded-xl shadow-sm transition-all duration-200"
            :class="[currentColor === index ? 'ring-2 ring-indigo-500 ring-offset-2' : '']"
            :style="{ background: gradient }"
            hover-class="scale-95 shadow-md"
            :hover-start-time="0"
            :hover-stay-time="200"
            @tap="handleSelect(index)"
          >
            <!-- 选中标记 -->
            <view
              v-if="currentColor === index"
              class="absolute bottom-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-indigo-500"
            >
              <text class="iconfont icon-check text-xs text-white" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </wd-popup>
  <wd-dialog />
</template>

<style lang="scss" scoped>
//
</style>
