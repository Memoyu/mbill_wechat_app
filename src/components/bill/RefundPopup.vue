<script setup lang="ts">
import type { IBill, IEditRefundBill, IRefundBill } from '@/api/types/bill'
import type { ActionItem } from '@/typings'
import dayjs from 'dayjs'
import { createRefundBill, deleteRefundBill, getRefundBillList, updateRefundBill } from '@/api/bill'
import { getBillColor } from '@/utils/bill'
import { getDateFormat } from '@/utils/date'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  bill: IBill
}>()
const emit = defineEmits(['changeRefund'])
const show = defineModel<boolean>()

const toast = useGlobalToast()
const dialog = useGlobalDialog()

const isCreate = ref(true)
const showEdit = ref(false)
const showDateTime = ref(false)

const refundList = ref<IRefundBill[]>([])
const refund = ref<IEditRefundBill>({
  billId: '',
  accountId: '',
  amount: 0,
  date: dayjs().format(),
  remark: '',
})
const accountId = ref()
const date = ref(dayjs().valueOf())

const actions: ActionItem[] = [
  {
    text: '删除',
    icon: 'delete',
    type: 'danger',
    action: () => {
      console.log('删除退款账单')
      handleDelete()
    },
  },
]

watch(() => show.value, (val) => {
  // 弹窗时获取退款列表
  if (val) {
    getRefundBillList(props.bill.billId).then((res) => {
      refundList.value = res
    })
  }
})

function handleAddRefund() {
  refund.value = {
    billId: props.bill.billId,
    accountId: props.bill.account.accountId,
    amount: props.bill.amount,
    remark: '',
    date: dayjs().format(),
  }
  isCreate.value = true
  showEdit.value = true
}

function handleRefundItemTap(item: IRefundBill) {
  // console.log('账单退款', item)
  refund.value = {
    refundId: item.refundId,
    billId: item.billId,
    accountId: item.account.accountId,
    amount: item.amount,
    date: item.date,
    remark: item.remark,
  }
  isCreate.value = false
  showEdit.value = true
}

function handleEditAfterEnter() {
  accountId.value = refund.value.accountId
  // console.log(refund.value)
}

function handleDelete() {
  const refundId = refund.value.refundId
  if (isCreate.value || !refundId) {
    toast.error('当前为新增账单，不能删除')
    return
  }

  dialog
    .confirm({
      msg: `确定要删除账单退款记录？`,
      success: () => {
        deleteRefundBill(refundId).then(() => {
          emit('changeRefund', refund.value.amount)
          toast.success('删除成功')
          // 删除refundList.value中的指定退款
          refundList.value = refundList.value.filter(item => item.refundId !== refund.value.refundId)
        }).catch(() => {
          toast.error('删除失败')
        })
      },
    })
}

/**
 * 提交退款
 */
function handleConfirm() {
  // 校验退款输入
  if (!refund.value.billId)
    return toast.error('退款的账单不能空')
  if (refund.value.amount <= 0)
    return toast.error('退款金额不能小于0')

  refund.value.accountId = accountId.value
  const promise = new Promise<IRefundBill>((resolve, reject) => {
    if (refund.value.refundId) {
      // 更新退款
      updateRefundBill(refund.value).then((dto) => {
        resolve(dto)
      }).catch((err) => {
        reject(err)
      })
    }
    else {
      // 创建退款
      createRefundBill(refund.value).then((dto) => {
        resolve(dto)
      }).catch((err) => {
        reject(err)
      })
    }
  })

  promise.then((dto) => {
    updateRefundList(dto)
    showEdit.value = false
  }).catch((err) => {
    console.log(err)
    toast.error('操作失败')
  })
}

function updateRefundList(dto: IRefundBill) {
  let diff = -dto.amount
  if (isCreate.value) {
    // 将新退款插入数组首位
    refundList.value.unshift(dto)
  }
  else {
    // 获取旧数据
    const oldRefund = refundList.value.find(item => item.refundId === dto.refundId)
    if (oldRefund) {
      diff = oldRefund.amount - dto.amount
      // 替换更新后的数据
      refundList.value[refundList.value.indexOf(oldRefund)] = dto
    }
  }
  emit('changeRefund', diff)
}
</script>

<template>
  <!-- 退款列表 -->
  <center-popup v-model="show" title="退款" confirm-text="新增退款" :show-cancel="false" @confirm="handleAddRefund">
    <view class="min-h-[50vh] flex flex-col px-3 pb-2 space-y-2">
      <view v-for="item in refundList" :key="item.refundId" class="flex flex-col list-item-box space-y-3" @tap="handleRefundItemTap(item)">
        <view class="flex items-center justify-between font-semibold">
          <text>退款到：{{ item.account.name }}</text>
          <wd-text :text="item.amount" mode="price" :color="getBillColor(1)" />
        </view>

        <view class="flex items-center justify-between">
          <view class="flex space-x-3">
            <text> {{ `${getDateFormat(item.date)} ${dayjs(item.date).format('HH:mm')}` }}</text>
            <text>{{ item.remark }}</text>
          </view>
          <wd-text :text="item.amountBefore" mode="price" decoration="line-through" />
        </view>
      </view>
    </view>
  </center-popup>

  <!-- 退款编辑 -->
  <bottom-popup v-model="showEdit" title="退款" :actions="isCreate ? [] : actions" @after-enter="handleEditAfterEnter" @confirm="handleConfirm">
    <view class="flex flex-col space-y-6">
      <wd-form :model="refund">
        <!-- 金额 -->
        <wd-form-item title="退款金额">
          <wd-input v-model="refund.amount" compact type="number" placeholder="金额" />
        </wd-form-item>
        <!-- 备注 -->
        <wd-form-item title="退款备注">
          <wd-input v-model="refund.remark" compact type="text" placeholder="备注" />
        </wd-form-item>
        <!-- 时间 -->
        <wd-form-item title="退款时间">
          <view @tap="showDateTime = true">
            {{ `${getDateFormat(date)} ${dayjs(date).format('HH:mm')}` }}
          </view>
        </wd-form-item>
      </wd-form>
      <!-- 账户 -->
      <view class="p-3">
        <text>退款账户</text>
        <!-- :height="240" -->
        <account-view v-model="accountId" :height="240" />
      </view>
    </view>
  </bottom-popup>

  <!-- 日期弹窗 -->
  <date-time-popup v-model="showDateTime" v-model:date="date" />
</template>

<style lang="scss" scoped>

</style>
