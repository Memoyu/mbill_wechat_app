<script setup lang="ts">
defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  trigger?: boolean
  placeholder?: string
  suffixIcon?: string
}>(), { placeholder: '' })

const emit = defineEmits(['suffix-click'])
const { proxy } = getCurrentInstance() as any
const show = defineModel<boolean>()
const input = defineModel<string>('input', { default: '' })

const inputBottom = ref(0)
let blurTimer: ReturnType<typeof setTimeout> | null = null
let suffixClicked = false

function handleKeyBoardHeightChange(event: any) {
  // console.log(event, 'handleKeyBoardHeightChange')
  const height = event.height ?? 0
  inputBottom.value = height
  uni
    .createSelectorQuery()
    .in(proxy)
    .select('#ABS-INPUT-TRIGGER')
    .boundingClientRect((view: any) => {
      // console.log(view, 'ABS-INPUT-TRIGGER')
      // TODO 暂未使用，没有完善
    })
    .exec()
}

function handleBlur() {
  // 延时关闭，给 clicksuffixicon 事件留出取消窗口
  blurTimer = setTimeout(() => {
    if (!suffixClicked) {
      show.value = false
    }
    suffixClicked = false
  }, 50)
}

function handleSuffixClick() {
  // 取消 blur 的延时关闭
  if (blurTimer) {
    clearTimeout(blurTimer)
    blurTimer = null
  }
  suffixClicked = true
  emit('suffix-click')
  // 强制 :focus 值变化以重新聚焦，保持键盘不收起
  show.value = false
  nextTick(() => {
    show.value = true
  })
}
</script>

<template>
  <view v-if="trigger">
    <!-- <view class="rounded-sm bg-[var(--wot-input-bg)] p-3" @tap="show = true">
      <text v-if="!input || input.length <= 0" class="text-[#b1b4bf]">{{ placeholder }}</text>
      <text v-else class="line-clamp-1">{{ input }}</text>
    </view> -->
    <view id="ABS-INPUT-TRIGGER" @tap="show = true">
      <wd-input v-model="input" type="text" :placeholder="placeholder" />
    </view>
  </view>
  <view v-if="show" class="fixed inset-0 z-10">
    <view class="absolute inset-x-0 bg-white" :style="{ bottom: `${inputBottom}px` }">
      <wd-input
        v-model="input"
        type="text"
        :placeholder="placeholder"
        :focus="show"
        :adjust-position="false"
        @keyboardheightchange="handleKeyBoardHeightChange"
        @blur="handleBlur"
      >
        <template #suffix>
          <wd-button size="mini" :icon="suffixIcon" custom-class="ml-2" @click="handleSuffixClick" />
        </template>
      </wd-input>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
