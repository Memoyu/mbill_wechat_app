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

const iconStore = useIconStore()

const catalogs = ref<IIconCatalog[]>([])
const active = ref<string[]>([])
const activeIcon = ref('')

onMounted(() => {
  if (iconStore.catalogs.length > 0) {
    catalogs.value = iconStore.catalogs.map((catalog, index) => {
      if (index === 0)
        return { ...catalog, count: catalog.icons.length }
      return { ...catalog, count: catalog.icons.length, icons: [] }
    })
    active.value.push(iconStore.catalogs[0].code)
  }
})

function handleIconClick(icon: IIcon) {
  activeIcon.value = icon.path
  emit('selected', icon)
}

function handleBeforeExpend(data: any) {
  const codes = data.value as string[]
  console.log(codes)

  catalogs.value.map((catalog, index) => {
    if (codes.includes(catalog.code)) {
      catalog.icons = iconStore.catalogs[index].icons
    }
    return catalog
  })
}
</script>

<template>
  <view>
    <wd-collapse v-model="active" @change="handleBeforeExpend">
      <wd-collapse-item v-for="catalog in catalogs" :key="catalog.code" :title="catalog.name" :name="catalog.code" :border="false">
        <template #title="{ expanded }">
          <view class="flex items-center justify-between">
            <text class="text-base font-semibold">{{ catalog.name }}</text>
            <view>
              <text class="mr-3">共{{ catalog.count }}个图标</text>
              <wd-icon v-if="expanded" name="caret-down" />
              <wd-icon v-else name="caret-right" />
            </view>
          </view>
        </template>
        <view class="grid grid-cols-7 gap-6">
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
      </wd-collapse-item>
    </wd-collapse>
  </view>
</template>

<style lang="scss" scoped>

</style>
