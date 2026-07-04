<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
  title: string
  content?: string
  editable?: boolean
  placeholder?: string
  danger?: boolean
  defaultValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', value?: string): void
  (e: 'cancel'): void
}>()

const inputValue = ref('')
const inputRef = ref<HTMLInputElement>()

function onConfirm() {
  if (props.editable && !inputValue.value)
    return
  emit('confirm', inputValue.value)
  emit('update:modelValue', false)
  inputValue.value = ''
}

function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
  inputValue.value = ''
}

function onInput() {
  // 可以在这里添加输入验证逻辑
}

watch(
  () => props.defaultValue,
  (newVal) => {
    if (newVal && props.modelValue) {
      inputValue.value = newVal
    }
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.defaultValue) {
      inputValue.value = props.defaultValue
    }
  },
)
</script>

<template>
  <wd-popup
    lock-scroll
    custom-class="rounded-3xl w-[300px] overflow-hidden"
    position="center"
    :model-value="modelValue"
    transition="fade-up"
    @close="$emit('update:modelValue', false)"
  >
    <view v-if="modelValue" class="flex flex-col overflow-hidden">
      <!-- 标题 -->
      <view class="px-6 pt-6 text-center">
        <text class="text-lg text-gray-800 font-semibold">{{ title }}</text>
      </view>

      <!-- 输入框容器 -->
      <view v-if="editable" class="mt-4 px-6">
        <input
          ref="inputRef"
          v-model="inputValue"
          class="box-border h-10 w-full border border-gray-200 rounded-lg bg-gray-50/50 px-3 text-base"
          :placeholder="placeholder"
          adjustPosition
          @input="onInput"
        >
      </view>

      <!-- 提示内容 -->
      <view v-if="content" class="mt-4 break-all px-6 text-center text-sm text-gray-500">
        {{ content }}
      </view>

      <!-- 按钮组 -->
      <view class="mt-4 flex">
        <view
          class="flex-1 border-t border-gray-100 py-4 text-center text-base text-gray-600 transition-colors hover:bg-gray-50"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="onCancel"
        >
          取消
        </view>
        <view class="w-[1px] bg-gray-100" />
        <view
          class="flex-1 border-t border-gray-100 py-4 text-center text-base font-medium transition-colors"
          :class="[danger ? 'text-red-500' : 'text-indigo-500 ']"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="onConfirm"
        >
          确定
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<style scoped>
:deep(.wd-popup) {
  overflow: hidden;
}
</style>
