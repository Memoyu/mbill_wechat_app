<script lang="ts" setup>
interface ICharNodeItem {
  width: number
}

const props = defineProps<{
}>()
const emit = defineEmits(['update:cursor'])

const gap = 1.4
const { proxy } = getCurrentInstance() as any

const input = defineModel<string>({ default: '' })
const cursor = defineModel<number>('cursor', { default: 0 })

const charNodes = ref<ICharNodeItem[]>([]) // 字符节点
const cursorPosition = ref(0) // 光标位置

watch(() => input.value, (newVal) => {
  if (!newVal && newVal.length < 1)
    return

  nextTick(() => {
    uni
      .createSelectorQuery()
      .in(proxy)
      .selectAll('.INPUT-CHAR-ITEM')
      .boundingClientRect((views: any) => {
        console.log(views, 'INPUT-CHAR-ITEM')
        if (!views)
          return
        charNodes.value = views.map((view: any) => {
          return {
            width: view.width,
          }
        })
        updateCursorPosition(cursor.value)
      })
      .exec()
  })
}, { immediate: true })

watch(() => cursor.value, (newCur) => {
  updateCursorPosition(newCur)
}, { immediate: true })

function updateCursorPosition(newCur: number) {
  console.log(newCur, charNodes.value, 'updateCursorPosition')
  if (!charNodes.value || charNodes.value.length < 1)
    return
  const index = newCur
  // 计算元素中心位置
  let scroll = 0 // 左边 padding
  for (let i = 0; i < index; i++) {
    scroll += charNodes.value[i].width
  }
  scroll = scroll + (gap * (index - 1)) + Math.floor(gap / 2)
  scroll = Math.max(0, scroll)
  cursorPosition.value = scroll
}

function handleCharItemTap(index: number, e: any) {
  console.log(index, e, 'handleCharItemTap')
  cursor.value = index + 1
}
</script>

<template>
  <scroll-view scroll-x>
    <view class="relative flex text-base" :style="{ gap: `${gap}px` }">
      <view v-for="(c, idx) in input" :key="`${idx}-${c}`" class="INPUT-CHAR-ITEM" @tap="(e: any) => handleCharItemTap(idx, e)">
        {{ c }}
      </view>
      <view class="px-10" @tap="(e: any) => handleCharItemTap(input.length - 1, e)" />
      <view class="absolute bottom-0 top-0 my-0.8 w-0.6 bg-indigo-200" :style="{ left: `${cursorPosition}px` }" />
    </view>
  </scroll-view>
</template>

<style lang="scss">
.amount-input {
  width: 100vw;
  overflow-x: auto;
}
</style>
