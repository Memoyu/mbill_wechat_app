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

const amountValue = ref('')
const tempCursor = ref(amountValue.value.length)

function handlePressKeyboard(key: any, value: string) {
  // console.log(key, value)

}
</script>

<template>
  <page-meta :page-style="lockScroll ? 'overflow:hidden' : ''" />
  <draw-background1 />
  <view class="absolute bottom-0 left-0 right-0">
    <amount-input v-model="amountValue" v-model:cursor="tempCursor" />
    <keyboard v-model="amountValue" v-model:cursor="tempCursor" @press="handlePressKeyboard" />
    <view class="pb-safe" />
  </view>
</template>

<style lang="scss" scoped>
.amount-input-box {
  position: relative;
}
.amount-input-cursor {
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 1px;
  background-color: rebeccapurple;
  animation: blink 1s infinite;
}
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
