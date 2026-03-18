import type { TabBar } from '@uni-helper/vite-plugin-uni-pages'
import type { CustomTabBarItem } from './types'

// 使用自定义Tabbar
export const customTabbarList: CustomTabBarItem[] = [
  {
    text: '首页',
    pagePath: 'pages/index/index',
    iconType: 'unocss',
    icon: 'i-carbon-home',
  },
  {
    text: '我的',
    pagePath: 'pages/me/me',
    iconType: 'unocss',
    icon: 'i-carbon-face-pending',
  }, 
]

/**
 * 需要tabbar缓存
 */
export const tabbarCacheEnable = true

const _tabbarList = customTabbarList.map(item => ({ text: item.text, pagePath: item.pagePath }))
export const tabbarList = customTabbarList

const _tabbar: TabBar = {
  // 只有微信小程序支持 custom。App 和 H5 不生效
  custom: true,
  list: _tabbarList as unknown as TabBar['list'],
}

export const tabBar = _tabbar
