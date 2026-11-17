import type { IUpdateUser, IUserInfo } from '@/api/types/user'
import { defineStore } from 'pinia'
import {
  getUser,
  updateUser,
} from '@/api/user'

interface State {
  userInfo: IUserInfo
  notices: string[]
}

// 初始化状态
const initState: State = {
  userInfo: {
    userId: '',
    username: '',
    nickname: '',
    avatar: '/static/images/default-avatar.png',
    roles: [],
    billDay: 0,
    billCount: 0,
  },
  notices: [], // 已读通知
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const state = reactive({ ...initState })

    // 设置用户信息
    const setUserInfo = (val: IUserInfo) => {
      console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.avatar) {
        val.avatar = state.userInfo.avatar
      }
      state.userInfo = val
    }

    const updateUserInfo = async (val: IUserInfo) => {
      await updateUser(val as IUpdateUser)
    }

    const setUserAvatar = (avatar: string) => {
      state.userInfo.avatar = avatar
      updateUserInfo(state.userInfo)
    }

    const setUserNickname = (nickname: string) => {
      state.userInfo.nickname = nickname
      updateUserInfo(state.userInfo)
    }

    // 删除用户信息
    const clearUserInfo = () => {
      state.userInfo = { ...initState.userInfo }
      state.notices = initState.notices
      uni.removeStorageSync('user')
    }

    /**
     * 获取用户信息
     */
    const fetchUserInfo = async () => {
      const res = await getUser()
      setUserInfo(res)
      return res
    }

    const setNotices = (notices: string[]) => {
      state.notices = notices
    }
    return {
      state,
      clearUserInfo,
      fetchUserInfo,
      setUserAvatar,
      setUserNickname,
      setNotices,
    }
  },
  {
    persist: true,
  },
)
