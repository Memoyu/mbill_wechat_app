<script setup lang="ts">
import { useSettingsStore } from '@/store'

const show = defineModel<boolean>()

const settingsStore = useSettingsStore()

function handleCancelClick() {
  show.value = false
}
</script>

<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :close-on-click-modal="true"
    :safe-area-inset-bottom="true"
    custom-class="rounded-t-3xl relative h-60vh"
    lock-scroll
    @close="handleCancelClick"
  >
    <view class="h-full overflow-auto">
      <!-- 标题栏 -->
      <view class="sticky left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <text class="text-base font-semibold">设置</text>
      </view>

      <wd-cell-group border title="主题外观">
        <!-- 深色模式 -->
        <wd-cell center>
          <template #title>
            <view class="cell-title">
              <view class="iconfont icon-dark-mode cell-title-icon" />
              <view class="text-sm">
                深色模式
              </view>
            </view>
          </template>
          <view class="custom-value" style="height: 32px">
            <wd-switch v-model="settingsStore.dark" size="20px" />
          </view>
        </wd-cell>
      </wd-cell-group>

      <wd-cell-group border>
        <template #title>
          <view>
            <view>位置信息</view>
            <view class="text-[#868a9c] font-normal">
              启用时，将获取位置信息，点击允许获取即可
            </view>
          </view>
        </template>

        <!-- 天气 -->
        <wd-cell center>
          <template #title>
            <view class="cell-title">
              <view class="iconfont icon-weather cell-title-icon" />
              <view class="text-sm">
                天气
              </view>
            </view>
          </template>
          <view class="custom-value" style="height: 32px">
            <wd-switch v-model="settingsStore.weather" size="20px" />
          </view>
        </wd-cell>

        <!-- 账单地址 -->
        <wd-cell center label="启用后将自动填充账单地址">
          <template #title>
            <view class="cell-title">
              <view class="iconfont icon-address cell-title-icon" />
              <view class="text-sm">
                账单地址
              </view>
            </view>
          </template>
          <view class="custom-value" style="height: 32px">
            <wd-switch v-model="settingsStore.address" size="20px" />
          </view>
        </wd-cell>
      </wd-cell-group>

      <wd-cell-group border title="其他">
        <!-- 震动反馈 -->
        <wd-cell center>
          <template #title>
            <view class="cell-title">
              <view class="iconfont icon-vibration cell-title-icon" />
              <view class="text-sm">
                震动反馈
              </view>
            </view>
          </template>
          <view class="custom-value" style="height: 32px">
            <wd-switch v-model="settingsStore.vibration" size="20px" />
          </view>
        </wd-cell>

        <!-- 联系作者 -->
        <wd-cell center>
          <template #title>
            <view class="cell-title">
              <view class="iconfont icon-chat cell-title-icon" />
              <view class="text-sm">
                联系作者
              </view>
            </view>
          </template>
          <view class="custom-value" style="height: 32px">
            <wd-button
              variant="text"
              icon="caret-right"
              custom-class="!text-gray-4"
              size="small"
              open-type="contact"
            />
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 版本号 -->
      <view class="flex items-center justify-center py-6">
        <text class="text-xs text-gray-400">版本号 {{ settingsStore.version }}</text>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.cell-title {
  @apply: flex items-center gap-2;
}
.cell-title-icon {
  @apply: text-18px text-gray-700 font-semibold;
}
</style>
