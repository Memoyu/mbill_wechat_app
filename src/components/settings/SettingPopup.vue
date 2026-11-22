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
const showThemeColor = ref<boolean>(false)

const settingsStore = useSettingsStore()
const {
  followSystem,
  isDark,
  currentThemeColor,
  toggleTheme,
  setFollowSystem,
  selectThemeColor,
} = useTheme()

function handleCancelClick() {
  show.value = false
}

function handleThemeColorSelect(index: number) {
  selectThemeColor(themeColorOptions[index])
}
</script>

<template>
  <bottom-popup
    v-model="show"
    :show-btn="false"
    title="设置"
  >
    <view class="space-y-4">
      <view>
        <view class="cell-group-title">
          <text class="title">
            主题外观
          </text>
        </view>
        <wd-cell-group insert>
          <!-- 跟随系统 -->
          <wd-cell clickable center @click="() => setFollowSystem(!followSystem)">
            <template #title>
              <view class="cell-title">
                <view class="title">
                  <text class="i-lucide-contrast icon" />
                  <text>跟随系统</text>
                </view>
              </view>
            </template>

            <wd-switch :model-value="followSystem" size="20px" />
          </wd-cell>

          <!-- 深色模式 -->
          <wd-cell :clickable="!followSystem" center @click="toggleTheme">
            <template #title>
              <view class="cell-title">
                <view class="title">
                  <text class="i-lucide-moon icon" />
                  <text>深色模式</text>
                </view>
              </view>
            </template>

            <wd-switch :model-value="isDark" size="20px" />
          </wd-cell>

          <!-- 主题颜色 -->
          <wd-cell clickable center @click="showThemeColor = true">
            <template #title>
              <view class="cell-title">
                <view class="title">
                  <text class="i-lucide-palette icon" />
                  <text>主题颜色</text>
                </view>
              </view>
            </template>

            <text>{{ currentThemeColor.name }}</text>
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
          <wd-cell clickable center @click="() => settingsStore.weather = !settingsStore.weather">
            <template #title>
              <view class="cell-title title">
                <view class="title">
                  <text class="i-lucide-cloud-sun icon" />
                  <text>天气</text>
                </view>
              </view>
            </template>

            <wd-switch :model-value="settingsStore.weather" size="20px" />
          </wd-cell>

          <!-- 账单地址 -->
          <wd-cell clickable center @click="() => settingsStore.address = !settingsStore.address">
            <template #title>
              <view class="cell-title">
                <view class="title">
                  <text class="i-lucide-map-pinned icon" />
                  <text>账单地址</text>
                </view>
                <text class="desc">
                  启用后将自动填充账单地址
                </text>
              </view>
            </template>

            <wd-switch :model-value="settingsStore.address" size="20px" />
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
          <wd-cell clickable center @click="() => settingsStore.vibration = !settingsStore.vibration">
            <template #title>
              <view class="cell-title">
                <view class="title">
                  <text class="i-lucide-waves-horizontal icon" />
                  <text>震动反馈</text>
                </view>
              </view>
            </template>

            <wd-switch :model-value="settingsStore.vibration" size="20px" />
          </wd-cell>

          <!-- 联系作者 -->
          <view class="relative">
            <wd-cell is-link center>
              <template #title>
                <view class="cell-title">
                  <view class="title">
                    <text class="i-lucide-message-circle-more icon" />
                    <text>联系开发者</text>
                  </view>
                </view>
              </template>
            </wd-cell>
            <!-- 透明 button 覆盖整个 cell，触发微信客服 -->
            <button open-type="contact" class="contact-btn" />
          </view>
        </wd-cell-group>
      </view>
      <!-- 版本号 -->
      <view class="flex items-center justify-center py-6">
        <text class="text-xs text-gray-400">版本号 {{ settingsStore.version }}</text>
      </view>
    </view>
  </bottom-popup>

  <bottom-popup v-model="showThemeColor" title="主题颜色" height="40vh" :show-btn="false">
    <!-- 颜色网格 -->
    <view class="p-4">
      <!-- 颜色网格 -->
      <view class="grid grid-cols-3 gap-4">
        <view
          v-for="(tc, i) in themeColorOptions"
          :key="i"
          class="relative aspect-square rounded-xl shadow-sm transition-all duration-200"
          :style="{ background: tc.primary }"
          hover-class="scale-95 shadow-md"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="handleThemeColorSelect(i)"
        >
          <checked-mask :value="currentThemeColor.value === tc.value" position="lt" />
        </view>
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

.contact-btn {
  @apply absolute inset-0 opacity-0;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  line-height: inherit;
  font-size: inherit;
  &::after {
    display: none;
  }
}
</style>
