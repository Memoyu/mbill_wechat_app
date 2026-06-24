<script lang="ts" setup>
import type { ILedger } from '@/api/types/ledger'
import type { ActionItem } from '@/typings'
import { useDialog } from '@wot-ui/ui'
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
    title: '创建',
    icon: 'plus',
    action: handleCreateTap,
  },
  {
    title: '加入',
    icon: 'scan',
    action: handleScanTap,
  },
]

const { proxy } = getCurrentInstance() as any
const editDialog = useDialog('ledger-edit-dialog')
const shareDialog = useDialog('ledger-share-dialog')
const ledgerStore = useLedgerStore()

const ledgers = computed(() => {
  return ledgerStore.ledgers
})

const show = ref(false)
const scrollHeight = ref(300)

const actionShow = ref(false)
const currentLedger = ref<ILedger>()
const canvasId = ref('qrcodeCnvas')
const shareQrCode = ref('')

const editLedger = ref<{
  isCreate: boolean
  name: string
  color: number
  randomColor?: boolean
}>({ isCreate: true, name: '', color: 0, randomColor: true })

onMounted(() => {
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: any) => {
      // console.log(data)
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

function handleLedgerActionTap(ledger: any) {
  currentLedger.value = ledger
  actionShow.value = true
}

function handleLedgerActionItemTap(action: string) {
  if (!currentLedger.value)
    return
  const ledgerId = currentLedger.value.ledgerId!

  if (action === 'edit') {
    editLedger.value = {
      isCreate: false,
      name: currentLedger.value.name,
      color: currentLedger.value.color,
    }
    editDialog.confirm({ title: currentLedger.value.name })
      .then(async () => {
        await ledgerStore.updateLedger({ ledgerId, name: editLedger.value.name, color: editLedger.value.color })
      })
      .catch(() => {
        // console.log('点击了取消')
      })
  }
  else if (action === 'share') {
    initQrcode(currentLedger.value.ledgerId)
  }
}

/**
 * 初始化二维码
 * @param content 二维码内容
 */
function initQrcode(content: string | number) {
  // 转换尺寸
  const size = uni.upx2px(200)
  // 获取uQRCode实例
  const qr = new UQRCode()
  qr.setOptions({
    // 设置二维码内容
    data: content,
    // 设置二维码大小，必须与canvas设置的宽高一致
    size,
    // 设置二维码边距
    margin: uni.upx2px(10),
  })
  // 调用制作二维码方法
  qr.make()
  // 获取canvas上下文
  const canvasContext = uni.createCanvasContext(canvasId.value, proxy)
  // 设置uQRCode实例的canvas上下文
  qr.canvasContext = canvasContext
  // 绘制图形
  qr.draw().then(() => {
    uni.canvasToTempFilePath(
      {
        width: size,
        height: size,
        destWidth: size,
        destHeight: size,
        canvasId: canvasId.value,
        success(res) {
          console.log(res.tempFilePath)
          shareQrCode.value = res.tempFilePath
          shareDialog.alert({})
        },
        fail(err) {
          console.log(err)
        },
      },
      proxy, // 这里很关键，不然拿不到canvas实例
    )
  })
}
function handleCreateTap() {
  editLedger.value = {
    isCreate: true,
    name: '',
    color: 0,
    randomColor: true,
  }

  editDialog.confirm({ title: '新增' })
    .then(async () => {
      const color = editLedger.value.randomColor ? getColorByName(editLedger.value.name) : editLedger.value.color
      await ledgerStore.createLedger(editLedger.value.name, color)
    })
    .catch(() => {
      // console.log('点击了取消')
    })
}

function handleScanTap() {
  console.log('handleScanTap')
}

function handleSortChange(list: ILedger[]) {
  console.log(list, '重新排序')
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
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
                    <text class="ml-2 text-emerald font-bold">
                      {{ listItem.income }}
                    </text>
                    <text class="ml-4">
                      支出
                    </text>
                    <text class="ml-2 text-rose font-bold">
                      {{ listItem.expend }}
                    </text>
                  </view>
                  <view class="mt-3 h-25px flex items-center justify-between">
                    <wd-avatar-group :max-count="3" size="25">
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
                    @tap.stop="handleLedgerActionTap(listItem)"
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

  <!-- 更多操作 -->
  <ledger-action-popup
    v-model="actionShow"
    more
    :ledger="currentLedger"
    @action-tap="handleLedgerActionItemTap"
  />

  <!-- 编辑账本 -->
  <wd-dialog selector="ledger-edit-dialog">
    <wd-input v-model="editLedger.name" type="text" placeholder="账簿名称" custom-class="custom-input" />
    <view v-if="editLedger.isCreate">
      <view class="mt-2">
        <wd-checkbox v-model="editLedger.randomColor">
          随机颜色
        </wd-checkbox>
      </view>
      <!-- 颜色网格 -->
      <view v-if="!editLedger.randomColor" class="grid grid-cols-4 mt-2 gap-4 p-1">
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
  </wd-dialog>

  <!-- 共享账本 -->
  <!-- 隐藏画布（index 放在最下） -->
  <canvas :id="canvasId" :canvas-id="canvasId" style="position: absolute; top: 0; left: 0; z-index: -99; width: 200px;height: 200px;" />
  <wd-dialog selector="ledger-share-dialog">
    <wd-img :width="200" :height="200" :src="shareQrCode" />
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
.custom-input {
  @apply bg-[#f7f8fa];
}
</style>
