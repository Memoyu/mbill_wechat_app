<script setup lang="ts">
import { ref } from 'vue'

onShow(() => {
  // console.log('App.ku.vue onShow', currRoute())

})

const helloKuRoot = ref('Hello AppKuVue')

const exposeRef = ref('this is form app.Ku.vue')

const { theme, themeVars } = useTheme()

defineExpose({
  exposeRef,
})
</script>

<template>
  <view>
    <!-- 这个先隐藏了，知道这样用就行 -->
    <view class="hidden text-center">
      {{ helloKuRoot }}，这里可以配置全局的东西
    </view>

    <wd-config-provider :theme="theme" :theme-vars="themeVars" :custom-class="`page-wraper ${theme}`">
      <KuRootView />
      <wd-dialog />
      <wd-toast />
      <!-- <global-loading /> -->
      <global-toast />
      <global-dialog />
    </wd-config-provider>
  </view>
</template>
