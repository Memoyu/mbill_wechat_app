<script lang="ts" setup>
import type { BillTypeEnum } from '@/typings'

interface ICharNodeItem {
  width: number
  left: number
}

const props = defineProps<{
  input: string
  type: BillTypeEnum
}>()

const CW = 2 // 光标宽度
const { proxy } = getCurrentInstance() as any

const cursor = defineModel<number>('cursor', { default: 0 })

const charNodes = ref<ICharNodeItem[]>([]) // 字符节点
const cursorPosition = ref(0) // 光标位置
const scroll = ref(0)

watch(() => props.input, (n) => {
  if (!n)
    return
  nextTick(() => {
    uni
      .createSelectorQuery()
      .in(proxy)
      .selectAll('.INPUT-CHAR-ITEM')
      .boundingClientRect((viewItems: any) => {
        // console.log(views, 'INPUT-CHAR-ITEM')
        const views = viewItems || []
        let left = 0
        charNodes.value = views.map((view: any) => {
          const n = {
            width: view.width,
            left,
          }
          left += n.width
          return n
        })
        updateCursorPosition()
        updateScroll()
      })
      .exec()
  })
}, { immediate: true })

function updateCursorPosition(event?: any) {
  // console.log(cursor.value, charNodes.value, 'updateCursorPosition')
  const items = charNodes.value || []

  if (event) {
    // 点击字符节点
    const index = cursor.value
    uni
      .createSelectorQuery()
      .in(proxy)
      .select(`#INPUT-CHAR-ITEM-${index}`)
      .boundingClientRect((view: any) => {
        if (!view)
          return

        const x = event.detail.x
        const node = items[index]
        let left = node.left
        if (x > view.left + node.width / 2) {
          left = node.left + node.width
          cursor.value += 1
        }
        // console.log(node, left, index, view, `#INPUT-CHAR-ITEM-${index}`)
        setCursorPosition(left)
      })
      .exec()
  }
  else {
    // 输入内容变化
    let offset = 0
    if (cursor.value > 0) {
      const node = items[cursor.value - 1]
      offset = node.left + node.width
    }
    setCursorPosition(offset)
  }
}

function setCursorPosition(offset: number) {
  offset = Math.max(0, offset)
  // console.log(left, 'left')
  cursorPosition.value = offset - (CW / 2)
}

function updateScroll() {
  // console.log(cursor.value, charNodes.value, 'updateScroll')
  if (!charNodes.value || charNodes.value.length < 1)
    return

  const node = charNodes.value[cursor.value - 1]
  scroll.value = node.left + node.width
}

function handleCharItemTap(index: number, event: any) {
  // console.log(index, event, 'handleCharItemTap')
  cursor.value = index
  updateCursorPosition(event)
}
</script>

<template>
  <scroll-view scroll-x :scroll-left="scroll">
    <view class="relative h-5 w-full flex items-center text-sm leading-5">
      <!-- 字符节点 -->
      <view
        v-for="(c, idx) in input"
        :id="`INPUT-CHAR-ITEM-${idx}`"
        :key="`${idx}-${c}`"
        class="INPUT-CHAR-ITEM h-full align-middle"
        @tap="(e: any) => handleCharItemTap(idx, e)"
      >
        {{ c }}
      </view>

      <!-- 占位符，留空白时占满，最小宽度为光标占位 -->
      <view :style="{ minWidth: `${CW}px` }" class="h-full grow" @tap="(e: any) => handleCharItemTap(input.length - 1, e)" />

      <!-- 光标 -->
      <view
        class="blink absolute bottom-0 top-0 my-0.5 rounded-sm bg-indigo-200"
        :style="{ left: `${cursorPosition}px`, width: `${CW}px` }"
      />
    </view>
  </scroll-view>
</template>

<style lang="scss">
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.blink {
  animation: blink 1s infinite;
}
</style>
