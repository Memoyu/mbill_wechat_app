import type { IUserInfo } from '@/api/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUser,
} from '@/api/user'

// 初始化状态
const userInfoState: IUserInfo = {
  userId: '',
  username: '',
  nickname: '',
  avatar: '/static/images/default-avatar.png',
  roles: [],
  billDay: 0,
  billCount: 0,
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<IUserInfo>({ ...userInfoState })
    // 设置用户信息
    const setUserInfo = (val: IUserInfo) => {
      console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.avatar) {
        val.avatar = userInfoState.avatar
      }
      userInfo.value = val
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatar = avatar
      console.log('设置用户头像', avatar)
      console.log('userInfo', userInfo.value)
    }
    // 删除用户信息
    const clearUserInfo = () => {
      userInfo.value = { ...userInfoState }
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

    return {
      userInfo,
      clearUserInfo,
      fetchUserInfo,
      setUserInfo,
      setUserAvatar,
    }
  },
  {
    persist: true,
  },
)
