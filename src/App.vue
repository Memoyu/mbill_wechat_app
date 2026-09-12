<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'
import { useAccountStore, useCategoryStore, useLedgerPickerStore, useLedgerStore, useTagStore, useTokenStore } from './store'
import { useIconStore } from './store/icon'

const tokenStore = useTokenStore()
const ledgerStore = useLedgerStore()
const ledgerPickerStore = useLedgerPickerStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()
const tagStore = useTagStore()
const iconStore = useIconStore()

onLaunch((options) => {
  // console.log('App.vue onLaunch', options)
  // 微信登录
  tokenStore.wxLogin().then(() => {
    // 初始化数据
    ledgerStore.loadLedgers().then((res) => {
      // 在没有选中任何账本时，默认选中第一个账本
      if (res && res.length > 0 && ledgerPickerStore.selecteds.length < 1)
        ledgerPickerStore.toggleLedgerSelection(res[0].ledgerId)
    })
    categoryStore.loadCategories()
    accountStore.loadAccounts()
    tagStore.loadTags()
    iconStore.loadIconCatalogs()
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
