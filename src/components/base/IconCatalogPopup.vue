<script setup lang="ts">
import type { IIcon, IIconCatalog } from '@/api/types/icon'
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

const iconStore = useIconStore()

const catalogs = ref<IIconCatalog[]>([])
const active = ref<number>(0)
const activeIcon = ref<string>('')

const input = ref('')
const scrollTop = ref(0)

function handleAfterEnter() {
  catalogs.value = iconStore.catalogs || []
}

function handleConfirm() {
  show.value = false
}

function handleChange(value: number) {
  console.log(value)
}

function handleIconClick(icon: IIcon) {
  activeIcon.value = icon.path
  emit('selected', icon)
}
const activeTranslateY = computed(() => `-${Number(active.value) * 100}%`)
</script>

<template>
  <bottom-popup v-model="show" title="图标库" confirm-text="确认" show-cancel @confirm="handleConfirm" @after-enter="handleAfterEnter">
    <template #title>
      <view class="flex items-center gap-2 px-2 pb-2 pt-4">
        <wd-input v-model="input" custom-class="w-full" type="text" placeholder="账户名称" />
      </view>
    </template>
    <view class="flex overflow-hidden" :style="{ height: '300px' }">
      <wd-sidebar v-model="active" @change="handleChange">
        <wd-sidebar-item
          v-for="(item, index) in catalogs"
          :key="index"
          :value="index"
          :label="item.name"
        />
      </wd-sidebar>
      <view class="flex-1 transition-transform duration-300 ease-in-out" :style="`transform: translateY(${activeTranslateY})`">
        <scroll-view
          v-for="(catalog, index) in catalogs"
          :key="index"
          class="box-border h-full"
          scroll-y
          scroll-with-animation
          :show-scrollbar="false"
          :scroll-top="scrollTop"
          :throttle="false"
        >
          <view class="grid grid-cols-5 gap-2 px-1 py-2">
            <view
              v-for="icon in catalog.icons"
              :key="icon.path"
              class="flex items-center justify-center"
            >
              <view
                class="h-32px rounded-full shadow-sm transition-all duration-200"
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
        </scroll-view>
      </view>
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
