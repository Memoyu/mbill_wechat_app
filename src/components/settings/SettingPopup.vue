<script setup lang="ts">
import { useSettingsStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const show = defineModel<boolean>()

const settingsStore = useSettingsStore()

function handleCancelClick() {
  show.value = false
}
</script>

<template>
  <bottom-popup
    v-model="show"
    :show-btn="false"
    title="设置"
  >
    <view>
      <view>
        <view class="cell-group-title">
          <text class="title">
            主题外观
          </text>
        </view>
        <wd-cell-group insert>
          <!-- 深色模式 -->
          <wd-cell center>
            <template #title>
              <view class="cell-title">
                <view class="title">
                  <text class="iconfont icon-dark-mode icon" />
                  <text>深色模式</text>
                </view>
              </view>
            </template>
            <view class="custom-value" style="height: 32px">
              <wd-switch v-model="settingsStore.dark" size="20px" />
            </view>
          </wd-cell>
        </wd-cell-group>
      </view>

      <view>
        <view class="cell-group-title">
          <text class="title">
            位置信息
          </text>
          <text class="desc">
            启用时，将获取位置信息，点击允许获取即可
          </text>
        </view>
        <wd-cell-group insert>
          <!-- 天气 -->
          <wd-cell center>
            <template #title>
              <view class="cell-title title">
                <view class="title">
                  <text class="iconfont icon-weather icon" />
                  <text>天气</text>
                </view>
              </view>
            </template>
            <view class="custom-value" style="height: 32px">
              <wd-switch v-model="settingsStore.weather" size="20px" />
            </view>
          </wd-cell>

          <!-- 账单地址 -->
          <wd-cell center>
            <template #title>
              <view class="cell-title">
                <view class="title">
                  <text class="iconfont icon-address icon" />
                  <text>账单地址</text>
                </view>
                <text class="desc">
                  启用后将自动填充账单地址
                </text>
              </view>
            </template>
            <view class="custom-value" style="height: 32px">
              <wd-switch v-model="settingsStore.address" size="20px" />
            </view>
          </wd-cell>
        </wd-cell-group>
      </view>

      <view>
        <view class="cell-group-title">
          <text class="title">
            其他
          </text>
        </view>
        <wd-cell-group insert>
          <!-- 震动反馈 -->
          <wd-cell center>
            <template #title>
              <view class="cell-title">
                <view class="title">
                  <text class="iconfont icon-vibration icon" />
                  <text>震动反馈</text>
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
                <view class="title">
                  <text class="iconfont icon-chat icon" />
                  <text>联系作者</text>
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
      </view>
      <!-- 版本号 -->
      <view class="flex items-center justify-center py-6">
        <text class="text-xs text-gray-400">版本号 {{ settingsStore.version }}</text>
      </view>
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>
.cell-group-title {
  @apply: pl-3 flex flex-col;
  .title {
    @apply: font-semibold;
  }
  .desc {
    @apply: text-gray-400 font-normal;
  }
}

.cell-title {
  @apply: flex flex-col;
  .title {
    @apply: flex items-center gap-2 text-sm font-semibold;
    .icon {
      @apply: text-base;
    }
  }

  .desc {
    @apply: text-gray-400 text-xs;
  }
}
</style>
