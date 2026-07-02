<script lang="ts" setup>
import type { ILedger } from '@/api/types/ledger'
import { gradients } from '@/constants/gradients'

const props = defineProps<{
  data: ILedger
}>()
const emit = defineEmits(['tap'])
</script>

<template>
  <view class="relative transform-gpu animate-fade-in animate-duration-300 transition-all duration-300" @tap.stop="emit('tap', data)">
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
    >
      <!-- 账簿封面 -->
      <view class="aspect-[5/4] bg-gradient-to-br" :style="{ background: gradients[props.data.color] }">
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
          <!-- 账本内容区域 -->
          <view class="relative h-full flex flex-col overflow-hidden">
            <!-- 账本名称 -->
            <text class="line-clamp-1 w-85% text-base text-gray-800 font-semibold">
              {{ data.name }}
            </text>

            <view class="mt-2">
              <view class="flex items-baseline">
                <view class="text-xs">
                  收入
                </view>
                <view class="ml-2 text-emerald font-bold">
                  {{ data.income }}
                </view>
              </view>

              <view class="flex items-baseline">
                <view class="text-xs">
                  支出
                </view>
                <view class="ml-2 text-rose font-bold">
                  {{ data.expend }}
                </view>
              </view>
            </view>
          </view>

          <!-- 底部内容区域 -->
          <view class="absolute bottom-3 left-3">
            <wd-avatar-group :max-count="3" size="25">
              <wd-avatar
                v-for="user in data.users" :key="user.userId"
                :text="user.nickname.slice(0, 1)"
                :src="user.avatar"
                bg-color="#a5b4fc"
              />
            </wd-avatar-group>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加插槽 -->
    <slot name="action" />
  </view>
</template>

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
