<script setup lang="ts">
import { ref } from 'vue'
import { useStartupStore } from '@/store'

onShow(() => {
  console.log('App.ku.vue onShow')
})

const helloKuRoot = ref('Hello AppKuVue')
const exposeRef = ref('this is form app.Ku.vue')

const { theme, themeVars } = useTheme()
const startupStore = useStartupStore()

defineExpose({
  exposeRef,
})
</script>

<template>
  <view>
    <!-- 这个先隐藏了，知道这样用就行 -->
    <!-- <view class="text-center">
      {{ helloKuRoot }}，这里可以配置全局的东西
    </view> -->

    <wd-config-provider :theme="theme" :theme-vars="themeVars" :custom-class="`page-wraper ${theme}`">
      <KuRootView />
      <global-loading />
      <global-toast />
      <global-dialog />
    </wd-config-provider>

    <!-- 启动加载页 -->
    <startup-loading
      v-if="startupStore.loading"
      :progress="startupStore.progress"
      :status-text="startupStore.statusText"
      :failed="startupStore.failed"
      :error-msg="startupStore.errorMsg"
      @retry="() => startupStore.startApp()"
    />
  </view>
</template>
