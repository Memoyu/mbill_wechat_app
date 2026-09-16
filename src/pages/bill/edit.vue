<script lang="ts" setup>
import type { IBillAccount, IBillCategory, IEditBill } from '@/api/types/bill'
import type { ILedger } from '@/api/types/ledger'
import type { ITag } from '@/api/types/tag'
import { useToast } from '@wot-ui/ui'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import { getAddressInfo } from '@/api/aggregation'
import { getBill } from '@/api/bill'
import { useIndexBillStore, useLedgerStore, useSettingsStore } from '@/store'
import { formatDate, getBillColor, systemInfo } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '新增账单',
    navigationStyle: 'custom',
  },
})

const toast = useToast()
const ledgerStore = useLedgerStore()
const settingsStore = useSettingsStore()
const indexBillStore = useIndexBillStore()

const typeOptions = ['支出', '收入']
const keyboardInput = ref('')
const inputCursor = ref(keyboardInput.value.length)

const showLedgers = ref(false)
const showDateTime = ref(false)
const showAccounts = ref(false)
const showTags = ref(false)
const showAddressEdit = ref(false)
const addressInput = ref()
const categoryPickerHeight = ref(0)

const isCreate = ref(true)
const bill = ref<IEditBill>({
  type: 0,
  ledger: { ledgerId: '', name: '账单选择' },
  category: { categoryId: '', name: '', icon: '' },
  account: { accountId: '', name: '账户选择', icon: '' },
  amount: 0,
  date: dayjs().format('YYYY-MM-DD HH:mm:00'),
  remark: '',
  tags: [] as ITag[],
  location: '',
  address: '',
})
const billDate = ref(dayjs(bill.value.date).valueOf())
const tagIds = ref<string[]>([])
watch(() => bill.value.tags, () => {
  calcFixedHeight()
})

onLoad((options: any) => {
  bill.value.billId = options.id
  isCreate.value = !options.id
  // console.log('账单id', options.id, isCreate.value)
  initBill()
})

onMounted(() => {
  calcFixedHeight()

  initAddress()
})

function initBill() {
  if (!bill.value.billId) {
    // 赋默认值
    // 账本取第一个
    const ledger = ledgerStore.ledgers[0]
    bill.value.ledger = {
      ledgerId: ledger.ledgerId,
      name: ledger.name,
    }
  }
  else {
    getBill(bill.value.billId).then((res) => {
      bill.value = {
        ...res,
      }
      tagIds.value = res.tags.map((tag: ITag) => tag.tagId)
      billDate.value = dayjs(res.date).valueOf()
      // 赋值键盘输入金额
      setKeyboardInput(res.amount)
    })
  }
}

/**
 * 赋值键盘输入金额
 * @param value 金额
 */
function setKeyboardInput(value: number) {
  keyboardInput.value = value.toString()
  inputCursor.value = keyboardInput.value.length
}
/**
 * 计算固定高度
 */
function calcFixedHeight() {
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

/**
 * 初始化地址信息
 */
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
        bill.value.location = `${res.longitude},${res.latitude}`
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

/**
 * 处理键盘按键按下
 * @param key 按下的键
 * @param value 按下的值
 */
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

  const amount = calcExpression(value)
  // console.log('计算结果:', amount)
  bill.value.amount = amount
}

/**
 * 计算算术表达式的值
 * @param expression 包含数字和运算符的字符串，支持 + - × ÷ 和小数
 * @returns 计算结果
 */
function calcExpression(expression: string): number {
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
  // TODO 防连击处理
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
    indexBillStore.createBill(edit).then(() => {
      if (!keep) {
        uni.navigateBack()
      }
    })
  }
  else {
    indexBillStore.updateBill(edit).then(() => {
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

/**
 * 分类选择
 */
function handleCategoryChange(category: IBillCategory) {
  console.log(category, 'handleCategoryChange')
  bill.value.category = category
}

/**
 * 时间选择
 */
function handleDateTimeConfirm(datetime: number) {
  // console.log(datetime, 'datetime')
  bill.value.date = dayjs(datetime).format()
  // console.log(bill.value.date, 'datetime')
}

function handleAccountSelectConfirm(account: IBillAccount) {
  console.log(account, 'handleAccountSelectConfirm')
  bill.value.account = account
}

function handleAddressEditShow() {
  addressInput.value = bill.value.address
  showAddressEdit.value = true
}

function handleAddressEditConfirm() {
  bill.value.address = addressInput.value
  showAddressEdit.value = false
}

function handleTagSelectConfirm(items: ITag[]) {
  // console.log(items, 'tags')
  showTags.value = false
  bill.value.tags = items
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
      <view class="mt-4 max-w-max rounded-full bg-gray-200/50 px-2 py-1">
        <mbill-segmented v-model="bill.type" :gap="6" :options="typeOptions" />
      </view>
    </template>
  </nav-bar>

  <!-- 账单分类 -->
  <category-view
    v-model="bill.category.categoryId"
    v-model:type="bill.type"
    show-top
    :height="categoryPickerHeight"
    @change="handleCategoryChange"
  />

  <view id="BOTTOM_INPUT" class="absolute bottom-0 left-0 right-0">
    <!-- 标签 -->
    <view v-if="bill.tags && bill.tags.length > 0" class="relative">
      <scroll-view scroll-x enhanced :show-scrollbar="false" class="relative mr-2 flex-1" :bounces="false">
        <view class="min-w-max flex items-center gap-2.5 whitespace-nowrap px-4">
          <view v-for="tag in bill.tags" :key="tag.tagId" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs" @tap="showTags = true">
            {{ tag.name }}
          </view>
        </view>
      </scroll-view>
      <!-- 添加渐变遮罩 -->
      <view
        class="pointer-events-none absolute bottom-0 left-0 top-0 w-5 transition-opacity duration-200"
        :style="{ background: 'linear-gradient(to left, rgba(250, 250, 250, 0) 0%, rgba(250, 250, 250, 0.95) 40%, rgba(250, 250, 250, 1) 100%)' }"
      />
      <view
        class="pointer-events-none absolute bottom-0 right-0 top-0 w-5 transition-opacity duration-200"
        :style="{ background: 'linear-gradient(to right, rgba(250, 250, 250, 0) 0%, rgba(250, 250, 250, 0.95) 40%, rgba(250, 250, 250, 1) 100%)' }"
      />
    </view>

    <!-- 账单属性 -->
    <view class="relative">
      <scroll-view scroll-x enhanced :show-scrollbar="false" :bounces="false">
        <view class="bill-attr-box min-w-max">
          <view class="bill-attr-box-item" @tap="showDateTime = true">
            <!-- 日期 -->
            <wd-icon name="calendar-line" size="20px" />
            <text class="ml-1">{{ `${formatDate(billDate)} ${dayjs(billDate).format('HH:mm')}` }}</text>
          </view>
          <view class="bill-attr-box-item" @tap="showAccounts = true">
            <!-- 账户 -->
            <bill-icon size="22" :icon="bill.account.icon" :text="bill.account.name" />
            <text class="ml-1">{{ bill.account.name }}</text>
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
      </scroll-view>
      <!-- 添加渐变遮罩 -->
      <view
        class="pointer-events-none absolute bottom-0 left-0 top-0 w-5 transition-opacity duration-200"
        :style="{ background: 'linear-gradient(to left, rgba(250, 250, 250, 0) 0%, rgba(250, 250, 250, 0.95) 40%, rgba(250, 250, 250, 1) 100%)' }"
      />
      <view
        class="pointer-events-none absolute bottom-0 right-0 top-0 w-5 transition-opacity duration-200"
        :style="{ background: 'linear-gradient(to right, rgba(250, 250, 250, 0) 0%, rgba(250, 250, 250, 0.95) 40%, rgba(250, 250, 250, 1) 100%)' }"
      />
    </view>
    <!-- 账单总额、备注 -->
    <view class="flex items-center justify-between px-2 py-1 space-x-xl">
      <view class="w-full shrink-1">
        <!-- 备注 -->
        <wd-input v-model="bill.remark" compact type="text" placeholder="账单备注" />
      </view>
      <view>
        <!-- 总金额 -->
        <wd-text :text="bill.amount" mode="price" size="17px" :style="{ color: getBillColor(bill.type) }" />
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
  <ledger-picker v-model="showLedgers" v-model:value="bill.ledger.ledgerId" single @change="handleLedgerChange" />
  <!-- 日期弹窗 -->
  <date-time-picker v-model="showDateTime" v-model:date="billDate" @confirm="handleDateTimeConfirm" />
  <!-- 账户弹窗 -->
  <account-picker v-model="showAccounts" :account="bill.account.accountId" @confirm="handleAccountSelectConfirm" />
  <!-- 标签弹窗 -->
  <tag-list-picker v-model="tagIds" v-model:visible="showTags" @confirm="handleTagSelectConfirm" />
  <!-- 地点弹窗 -->
  <center-popup v-model="showAddressEdit" title="地址" @confirm="handleAddressEditConfirm">
    <view class="px-3">
      <wd-input v-model="addressInput" type="text" placeholder="地址" />
    </view>
  </center-popup>
</template>

<style lang="scss" scoped>
.bill-attr-box {
  @apply: flex items-center px-4 py-1 gap-2 whitespace-nowrap;
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
