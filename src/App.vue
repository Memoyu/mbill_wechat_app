<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'
import { useAccountStore, useCategoryStore, useLedgerStore, useTagStore, useTokenStore } from './store'

const tokenStore = useTokenStore()
const ledgerStore = useLedgerStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()
const tagStore = useTagStore()

onLaunch((options) => {
  // console.log('App.vue onLaunch', options)
  // 微信登录
  tokenStore.wxLogin().then(() => {
    // 初始化数据
    ledgerStore.loadLedgers()
    categoryStore.loadCategories()
    accountStore.loadAccounts()
    tagStore.loadTags()
  })
})
onShow((options) => {
  console.log('App.vue onShow', options)
  // 处理直接进入页面路由的情况：如h5直接输入路由、微信小程序分享后进入等
  // https://github.com/unibest-tech/unibest/issues/192
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">

</style>
