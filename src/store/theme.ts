import type { ThemeColorOption, ThemeMode, ThemeState } from '@/hooks/types/theme'
import lodash from 'lodash'
import { defineStore } from 'pinia'
import { themeColorOptions } from '@/hooks/types/theme'
import { getSystemTheme } from '@/utils/systemTheme'

function buildThemeVars(color: ThemeColorOption) {
  return {
    ...color.primaryShades,
  }
}

/**
 * 完整版主题状态管理
 * 支持手动切换主题、主题色选择、跟随系统主题等完整功能
 */
export const useThemeStore = defineStore('theme', () => {
  // state
  const initColor = lodash.cloneDeep(themeColorOptions[0])
  const theme = ref<ThemeState['theme']>('light')
  const followSystem = ref(true)
  const hasUserSet = ref(false)
  const currentThemeColor = ref<ThemeColorOption>(initColor)
  const themeVars = ref<ThemeState['themeVars']>(buildThemeVars(initColor))

  // getters
  const isDark = computed(() => theme.value === 'dark')

  // actions

  /**
   * 手动切换主题
   * @param mode 指定主题模式，不传则自动切换
   * @param isFollowSystem 是否是跟随系统
   */
  function toggleTheme(mode?: ThemeMode, isFollowSystem: boolean = false) {
    theme.value = mode || (theme.value === 'light' ? 'dark' : 'light')
    if (!isFollowSystem) {
      hasUserSet.value = true
      followSystem.value = false
    }
    setNavigationBarColor()
  }

  /**
   * 设置是否跟随系统主题
   * @param follow 是否跟随系统
   */
  function setFollowSystem(follow: boolean) {
    followSystem.value = follow
    if (follow) {
      hasUserSet.value = false
      initTheme()
    }
    else {
      hasUserSet.value = true
      setNavigationBarColor()
    }
  }

  /**
   * 设置导航栏颜色
   */
  function setNavigationBarColor() {
    uni.setNavigationBarColor({
      frontColor: theme.value === 'light' ? '#000000' : '#ffffff',
      backgroundColor: theme.value === 'light' ? '#ffffff' : '#000000',
    })
  }

  /**
   * 设置主题色
   * @param color 主题色选项
   */
  function setCurrentThemeColor(color: ThemeColorOption) {
    currentThemeColor.value = color
    themeVars.value = {
      ...themeVars.value,
      ...buildThemeVars(color),
    }
  }

  /**
   * 获取系统主题
   * @returns 系统主题模式
   */
  function getSystemThemeMode(): ThemeMode {
    return getSystemTheme()
  }

  /**
   * 初始化主题
   */
  function initTheme() {
    // 如果用户已手动设置且不跟随系统，保持当前主题
    if (hasUserSet.value && !followSystem.value) {
      console.log('使用用户设置的主题:', theme.value)
      setNavigationBarColor()
      return
    }

    // 获取系统主题
    const systemTheme = getSystemThemeMode()

    // 如果是首次启动或跟随系统，使用系统主题
    if (!hasUserSet.value || followSystem.value) {
      theme.value = systemTheme
      if (!hasUserSet.value) {
        followSystem.value = true
        console.log('首次启动，使用系统主题:', theme.value)
      }
      else {
        console.log('跟随系统主题:', theme.value)
      }
    }

    setNavigationBarColor()
  }

  return {
    theme,
    followSystem,
    hasUserSet,
    currentThemeColor,
    themeVars,
    isDark,
    toggleTheme,
    setFollowSystem,
    setNavigationBarColor,
    setCurrentThemeColor,
    getSystemThemeMode,
    initTheme,
  }
}, {
  persist: true,
})
