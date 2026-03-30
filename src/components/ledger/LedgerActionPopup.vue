<script setup lang="ts">
const props = defineProps<{
  ledger: any // 账本信息
  more?: boolean // 显示更多操作按钮
}>()

const defItems = [
  {
    icon: 'i-carbon-edit',
    text: '编辑账本',
    value: 'edit',
    action: handleEditClick,
  },
  {
    icon: 'i-carbon-share',
    text: '共享账本',
    value: 'share',
    action: handleShareClick,
  },
  {
    icon: 'i-carbon-arrows-horizontal',
    text: '账单迁移',
    value: 'migrate',
    action: handleMigrateClick,
  },
  {
    icon: 'i-carbon-view-off',
    text: '隐藏账单',
    value: 'hide',
    action: handleHideClick,
    danger: true,

  },
  {
    icon: 'i-carbon-trash-can',
    text: '删除账本',
    value: 'delete',
    action: handleDeleteClick,
    danger: true,
  },
]

const show = defineModel<boolean>()

const actionItems = computed(() => {
  if (props.more) {
    return defItems
  }
  return defItems.slice(0, 2)
})

function handleCancelClick() {
  show.value = false
}

function handleActionClick(item: any) {
  console.log(item)
}

function handleEditClick() {
  console.log('handleEditClick')
}

function handleShareClick() {
  console.log('handleShareClick')
}

function handleMigrateClick() {
  console.log('handleMigrateClick')
}

function handleHideClick() {
  console.log('handleHideClick')
}

function handleDeleteClick() {
  console.log('handleDeleteClick')
}
</script>

<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :close-on-click-modal="true"
    :safe-area-inset-bottom="true"
    custom-class="rounded-t-3xl relative"
    lock-scroll
    lazy-render
    root-portal
    @close="handleCancelClick"
  >
    <view class="overflow-hidden">
      <!-- 标题栏 -->
      <view class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <text class="line-clamp-1 text-base font-semibold">{{ ledger.name }}</text>
        <view
          class="flex-shrink-0 rounded-full px-3 py-1 text-sm text-gray-400"
          hover-class="bg-gray-50"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="handleCancelClick"
        >
          关闭
        </view>
      </view>

      <!-- 操作按钮列表 -->
      <view class="py-4">
        <!-- 账本管理 -->
        <view v-if="actionItems.length > 0" class="mb-6">
          <view class="grid grid-cols-4 gap-6 px-6">
            <view
              v-for="item in actionItems"
              :key="item.text"
              class="flex flex-col items-center gap-2"
              hover-class="opacity-60"
              :hover-start-time="0"
              :hover-stay-time="200"
              @tap="handleActionClick(item)"
            >
              <view
                class="h-12 w-12 flex items-center justify-center rounded-3"
                :class="[item.danger ? 'bg-red-50' : 'bg-gray-50']"
              >
                <view class="text-xl" :class="[item.icon, item.danger ? 'text-red-500' : 'text-gray-500']" />
              </view>
              <text
                class="whitespace-nowrap text-xs"
                :class="[item.danger ? 'text-red-500' : 'text-gray-700']"
              >
                {{ item.text }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped></style>
