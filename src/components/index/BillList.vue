<script setup lang="ts">
import type { BillGroupRes } from '@/api/types/bill'
import { formatAmount } from '@/utils'
import { getDateFormat, getWeekday } from '@/utils/date'

const billGroups = ref<BillGroupRes[]>([{
  date: '2026-03-27',
  income: 1000.7823,
  expend: 499.4455,
  bills: [
    {
      billId: '5',
      type: 0,
      category: {
        categoryId: 'c1',
        name: '购物消费-办公用品',
        icon: '',
      },
      account: {
        accountId: 'a1',
        name: '现金',
        icon: 'icon-cash',
      },
      amount: 100.78,
      date: new Date('2026-03-01 23:13:05'),
      remark: '购物--dwawdawdawdajfkafjke交罚款我房间啊集副卡杰尔夫卡巨额罚款讲课费金卡',
      tags: ['标签1', '标签2', '标签3', '标签4'],
      address: '广州白云',
    },
  ],
}, {
  date: '2026-03-26',
  income: 1000.78,
  expend: 499.44,
  bills: [
    {
      billId: '6',
      type: 0,
      category: {
        categoryId: 'c1',
        name: '购物消费-办公用品',
        icon: '',
      },
      account: {
        accountId: 'a1',
        name: '现金',
        icon: 'icon-cash',
      },
      amount: 100.78,
      date: new Date('2026-03-01 12:13:05'),
      // remark: '购物--',
      tags: ['标签1', '标签2', '标签3', '标签4'],
      address: '广州白云',
    },
  ],
}, {
  date: '2026-03-01',
  income: 3445000.78,
  expend: 499.44,
  bills: [
    {
      billId: '1',
      type: 0,
      category: {
        categoryId: 'c1',
        name: '购物消费-办公用品',
        icon: 'icon-shopping',
      },
      account: {
        accountId: 'a1',
        name: '现金',
        icon: 'icon-cash',
      },
      amount: 100.78,
      date: new Date('2026-03-01  03:13:05'),
      remark: '购物--',
      tags: ['标签1', '标签2', '标签3', '标签4'],
      address: '广州白云',
    },
    {
      billId: '2',
      type: 1,
      category: {
        categoryId: 'c2',
        name: '工资',
        icon: 'icon-shopping',
      },
      account: {
        accountId: 'a2',
        name: '招商银行',
        icon: 'icon-cash',
      },
      amount: 8600.78,
      date: new Date('2026-03-01  10:13:05'),
      remark: '工资',
      tags: ['标签1', '标签2', '标签3', '标签4'],
      address: '广州白云',
    },
    {
      billId: '3',
      type: 0,
      category: {
        categoryId: 'c1',
        name: '购物2',
        icon: 'icon-shopping',
      },
      account: {
        accountId: 'a1',
        name: '现金',
        icon: 'icon-cash',
      },
      amount: 100.78,
      date: new Date('2026-03-01 05:13:05'),
      remark: '购物--',
      tags: ['标签1', '标签2', '标签3', '标签4'],
      address: '广州白云',
    },
    {
      billId: '4',
      type: 0,
      category: {
        categoryId: 'c1',
        name: '购物2',
        icon: 'icon-shopping',
      },
      account: {
        accountId: 'a1',
        name: '现金',
        icon: 'icon-cash',
      },
      amount: 100.78,
      date: new Date('2026-03-01 14:13:05'),
      remark: '购物--',
      tags: ['标签1', '标签2', '标签3', '标签4'],
      address: '广州白云',
    },
  ],
}])
</script>

<template>
  <view class="p-3">
    <view v-for="g in billGroups" :key="g.date" class="mt-5">
      <view class="flex items-center justify-between">
        <view class="flex">
          <view class="font-bold">
            {{ getDateFormat(g.date) }}
          </view>
          <view class="ml-2 text-gray">
            {{ getWeekday(g.date) }}
          </view>
        </view>
        <view class="flex items-center gap-3 text-sm">
          <view>
            <text>
              收入
            </text>
            <text class="ml-1 text-emerald">
              {{ formatAmount(g.income) }}
            </text>
          </view>

          <view>
            <text>
              支出
            </text>
            <text class="ml-1 text-rose">
              {{ formatAmount(g.expend) }}
            </text>
          </view>
        </view>
      </view>
      <view v-for="b in g.bills" :key="b.billId" class="mt-2 rounded-lg bg-gray-100/60 p-3">
        <bill-item :bill="b" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
