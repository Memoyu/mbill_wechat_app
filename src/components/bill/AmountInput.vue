<script lang="ts" setup>
import { useTouch } from 'wot-design-uni'
import { canvas2dAdapter } from 'wot-design-uni/components/common/canvasHelper'
import { objToStyle } from '@/utils'
import { systemInfo } from '@/utils/systemInfo'

const props = defineProps<{
  cursor: number
}>()
const emit = defineEmits(['update:cursor'])
const input = defineModel<string>()

const maxWidth = systemInfo.windowWidth // 最大画布宽度
// 响应式宽度
const canvasWidth = ref(maxWidth)
const canvasHeight = 30 // Canvas 高度
const px = 10 // 初始偏移量

// 光标位置
const cursorPosition = ref(0)
// Canvas 上下文
let ctx: UniApp.CanvasContext | null = null
let canvas: HTMLCanvasElement | null = null
const canvasId = ref('textCanvas')

const touch = useTouch()
const { proxy } = getCurrentInstance() as any
const pixelRatio = ref<number>(1) // 像素比
const active = ref<boolean>(false)

watchEffect(() => {

})

const canvasStyle = computed(() => {
  const style = {
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight}px`,
  }
  return `${objToStyle(style)}`
})

watch(
  () => input.value,
  () => {
    updateCanvasSize()
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => props.cursor,
  (newValue) => {
    cursorPosition.value = newValue
    // console.log(cursorPosition.value, 'change cursor')
    updateCanvasSize()
  },
  {
    deep: true,
    immediate: true,
  },
)

onBeforeMount(() => {
  pixelRatio.value = systemInfo.pixelRatio
  cursorPosition.value = input.value?.length ?? 0
})

onMounted(() => {
  uni
    .createSelectorQuery()
    .in(proxy)
    .select(`#${canvasId.value}`)
    .node((res) => {
      // console.log(res)
      if (res && res.node) {
        canvas = res.node
        ctx = canvas2dAdapter(canvas.getContext('2d') as CanvasRenderingContext2D)
        updateCanvasSize()
      }
    })
    .exec()
})

// 更新 Canvas 尺寸
function updateCanvasSize() {
  // console.log('更新宽度', ctx, canvas)
  if (!ctx || !canvas)
    return

  setCanvasStyle()

  const textWidth = ctx.measureText(input.value).width
  // console.log('算出宽度', textWidth)
  canvasWidth.value = Math.ceil(textWidth + px * 2)

  // console.log('宽度', canvasWidth.value)
  canvas.width = canvasWidth.value * pixelRatio.value
  canvas.height = canvasHeight * pixelRatio.value
  ctx.scale(pixelRatio.value, pixelRatio.value)
  redrawCanvas()
}

// 重绘画布
function redrawCanvas() {
  if (!ctx)
    return

  // 清空画布
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight)

  setCanvasStyle()

  // 绘制文本
  ctx.fillText(input.value, px, canvasHeight / 2)

  // 绘制光标
  const py = 5 // 光标上下padding
  const textBeforeCursor = input.value.slice(0, cursorPosition.value)
  const cursorX = px + ctx.measureText(textBeforeCursor).width
  ctx.beginPath()
  ctx.moveTo(cursorX, py)
  ctx.lineTo(cursorX, canvasHeight - py)
  ctx.setStrokeStyle('#00f')
  ctx.setLineWidth(2)
  ctx.stroke()

  // 刷新画布
  ctx.draw(true)
}

function setCanvasStyle() {
// 设置字体样式
  ctx.setTextBaseline('middle')
  ctx.setTextAlign('left')
  // ctx.setFontSize(16 * pixelRatio.value)
  ctx.font = `${16}px sans-serif`
  ctx.setFillStyle('#000')
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
  if (!ctx || !active.value)
    return

  const { x } = event.changedTouches[0] as any
  // console.log(event)
  // console.log(x, 'canvas x')
  let totalWidth = px // 初始偏移量
  let newIndex = 0

  // 逐字符累加宽度，找到最接近点击位置的字符索引
  for (let i = 0; i < input.value.length; i++) {
    const char = input.value[i]
    // console.log(char, 'char')
    const charWidth = ctx.measureText(char).width
    if (x <= totalWidth + charWidth / 2) {
      newIndex = i
      break
    }
    else {
      newIndex = input.value.length
    }
    totalWidth += charWidth
  }
  // console.log('选中文字idx', newIndex)
  // 触发model更新，在watch中处理重新渲染
  emit('update:cursor', newIndex)
}
</script>

<template>
  <view class="amount-input">
    <canvas :id="canvasId" type="2d" :style="canvasStyle" :canvas-id="canvasId" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" />
  </view>
</template>

<style lang="scss">
.amount-input {
  width: 100vw;
  overflow-x: auto;
}
</style>
