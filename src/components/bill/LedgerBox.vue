<template>
  <view class="group relative transform-gpu animate-fade-in animate-duration-300 transition-all duration-300">
    <!-- 添加阴影容器 -->
    <view
      class="absolute inset-0 rounded-xl transition-all duration-200 -z-1"
      :style="{
        transform: 'scale(0.97)',
        boxShadow: '0 8px 20px -6px rgba(0,0,0,0.06), 0 4px 12px -4px rgba(0,0,0,0.03)',
      }"
    />

    <view
      class="relative overflow-hidden rounded-xl bg-white transition-all duration-200"
      hover-class="scale-97 origin-center"
      :hover-start-time="0"
      :hover-stay-time="200"
      @tap="onBoxClick"
    >
      <!-- 账簿封面 -->
      <view class="aspect-[5/4] bg-gradient-to-br" :style="{ background: getGradientById(data.ledgerId) }">
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

        <view class="absolute inset-0 flex flex-col p-3">
          <!-- 右上角操作按钮 -->
          <view class="absolute right-3 top-3 z-10">
            <view
              class="h-6 w-6 flex items-center justify-center rounded-full bg-white/90 shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
              hover-class="bg-gray-50"
              :hover-start-time="0"
              :hover-stay-time="200"
              @tap.stop="onMoreBtnTap"
            >
              <wd-icon name="ellipsis" />
            </view>
          </view>

          <!-- 账簿内容区域 -->
          <view class="relative h-full flex flex-col overflow-hidden">
            <!-- 账簿名称 -->
            <text class="line-clamp-1 w-85% text-base text-gray-800 font-semibold">
              {{ data.name }}
            </text>

            <view class="mt-2">
              <view class="flex items-baseline">
                <view class="text-xs">
                  收入
                </view>
                <view class="ml-2 text-emerald font-bold">
                  2000000
                </view>
              </view>

              <view class="flex items-baseline">
                <view class="text-xs">
                  支出
                </view>
                <view class="ml-2 text-rose font-bold">
                  2000000
                </view>
              </view>
            </view>
          </view>

          <!-- 底部内容区域 -->
          <view class="absolute bottom-3 left-3">
            <wd-avatar-group :max-count="3" size="25">
              <wd-avatar text="明" />
              <wd-avatar icon="star-on" />
              <wd-avatar text="A" bg-color="#1E90FF" />
              <wd-avatar text="B" bg-color="#228B22" />
              <wd-avatar text="C" bg-color="#DC143C" />
            </wd-avatar-group>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { gradients } from '@/constants/gradients'

const props = defineProps<{
  data: any
}>()

function onBoxClick() {

}

// 在 script setup 中添加
const decorationCache = new Map()

// 修改 getGradientById 函数
function getGradientById(cardId: string) {
  // 如果卡盒有指定颜色,则使用指定的颜色
  if (props.data.color !== undefined) {
    return gradients[props.data.color]
  }

  // 对于没有指定颜色的卡盒，使用随机但固定的颜色
  const cacheKey = `gradient-${cardId}`
  if (decorationCache.has(cacheKey)) {
    return decorationCache.get(cacheKey)
  }

  const len = cardId.length
  const seed
    = cardId.charCodeAt(0) + cardId.charCodeAt(Math.floor(len / 2)) + cardId.charCodeAt(len - 1)

  const gradient = gradients[seed % gradients.length]
  decorationCache.set(cacheKey, gradient)
  return gradient
}

function onMoreBtnTap(e: any) {

}
</script>

<style scoped>
.text-2xs {
  font-size: 0.65rem;
  line-height: 1rem;
}

.line-clamp-1 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
