<script lang="ts" setup>
import type { ActionItem } from '@/typings'
import dayjs from 'dayjs'
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

const id = ref('')
const bill = ref({
  billId: 'bill2222',
  type: 1,
  category: {
    icon: 'https://wot-ui.cn/assets/panda.jpg',
    name: '购物消费-日常家居',
  },
  account: {
    icon: 'https://wot-ui.cn/assets/panda.jpg',
    name: '虚拟账户-微信',
  },
  way: 0,
  tags: ['服装鞋帽', '美妆护肤', '数码电子', '日用百货', '图书文具', '母婴用品', '宠物用品'],
  amount: 10334560.00,
  time: '2021-09-09 09:09:09',
  createTime: '2025-09-09 09:09:09',
  remark: '备注广东省广州市广州市天河区人民政府(天府路西广东省广州市广州市天河区人民政府(天府路西广东省广州市广州市天河区人民政府(天府路西',
  address: '广东省广州市广州市天河区人民政府(天府路西)',
})

const relatedBill = ref({
  expend: 334567.98,
  income: 334567.98,
  bills: [
    {
      billId: 'bill22221',
      type: 1,
      category: {
        icon: 'https://wot-ui.cn/assets/panda.jpg',
        name: '购物消费-日常家居',
      },
      account: {
        icon: 'https://wot-ui.cn/assets/panda.jpg',
        name: '虚拟账户-微信',
      },
      way: 0,
      tags: ['服装鞋帽', '美妆护肤', '数码电子', '日用百货', '图书文具', '母婴用品', '宠物用品'],
      amount: 10334560.00,
      time: '2021-09-09 09:09:09',
      createTime: '2025-09-09 09:09:09',
      remark: '备注广东省广州市广州市天河区人民政府(天府路西广东省广州市广州市天河区人民政府(天府路西广东省广州市广州市天河区人民政府(天府路西',
      address: '广东省广州市广州市天河区人民政府(天府路西)',
    },
    {
      billId: 'bill22222',
      type: 1,
      category: {
        icon: 'https://wot-ui.cn/assets/panda.jpg',
        name: '购物消费-日常家居',
      },
      account: {
        icon: 'https://wot-ui.cn/assets/panda.jpg',
        name: '虚拟账户-微信',
      },
      tags: [],
      amount: 10334560.00,
      time: '2021-09-09 09:09:09',
      remark: '备注广东省广州市广州市天河区人民政府(天府路西广东省广州市广州市天河区人民政府(天府路西广东省广州市广州市天河区人民政府(天府路西',
    },
    {
      billId: 'bill22223',
      type: 1,
      category: {
        icon: 'https://wot-ui.cn/assets/panda.jpg',
        name: '购物消费-日常家居',
      },
      account: {
        icon: 'https://wot-ui.cn/assets/panda.jpg',
        name: '虚拟账户-微信',
      },

      tags: ['服装鞋帽', '美妆护肤', '数码电子', '日用百货', '图书文具', '母婴用品', '宠物用品'],
      amount: 10334560.00,
      time: '2021-09-09 09:09:09',
      remark: '',
    },
  ],
})

onLoad((options: any) => {
  console.log('账单id', options.id)
})
</script>

<template>
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" title="账单详情" />

  <!-- 账单信息 -->
  <view class="flex justify-center">
    <view class="bill-detail-box mt-10 w-[87.5vw]">
      <view class="absolute left-50% -top-5 -translate-x-1/2">
        <wd-avatar :text="bill.category.name" :src="bill.category.icon" size="50" />
      </view>
      <!-- 头部信息 -->
      <view class="bill-header-box">
        <wd-text :text="bill.amount" mode="price" size="23px" :color="getBillColor(bill.type)" bold />
        <view class="mt-3 text-23px font-semibold">
          {{ bill.category.name }}
        </view>
      </view>
      <!-- 中间票据缺口、分割线样式 -->
      <view class="bill-mid-box" />
      <view class="bill-bottom-box">
        <view class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">日期</text>
          <text class="font-bold">{{ dayjs(bill.time).format('YYYY年MM月DD日 HH:MM') }}</text>
        </view>

        <view class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">账户</text>
          <view class="flex items-center gap-2 font-bold">
            <wd-avatar :text="bill.account.name" :src="bill.account.icon" size="23" />
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
            <view v-for="tag in bill.tags" :key="tag" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs">
              {{ tag }}
            </view>
          </view>
        </view>

        <view class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">方式</text>
          <text class="font-bold">{{ getBillWay(bill.way) }}</text>
        </view>

        <view class="bill-bottom-box-item">
          <text class="bill-bottom-box-item-title">入账</text>
          <text class="font-bold">{{ dayjs(bill.createTime).format('YYYY年MM月DD日 HH:MM') }}</text>
        </view>
      </view>
    </view>
  </view>
  <!-- 关联账单 -->
  <view class="mt-10">
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
        v-if="relatedBill && relatedBill.bills && relatedBill.bills.length > 0"
        class="w-[87.5vw] p-3"
      >
        <view class="flex flex-col justify-center gap-8">
          <view v-for="item in relatedBill.bills" :key="item.billId" class="bill-detail-box">
            <view class="bill-related-box">
              <view class="bill-related-box-item">
                <view class="flex items-center items-center gap-3">
                  <wd-avatar :text="item.category.name" :src="item.category.icon" size="30" />
                  <view class="font-semibold">
                    {{ item.category.name }}
                  </view>
                </view>
                <wd-text :text="item.amount" mode="price" :color="getBillColor(item.type)" bold />
              </view>
              <view class="bill-related-box-item">
                <text class="font-bold">{{ dayjs(item.time).format('YYYY年MM月DD日 HH:MM') }}</text>
                <view class="flex items-center gap-2 font-bold">
                  <wd-avatar :text="item.account.name" :src="bill.account.icon" size="20" />
                  <text>{{ item.account.name }}</text>
                </view>
              </view>
              <view v-if="item.tags && item.tags.length > 0" class="bill-related-box-item">
                <view class="hide-view-scrollbar flex overflow-x-auto space-x-2">
                  <view v-for="tag in item.tags" :key="tag" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs">
                    {{ tag }}
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
  @apply: flex flex-col text-center bg-gray-100 rounded-t-lg pt-15 pb-5;
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
