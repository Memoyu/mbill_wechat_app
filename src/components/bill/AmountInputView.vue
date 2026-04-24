<script lang="ts" setup>
import { useTouch } from 'wot-design-uni'
import { systemInfo } from '@/utils/systemInfo'

const props = defineProps<{
  cursor: number
}>()

const emit = defineEmits(['update:cursor'])
const chars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '-', '+', '×', '÷']
const charWidths = {}

const input = defineModel<string>()

const maxWidth = systemInfo.windowWidth // 最大画布宽度
// 响应式宽度
const canvasWidth = ref(maxWidth)
const canvasHeight = 30 // Canvas 高度
const px = 10 // 初始偏移量

// 光标位置
const cursorPosition = ref(0)

const touch = useTouch()
const { proxy } = getCurrentInstance() as any
const pixelRatio = ref<number>(1) // 像素比
const active = ref<boolean>(false)

const cursorLeft = ref(0)

watch(
  () => input.value,
  () => {
  },
  { deep: true, immediate: true },
)

watch(
  () => props.cursor,
  (newValue) => {
    cursorPosition.value = newValue
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  initCharWidth()
})

function initCharWidth() {
  const ctx = uni.createCanvasContext('amount-input-canvas', proxy)
  ctx.setFontSize(18)
  ctx.scale(pixelRatio.value, pixelRatio.value)
  // ctx.font = `${18}px sans-serif`

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    console.log(ctx.measureText(char))
    const charWidth = ctx.measureText(char).width
    charWidths[char] = charWidth
  }
  console.log(charWidths)
}

function onTouchStart(event: TouchEvent) {
  touch.touchStart(event)
  active.value = true
}

function onTouchMove(event: TouchEvent) {
  touch.touchMove(event)
  if (touch.direction.value) {
    active.value = false
  }
}

// 处理 Canvas 点击事件
function onTouchEnd(event: TouchEvent) {
  if (!active.value)
    return

  const x = touch.startX.value

  console.log(x, touch, 'x')
  let totalWidth = 0
  let newIndex = 0
  for (let i = 0; i < input.value.length; i++) {
    const char = input.value[i]

    const charWidth = charWidths[char]
    console.log(char, charWidth, 'char')
    if (x <= totalWidth + charWidth / 2) {
      newIndex = i
      break
    }
    else {
      newIndex = input.value.length
    }
    totalWidth += charWidth
  }

  console.log(totalWidth, 'totalWidth')
  cursorLeft.value = totalWidth
}
</script>

<template>
  <view class="relative h-28px w-100vw text-18px">
    <view class="amount-input" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      {{ input }}
    </view>
    <view class="absolute bottom-0 top-0 w-1.5px bg-indigo" :style="{ left: `${cursorLeft}px` }" />
  </view>
</template>

<style lang="scss">
.amount-input {
  overflow-x: auto;
}
</style>
