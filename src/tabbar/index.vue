<script setup lang="ts">
// i-carbon-code
import { tabbarList, tabbarStore } from './store'
import TabbarItem from './TabbarItem.vue'

// 将自定义节点设置成虚拟的（去掉自定义组件包裹层），更加接近Vue组件的表现，能更好的使用flex属性
defineOptions({
  virtualHost: true,
})

function handleClick(index: number) {
  // console.log(this)
  // activeCircleRef.value.classList.add('jello-animation')
  // setTimeout(() =>
  //   activeCircleRef.value.classList.remove('jello-animation')
  // }, 500)

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
</script>

<template>
  <view class="">
    <view class="tabbar-box mx-auto w-90% flex dark:bg-[var(--wot-dark-background2)]" @touchmove.stop.prevent>
      <view
        class="tabbar-shadow relative flex flex-1 items-center justify-between rounded-full bg-white/70 px-2.5 py-1.5"
      >
        <view id="activeCircle" class="active-circle jello-animation" :style="{ left: `${(46 + (tabbarStore.curIdx) * 103)}` + 'px' }" />
        <view
          v-for="(item, index) in tabbarList" :key="index"
          class="flex flex-1 flex-col items-center justify-center"
          @click="handleClick(index)"
        >
          <TabbarItem :item="item" :index="index" class="relative text-center" />
        </view>
      </view>
      <!-- 自定义添加按钮 -->
      <view
        class="tabbar-shadow ml-5 flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 transition-colors"
        hover-class="bg-indigo-500/15 scale-95"
        :hover-start-time="0"
        :hover-stay-time="200"
      >
        <text class="i-carbon-add text-20px text-indigo-500" />
        <text class="text-sm text-indigo-500 font-medium">添加</text>
      </view>
      <view class="pb-safe" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.tabbar-box {
  position: fixed;
  bottom: 32px;
  left: 0;
  right: 0;
  z-index: 1000;
  box-sizing: border-box;
}

.tabbar-shadow {
  @apply: shadow-lg;
  box-shadow:
    0 8px 24px -6px rgba(0, 0, 0, 0.12),
    0 4px 8px -4px rgba(0, 0, 0, 0.08);
}

/* 选中项的背景圆 */
.active-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
  bottom: calc(50% - 15px);
  transition: 0.4s ease-in-out;
  @apply: bg-indigo-500/15;
}

.jello-animation {
  /* 执行动画：动画名 时长 线性的 停留在最后一帧 */
  animation: jello 0.8s linear forwards;
}

/* 定义动画 */
/* 果冻Q弹效果 */
@keyframes jello {
  0% {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
