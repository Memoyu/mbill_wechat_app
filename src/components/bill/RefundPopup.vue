<script setup lang="ts">
import type { IRefunBill } from '@/api/types/bill'
import { useToast } from '@wot-ui/ui'
import dayjs from 'dayjs'
import { getDateFormat } from '@/utils/date'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  refund: IRefunBill
}>()
const emit = defineEmits(['confirm'])
const show = defineModel<boolean>()

const toast = useToast()

const showDateTime = ref(false)
const refund = ref<IRefunBill>()
const accountId = ref()
const date = ref(dayjs().valueOf())

watch(() => props.refund, (val) => {
  refund.value = val
}, { immediate: true, deep: true })

function handleAfterEnter() {
  accountId.value = refund.value.accountId
  console.log(refund.value)
}

/**
 * 提交退款
 */
function handleConfirm(check: (pass: boolean) => void) {
  // 校验退款输入
  if (refund.value.amount <= 0)
    return toast.error('退款金额不能小于0')

  emit('confirm')
  check(true)
}
</script>

<template>
  <bottom-popup v-model="show" title="退款" @after-enter="handleAfterEnter" @confirm="handleConfirm">
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
        <account-view v-model="accountId" :height="240" />
      </view>
    </view>
  </bottom-popup>

  <!-- 日期弹窗 -->
  <date-time-popup v-model="showDateTime" v-model:date="date" />
</template>

<style lang="scss" scoped>

</style>
