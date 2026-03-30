<script setup lang="ts">
import { tabbarList, tabbarStore } from './store'
import TabbarItem from './TabbarItem.vue'

// 将自定义节点设置成虚拟的（去掉自定义组件包裹层），更加接近Vue组件的表现，能更好的使用flex属性
defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

function handleClickItemBar(index: number) {
  // 点击原来的不做操作
  if (index === tabbarStore.curIdx) {
    return
  }
  const list = tabbarList.value
  if (!list[index]) {
    return
  }

  const url = list[index].pagePath
  tabbarStore.setCurIdx(index)
  uni.switchTab({ url })
}

function handleClickCustomBar() {
  uni.navigateTo({
    url: '/pages/bill/edit',
  })
}
</script>

<template>
  <view class="">
    <view class="tabbar-box mx-auto w-90% flex" @touchmove.stop.prevent>
      <view
        class="tabbar-shadow tabbar-list"
      >
        <view
          v-for="(item, index) in tabbarList" :key="index"
          class="flex flex-1 flex-col items-center justify-center"
          @tap="handleClickItemBar(index)"
        >
          <TabbarItem :item="item" :index="index" class="relative text-center" />
        </view>
      </view>
      <!-- 自定义添加按钮 -->
      <view
        class="tabbar-shadow tabbar-custom"
        hover-class="bg-indigo-500/15 scale-95"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="handleClickCustomBar"
      >
        <text class="i-carbon-add text-xl" />
        <text class="text-xs font-semibold">添加</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.tabbar-box {
  position: fixed;
  bottom: 32px;
  left: 0;
  right: 0;
  // z-index: 1000;
  box-sizing: border-box;
}

.tabbar-list {
  @apply: bg-white dark:bg-[var(--wot-dark-background6)] relative flex flex-1 items-center justify-between rounded-full px-2.5 py-1.5;
}

.tabbar-custom {
  @apply: bg-indigo-300 dark:bg-indigo-500  ml-5 flex items-center gap-2 rounded-full  px-4 transition-colors;
}

.tabbar-shadow {
  @apply: shadow-lg;
  box-shadow:
    0 8px 24px -6px rgba(0, 0, 0, 0.12),
    0 4px 8px -4px rgba(0, 0, 0, 0.08);
}
</style>
