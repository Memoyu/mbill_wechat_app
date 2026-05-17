<script setup lang="ts">
const props = defineProps<{
  options: string[]
}>()

const emit = defineEmits(['scrolltolower'])
const active = defineModel({ default: 0 })
const { proxy } = getCurrentInstance() as any
const lineWidth = 32

const lineLeft = ref(0)
const scrollLeft = ref(0)
const targetScroll = ref(0)
const nodes = ref<UniApp.NodeInfo[]>([])
const segmentWidth = ref(0)

watch(() => active.value, (val) => {
  scrollTo(val)
  calcLineLeft(val)
})

watch(() => props.options, (val) => {
  initOptionNode()
}, { immediate: true, deep: true })

function initOptionNode() {
  nextTick(() => {
    uni.createSelectorQuery().in(proxy).select('#MBILL_SEGMENTED_BOX').boundingClientRect((res: any) => {
      console.log(res, 'MBILL_SEGMENTED_BOX')
      segmentWidth.value = res.width

      uni.createSelectorQuery().in(proxy).selectAll('.bill-segment-item').boundingClientRect((res: any) => {
        console.log(res)

        nodes.value = res
        calcLineLeft(active.value)
      }).exec()
    }).exec()
  })
}

function handleScroll(event: any) {
  // console.log(e)
  scrollLeft.value = event.detail.scrollLeft
}

function handelOptionTap(idx: number, op: string) {
  active.value = idx
  scrollTo(idx)
  calcLineLeft(idx)
}

function scrollTo(idx: number) {
  if (!nodes.value || nodes.value.length < 1)
    return

  const segmentCenter = segmentWidth.value / 2
  const node = nodes.value[idx]

  // 计算元素中心位置
  let scroll = 0 // 左边 padding
  for (let i = 0; i < idx; i++) {
    scroll += nodes.value[i].width! + 10
  }
  // 居中滚动
  scroll = Math.floor((scroll + node.width! / 2) - segmentCenter)
  // 边界限制
  scroll = Math.max(0, scroll)

  // console.log(scroll, segmentCenter, segmentWidth.value, 'scroll')
  targetScroll.value = scroll
}

function calcLineLeft(idx: number) {
  if (!nodes.value || nodes.value.length < 1)
    return

  let offset = 0// 初始化为 px 宽度
  for (let i = 0; i < idx; i++) {
    offset += nodes.value[i].width! + 10
  }
  const node = nodes.value[idx]
  lineLeft.value = Math.floor(offset + node.width! / 2 - lineWidth / 2)
}
</script>

<template>
  <view id="MBILL_SEGMENTED_BOX" class="flex">
    <scroll-view
      scroll-x :show-scrollbar="false" scroll-with-animation :scroll-left="targetScroll" class="flex-1"
      @scroll="handleScroll"
      @scrolltolower="emit('scrolltolower')"
    >
      <view class="relative flex items-center">
        <!-- 选项 -->
        <view class="min-w-max flex gap-2.5 whitespace-nowrap">
          <view v-for="(op, index) in options" :key="index" class="bill-segment-item" @tap="handelOptionTap(index, op)">
            <view v-if="$slots.content">
              <slot name="content" :option="{ value: op, index }" />
            </view>
            <view v-else class="px-2 py-1">
              {{ op }}
            </view>
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
