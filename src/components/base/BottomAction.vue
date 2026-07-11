<script setup lang="ts">
import type { ActionItem } from '@/typings'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  actions: ActionItem[]
  direction?: 'horizontal' | 'vertical'
  moreActions?: ActionItem[]
}>(), {
  direction: 'vertical',
})

const emit = defineEmits(['moreTap'])

const moreShow = ref(false)

function handleMoreTap() {
  moreShow.value = !moreShow.value
}

function showMore() {
  return props.moreActions && props.moreActions.length > 0
}
</script>

<template>
  <view id="BOTTOM_ACTION" class="fixed bottom-5 left-0 right-0 z-4 mx-auto max-w-2xl w-[90vw]">
    <view
      class="relative flex flex-1 items-center justify-between overflow-hidden rounded-2xl bg-white p-2 shadow-lg"
      :style="{ boxShadow: '0 8px 24px -6px rgba(0,0,0,0.12), 0 4px 8px -4px rgba(0,0,0,0.08)' }"
    >
      <scroll-view
        scroll-x
        :show-scrollbar="false"
        class="relative mr-2 w-83% flex-1"
        enhanced
        :bounces="false"
      >
        <view
          v-if="direction === 'vertical'"
          class="min-w-max flex items-center gap-2.5 whitespace-nowrap"
          :class="[showMore() ? '' : 'justify-center']"
        >
          <view
            v-for="(action, index) in actions" :key="index"
            class="w-13 flex flex-col items-center justify-center gap-1.5 rounded-xl px-0.5 py-2"
            :hover-class="`${action.type === 'danger' ? 'bg-red-50' : action.type === 'warning' ? 'bg-yellow-50' : 'bg-gray-50'} scale-95 origin-center transition-all`"
            :hover-start-time="0"
            :hover-stay-time="200"
            @tap="action.action()"
          >
            <text
              v-if="action.icon.startsWith('icon-')" class="text-[17px]"
              :class="[action.icon, action.type === 'danger' ? 'text-red-500' : action.type === 'warning' ? 'text-yellow-500' : 'text-gray-500']"
            />
            <wd-icon
              v-else :name="action.icon"
              :custom-class="`${action.type === 'danger' ? 'text-red-500' : action.type === 'warning' ? 'text-yellow-500' : 'text-gray-500'}`"
              size="17px"
            />
            <text
              class="text-[10px] leading-none"
              :class="[action.type === 'danger' ? 'text-red-700' : action.type === 'warning' ? 'text-yellow-700' : 'text-gray-700']"
            >
              {{ action.text }}
            </text>
          </view>
        </view>
        <view v-else class="min-w-max flex items-center gap-2.5 whitespace-nowrap px-2 py-1">
          <view
            v-for="(action, index) in actions" :key="index"
            class="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2"
            :class="[action.type === 'danger' ? 'bg-red-50' : action.type === 'warning' ? 'bg-yellow-50' : 'bg-gray-50']"
            hover-class="opacity-60"
            :hover-start-time="0"
            :hover-stay-time="200"
            @tap="action.action()"
          >
            <text
              v-if="action.icon.startsWith('icon-')" class="text-[17px]"
              :class="[action.icon, action.type === 'danger' ? 'text-red-500' : action.type === 'warning' ? 'text-yellow-500' : 'text-gray-500']"
            />
            <wd-icon
              v-else :name="action.icon"
              :custom-class="`${action.type === 'danger' ? 'text-red-500' : action.type === 'warning' ? 'text-yellow-500' : 'text-gray-500'}`"
              size="17px"
            />
            <text
              class="text-[10px] leading-none"
              :class="[action.type === 'danger' ? 'text-red-700' : action.type === 'warning' ? 'text-yellow-700' : 'text-gray-700']"
            >
              {{ action.text }}
            </text>
          </view>
        </view>
      </scroll-view>

      <!-- 添加渐变遮罩 -->
      <view
        v-if="showMore()"
        class="pointer-events-none absolute bottom-0 right-[3.5rem] top-0 w-10 transition-opacity duration-200"
        :style="{
          background:
            'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,1) 100%)',
        }"
      />

      <!-- 更多按钮 -->
      <view
        v-if=" showMore() && direction === 'vertical'"
        class="relative z-1 h-12 w-13 flex flex-col items-center justify-center gap-1 rounded-xl"
        :style="{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.05)' }"
        hover-class="bg-gray-50/80 scale-95 origin-center transition-all"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="handleMoreTap"
      >
        <wd-icon name="more" size="17px" />
        <text class="text-[10px] text-gray-500 leading-none">更多</text>
      </view>
      <view
        v-if="showMore() && direction === 'horizontal'"
        class="flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 px-3 py-2"
        hover-class="opacity-60"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="emit('moreTap')"
      >
        <wd-icon name="more" size="17px" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
