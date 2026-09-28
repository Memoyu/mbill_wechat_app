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
}>(), { placeholder: '' })

const { proxy } = getCurrentInstance() as any

const show = defineModel<boolean>()
const input = defineModel<string>('input', { default: '' })

const inputBottom = ref(0)

function handleKeyBoardHeightChange(event: any) {
  console.log(event, 'handleKeyBoardHeightChange')
  const height = event.height ?? 0
  inputBottom.value = height
  uni
    .createSelectorQuery()
    .in(proxy)
    .select('#ABS-INPUT-TRIGGER')
    .boundingClientRect((view: any) => {
      console.log(view, 'ABS-INPUT-TRIGGER')
    })
    .exec()
}

function handleBlur() {
  show.value = false
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
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
