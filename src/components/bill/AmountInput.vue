<script lang="ts" setup>
interface ICharNodeItem {
  width: number
  left: number
}

const props = defineProps<{
}>()

const PX = 4 // 节点容器padding x宽度
const CW = 2 // 光标宽度
const { proxy } = getCurrentInstance() as any

const input = defineModel<string>({ default: '' })
const cursor = defineModel<number>('cursor', { default: 0 })

const charNodes = ref<ICharNodeItem[]>([]) // 字符节点
const cursorPosition = ref(PX) // 光标位置
const scroll = ref(0)

watch(() => input.value, (newVal) => {
  if (!newVal && newVal.length < 1)
    return

  nextTick(() => {
    uni
      .createSelectorQuery()
      .in(proxy)
      .selectAll('.INPUT-CHAR-ITEM')
      .boundingClientRect((views: any) => {
        // console.log(views, 'INPUT-CHAR-ITEM')
        if (!views)
          return
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
        updateScrollPosition()
      })
      .exec()
  })
}, { immediate: true })

function updateCursorPosition(event?: any) {
  // console.log(cursor.value, charNodes.value, 'updateCursorPosition')
  if (!charNodes.value || charNodes.value.length < 1)
    return

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
        const node = charNodes.value[index]
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
    const node = charNodes.value[cursor.value - 1]
    setCursorPosition(node.left + node.width)
  }
}

function setCursorPosition(offset: number) {
  offset = Math.max(0, offset)
  // console.log(left, 'left')
  cursorPosition.value = offset + CW / 2 + PX / 2
}

function updateScrollPosition() {
  // console.log(cursor.value, charNodes.value, 'updateScrollPosition')
  if (!charNodes.value || charNodes.value.length < 1)
    return

  const node = charNodes.value[cursor.value - 1]
  let offset = node.width
  if (scroll.value === 0) {
    offset = node.left
  }
  scroll.value += offset
}

function handleCharItemTap(index: number, event: any) {
  // console.log(index, event, 'handleCharItemTap')
  cursor.value = index
  updateCursorPosition(event)
}
</script>

<template>
  <scroll-view scroll-x :scroll-left="scroll">
    <view class="relative h-7 flex items-center px-1 text-base leading-7" :style="{ padding: `0px ${PX}px` }">
      <!-- 字符节点 -->
      <view
        v-for="(c, idx) in input"
        :id="`INPUT-CHAR-ITEM-${idx}`"
        :key="`${idx}-${c}`"
        class="INPUT-CHAR-ITEM"
        @tap="(e: any) => handleCharItemTap(idx, e)"
      >
        {{ c }}
      </view>
      <!-- 占位符，留空白时占满 -->
      <view class="h-full grow" @tap="(e: any) => handleCharItemTap(input.length - 1, e)" />
      <!-- 光标 -->
      <view
        id="INPUT-CHAR-ITEM-CURSOR"
        class="blink absolute bottom-0 top-0 my-0.8 w-0.5 rounded-sm bg-indigo-200"
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
