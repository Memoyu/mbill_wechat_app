import type { IAuthLoginRes } from '@/api/types/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue' // 修复：导入 computed
import {
  logout as fetchLogout,
  refreshToken as fetchRefreshToken,
  wxLogin as fetchWxLogin,
  getWxCode,
} from '@/api/auth'
import { useUserStore } from './user'

// 登录锁，防止并发重复调用
let loginLock: Promise<any> | null = null

// 初始化状态
const tokenInfoState = {
  accessToken: '',
  accessExpiresIn: 0,
  refreshToken: '',
  refreshExpiresIn: 0,
}

export const useTokenStore = defineStore(
  'token',
  () => {
    // 定义用户信息
    const tokenInfo = ref<IAuthLoginRes>({ ...tokenInfoState })

    // 添加一个时间戳 ref 作为响应式依赖
    const nowTime = ref(Date.now())

    /**
     * 更新响应式数据:now
     * 确保isTokenExpired/isRefreshTokenExpired重新计算,而不是用错误过期缓存值
     * 可useTokenStore内部适时调用;也可链式调用:tokenStore.updateNowTime().hasLogin
     * @returns 最新的tokenStore实例
     */
    const updateNowTime = () => {
      nowTime.value = Date.now()
      return useTokenStore()
    }

    // 设置用户信息
    const setTokenInfo = (val: IAuthLoginRes) => {
      updateNowTime()
      tokenInfo.value = val

      // 计算并存储过期时间
      const now = Date.now()

      // 双token模式
      const accessExpireTime = now + val.accessExpiresIn * 1000
      const refreshExpireTime = now + val.refreshExpiresIn * 1000
      uni.setStorageSync('accessTokenExpireTime', accessExpireTime)
      uni.setStorageSync('refreshTokenExpireTime', refreshExpireTime)
    }

    /**
     * 判断token是否过期
     */
    const isTokenExpired = computed(() => {
      if (!tokenInfo.value) {
        return true
      }

      const now = nowTime.value
      const expireTime = uni.getStorageSync('accessTokenExpireTime')

      if (!expireTime)
        return true
      return now >= expireTime
    })

    /**
     * 判断refreshToken是否过期
     */
    const isRefreshTokenExpired = computed(() => {
      const now = nowTime.value
      const refreshExpireTime = uni.getStorageSync('refreshTokenExpireTime')

      if (!refreshExpireTime)
        return true
      return now >= refreshExpireTime
    })

    /**
     * 登录成功后处理逻辑
     * @param tokenInfo 登录返回的token信息
     */
    async function afterLogin(tokenInfo: IAuthLoginRes) {
      setTokenInfo(tokenInfo)
      const userStore = useUserStore()
      await userStore.fetchUserInfo()
    }

    /**
     * 检查是否有登录信息（不考虑token是否过期）
     */
    const hasLoginInfo = computed(() => {
      if (!tokenInfo.value) {
        return false
      }

      return tokenInfo.value.accessToken
    })

    /**
     * 检查是否已登录且token有效
     * 建议这样使用tokenStore.updateNowTime().hasLogin
     */
    const hasValidLogin = computed(() => {
      console.log('hasValidLogin', hasLoginInfo.value, !isTokenExpired.value)
      return hasLoginInfo.value && !isTokenExpired.value
    })

    /**
     * 静默登录（启动时使用）
     * 失败不弹提示，仅打印日志；通过 loginLock 防止并发重复调用
     */
    const silentLogin = async () => {
      // 如果已有登录锁，等待锁完成
      if (loginLock) {
        await loginLock
        return
      }

      // 已登录则直接返回
      if (hasValidLogin.value)
        return

      loginLock = (async () => {
        try {
          console.log('静默登录开始')
          const code = await getWxCode()
          const res = await fetchWxLogin(code)
          await afterLogin(res)
          return res
        }
        catch (error) {
          console.error('静默登录失败:', error)
          throw error
        }
        finally {
          console.log('静默登录结束')
          updateNowTime()
          loginLock = null
        }
      })()

      return loginLock
    }

    // /**
    //  * 微信登录
    //  * 有的时候后端会用一个接口返回token和用户信息，有的时候会分开2个接口，一个获取token，一个获取用户信息
    //  * （各有利弊，看业务场景和系统复杂度），这里使用2个接口返回的来模拟
    //  * @returns 登录结果
    //  */
    // const wxLogin = async () => {
    //   try {
    //     console.log('微信登录开始')
    //     if (hasValidLogin.value)
    //       return

    //     // 获取微信小程序登录的code
    //     const code = await getWxCode()
    //     console.log('微信登录-code: ', code)
    //     const res = await fetchWxLogin(code)
    //     console.log('微信登录-res: ', res)
    //     await afterLogin(res)
    //     return res
    //   }
    //   catch (error) {
    //     console.error('微信登录失败:', error)
    //     uni.showToast({
    //       title: '微信登录失败，请重试',
    //       icon: 'error',
    //     })
    //     throw error
    //   }
    //   finally {
    //     console.log('微信登录结束')
    //     updateNowTime()
    //   }
    // }

    /**
     * 退出登录 并 删除用户信息
     */
    const logout = async () => {
      try {
        // TODO 实现自己的退出登录逻辑
        // await fetchLogout()
      }
      catch (error) {
        console.error('退出登录失败:', error)
      }
      finally {
        updateNowTime()

        // 无论成功失败，都需要清除本地token信息
        // 清除存储的过期时间
        uni.removeStorageSync('accessTokenExpireTime')
        uni.removeStorageSync('refreshTokenExpireTime')
        console.log('退出登录-清除用户信息')
        tokenInfo.value = { ...tokenInfoState }
        uni.removeStorageSync('token')
        const userStore = useUserStore()
        userStore.clearUserInfo()
      }
    }

    /**
     * 刷新token
     * 刷新失败时自动清除旧凭据并尝试静默登录恢复
     * @returns 刷新结果
     */
    const refreshToken = async () => {
      try {
        // 安全检查，确保refreshToken存在
        if (!tokenInfo.value.refreshToken) {
          throw new Error('无效的refreshToken')
        }

        const refreshToken = tokenInfo.value.refreshToken
        const res = await fetchRefreshToken(refreshToken)
        console.log('刷新token-res: ', res)
        setTokenInfo(res)
        return res
      }
      catch (error) {
        console.error('刷新token失败:', error)
        // 刷新失败，清除旧凭据并尝试静默登录恢复
        await logout()
        try {
          await silentLogin()
        }
        catch (loginErr) {
          console.error('静默登录恢复失败:', loginErr)
          throw loginErr
        }
      }
      finally {
        updateNowTime()
      }
    }

    /**
     * 获取有效的token
     * 注意：在computed中不直接调用异步函数，只做状态判断
     * 实际的刷新操作应由调用方处理
     * 建议这样使用 tokenStore.updateNowTime().validToken
     */
    const getValidToken = computed(() => {
      // token已过期，返回空
      if (isTokenExpired.value) {
        return ''
      }

      return tokenInfo.value.accessToken || ''
    })

    /**
     * 尝试获取有效的token，如果过期且可刷新，则刷新token
     * @returns 有效的token或空字符串
     */
    const tryGetValidToken = async (): Promise<string> => {
      updateNowTime()
      if (!getValidToken.value && !isRefreshTokenExpired.value) {
        try {
          await refreshToken()
          return getValidToken.value
        }
        catch (error) {
          console.error('尝试刷新token失败:', error)
          return ''
        }
      }
      return getValidToken.value
    }

    return {
      // 核心API方法
      silentLogin,
      // wxLogin,
      logout,

      // 认证状态判断（最常用的）
      hasLogin: hasValidLogin,

      // 内部系统使用的方法
      refreshToken,
      tryGetValidToken,
      validToken: getValidToken,

      // 调试或特殊场景可能需要直接访问的信息
      tokenInfo,
      setTokenInfo,
      updateNowTime,
    }
  },
  {
    // 添加持久化配置，确保刷新页面后token信息不丢失
    persist: true,
  },
)
