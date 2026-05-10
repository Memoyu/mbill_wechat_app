<script setup lang="ts">
import { useAccountStore } from '@/store'

const props = withDefaults(defineProps<{
  id: number
}>(), {
})
const emit = defineEmits(['change'])
const show = defineModel<boolean>()

const accountStore = useAccountStore()

const accounts = ref(accountStore.accounts)
const active = ref<number>(1)
const scrollTop = ref<number>(0)

function handleChange({ value }: any) {
  active.value = value
  scrollTop.value = -1
  nextTick(() => {
    scrollTop.value = 0
  })
}

function handleConfirmClick() {
  show.value = false
}

function handleAccountItemTap(item: any) {
}
</script>

<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :hide-when-close="false"
    :close-on-click-modal="true"
    :safe-area-inset-bottom="true"
    root-portal
    lazy-render
    custom-style="border-radius: 16px 16px 0 0;"
    @close="() => show = false"
  >
    <view class="datetime-picker-toolbar">
      <!-- 取消按钮 -->
      <view class="datetime-picker-action datetime-picker-action-cancel" @tap="() => show = false">
        取消
      </view>
      <!-- 确定按钮 -->
      <view class="datetime-picker-action" @tap="handleConfirmClick">
        完成
      </view>
    </view>
    <view class="account-items">
      <wd-sidebar v-model="active" @change="handleChange">
        <wd-sidebar-item
          v-for="(item, index) in accounts"
          :key="index"
          :value="index"
          :label="item.name"
          :icon="item.icon"
        />
      </wd-sidebar>
      <view class="account-items-box" :style="`transform: translateY(-${active * 100}%)`">
        <scroll-view
          v-for="(item, index) in accounts"
          :key="index"
          class="account-items-content"
          scroll-y
          scroll-with-animation
          :show-scrollbar="false"
          :scroll-top="scrollTop"
          :throttle="false"
        >
          <!-- <wd-cell-group :title="item.title" border>
          <wd-cell v-for="(cell, index) in item.items" :key="index" :title="cell.title" :label="cell.label">
            <wd-icon name="code" size="24px" />
          </wd-cell>
        </wd-cell-group> -->
          <view class="grid grid-cols-5 gap-2">
            <view
              v-for="(child, cidx) in item.childs" :key="cidx"
              class="flex flex-col items-center rounded-lg py-2"
              @tap="handleAccountItemTap(item)"
            >
              <wd-img :width="30" round :height="30" :src="item.icon" />
              <view class="account-item-title">
                {{ item.name }}
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.datetime-picker-toolbar {
  position: relative;
  display: flex;
  font-size: 16px;
  height: 54px;
  line-height: 16px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.datetime-picker-action {
  display: block;
  border: none;
  outline: none;
  font-size: 16px;
  color: #4d80f0;
  background: transparent;
  padding: 24px 15px 14px;
}

.datetime-picker-action-cancel {
  color: #666666;
}
.account-items {
  &-box {
    flex: 1;
    // background: $filled-oppo;
    transition: transform 0.3s ease;
  }

  &-content {
    box-sizing: border-box;
    height: 100%;
  }
}
.account-item-title {
  font-size: 12px;
}
</style>
