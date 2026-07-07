<script setup lang="ts">
import { useTagStore } from '@/store'

const props = withDefaults(defineProps<{
  tags?: string[]
}>(), {
})
const show = defineModel<boolean>()

const tagStore = useTagStore()

const tags = ref()

watch(() => show.value, (val) => {
  if (val) {
    initSelectItem()
  }
})

function initSelectItem() {
  tags.value = tagStore.tags.map((a) => {
    return {
      id: a.tagId,
      name: a.name,
      childs: (a.childs ?? []).map((c) => {
        return {
          id: c.tagId,
          name: c.name,
        }
      }),
    }
  })
}

function handleTagItemTap(item: any) {
  console.log('标签选中', item)
}
</script>

<template>
  <bottom-popup v-model="show" title="选择标签">
    <view class="tag-items">
      <!--  -->
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>
</style>
