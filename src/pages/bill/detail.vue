<script lang="ts" setup>
import type { IBill, IRelatedBill } from '@/api/types/bill'
import type { ActionItem } from '@/typings'
import dayjs from 'dayjs'
import { getBill, getRelatedBill } from '@/api/bill'
import { getBillColor, getBillWay } from '@/utils/bill'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单详情',
  },
})

const actions: ActionItem[] = [
  {
    text: '退款',
    icon: 'redo',
    action: () => {
      console.log('账单退款')
    },
  },
  {
    text: '编辑',
    icon: 'pen',
    action: () => {
      console.log('编辑账单')
    },
  },
  {
    text: '关联账单',
    icon: 'link',
    action: () => {
      console.log('关联账单')
    },
  },
  {
    text: '删除',
    icon: 'delete',
    type: 'danger',
    action: () => {
      console.log('删除账单')
    },
  },
]

const bill = ref<IBill>({
  billId: '',
  type: 0,
  ledger: { ledgerId: '', name: '' },
  category: { categoryId: '', name: '', icon: '' },
  account: { accountId: '', name: '', icon: '' },
  amount: 0,
  refundAmount: 0,
  date: dayjs().format(),
  remark: '',
  tags: [],
  address: '',
  createTime: dayjs().toDate(),
})

const relatedBill = ref<IRelatedBill>({
  expend: 0,
  income: 0,
  items: [],
})

onLoad((options: any) => {
  console.log('账单id', options.id)
  getBill(options.id).then((res) => {
    bill.value = res
    getRelatedBill(options.id).then((res) => {
      relatedBill.value = res
    })
  })
})
</script>

<template>
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" title="账单详情" />

  <!-- 账单信息 -->
  <view class="flex justify-center">
    <view class="bill-detail-box mt-10 w-[87.5vw]">
      <!-- 分类图标 -->
      <view class="absolute left-50% -top-5 -translate-x-1/2">
        <bill-icon :icon="bill.category.icon" :text="bill.category.name" size="50" />
      </view>

      <view class="bill-header-box">
        <!-- 金额 -->
        <wd-text :text="bill.amount" mode="price" size="23px" :color="getBillColor(bill.type)" bold />

        <!-- 退款 -->
        <view v-if="bill.refundAmount > 0" class="flex items-center space-x-2">
          <view class="rounded-md bg-yellow-500/50 px-1 py-0.5">
            <text>退款 {{ bill.refundAmount }}</text>
          </view>
          <wd-text :text="bill.amount + bill.refundAmount" mode="price" decoration="line-through" />
        </view>

        <!-- 分类 -->
        <view class="text-23px font-semibold">
          {{ bill.category.name }}
        </view>
      </view>

      <!-- 中间票据缺口、分割线样式 -->
      <view class="bill-mid-box" />
      <view class="bill-bottom-box">
        <view class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">日期</text>
          <text class="font-bold">{{ dayjs(bill.date).format('YYYY年MM月DD日 HH:mm') }}</text>
        </view>

        <view class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">账户</text>
          <view class="flex items-center gap-2 font-bold">
            <bill-icon :icon="bill.account.icon" :text="bill.account.name" size="22" />
            <text>{{ bill.account.name }}</text>
          </view>
        </view>

        <view v-if="bill.address && bill.address.length > 0" class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">地点</text>
          <view class="hide-view-scrollbar flex overflow-x-auto">
            <text class="whitespace-nowrap font-bold">{{ bill.address }}</text>
          </view>
        </view>

        <view v-if="bill.remark && bill.remark.length > 0" class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">备注</text>
          <view class="hide-view-scrollbar flex overflow-x-auto">
            <text class="whitespace-nowrap font-bold"> {{ bill.remark }} </text>
          </view>
        </view>

        <view v-if="bill.tags && bill.tags.length > 0" class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">标签</text>
          <view class="hide-view-scrollbar flex overflow-x-auto space-x-2">
            <view v-for="tag in bill.tags" :key="tag.tagId" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs">
              {{ tag.name }}
            </view>
          </view>
        </view>

        <!-- <view class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">方式</text>
          <text class="font-bold">{{ getBillWay(bill.way) }}</text>
        </view> -->

        <view class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">入账</text>
          <text class="font-bold">{{ dayjs(bill.createTime).format('YYYY年MM月DD日 HH:mm') }}</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 关联账单 -->
  <view v-if="relatedBill.items && relatedBill.items.length > 0" class="mt-10">
    <view class="flex justify-between px-2">
      <text class="font-bold">关联账单</text>
      <view class="flex items-center gap-3">
        <view class="flex gap-2">
          <view>
            收
          </view>
          <wd-text :text="relatedBill.income" mode="price" :color="getBillColor(1)" bold />
        </view>

        <view class="flex gap-2">
          <view>
            支
          </view>
          <wd-text :text="relatedBill.expend" mode="price" :color="getBillColor(0)" bold />
        </view>
      </view>
    </view>
    <view class="flex justify-center">
      <view
        v-if="relatedBill && relatedBill.items && relatedBill.items.length > 0"
        class="w-[87.5vw] p-3"
      >
        <view class="flex flex-col justify-center gap-8">
          <view v-for="item in relatedBill.items" :key="item.billId" class="bill-detail-box">
            <view class="bill-related-box">
              <view class="bill-related-box-item">
                <view class="flex items-center items-center gap-3">
                  <bill-icon :icon="bill.category.icon" :text="bill.category.name" size="22" />
                  <view class="font-semibold">
                    {{ item.category.name }}
                  </view>
                </view>
                <wd-text :text="item.amount" mode="price" :color="getBillColor(item.type)" bold />
              </view>
              <view class="bill-related-box-item">
                <text class="font-bold">{{ dayjs(item.date).format('YYYY年MM月DD日 HH:mm') }}</text>
                <view class="flex items-center gap-2 font-bold">
                  <bill-icon :icon="bill.account.icon" :text="bill.account.name" size="22" />
                  <text>{{ item.account.name }}</text>
                </view>
              </view>
              <view v-if="item.tags && item.tags.length > 0" class="bill-related-box-item">
                <view class="hide-view-scrollbar flex overflow-x-auto space-x-2">
                  <view v-for="tag in item.tags" :key="tag.tagId" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs">
                    {{ tag.name }}
                  </view>
                </view>
              </view>
              <view v-if="item.remark" class="bill-related-box-item">
                <text class="line-clamp-1"> {{ item.remark }} </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 底部安全距离 -->
  <view class="h-100px" />
  <!-- 底部操作栏 -->
  <bottom-action :actions="actions" />
</template>

<style lang="scss" scoped>
.bill-detail-box {
  position: relative;

  /* 底部锯齿 */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 100%;
    height: 12px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Ccircle cx='10' cy='0' r='10' fill='%23f3f4f6'/%3E%3C/svg%3E");
    background-size: 20px 12px;
    background-repeat: repeat-x;
  }
}

.bill-header-box {
  @apply: flex flex-col items-center bg-gray-100 rounded-t-lg pt-15 pb-5 space-y-2;
}
.bill-mid-box {
  position: relative;
  height: 20px;
  background: #f3f4f6;

  // 左右透明半圆缺口
  mask:
    radial-gradient(circle 10px at 0 50%, transparent 100%, black 0) left,
    radial-gradient(circle 10px at 100% 50%, transparent 100%, black 0) right;
  mask-size: 51% 100%;
  mask-position: left, right;
  mask-repeat: no-repeat;

  // 中间虚线
  &::before {
    content: '';
    position: absolute;
    left: 2px;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    height: 0;
    border-top: 2px dashed #d1d5db;
    /* 调整虚线间隔 */
    background-image: linear-gradient(to right, #d1d5db 50%, transparent 50%);
    background-size: 15px 2px;
    background-repeat: repeat-x;
    background-position: center;
    height: 2px;
    border-top: none;
  }
}
.bill-bottom-box {
  @apply: bg-gray-100 rounded-b-lg p-3;

  &-item {
    @apply: flex items-center justify-between py-3;
    &-title {
      @apply: shrink-0 mr-8;
    }
  }
}

.bill-related-box {
  @apply: flex flex-col bg-gray-100 rounded-t-lg p-3;

  &-item {
    @apply: flex items-center justify-between py-2;
  }
}
</style>
