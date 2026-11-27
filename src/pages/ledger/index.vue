<script lang="ts" setup>
import type { ILedger } from '@/api/types/ledger'
import type { ActionGroup, ActionItem } from '@/typings'
import dayjs from 'dayjs'
import { getColorByName, gradients } from '@/constants/gradients'
import { useLedgerStore } from '@/store'
import { systemInfo } from '@/utils'

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

const toast = useGlobalToast()
const ledgerStore = useLedgerStore()

const ledgers = computed(() => ledgerStore.ledgers)

const editShow = ref(false)
const shareShow = ref(false)
const editTitle = ref('新增账本')
const scrollHeight = ref(300)

const actionShow = ref(false)
const colorPickerShow = ref(false)
const currentLedger = ref<ILedger>()
const ledgerActions = ref<ActionGroup[]>([
  // {
  //   title: '账本样式',
  //   actions: [
  //     {
  //       icon: 'i-lucide-palette',
  //       text: '更换颜色',
  //       action: handleChangeColorAction,
  //     },
  //   ],
  // },
  {
    // title: '账本管理',
    actions: [
      {
        icon: 'i-lucide-edit',
        text: '编辑账本',
        action: handleEditAction,
      },
      {
        icon: 'i-lucide-share',
        text: '共享账本',
        action: handleShareAction,
      },
      // {
      //   icon: 'i-lucide-arrow-right-left',
      //   text: '账单迁移',
      //   action: handleMigrateAction,
      // },
      // {
      //   icon: 'view-off',
      //   text: '隐藏账单',
      //   type: 'warning',
      //   action: handleHideAction,
      // },
      {
        icon: 'i-lucide-trash',
        text: '删除账本',
        type: 'danger',
        action: handleDeleteAction,
      },
    ],
  },
])

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
      ledgerStore.joinLedger(res.result)
    },
    fail(e) {
      console.log(`扫码错误：${e}`)
    },
  })
}

function handleLedgerActions(ledger: any) {
  if (!ledger)
    return
  currentLedger.value = ledger
  // 默认账单，不显示共享
  ledgerActions.value[0].actions[1].hide = currentLedger.value!.default
  actionShow.value = true
}

function handleLedgerTap(ledger: any) {
  if (!ledger)
    return

  // TODO 开发账本详情页后开放
  // uni.navigateTo({
  //   url: `/pages/ledger/detail?ledgerId=${ledger.ledgerId}`,
  // })
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

async function handleEditConfirm() {
  const { isCreate, ledgerId, name, color, randomColor } = editLedger.value

  if (!name) {
    toast.error('账本名称不能为空')
    return
  }

  if (isCreate) {
    const color = randomColor ? getColorByName(editLedger.value.name) : editLedger.value.color
    await ledgerStore.createLedger(editLedger.value.name, color)
  }
  else {
    if (!ledgerId) {
      toast.error('账本ID不能为空')
      return
    }
    await ledgerStore.updateLedger({
      ledgerId,
      name,
    })
  }

  editShow.value = false
}

function handleShareAction() {
  if (!currentLedger.value)
    return

  shareShow.value = true
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
          <view class="mb-block-bg relative overflow-hidden p-3 transition-all duration-200" @tap.stop="handleLedgerTap(listItem)">
            <!-- 账簿封面 -->
            <view class="bg-gradient-to-br">
              <!-- 装饰元素容器 -->
              <view class="pointer-events-none absolute inset-0">
                <!-- 小圆形装饰 -->
                <view class="absolute bottom-0 left-0 z-[1] h-32 w-32 translate-y-16 rounded-full bg-black/3 -translate-x-16" />

                <!-- 上下左右居中的大圆 -->
                <view class="absolute inset-0 left-0 top-0 h-35 w-35 translate-x-10 rounded-full bg-black/2 -translate-y-22" />

                <!-- 大圆形装饰 -->
                <view class="absolute right-0 top-0 z-[1] h-48 w-48 translate-x-25 rounded-full bg-black/2 -translate-y-15" />
              </view>
            </view>

            <view class="flex rounded-2xl">
              <view class="flex flex-1 flex-col">
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
              </view>

              <view class="flex flex-shrink-0 flex-col justify-items-start">
                <action-btn @tap.stop="handleLedgerActions(listItem)">
                  <wd-icon size="10" name="more" />
                </action-btn>
              </view>
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
              <text class="text-xs">{{ dayjs(listItem.createTime).format('YYYY-MM-DD HH:mm') }}</text>
            </view>
          </view>
        </template>
      </drag-sort-list-view>
    </view>
  </view>

  <!-- 编辑账本 -->
  <center-popup v-model="editShow" :title="editTitle" @confirm="handleEditConfirm">
    <view class="px-3">
      <wd-input v-model="editLedger.name" type="text" placeholder="账本名称" />
    </view>
  </center-popup>

  <!-- 更多操作 -->
  <action-popup
    v-model="actionShow"
    :title="currentLedger?.name || ''"
    :items="ledgerActions"
  />
  <!-- 颜色选择器 -->
  <!-- <color-picker v-model="colorPickerShow" :ledger-id="currentLedger?.ledgerId ?? ''" /> -->

  <!-- 分享二维码 -->
  <center-popup v-model="shareShow" title="扫码加入" :show-btn="false">
    <view class="mb-7 flex items-center justify-center px-3">
      <wd-qr-code :text="currentLedger?.ledgerId" />
    </view>
  </center-popup>
</template>

<style lang="scss" scoped>

</style>
