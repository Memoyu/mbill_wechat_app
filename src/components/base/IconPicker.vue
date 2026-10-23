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

const props = withDefaults(defineProps<{
  path?: string
  height?: string
}>(), { height: '40vh' })
const emit = defineEmits(['change'])

const { proxy } = getCurrentInstance() as any

const iconStore = useIconStore()

const catalogs = ref<IIconCatalog[]>([])
const active = ref<number>(0)
const selected = ref('')

const scrollTop = ref(0)
const activeTranslateY = computed(() => `-${Number(active.value) * 100}%`)

watch(() => props.path, (newValue) => {
  // 遍历本地图标数据，找到对应的图标，返回图标所在目录索引及图标数据
  // 需要模糊匹配，传入的value可能为：https://oss.memoyu.com/icons/smile-foots/9.png、icons/smile-foots/9.png
  if (!newValue || iconStore.catalogs.length === 0)
    return

  for (let i = 0; i < iconStore.catalogs.length; i++) {
    const catalog = iconStore.catalogs[i]
    const icon = catalog.icons.find(icon => newValue.includes(icon.path) || icon.url.includes(newValue))

    if (icon) {
      active.value = i
      selected.value = icon.id
      // 确保该目录的图标数据已加载
      catalogs.value[i].icons = catalog.icons
      // 滚动到指定的区域
      scrollIntoView()
      break
    }
  }
  console.log(active.value, selected.value, catalogs.value)
})

onMounted(() => {
  if (iconStore.catalogs.length > 0 && catalogs.value.length === 0) {
    catalogs.value = iconStore.catalogs.map((catalog, index) => {
      if (index === active.value)
        return { ...catalog }
      return { ...catalog, icons: [] }
    })
  }
})

function handleChange(opt: any) {
  // console.log(opt)
  const { value } = opt
  catalogs.value[value].icons = iconStore.catalogs[value].icons || []
}

/**
 * 滚动选中图标到可视区域居中
 */
function scrollIntoView() {
  if (!selected.value)
    return

  nextTick(() => {
    Promise.all([
      getRect(`#ICON-CATALOG-${active.value}`, false, proxy),
      getRect(`#ICON-ITEM-${selected.value}`, false, proxy),
    ]).then(([conRect, itemRect]) => {
      const relativeTop = itemRect.top - conRect.top
      // 先重置 scrollTop 确保 scroll-view 响应变化
      scrollTop.value = relativeTop - conRect.height / 2 + itemRect.height / 2
    })
  })
}

function handleIconClick(icon: IIcon) {
  selected.value = icon.id
  emit('change', icon)
}

defineExpose({ scrollIntoView })
</script>

<template>
  <view class="flex overflow-hidden" :style="{ height }">
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
        :id="`ICON-CATALOG-${index}`"
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
              :id="`ICON-ITEM-${icon.id}`"
              class="h-32px rounded-full shadow-sm transition-all duration-200"
              :class="[selected === icon.id ? 'ring-2 ring-indigo-500 ring-offset-2' : '']"
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
</template>

<style lang="scss" scoped>

</style>
