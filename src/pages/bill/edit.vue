<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '新增账单',
    navigationStyle: 'custom',
  },
})

const lockScroll = ref(false)
provide('lockScroll', {
  lockScroll,
  updateLockScroll: (newValue) => {
    lockScroll.value = newValue
  },
})

const amount = ref(0)

const amountInput = ref('1234567')
const tempCursor = ref(amountInput.value.length)
const inputCursor = ref(amountInput.value.length)
const inputFocus = ref(true)

const cursor = computed(() => {
  return tempCursor.value
})
function handleBlurInput(e: any) {
  console.log(e.target)
  tempCursor.value = e.target.cursor
  inputFocus.value = false
  nextTick(() => {
    inputFocus.value = true
    nextTick(() => {
      inputCursor.value = tempCursor.value
    })
  })
}

function handleFocusInput(e: any) {
  // 保存光标位置
  // console.log(e.target, inputCursor.value, '获得焦点')
  // inputCursor.value = tempCursor.value
  nextTick(() => {

  })
}

function handlePressKeyboard(key: any, value: string) {
  // console.log(key, value)

}
</script>

<template>
  <page-meta :page-style="lockScroll ? 'overflow:hidden' : ''" />
  <draw-background1 />
  <input
    v-model="amountInput" type="text" placeholder="请输入用户名" :focus="inputFocus" :cursor="inputCursor"
    @focus="handleFocusInput" @blur="(e) => handleBlurInput(e)"
  >
  <keyboard v-model="amountInput" v-model:cursor="tempCursor" @press="handlePressKeyboard" />
</template>

<style lang="scss" scoped>
//
</style>
