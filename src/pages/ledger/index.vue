<script lang="ts" setup>
import type { ILedger } from '@/api/types/ledger'
import type { ActionItem } from '@/typings'
import { useDialog } from '@wot-ui/ui'
import dayjs from 'dayjs'
import { getColorByName, gradients } from '@/constants/gradients'
import { useLedgerStore } from '@/store'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账本管理',
  },
})
const navActions: ActionItem[] = [
  {
    title: '创建',
    icon: 'plus',
    action: handleCreateTap,
  },
  {
    title: '加入',
    icon: 'scan',
    action: handleScanTap,
  },
]

const editDialog = useDialog('ledger-edit-dialog')
const ledgerStore = useLedgerStore()

const ledgers = computed(() => {
  return ledgerStore.ledgers
})

const show = ref(false)
const scrollHeight = ref(300)

const actionShow = ref(false)
const currentLedger = ref<ILedger>()

const editLedger = ref<{
  ledgerId?: string
  name: string
  color: number
}>({ name: '', color: 0 })
const editRandomColor = ref(true)

onMounted(() => {
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: any) => {
      // console.log(data)
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

function handleLedgerActionClick(ledger: any) {
  currentLedger.value = ledger
  actionShow.value = true
}

function handleCreateTap() {
  editDialog.confirm({ title: '新增' })
    .then(async () => {
      const color = editRandomColor.value ? getColorByName(editLedger.value.name) : editLedger.value.color
      await ledgerStore.createLedger(editLedger.value.name, color)
    })
    .catch(() => {
      console.log('点击了取消')
    })
}

function handleScanTap() {
  console.log('handleScanTap')
}

function handleSortChange(list: ILedger[]) {
  console.log(list, '重新排序')
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" :actions="navActions" title="账本管理" />
  <view class="w-screen">
    <view class="px-3 py-2">
      <drag-sort-list-view :list="ledgers" :gap="8" key-prop="ledgerId" :height="scrollHeight" @change="handleSortChange">
        <template #content="{ listItem }">
          <view class="relative overflow-hidden transition-all duration-200">
            <!-- 账簿封面 -->
            <view class="bg-gradient-to-br" :style="{ background: gradients[listItem.color] }">
              <!-- 装饰元素容器 -->
              <view class="pointer-events-none absolute inset-0">
                <!-- 大圆形装饰 -->
                <view class="absolute right-0 top-0 z-[1] h-48 w-48 rounded-full bg-black/2" />
                <!-- 小圆形装饰 -->
                <view class="absolute bottom-0 left-0 z-[1] h-32 w-32 translate-y-16 rounded-full bg-black/3 -translate-x-16" />
                <view class="absolute left-20 top-16 z-[2] h-20 w-20">
                  <view class="absolute inset-0 border-[3px] border-white/8 rounded-full" />
                </view>
              </view>

              <view class="ledger-item-box">
                <view class="ledger-item-content">
                  <text class="line-clamp-1 font-semibold">{{ listItem.name }}</text>
                  <view class="mt-2 flex items-center text-xs">
                    <text>
                      收入
                    </text>
                    <text class="ml-2 text-emerald font-bold">
                      {{ listItem.income }}
                    </text>
                    <text class="ml-4">
                      支出
                    </text>
                    <text class="ml-2 text-rose font-bold">
                      {{ listItem.expend }}
                    </text>
                  </view>
                  <view class="mt-2 flex items-center justify-between">
                    <wd-avatar-group :max-count="3" size="25">
                      <wd-avatar text="明" />
                      <wd-avatar icon="star-on" />
                      <wd-avatar text="A" bg-color="#1E90FF" />
                      <wd-avatar text="B" bg-color="#228B22" />
                      <wd-avatar text="C" bg-color="#DC143C" />
                    </wd-avatar-group>

                    <text class="text-xs">创建于{{ dayjs(listItem.createTime).format('YYYY-MM-DD HH:MM') }}</text>
                  </view>
                </view>
                <view class="ledger-item-more">
                  <view
                    class="h-6 w-6 flex items-center justify-center rounded-full bg-white/40 shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
                    @tap.stop="handleLedgerActionClick(listItem)"
                  >
                    <wd-icon name="more" />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
      </drag-sort-list-view>
    </view>
  </view>

  <!-- 更多操作 -->
  <ledger-action-popup
    v-model="actionShow"
    more
    :ledger="currentLedger"
  />

  <!-- 编辑账本 -->
  <wd-dialog selector="ledger-edit-dialog">
    <wd-input v-model="editLedger.name" type="text" placeholder="账簿名称" custom-class="custom-input" />
    <view class="mt-2">
      <wd-checkbox v-model="editRandomColor">
        随机颜色
      </wd-checkbox>
    </view>
    <!-- 颜色网格 -->
    <view v-if="!editRandomColor" class="grid grid-cols-4 mt-2 gap-4 p-1">
      <view
        v-for="(gradient, index) in gradients"
        :key="index"
        class="relative aspect-square overflow-hidden rounded-xl shadow-sm transition-all duration-200"
        :class="[editLedger.color === index ? 'ring-2 ring-indigo-500 ring-offset-2' : '']"
        :style="{ background: gradient }"
        hover-class="scale-95 shadow-md"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="editLedger.color = index"
      />
    </view>
  </wd-dialog>
</template>

<style lang="scss" scoped>
.ledger-item-box {
  display: flex;
  border-radius: 19px;
  box-sizing: border-box;
  padding: 0.5rem 0;
  // border-bottom: 1px solid #f0f0f0;
}

.ledger-item-content {
  margin-left: 0.9rem;
  flex: 1;
  width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
}
.ledger-item-more {
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: 100%;
  flex-shrink: 0;
  color: #999;
  padding: 0 0.9rem;
}
.custom-input {
  @apply bg-[#f7f8fa];
}
</style>
