<script setup lang="ts">
import { useToast } from 'wot-design-uni'

const props = defineProps<{
  // value: string
}>()
const emit = defineEmits(['change', 'update:value'])
const show = defineModel<boolean>()
const ledgers = ref([{
  ledgerId: '2323234341',
  name: '日常账本字符222222233333333',
}, {
  ledgerId: '2323234342',
  name: '学习账单',
}, {
  ledgerId: '2323234343',
  name: '开店账单',
}, {
  ledgerId: '2323234344',
  name: '开店账单4',
}, {
  ledgerId: '2323234345',
  name: '开店账单5',
}, {
  ledgerId: '2323234346',
  name: '开店账单6',
}])

const toast = useToast()

function handleSacnClick() {
  // 只允许通过相机扫码
  uni.scanCode({
    success(res) {
      console.log(`条码类型：${res.scanType}`)
      console.log(`条码内容：${res.result}`)
    },
    fail(e) {
      toast.show(`错误： ${e}`)
    },
  })
}
</script>

<template>
  <view class="flex">
    <!-- 操作 -->
    <view class="flex flex-col justify-between pr-2">
      <view class="flex flex-shrink-0 items-center rounded-full bg-white/70 p-1" @click="handleSacnClick">
        <wd-icon name="scan" class="text-20px" />
      </view>
      <view class="flex flex-col items-center rounded-full bg-indigo-500/10 py-2">
        <text class="i-carbon-add text-20px text-indigo-500" />
        <text class="vertical-text text-sm text-indigo-500 font-medium">添加</text>
      </view>
    </view>

    <!-- 列表 -->
    <scroll-view class="scroll-horizontal" scroll-x>
      <view v-for="item in ledgers" :key="item.ledgerId" class="ledger-item">
        <view class="w-full flex items-center justify-between">
          <view class="ledger-item-name truncate text-sm">
            {{ item.name }}
          </view>
          <wd-icon name="ellipsis" custom-class="flex-shrink-0 rounded-full bg-white/70" />
        </view>
        <view class="">
          <view>
            收 2000
          </view>
          <view>
            支 300
          </view>
        </view>
        <view>
          <wd-avatar-group :max-count="3" size="17">
            <wd-avatar text="明" />
            <wd-avatar icon="star-on" />
            <wd-avatar text="A" bg-color="#1E90FF" />
            <wd-avatar text="B" bg-color="#228B22" />
            <wd-avatar text="C" bg-color="#DC143C" />
          </wd-avatar-group>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.ledger-item {
  width: 120px;
  display: inline-block;
  @apply: bg-indigo-300 rounded-2xl p-3 mx-1;
}
.vertical-text {
  writing-mode: vertical-rl; /* 从右到左垂直排列 */
}

.ledger-item-name {
  width: calc(100% - 50px);
}

.scroll-horizontal {
  width: calc(100% - 40px);
  white-space: nowrap;
}
</style>
