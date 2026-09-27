<script lang="ts" setup>
import type { Key } from './keyItem.vue'
import type { BillTypeEnum } from '@/typings.js'
import Decimal from 'decimal.js'
import { amountFormat, getBillColor } from '@/utils'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  input?: string
  type: BillTypeEnum
}>(), {
  input: '',
})

const emit = defineEmits(['press'])
const amount = defineModel<number>({ default: 0 })

// 运算符键
const opKeys: Key[] = [{
  key: '+',
  icon: 'plus',
  emphasize: true,
}, {
  key: '-',
  icon: 'minus',
  emphasize: true,
}, {
  key: '×',
  icon: 'close',
  emphasize: true,
}, {
  key: '÷',
  icon: 'division',
  emphasize: true,
}]

// 删除键
const delKey: Key = {
  key: 'delete',
  icon: 'del',
  emphasize: true,
}
// 完成/提交键
const confirmKey: Key = {
  key: 'confirm',
  text: '完成',
  emphasize: true,
}

const toast = useGlobalToast()

const input = ref('')
const cursor = ref(0)

// 数字键
const keys = computed(() => genBasicKeys())

watch(() => props.input, (n) => {
  if (!n)
    return

  // 初始化输入
  input.value = n
  cursor.value = n.length
})

function genBasicKeys(): Key[] {
  const keys: Key[] = Array.from({ length: 9 }, (_, i) => ({ key: i + 1 }))
  // 0：零, .：小数点, custom：再记
  keys.push({ key: 0 }, { key: '.' }, { key: 'custom', text: '再记', emphasize: true })
  return keys
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

function handleKeyPress(key: string | number) {
  const value = input.value
  // console.log(props.cursor, 'cursor')

  if (key === 'custom' || key === 'confirm') {
    emit('press', key, value)
    return
  }

  if (key === 'delete') {
    // console.log(value)

    const newValue = value.slice(0, cursor.value - 1) + value.slice(cursor.value)
    let cur = cursor.value
    if (cur > 0) {
      cur = cursor.value - 1
    }
    cursor.value = cur
    input.value = newValue
  }
  else {
    const newValue = value.slice(0, cursor.value) + key + value.slice(cursor.value)
    cursor.value += 1
    input.value = newValue
  }

  // console.log(props.cursor, 'props.cursor')
  amount.value = calcExpression(input.value)
  emit('press', { key, input: input.value, amount: amount.value })
}

function handleDelLongPress() {
  console.log('长按删除')
  input.value = ''
  cursor.value = 0
  // emit('press', key, input.value)
}
</script>

<template>
  <view class="keyboard">
    <view class="mb-2 px-2">
      <view class="flex text-lg font-semibold" :style="{ color: getBillColor(type) }">
        <text class="pr-0.5">￥</text>
        <text>{{ amountFormat(amount) }}</text>
      </view>

      <keyboard-input v-model:cursor="cursor" :input="input" :type="type" />
    </view>

    <view class="keyboard-box">
      <view class="keyboard-basic-keys">
        <key-item v-for="value in keys" :key="value.key" :value="value" @press="handleKeyPress" />
      </view>
      <view class="keyboard-sidebar">
        <key-item :key="delKey.key" :value="delKey" @press="handleKeyPress" @long-press="handleDelLongPress" />
        <view class="keyboard-op-keys">
          <key-item v-for="value in opKeys" :key="value.key" small :value="value" @press="handleKeyPress" />
        </view>
        <key-item :key="confirmKey.key" :value="confirmKey" @press="handleKeyPress" />
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.keyboard {
  @apply: rounded-t-lg bg-gray-100 dark:bg-[var(--wot-dark-background6)] text-black dark:text-white;
  -webkit-user-select: none;
  user-select: none;
}

.keyboard-box {
  display: flex;
  padding: 6px 0 0 6px;
}

.keyboard-basic-keys {
  display: flex;
  flex: 3;
  flex-wrap: wrap;
}

.keyboard-op-keys {
  display: flex;
  flex: 2;
  flex-wrap: wrap;
}

.keyboard-sidebar {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
