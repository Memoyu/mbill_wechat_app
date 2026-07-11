<script lang="ts" setup>
import type { ILedger } from '@/api/types/ledger'
import type { ActionGroup, ActionItem } from '@/typings'
import { useDialog, useToast } from '@wot-ui/ui'
import dayjs from 'dayjs'
import UQRCode from 'uqrcodejs'
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
    text: '创建',
    icon: 'plus',
    action: handleCreateAction,
  },
  {
    text: '加入',
    icon: 'scan',
    action: handleScanAction,
  },
]
const ledgerActions: ActionGroup[] = [
  {
    title: '账本样式',
    actions: [
      {
        icon: 'i-carbon-color-palette',
        text: '更换颜色',
        action: handleChangeColorAction,
      },
    ],
  },
  {
    title: '账本管理',
    actions: [
      {
        icon: 'i-carbon-edit',
        text: '编辑账本',
        action: handleEditAction,
      },
      {
        icon: 'i-carbon-share',
        text: '共享账本',
        action: handleShareAction,
      },
      {
        icon: 'i-carbon-arrows-horizontal',
        text: '账单迁移',
        action: handleMigrateAction,
      },
      // {
      //   icon: 'view-off',
      //   text: '隐藏账单',
      //   type: 'warning',
      //   action: handleHideAction,
      // },
      {
        icon: 'i-carbon-trash-can',
        text: '删除账本',
        type: 'danger',
        action: handleDeleteAction,
      },
    ],
  },
]
const qrcodeCanvasId = 'ledgerQrcodeCnvas'

const { proxy } = getCurrentInstance() as any
const dialog = useDialog()
const toast = useToast()

const shareDialog = useDialog('ledger-share-dialog')
const ledgerStore = useLedgerStore()

const ledgers = computed(() => {
  return ledgerStore.ledgers
})

const editShow = ref(false)
const editTitle = ref('新增账本')
const scrollHeight = ref(300)

const actionShow = ref(false)
const colorPickerShow = ref(false)
const currentLedger = ref<ILedger>()

const editLedger = ref<{
  isCreate: boolean
  name: string
  color: number
  ledgerId?: string
  randomColor?: boolean
}>({ isCreate: true, name: '', color: 0, randomColor: true })

onMounted(() => {
  // 进入管理页面重新加载一下数据
  ledgerStore.loadLedgers()
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: any) => {
      // console.log(data)
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

/**
 * 创建账本
 */
function handleCreateAction() {
  editLedger.value = {
    isCreate: true,
    name: '',
    color: 0,
    randomColor: true,
  }

  editTitle.value = '创建账本'
  editLedger.value.isCreate = true
  editShow.value = true
}

/**
 * 扫码加入账本
 */
function handleScanAction() {
  uni.scanCode({
    success(res) {
      // console.log(`条码类型：${res.scanType}`)
      // console.log(`条码内容：${res.result}`)
      ledgerStore.joinLedger(dialog, toast, res.result)
    },
    fail(e) {
      console.log(`扫码错误：${e}`)
    },
  })
}

function handleLedgerActions(ledger: any) {
  currentLedger.value = ledger
  actionShow.value = true
}

function handleChangeColorAction() {
  colorPickerShow.value = true
}

function handleEditAction() {
  if (!currentLedger.value)
    return

  const { ledgerId, name, color } = currentLedger.value
  editLedger.value = {
    isCreate: false,
    name,
    color,
    ledgerId,
  }

  editTitle.value = name
  editShow.value = true
}

async function handleEditConfirm(check: (close: boolean) => void) {
  const { isCreate, ledgerId, name, color, randomColor } = editLedger.value

  if (!name) {
    toast.error('账本名称不能为空')
    return check (false)
  }

  if (isCreate) {
    const color = randomColor ? getColorByName(editLedger.value.name) : editLedger.value.color
    await ledgerStore.createLedger(editLedger.value.name, color)
  }
  else {
    if (!ledgerId) {
      toast.error('账本ID不能为空')
      return check(false)
    }
    await ledgerStore.updateLedger({
      ledgerId,
      name,
    })
  }

  return check (true)
}

function handleShareAction() {
  if (!currentLedger.value)
    return

  // 转换尺寸
  const size = 240
  // 获取uQRCode实例
  const qr = new UQRCode()
  qr.setOptions({
    // 设置二维码内容
    data: currentLedger.value.ledgerId,
    // 设置二维码大小，必须与canvas设置的宽高一致
    size,
    // 设置二维码边距
    margin: uni.upx2px(10),
  })
  // 调用制作二维码方法
  qr.make()
  // 获取canvas上下文
  const canvasContext = uni.createCanvasContext(qrcodeCanvasId, proxy)
  // 设置uQRCode实例的canvas上下文
  qr.canvasContext = canvasContext
  qr.drawCanvas()
  shareDialog.alert({})
}

function handleMigrateAction() {

}

function handleHideAction() {

}

function handleDeleteAction() {
  if (!currentLedger.value)
    return
  ledgerStore.deleteLedger(currentLedger.value.ledgerId)
}

/**
 * 排序触发
 * @param list 排序结果
 */
function handleSortChange(list: ILedger[]) {
  // console.log(ledgerStore.ledgers, '原有账本')
  // console.log(list, '排序触发')
  ledgerStore.sortLedger(list)
}
</script>

<template>
  <page-meta :page-style="`overflow:${editShow ? 'hidden' : 'visible'};`" />
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
                  <view class="mt-3 flex items-center text-xs">
                    <text>
                      收入
                    </text>
                    <text class="ml-2 text-[var(--mbill-income-color)] font-bold">
                      {{ listItem.income }}
                    </text>
                    <text class="ml-4">
                      支出
                    </text>
                    <text class="ml-2 text-[var(--mbill-expend-color)] font-bold">
                      {{ listItem.expend }}
                    </text>
                  </view>
                  <view class="mt-3 h-25px flex items-center justify-between">
                    <wd-avatar-group :max-count="9" size="25">
                      <wd-avatar
                        v-for="user in listItem.users" :key="user.userId"
                        :text="user.nickname.slice(0, 1)"
                        :src="user.avatar"
                        bg-color="#a5b4fc"
                      />
                    </wd-avatar-group>
                    <text class="text-xs">{{ dayjs(listItem.createTime).format('YYYY-MM-DD HH:MM') }}</text>
                  </view>
                </view>
                <view class="ledger-item-more">
                  <view
                    class="h-6 w-6 flex items-center justify-center rounded-full bg-white/40 shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
                    @tap.stop="handleLedgerActions(listItem)"
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

  <!-- 编辑账本 -->
  <center-popup v-model="editShow" :title="editTitle" @confirm="handleEditConfirm">
    <view class="px-4 pt-4">
      <wd-input v-model="editLedger.name" type="text" placeholder="账本名称" />
      <view v-if="editLedger.isCreate">
        <view class="mt-2">
          <wd-checkbox v-model="editLedger.randomColor">
            随机颜色
          </wd-checkbox>
        </view>
        <!-- 颜色网格 -->
        <view v-if="!editLedger.randomColor" class="mt-2 h-50 overflow-y-auto p-2">
          <view class="grid grid-cols-4 gap-4">
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
        </view>
      </view>
    </view>
  </center-popup>

  <!-- 更多操作 -->
  <action-popup
    v-model="actionShow"
    :title="currentLedger?.name || ''"
    :items="ledgerActions"
  />
  <!-- 颜色选择器 -->
  <color-picker-popup v-model="colorPickerShow" :ledger-id="currentLedger?.ledgerId ?? ''" />

  <!-- 分享二维码 -->
  <wd-dialog selector="ledger-share-dialog">
    <canvas :id="qrcodeCanvasId" :canvas-id="qrcodeCanvasId" style="width: 240px;height: 240px;" />
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
</style>
