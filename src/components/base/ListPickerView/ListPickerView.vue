<script setup lang="ts">
defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  list: any[]
  valueKey?: string
  labelKey?: string
  iconKey?: string
  childrenKey?: string
  customClass?: string
  expandeds?: string[]
}>(), {
  valueKey: 'id',
  labelKey: 'name',
  iconKey: 'icon',
  childrenKey: 'childs',
  customClass: 'h-[50vh]',
})

const emit = defineEmits(['change'])
const selecteds = defineModel<string[]>({ default: [] })
defineExpose({
  toggleAll,
  selectAll,
})

const collapseRef = ref()
const innerExpandeds = ref([])

watch(() => props.expandeds, (val) => {
  innerExpandeds.value = val ?? []
}, { immediate: true, deep: true })

function toggleAll(all: boolean) {
  collapseRef.value.toggleAll(all)
}

function selectAll(all: boolean) {
  if (all) {
    selecteds.value = []
  }
  else {
    props.list.forEach((c) => {
      selecteds.value.push(c[props.valueKey])
      selecteds.value.push(...(c[props.childrenKey]?.map((c: any) => c[props.valueKey]) ?? []))
    })
  }
  emit('change', selecteds.value)
}

function handleAccountClick(item: any) {
  // console.log(item, 'item')
  if (isSelected(item)) {
    selecteds.value = selecteds.value.filter(id => id !== item[props.valueKey])
  }
  else {
    selecteds.value.push(item[props.valueKey])
  }
  emit('change', selecteds.value)
}

function isSelected(item: any) {
  return selecteds.value.some(t => t[props.valueKey] === item[props.valueKey]) || false
}

function hasChilds(item: any) {
  return item[props.childrenKey] && item[props.childrenKey].length > 0
}
</script>

<template>
  <scroll-view scroll-y :class="customClass">
    <view class="p-2 space-y-3">
      <wd-collapse ref="collapseRef" v-model="innerExpandeds">
        <wd-collapse-item v-for="item in list" :key="item[valueKey]" :name="item[valueKey]" :border="false">
          <template #title="{ expanded }">
            <view
              class="relative flex items-center gap-3 py-3"
            >
              <view class="flex flex-1 items-center justify-between gap-3 px-2">
                <list-picker-view-item
                  v-model="selecteds"
                  :item="item"
                  :value-key="valueKey"
                  :label-key="labelKey"
                  :icon-key="iconKey"
                  @tap="handleAccountClick(item)"
                />
                <view v-if="hasChilds(item)">
                  <wd-icon v-if="expanded" size="16" name="up" />
                  <wd-icon v-else size="16" name="down" />
                </view>
              </view>
            </view>
          </template>

          <view
            v-if="hasChilds(item)"
            class="flex flex-wrap gap-3 rounded-md bg-[var(--wot-input-bg)] p-3"
          >
            <list-picker-view-item
              v-for="child in item[props.childrenKey]" :key="child[props.valueKey]"
              v-model="selecteds"
              :item="child"
              :value-key="valueKey"
              :label-key="labelKey"
              :icon-key="iconKey"
              @tap="handleAccountClick(child)"
            />
          </view>
        </wd-collapse-item>
      </wd-collapse>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
:deep(.wd-collapse-item__header) {
  padding: 0;
  overflow: auto;
}
:deep(.wd-collapse-item__body) {
  padding: 0;
}
</style>
