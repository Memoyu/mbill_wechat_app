<script lang="ts" setup>
import { systemInfo } from '@/utils'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单统计',
  },
})
const options = [
  '月统计',
  '年统计',
  '自定义',
]
const initializedTabs: number[] = []

const monthlyStatisRef = ref()
const annualStatisRef = ref()
const customStatisRef = ref()

const { proxy } = getCurrentInstance() as any
const active = ref(0)
const contentHeight = ref(0)
const showMore = ref(false)

watch(() => active.value, (val) => {
  initComponent(val)
})

onMounted(() => {
  calcNavbarHeight()
})

function calcNavbarHeight() {
  nextTick(() => {
    uni
      .createSelectorQuery()
      .in(proxy)
      .select('#TOP_NAVBAR')
      .boundingClientRect((view: any) => {
        contentHeight.value = systemInfo.windowHeight - (view?.height ?? 92)
        initComponent(0)
        // console.log(view, contentHeight.value, 'TOP_NAVBAR')
      })
      .exec()
  })
}

function initComponent(tabIdx: number) {
  if (initializedTabs.includes(tabIdx))
    return

  if (tabIdx === 0)
    monthlyStatisRef.value.init(contentHeight.value)
  else if (tabIdx === 1)
    annualStatisRef.value.init(contentHeight.value)
  else if (tabIdx === 2)
    customStatisRef.value.init(contentHeight.value)

  initializedTabs.push(tabIdx)
}

function handleMoreConfirm() {
  const tabIdx = active.value
  if (tabIdx === 0)
    monthlyStatisRef.value.reload()
  else if (tabIdx === 1)
    annualStatisRef.value.reload()
  else if (tabIdx === 2)
    customStatisRef.value.reload()
}
</script>

<template>
  <draw-background2 />
  <!-- 导航栏 -->
  <nav-bar id="TOP_NAVBAR" title="">
    <template #title>
      <view class="w-full flex items-center justify-between">
        <text>数据统计</text>
        <action-btn @tap="showMore = true">
          <view class="iconfont icon-book" />
        </action-btn>
      </view>
    </template>
    <template #prefix-action>
      <view class="mt-4 max-w-max rounded-full bg-gray-200/50 px-2 py-1">
        <mbill-segmented v-model="active" :gap="6" :options="options" />
      </view>
    </template>
  </nav-bar>

  <view>
    <wd-tabs v-model="active" animated>
      <wd-tab title="月统计" :name="0">
        <monthly-statis ref="monthlyStatisRef" />
      </wd-tab>

      <wd-tab title="年统计" :name="1">
        <annual-statis ref="annualStatisRef" />
      </wd-tab>

      <wd-tab title="自定义" :name="2">
        <custom-statis ref="customStatisRef" />
      </wd-tab>
    </wd-tabs>
  </view>

  <!-- 更多筛选条件 -->
  <statis-more v-model="showMore" @confirm="handleMoreConfirm" />
</template>

<style lang="scss" scoped>
// 自定义tabs
:deep(.wd-tabs) {
  background: none;
}
:deep(.wd-tabs__nav) {
  display: none !important;
}
</style>
