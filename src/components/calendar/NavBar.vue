<script lang="ts" setup>
const date = ref('2026年03月')

function back() {
  uni.navigateBack()
}

function handleTodayClick() {
  // 定位到今天
}
</script>

<template>
  <view
    class="sticky top-0 z-10 bg-white/90 px-4 pb-3 pt-3 backdrop-blur-sm"
    :style="{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }"
  >
    <view class="flex items-center justify-between">
      <view class="flex-1">
        <view class="flex flex-col gap-1">
          <!-- 第一行：返回按钮和标题 -->
          <view class="flex items-center gap-3">
            <view
              class="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-50/80"
              hover-class="bg-gray-100/80 scale-95" :hover-start-time="0" :hover-stay-time="200"
              @tap="back"
            >
              <wd-icon name="thin-arrow-left" size="18px" class="text-gray-500" />
            </view>

            <view class="flex flex-col gap-1">
              <!-- 日期操作 -->
              <view class="w-[55vw] flex items-center justify-between text-lg text-gray-800 font-semibold">
                <view class="flex items-center">
                  <text class="mr-2">
                    {{ date }}
                  </text>
                  <wd-icon name="arrow-down" />
                </view>
                <view class="iconfont icon-calendar text-xl" @click="handleTodayClick" />
              </view>

              <!-- 收支汇总 -->
              <view class="flex items-center gap-3 text-sm">
                <view class="flex">
                  <view>
                    收入
                  </view>
                  <view class="ml-1 text-emerald">
                    2000000
                  </view>
                </view>

                <view class="flex">
                  <view>
                    支出
                  </view>
                  <view class="ml-1 text-rose">
                    2000000
                  </view>
                </view>

                <view class="flex">
                  <view>
                    结余
                  </view>
                  <view class="ml-1 text-gray">
                    2000000
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
