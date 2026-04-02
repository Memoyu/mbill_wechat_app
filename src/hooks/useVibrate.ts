import { useSettingsStore } from '@/store'

// 震动反馈
function useVibrate() {
  const settingsStore = useSettingsStore()

  const vibrate = () => {
    if (settingsStore.vibration) {
      uni.vibrateShort({ type: 'soft' })
    }
  }

  return { vibrate }
}
export default useVibrate
