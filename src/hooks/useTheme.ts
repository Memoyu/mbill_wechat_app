import type { ThemeMode } from '@/hooks/types/theme'
import { useThemeStore } from '@/store'

export function useTheme() {
  const store = useThemeStore()

  // 组件挂载前初始化系统主题
  onBeforeMount(() => {
    store.initSystemTheme()
    // 监听系统主题变化
    if (typeof uni !== 'undefined' && uni.onThemeChange) {
      uni.onThemeChange((res) => {
        // 系统主题变化时自动更新，导航栏颜色由 theme.json 自动处理
        store.setTheme(res.theme as ThemeMode)
        console.log('系统主题已切换至:', res.theme)
      })
    }
  })

  // 组件卸载时清理监听
  onUnmounted(() => {
    if (typeof uni !== 'undefined' && uni.offThemeChange) {
      uni.offThemeChange((res) => {
        store.setTheme(res.theme as ThemeMode)
      })
    }
  })

  return {
    // 状态（只读）
    theme: computed(() => store.theme),
    isDark: computed(() => store.isDark),
    themeVars: computed(() => store.themeVars),
  }
}
