<script lang="ts" setup>
import { useTouch } from 'wot-design-uni'

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
const amountValue = ref('1234567')
const tempCursor = ref(amountValue.value.length)
const amountInputCursor = ref()

function handlePressKeyboard(key: any, value: string) {
  // console.log(key, value)

}

const touch = useTouch()
function onTouchStart(event: TouchEvent) {
  touch.touchStart(event)
  console.log({ x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY })
  amountInputCursor.value = event.changedTouches[0].clientX
}

function onTouchMove(event: TouchEvent) {
  touch.touchMove(event)
}

function onTouchEnd() {
}
const current = ref<number>(10)
</script>

<template>
  <page-meta :page-style="lockScroll ? 'overflow:hidden' : ''" />
  <draw-background1 />
  <view class="absolute bottom-0 left-0 right-0">
    <!-- <view class="amount-input-box" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      <view class="amount-input">
        {{ amountInput }}
      </view>
      <view class="amount-input-cursor" :style="{ left: `${amountInputCursor}px` }" />
    </view> -->
    <amount-input />
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
