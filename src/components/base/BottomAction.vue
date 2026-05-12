<script setup lang="ts">
export interface ActionItem {
  title: string
  icon: string
  action: () => void
}

const props = withDefaults(defineProps<{
  actions: ActionItem[]
  shwoMore?: boolean
}>(), {
  shwoMore: true,
})

const emit = defineEmits(['moreTap'])
</script>

<template>
  <view id="BOTTOM_ACTION" class="fixed bottom-5 left-0 right-0 z-4 mx-auto max-w-2xl w-[90vw]">
    <view
      class="relative flex flex-1 items-center justify-between overflow-hidden rounded-2xl bg-white p-2 shadow-lg"
      :style="{
        boxShadow: '0 8px 24px -6px rgba(0,0,0,0.12), 0 4px 8px -4px rgba(0,0,0,0.08)',
      }"
    >
      <scroll-view
        scroll-x
        :show-scrollbar="false"
        class="relative mr-2 flex-1"
        enhanced
        :bounces="false"
        @scroll="onScroll"
      >
        <view class="min-w-max flex items-center gap-2.5 whitespace-nowrap px-0.5">
          <view
            v-for="(item, index) in actions" :key="index"
            class="w-13 flex flex-col items-center justify-center gap-1.5 rounded-xl p-2"
            hover-class="bg-gray-50/80 scale-95 origin-center transition-all"
            :hover-start-time="0"
            :hover-stay-time="200"
            @tap="startPractice"
          >
            <text v-if="item.icon.startsWith('icon-')" class="i-tabler-mood-up text-[17px] text-gray-600" />
            <wd-icon v-else :name="item.icon" size="17px" />
            <text class="text-[10px] text-gray-500 leading-none">{{ item.title }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 添加渐变遮罩 -->
      <view
        class="pointer-events-none absolute bottom-0 right-[3.5rem] top-0 w-10 transition-opacity duration-200"
        :style="{
          background:
            'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,1) 100%)',
        }"
      />

      <!-- 更多按钮 -->
      <view
        v-if="shwoMore"
        class="relative z-1 h-12 w-13 flex flex-col items-center justify-center gap-1 rounded-xl"
        :style="{
          boxShadow: '0 2px 8px -2px rgba(0,0,0,0.05)',
        }"
        hover-class="bg-gray-50/80 scale-95 origin-center transition-all"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="emit('moreTap')"
      >
        <wd-icon name="more" size="17px" />
        <text class="text-[10px] text-gray-500 leading-none">更多</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
