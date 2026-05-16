<script setup lang="ts">
import { systemInfo } from '@/utils/systemInfo'

const props = withDefaults(defineProps<{
  options: string[]
  width?: number
}>(), {
})

const active = defineModel<number>()
const { proxy } = getCurrentInstance() as any
const lineWidth = 32
const px = 12

const lineLeft = ref(0)
const scrollLeft = ref(0)
const maxScroll = ref(0)
const targetScroll = ref(0)
const optionNodes = ref([])
const segmentWidth = ref(0)

watch(() => active.value, (val) => {
  scrollTo(val)
  calcLineLeft(val)
})

onMounted(() => {
  initOptionNode()
})
function initOptionNode() {
  nextTick(() => {
    uni.createSelectorQuery().in(proxy).selectAll('.bill-segment-item').boundingClientRect((res: UniApp.NodeInfo[]) => {
      // console.log(res, (res.length - 1) * 10)
      optionNodes.value = res
      const dpx = px * 2

      const totalContentWidth = res.reduce((sum, curr, idx) => {
        return sum + curr.width + (idx < res.length - 1 ? 10 : 0) // 最后一个不加 gap
      }, dpx)
      // 没有自定义宽度时，根据选项计算宽度
      segmentWidth.value = props.width
        ? props.width
        : totalContentWidth > systemInfo.windowWidth ? (systemInfo.windowWidth - dpx) : totalContentWidth // 不超过屏幕宽度
      maxScroll.value = Math.max(0, totalContentWidth - segmentWidth.value)

      calcLineLeft(active.value)
    }).exec()
  })
}

function handleScroll(e) {
  // console.log(e)
  scrollLeft.value = e.detail.scrollLeft
}

function handelOptionTap(idx: number, op: string) {
  active.value = idx
  scrollTo(idx)
  calcLineLeft(idx)
}

function scrollTo(idx: number) {
  if (!optionNodes.value.length)
    return

  const segmentCenter = segmentWidth.value / 2
  const node = optionNodes.value[idx]

  // 计算元素中心位置
  let scroll = px // 左边 padding
  for (let i = 0; i < idx; i++) {
    scroll += optionNodes.value[i].width + 10
  }
  // 居中滚动
  scroll = (scroll + node.width / 2) - segmentCenter
  // 边界限制
  scroll = Math.max(0, Math.min(scroll, maxScroll.value))

  // console.log(scroll, 'scroll')
  targetScroll.value = scroll
}

function calcLineLeft(idx: number) {
  let offset = px // 初始化为 px 宽度
  for (let i = 0; i < idx; i++) {
    offset += optionNodes.value[i].width + 10
  }
  const node = optionNodes.value[idx]
  lineLeft.value = offset + (node.width / 2) - lineWidth / 2
}
</script>

<template>
  <view class="flex" :style="{ width: `${segmentWidth}px` }">
    <scroll-view scroll-x :show-scrollbar="false" scroll-with-animation :scroll-left="targetScroll" class="flex-1" @scroll="handleScroll">
      <view class="relative flex items-center px-3">
        <!-- 选项 -->
        <view class="min-w-max flex gap-2.5 whitespace-nowrap">
          <view v-for="(op, index) in options" :key="index" class="bill-segment-item px-2 py-1" @tap="handelOptionTap(index, op)">
            {{ op }}
          </view>
        </view>
        <!-- 底部条 -->
        <view
          class="absolute bottom-1 z--1 h-2 rounded-full bg-indigo-300 transition-all duration-300"
          :style="{ width: `${lineWidth}px`, left: `${lineLeft}px` }"
        />
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>

</style>
