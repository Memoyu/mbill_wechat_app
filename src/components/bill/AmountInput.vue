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

function updateCursorPosition(cur: number, event?: any) {
  // console.log(cur, charNodes.value, 'updateCursorPosition')
  if (!charNodes.value || charNodes.value.length < 1)
    return

  // 计算元素中心位置
  // for (let i = 0; i < cur; i++) {
  //   scroll += charNodes.value[i].width
  // }

  uni
    .createSelectorQuery()
    .in(proxy)
    .select(`#INPUT-CHAR-ITEM-${cur}`)
    .boundingClientRect((view: any) => {
      console.log(view, `#INPUT-CHAR-ITEM-${cur}`)
      if (!view)
        return

      let x = 99999
      if (event) {
        x = event.detail.x
      }

      // 同时更新cursor
      const node = charNodes.value[cur]
      const gw = Math.floor(gap)
      let left = view.left
      if (x > left + node.width / 2) {
        left = view.left + node.width
        cursor.value = cur + 1
      }

      left = Math.max(0, left)
      console.log(left, 'left')
      cursorPosition.value = left - gw
    })
    .exec()
}

function handleCharItemTap(index: number, event: any) {
  console.log(index, event, 'handleCharItemTap')
  updateCursorPosition(index, event)
}
</script>

<template>
  <scroll-view scroll-x>
    <view class="relative h-7 flex items-center text-base" :style="{ gap: `${gap}px` }">
      <view v-for="(c, idx) in input" :id="`INPUT-CHAR-ITEM-${idx}`" :key="`${idx}-${c}`" class="INPUT-CHAR-ITEM" @tap="(e: any) => handleCharItemTap(idx, e)">
        {{ c }}
      </view>
      <view class="min-w-20 grow" @tap="(e: any) => handleCharItemTap(input.length - 1, e)" />
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
