<script lang="ts" setup>
import { canvas2dAdapter } from 'wot-design-uni/components/common/canvasHelper'
import { objToStyle } from '@/utils'
import { systemInfo } from '@/utils/systemInfo'

const maxWidth = 500 // 最大画布宽度
const canvasHeight = 50 // Canvas 高度
// 文本内容
const textContent = ref('.+-×÷342452342342452545255352.+-×÷')
// 光标位置
const cursorPosition = ref(0)
// Canvas 上下文
let ctx: UniApp.CanvasContext | null = null
const canvasId = ref('textCanvas')
const canvasRef = ref()
const { proxy } = getCurrentInstance() as any
const pixelRatio = ref<number>(1) // 像素比

// 动态计算画布宽度
const canvasWidth = computed(() => {
  if (!ctx)
    return maxWidth
  const textWidth = ctx.measureText(textContent.value).width
  return Math.min(maxWidth, Math.ceil(textWidth + 20)) // 加上左右 padding
})

const canvasStyle = computed(() => {
  const style = {
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight}px`,
  }
  return `${objToStyle(style)}`
})

onBeforeMount(() => {
  pixelRatio.value = systemInfo.pixelRatio
  console.log(pixelRatio.value)
})

onMounted(() => {
  uni
    .createSelectorQuery()
    .in(proxy)
    .select(`#${canvasId.value}`)
    .node((res) => {
      console.log(res)
      if (res && res.node) {
        const canvas = res.node
        canvasRef.value = canvas
        ctx = canvas2dAdapter(canvas.getContext('2d') as CanvasRenderingContext2D)
        // canvas.width = canvasWidth * pixelRatio.value
        // canvas.height = canvasHeight * pixelRatio.value
        // ctx.scale(pixelRatio.value, pixelRatio.value)
        updateCanvasSize()
        nextTick(() => {
          redrawCanvas()
        })
      }
    })
    .exec()
})

// 更新 Canvas 尺寸
function updateCanvasSize() {
  if (!ctx || !canvasRef.value)
    return
  const canvas = canvasRef.value as HTMLCanvasElement
  canvas.width = canvasWidth.value * pixelRatio.value
  canvas.height = canvasHeight * pixelRatio.value
  ctx.scale(pixelRatio.value, pixelRatio.value)
}

// 重绘画布
function redrawCanvas() {
  if (!ctx)
    return
  // 清空画布
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight)

  // 设置字体样式
  ctx.setTextBaseline('middle')
  ctx.setTextAlign('left')
  // ctx.setFontSize(16 * pixelRatio.value)
  ctx.font = `${16}px sans-serif`
  ctx.setFillStyle('#000')

  // 绘制文本
  ctx.fillText(textContent.value, 10, canvasHeight / 2)

  // 绘制光标
  const textBeforeCursor = textContent.value.slice(0, cursorPosition.value)
  const cursorX = 10 + ctx.measureText(textBeforeCursor).width
  ctx.beginPath()
  ctx.moveTo(cursorX, 10)
  ctx.lineTo(cursorX, canvasHeight - 10)
  ctx.setStrokeStyle('#00f')
  ctx.setLineWidth(2)
  ctx.stroke()

  // 刷新画布
  ctx.draw(true)
}
// 处理文本输入
function onTextInput(e: any) {
  textContent.value = e.detail.value
  cursorPosition.value = textContent.value.length
  redrawCanvas()
}

// 处理输入框聚焦
function onInputFocus() {
  // 聚焦后自动弹出键盘
}

// 处理 Canvas 点击事件
function onCanvasTap(e: any) {
  if (!ctx)
    return

  const { x } = e.detail
  let totalWidth = 10 // 初始偏移量
  let newIndex = 0

  // 逐字符累加宽度，找到最接近点击位置的字符索引
  for (let i = 0; i < textContent.value.length; i++) {
    const char = textContent.value[i]
    const charWidth = ctx.measureText(char).width
    if (x <= totalWidth + charWidth / 2) {
      newIndex = i
      break
    }
    totalWidth += charWidth
  }

  cursorPosition.value = newIndex
  updateCanvasSize()
  redrawCanvas()
}

function canvasIdErrorCallback(e) {
  console.error(e.detail.errMsg)
}
</script>

<template>
  <canvas :id="canvasId" type="2d" :style="canvasStyle" :canvas-id="canvasId" @tap="onCanvasTap" />
</template>

<style lang="scss">
.editor-container {
  position: relative;
  width: 300px;
  height: 50px;
  border: 1px solid #ccc;
}
</style>
