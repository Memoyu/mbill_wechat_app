import type { ConfigProviderThemeVars } from '@wot-ui/ui'

export type PrimaryShadeKey
  = | 'primary1'
    | 'primary2'
    | 'primary3'
    | 'primary4'
    | 'primary5'
    | 'primary6'
    | 'primary7'
    | 'primary8'
    | 'primary9'
    | 'primary10'

export type ThemePrimaryShades = Record<PrimaryShadeKey, string>

/**
 * 主题色选项接口
 */
export interface ThemeColorOption {
  name: string
  value: string
  // 主色 6，用于列表和当前主题色圆点展示
  primary: string
  // 完整主色阶，用于注入 ConfigProvider 主题变量
  primaryShades: ThemePrimaryShades
}

/**
 * 主题类型
 */
export type ThemeMode = 'light' | 'dark'

/**
 * 主题状态接口
 */
export interface ThemeState {
  theme: ThemeMode
  followSystem: boolean
  hasUserSet: boolean
  currentThemeColor: ThemeColorOption
  themeVars: ConfigProviderThemeVars
}

/**
 * 系统主题状态接口（简化版）
 */
export interface SystemThemeState {
  theme: ThemeMode
  themeVars: ConfigProviderThemeVars
}

/**
 * 预定义的主题色选项
 */
export const themeColorOptions: ThemeColorOption[] = [
  {
    name: '默认蓝',
    value: 'blue',
    primary: '#1C64FD',
    primaryShades: {
      primary1: '#F5F8FF',
      primary2: '#E5EDFF',
      primary3: '#B8CFFF',
      primary4: '#7CA4FF',
      primary5: '#4480FF',
      primary6: '#1C64FD',
      primary7: '#164ED1',
      primary8: '#1341AD',
      primary9: '#0F3285',
      primary10: '#0A235C',
    },
  },
  {
    name: '活力橙',
    value: 'orange',
    primary: '#FF7D00',
    primaryShades: {
      primary1: '#FFF7F0',
      primary2: '#FFEAD6',
      primary3: '#FFD0A8',
      primary4: '#FFB06E',
      primary5: '#FF9338',
      primary6: '#FF7D00',
      primary7: '#D96800',
      primary8: '#B35600',
      primary9: '#8A4200',
      primary10: '#5F2D00',
    },
  },
  {
    name: '薄荷绿',
    value: 'green',
    primary: '#07C160',
    primaryShades: {
      primary1: '#F1FCF6',
      primary2: '#DCF7E8',
      primary3: '#B4EFD0',
      primary4: '#7FE2AF',
      primary5: '#42D28A',
      primary6: '#07C160',
      primary7: '#049F4F',
      primary8: '#028241',
      primary9: '#016532',
      primary10: '#014825',
    },
  },
  {
    name: '樱花粉',
    value: 'pink',
    primary: '#FF69B4',
    primaryShades: {
      primary1: '#FFF2F9',
      primary2: '#FFE2F1',
      primary3: '#FFC2E3',
      primary4: '#FF99D1',
      primary5: '#FF7FC2',
      primary6: '#FF69B4',
      primary7: '#E84E9F',
      primary8: '#CC3F8A',
      primary9: '#A9336F',
      primary10: '#7A2450',
    },
  },
  {
    name: '紫罗兰',
    value: 'purple',
    primary: '#8A2BE2',
    primaryShades: {
      primary1: '#F7F2FF',
      primary2: '#EEE2FF',
      primary3: '#D9BDFF',
      primary4: '#BC8DFF',
      primary5: '#A05EFF',
      primary6: '#8A2BE2',
      primary7: '#7423BF',
      primary8: '#5E1D9C',
      primary9: '#491679',
      primary10: '#321056',
    },
  },
  {
    name: '朱砂红',
    value: 'red',
    primary: '#FF4757',
    primaryShades: {
      primary1: '#FFF3F4',
      primary2: '#FFE3E5',
      primary3: '#FFC0C6',
      primary4: '#FF909A',
      primary5: '#FF6672',
      primary6: '#FF4757',
      primary7: '#DB3445',
      primary8: '#B7293A',
      primary9: '#931E2E',
      primary10: '#6F1421',
    },
  },
]
