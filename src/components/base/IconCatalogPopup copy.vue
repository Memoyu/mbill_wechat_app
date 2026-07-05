<script setup lang="ts">
import type { IIcon, IIconCatalog } from '@/api/types/icon'
import { getRect } from '@wot-ui/ui/common/util'
import { useIconStore } from '@/store/icon'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
}>()
const emit = defineEmits(['selected'])
const show = defineModel<boolean>()

const { proxy } = getCurrentInstance() as any

const iconStore = useIconStore()

const catalogs = ref<IIconCatalog[]>([])
const active = ref(0)
const scrollTop = ref<number>(0)
const itemScrollTop = ref<number[]>([])
const activeIcon = ref('')

watch(() => show.value, (show) => {
  if (show)
    catalogs.value = iconStore.catalogs
})

/**
 * 关闭按钮触发
 */
function handleCancelClick() {
  show.value = false
}

function handleIconClick(icon: IIcon) {
  // console.log(item)
  // show.value = false
  activeIcon.value = icon.path
  emit('selected', icon)
}

function handleAfterEnter() {
  if (itemScrollTop.value && itemScrollTop.value.length > 0) {
    scrollTop.value = itemScrollTop.value[active.value] || 0
    return
  }
}

function handleSidebarChange({ value }: any) {
  active.value = value
  scrollTop.value = itemScrollTop.value[value]
}

function onSidebarContentScroll(e: any) {
  const { scrollTop } = e.detail
  const threshold = 50 // 下一个标题与顶部的距离
  if (scrollTop < threshold) {
    active.value = 0
    return
  }
  const index = itemScrollTop.value.findIndex(top => top > scrollTop && top - scrollTop <= threshold)
  if (index > -1) {
    active.value = index
  }
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
    @after-enter="handleAfterEnter"
  >
    <view class="overflow-hidden">
      <!-- 标题栏 -->
      <view class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <text class="line-clamp-1 text-base font-semibold">图标库</text>
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

      <!-- 图标 -->
      <view class="icon-catalog-sidebar">
        <wd-sidebar v-model="active" @change="handleSidebarChange">
          <wd-sidebar-item v-for="(catalog, index) in catalogs" :key="catalog.code" :value="index" :label="catalog.name" />
        </wd-sidebar>
        <scroll-view class="page-sidebar-demo1__content" scroll-y scroll-with-animation :scroll-top="scrollTop" :throttle="false" @scroll="onSidebarContentScroll">
          <view v-for="catalog in catalogs" :key="catalog.code" class="catalog-icons-grid">
            <view class="py-2 text-sm font-semibold">
              {{ catalog.name }}
            </view>
            <view class="grid grid-cols-5 gap-7">
              <view
                v-for="icon in catalog.icons"
                :key="icon.path"
              >
                <view
                  class="flex items-center justify-center rounded-full shadow-sm transition-all duration-200"
                  :class="[activeIcon === icon.path ? 'ring-2 ring-indigo-500 ring-offset-2' : '']"
                  hover-class="scale-95 shadow-md"
                  :hover-start-time="0"
                  :hover-stay-time="200"
                  @tap="handleIconClick(icon)"
                >
                  <wd-img :width="32" :height="32" :src="icon.url" round :lazy-load="true" />
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.icon-catalog-sidebar {
  display: flex;
  height: calc(100vh - 300px);

  &__content {
    flex: 1;
    background: #fff;
  }
}
</style>
