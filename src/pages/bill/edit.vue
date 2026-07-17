<script lang="ts" setup>
import type { IBill } from '@/api/types/bill'
import type { ILedger } from '@/api/types/ledger'
import type { ITag } from '@/api/types/tag'
import { useToast } from '@wot-ui/ui'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import { c } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'
import { getAddressInfo } from '@/api/aggregation'
import { useBillStore, useLedgerStore, useSettingsStore } from '@/store'
import { getDateFormat } from '@/utils/date'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationBarTitleText: '新增账单',
    navigationStyle: 'custom',
  },
})

const toast = useToast()
const ledgerStore = useLedgerStore()
const settingsStore = useSettingsStore()
const billStore = useBillStore()

const typeOptions = ['支出', '收入']
const keyboardInput = ref('')
const inputCursor = ref(keyboardInput.value.length)

const showLedgers = ref(false)
const showDateTime = ref(false)
const showAccounts = ref(false)
const showTags = ref(false)
const showAddressEdit = ref(false)
const addressInput = ref()
const location = ref()
const categoryPickerHeight = ref(0)
const activeType = ref(0)

const billId = ref('')
const bill = ref<IBill>({
  type: 0,
  ledger: { ledgerId: '', name: '账单选择' },
  category: { categoryId: '', name: '', icon: '' },
  account: { accountId: '', name: '账户选择', icon: '' },
  amount: 0,
  date: dayjs().format(),
  remark: '',
  tags: [],
  address: '',
})

const billDate = ref(dayjs().valueOf())

const isCreate = ref(true)

watch(() => bill.value.tags, (newTags, oldTags) => {
  if (oldTags.length < 1 || newTags.length < 1) {
    initFixedHeight()
  }
})

onLoad((options: any) => {
  console.log('账单id', options.id)
  billId.value = options.id
  isCreate.value = !billId.value

  initBill()
})

onMounted(() => {
  initFixedHeight()

  initAddress()
})

function initBill() {
  if (isCreate.value) {
    // 赋默认值
    // 账本取第一个
    const ledger = ledgerStore.ledgers[0]
    bill.value.ledger = {
      ledgerId: ledger.ledgerId,
      name: ledger.name,
    }
  }
  else {
    // 接口加载bill数据bill.value.ledger = ledgerStore.ledgers[0]
  }
}
function initFixedHeight() {
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((top: any) => {
      const topHeight = top.height
      uni.createSelectorQuery().select('#BOTTOM_INPUT').boundingClientRect((bottom: any) => {
        categoryPickerHeight.value = systemInfo.windowHeight - (topHeight + bottom.height)
        // console.log(topHeight, bottom.height, categoryPickerHeight.value, 'categoryPickerHeight')
      }).exec()
    }).exec()
  })
}

function initAddress() {
  if (!settingsStore.address)
    return
  getAddress()
}

/**
 * 获取地址信息
 */
function getAddress() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success: (res: any) => {
        console.log(res, 'res')
        // bill.value.address = res.address
        location.value = `${res.longitude},${res.latitude}`
        getAddressInfo(res.longitude, res.latitude).then((res) => {
          bill.value.address = res.address
          addressInput.value = res.address
          resolve(res)
        })
      },
      fail: (err) => {
        console.log(err, 'err')
        wx.showModal({
          title: '温馨提示',
          content: '获取位置失败，需要授权获取地理位置',
          confirmText: '前往设置',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                // console.log(res);
                  if (res.authSetting['scope.userLocation']) {
                    // 重新获取地址
                    return getAddress()
                  }
                  else {
                    toast.error('授权失败，请检查设置')
                    reject(new Error('授权失败，请检查设置'))
                  }
                },
              })
            }
            else {
              toast.error('用户取消了授权地理位置')
              reject(new Error('用户取消了授权地理位置'))
            }
          },
          fail: (err) => {
            console.log(err, 'err')
            reject(err)
          },
        })
      },
    })
  })
}

function handlePressKeyboard(key: any, value: string) {
  // console.log(key, value)
  // key: 键盘按下的键，例如：0-9，+，-，*，÷，.，delete，confirm，custom
  // value: 键盘按下的值

  if (key === 'confirm') {
    // 完成键（创建/更新账单，关闭当前页面）
    handleEditComplete()
  }
  else if (key === 'custom') {
    // 再记键（继续创建/更新账单，不关闭当前页面）
    handleEditComplete(true)
  }

  const amount = calculateExpression(value)
  // console.log('计算结果:', amount)
  bill.value.amount = amount
}

/**
 * 计算算术表达式的值
 * @param expression 包含数字和运算符的字符串，支持 + - × ÷ 和小数
 * @returns 计算结果
 */
function calculateExpression(expression: string): number {
  if (!expression)
    return 0

  // 替换中文乘除号为 JavaScript 运算符
  let expr = expression.replace(/×/g, '*').replace(/÷/g, '/')

  // 处理以小数点开头的数字，如 ".89" -> "0.89"
  expr = expr.replace(/([+\-*/]|^)\.(\d)/g, '$10.$2')

  // 移除连续的运算符，保留最后一个
  expr = expr.replace(/[+\-*/]+/g, (match) => {
    // 取最后一个运算符
    const lastOperator = match.slice(-1)
    return lastOperator
  })

  // 使用正则表达式分割数字和运算符
  const tokens = expr.match(/\d+(\.\d+)?|[+\-*/]/g)

  if (!tokens)
    return 0

  // 过滤掉可能存在的无效token
  const validTokens = tokens.filter(token =>
    !Number.isNaN(Number(token)) || ['+', '-', '*', '/'].includes(token),
  )

  if (validTokens.length === 0)
    return 0

  // 使用栈来处理运算优先级，使用 Decimal 进行高精度计算
  const stack: Decimal[] = []
  let currentNum = null as Decimal | null
  let operation: string = '+'
  let index = 0

  while (index < validTokens.length) {
    const token = validTokens[index]

    // 如果是数字
    if (!Number.isNaN(Number(token))) {
      currentNum = new Decimal(token)
    }
    // 如果是运算符
    else if (['+', '-', '*', '/'].includes(token)) {
      // 如果当前有数字，先处理它
      if (currentNum !== null) {
        // 根据之前的运算符执行相应操作
        switch (operation) {
          case '+':
            stack.push(currentNum)
            break
          case '-':
            stack.push(currentNum.negated())
            break
          case '*':
            stack.push(stack.pop()!.times(currentNum))
            break
          case '/':
          {
            const prev = stack.pop()!
            // 防止除零错误
            if (currentNum.isZero()) {
              toast.error('除数不能为零, 请检查输入')
              return stack.reduce((acc, curr) => acc.plus(curr), new Decimal(0)).toNumber()
            }
            stack.push(prev.dividedBy(currentNum))
            break
          }
        }
      }

      // 更新运算符，重置当前数字
      operation = token
      currentNum = null
    }

    index++
  }

  // 处理最后一个数字
  if (currentNum !== null) {
    switch (operation) {
      case '+':
        stack.push(currentNum)
        break
      case '-':
        stack.push(currentNum.negated())
        break
      case '*':
        stack.push(stack.pop()!.times(currentNum))
        break
      case '/':
      {
        const prev = stack.pop()!
        // 防止除零错误
        if (currentNum.isZero()) {
          toast.error('除数不能为零, 请检查输入')
          return stack.reduce((acc, curr) => acc.plus(curr), new Decimal(0)).toNumber()
        }
        stack.push(prev.dividedBy(currentNum))
        break
      }
    }
  }

  // 将栈中所有数值相加得到最终结果
  const finalResult = stack.reduce((acc, curr) => acc.plus(curr), new Decimal(0))
  return Number.parseFloat(finalResult.toFixed(2).toString())
}

function handleEditComplete(keep: boolean = false) {
  console.log('handleEditComplete', bill.value)
  // 校验必要参数
  const edit = bill.value
  if (!edit.ledger || !edit.ledger.ledgerId)
    return toast.error('请选择账本')
  if (!edit.category || !edit.category.categoryId)
    return toast.error('请选择分类')
  if (!edit.account || !edit.account.accountId)
    return toast.error('请选择账户')
  if (edit.amount <= 0)
    return toast.error('请输入正确的金额')

  if (isCreate.value) {
    billStore.createBill(edit, location.value).then(() => {
      if (!keep) {
        uni.navigateBack()
      }
    })
  }
  else {
    billStore.createBill(edit, location.value).then(() => {
      if (!keep) {
        uni.navigateBack()
      }
    })
  }
}

function handleLedgerChange(ledger: ILedger) {
  bill.value.ledger = {
    ledgerId: ledger.ledgerId,
    name: ledger.name,
  }
}

function handleDateTimeConfirm(datetime: number) {
  // console.log(datetime, 'datetime')
  bill.value.date = dayjs(datetime).format()
  // console.log(bill.value.date, 'datetime')
}

function handleCategoryChange(item: any) {
  const { type, select, parent } = item

  if (type !== bill.value.type)
    return

  bill.value.category = {
    categoryId: select.id,
    name: select.name,
    icon: select.icon,
    parent: {
      categoryId: parent.id,
      name: parent.name,
      icon: parent.icon,
    },
  }
}

function handleAddressEditShow() {
  addressInput.value = bill.value.address
  showAddressEdit.value = true
}

function handleAddressEditConfirm(check: any) {
  bill.value.address = addressInput.value
  check(true)
}

function handleTagSelectConfirm(items: ITag[]) {
  // console.log(items, 'tags')
  bill.value.tags = items.map((t) => {
    return {
      tagId: t.tagId,
      name: t.name,
    }
  })
}

function handleAccountSelectConfirm(item: any) {
  console.log(item, 'handleAccountSelectedChange')
  const { account, parent } = item
  if (!account)
    return

  bill.value.account = {
    accountId: account.id,
    name: account.name,
    icon: account.icon,
    parent: {
      accountId: parent.id,
      name: parent.name,
      icon: parent.icon,
    },
  }
}
</script>

<template>
  <!-- <page-meta :page-style="`overflow:${showLedgers || showDateTime || showAccounts || showTags ? 'hidden' : 'visible'};`" /> -->
  <draw-background1 />
  <!-- 导航栏 -->
  <nav-bar id="TOP_NAVBAR">
    <template #title>
      <view class="w-full flex justify-between">
        <!-- 账本按钮 -->
        <view class="flex items-center" @tap="showLedgers = true">
          <wd-icon class="flex-shrink-0" name="caret-down" />
          <text class="line-clamp-1 ml-2">{{ bill.ledger.name }}</text>
        </view>
      </view>
    </template>
    <template #prefix-action>
      <view class="mt-4 max-w-max rounded-full bg-gray-200/50 px-3 py-1">
        <mbill-segmented v-model="activeType" :options="typeOptions" />
      </view>
    </template>
  </nav-bar>
  <!-- 账单分类 -->
  <view class="">
    <wd-swiper
      v-model:current="activeType" :list="['0', '1']"
      :indicator="false" :autoplay="false" :height="categoryPickerHeight"
    >
      <template #default="{ item }">
        <category-view v-model="bill.category.categoryId" :type="item === '0' ? 0 : 1" :height="categoryPickerHeight" @change="handleCategoryChange" />
      </template>
    </wd-swiper>
  </view>

  <view id="BOTTOM_INPUT" class="absolute bottom-0 left-0 right-0">
    <!-- 标签 -->
    <view v-if="bill.tags && bill.tags.length > 0" class="hide-view-scrollbar flex overflow-x-auto px-2 py-1 space-x-2">
      <view v-for="tag in bill.tags" :key="tag.tagId" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs" @tap="showTags = true">
        {{ tag.name }}
      </view>
    </view>
    <!-- 账单属性 -->
    <view class="bill-attr-box hide-view-scrollbar">
      <view class="bill-attr-box-item" @tap="showDateTime = true">
        <!-- 日期 -->
        <wd-icon name="calendar-line" size="20px" />
        <text class="ml-1">{{ `${getDateFormat(billDate)} ${dayjs(billDate).format('HH:mm')}` }}</text>
      </view>
      <view class="bill-attr-box-item" @tap="showAccounts = true">
        <!-- 账户 -->
        <bill-icon size="22px" :icon="bill.account.icon" :text="bill.account.name" />
        <text class="ml-1">{{ bill.account.parent ? `${bill.account.parent.name}-${bill.account.name}` : bill.account.name }}</text>
      </view>
      <view class="bill-attr-box-item" @tap="showTags = true">
        <!-- 标签 -->
        <wd-icon name="tag" size="20px" />
        <text class="ml-1">标签</text>
      </view>
      <view class="bill-attr-box-item" @tap="handleAddressEditShow">
        <!-- 地点 -->
        <wd-icon name="location" size="20px" />
        <text class="address-truncate-start">{{ bill.address || '地址' }}</text>
      </view>
    </view>
    <!-- 账单总额、备注 -->
    <view class="flex items-center justify-between px-2 py-1 space-x-xl">
      <view class="w-full shrink-1">
        <!-- 备注 -->
        <wd-input v-model="bill.remark" compact type="text" placeholder="账单备注" />
      </view>
      <view>
        <!-- 总金额 -->
        <wd-text :text="bill.amount" mode="price" type="success" size="17px" />
      </view>
    </view>

    <!-- 键盘输入框 -->
    <view class="py-1">
      <amount-input v-model="keyboardInput" v-model:cursor="inputCursor" />
    </view>
    <!-- 金额键盘 -->
    <keyboard v-model="keyboardInput" v-model:cursor="inputCursor" @press="handlePressKeyboard" />
    <view class="pb-safe" />
  </view>

  <!-- 账本弹窗 -->
  <ledger-popup v-model="showLedgers" v-model:value="bill.ledger.ledgerId" single @change="handleLedgerChange" />
  <!-- 日期弹窗 -->
  <date-time-popup v-model="showDateTime" v-model:date="billDate" @confirm="handleDateTimeConfirm" />
  <!-- 账户弹窗 -->
  <account-picker-popup v-model="showAccounts" :account="bill.account.accountId" @confirm="handleAccountSelectConfirm" />
  <!-- 标签弹窗 -->
  <tag-picker-popup v-model="showTags" :tags="bill.tags.map(t => t.tagId)" @confirm="handleTagSelectConfirm" />
  <!-- 地点弹窗 -->
  <center-popup v-model="showAddressEdit" title="地址" @confirm="handleAddressEditConfirm">
    <view class="px-4 pt-4">
      <wd-input v-model="addressInput" type="text" placeholder="地址" />
    </view>
  </center-popup>
</template>

<style lang="scss" scoped>
.bill-attr-box {
  white-space: nowrap;
  @apply: flex items-center px-2 py-1 gap-2 overflow-x-auto;
  &-item {
    @apply: flex items-center justify-center py-1.5 px-2.5 bg-indigo-200/40 rounded-full;
  }
}
.address-truncate-start {
  direction: rtl; /* 文本从右向左排列 */
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 200px;
  margin-left: 2px;
}
</style>
