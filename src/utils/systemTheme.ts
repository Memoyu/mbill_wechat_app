import type { ThemeMode } from '@/hooks/types/theme'

interface ThemeOwnerState {
  initialized: boolean
  listenerCount: number
  themeChangeHandler?: UniNamespace.OnThemeChangeCallback
}

const themeOwnerStates = new WeakMap<object, ThemeOwnerState>()

function getThemeOwnerState(owner: object) {
  let state = themeOwnerStates.get(owner)
  if (!state) {
    state = {
      initialized: false,
      listenerCount: 0,
    }
    themeOwnerStates.set(owner, state)
  }
  return state
}

function isThemeMode(theme: unknown): theme is ThemeMode {
  return theme === 'light' || theme === 'dark'
}

/**
 * 获取当前系统主题，不支持主题 API 或调用失败时回退为亮色。
 */
export function getSystemTheme(): ThemeMode {
  try {
    // #ifdef MP-WEIXIN
    const appBaseInfo = uni.getAppBaseInfo()
    if (isThemeMode(appBaseInfo?.theme)) {
      return appBaseInfo.theme
    }
    // #endif

    // #ifndef MP-WEIXIN
    const systemInfo = uni.getSystemInfoSync()
    if (isThemeMode(systemInfo?.theme)) {
      return systemInfo.theme
    }
    // #endif
  }
  catch (error) {
    console.warn('获取系统主题失败:', error)
  }

  return 'light'
}

/**
 * 确保同一个主题 store 在生命周期内只初始化一次。
 */
export function initializeThemeOnce(owner: object, initialize: () => void) {
  const state = getThemeOwnerState(owner)
  if (state.initialized) {
    return
  }

  initialize()
  state.initialized = true
}

/**
 * 按主题 store 复用系统主题监听，并返回对应的清理函数。
 */
export function subscribeSystemThemeChange(
  owner: object,
  handler: UniNamespace.OnThemeChangeCallback,
) {
  if (
    typeof uni === 'undefined'
    || typeof uni.onThemeChange !== 'function'
  ) {
    return () => {}
  }

  const state = getThemeOwnerState(owner)

  if (!state.themeChangeHandler) {
    state.themeChangeHandler = handler
    uni.onThemeChange(state.themeChangeHandler)
  }
  state.listenerCount += 1

  let subscribed = true

  return () => {
    if (!subscribed) {
      return
    }
    subscribed = false
    state.listenerCount = Math.max(0, state.listenerCount - 1)

    if (
      state.listenerCount === 0
      && state.themeChangeHandler
    ) {
      if (typeof uni.offThemeChange === 'function') {
        uni.offThemeChange(state.themeChangeHandler)
      }
      state.themeChangeHandler = undefined
    }
  }
}
