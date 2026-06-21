export const gradients = [
  // 暖色系
  // 红色系
  'linear-gradient(135deg, #fff0f0 0%, #ffd6d6 100%)', // 浅红色
  'linear-gradient(135deg, #fff2f5 0%, #ffe0e9 100%)', // 珊瑚粉

  // 粉色系
  'linear-gradient(135deg, #fff5eb 0%, #ffe5cc 100%)', // 温暖橙色
  'linear-gradient(135deg, #fff0f7 0%, #ffe0f0 100%)', // 桃花粉

  // 橙色系
  'linear-gradient(135deg, #fff4e8 0%, #ffe8d1 100%)', // 温暖杏色
  'linear-gradient(135deg, #fff6e6 0%, #ffedd4 100%)', // 金黄色
  // 黄色系
  'linear-gradient(135deg, #fffbe6 0%, #fff5c6 100%)', // 柔和黄
  'linear-gradient(135deg, #fff8e0 0%, #ffedb3 100%)', // 淡金色

  // 冷色系
  // 绿色系
  'linear-gradient(135deg, #edfff2 0%, #dcf5e6 100%)', // 翠绿色
  'linear-gradient(135deg, #e8fff0 0%, #bfebd6 100%)', // 薄荷绿
  // 青色系
  'linear-gradient(135deg, #e8ffff 0%, #d1ffff 100%)', // 水晶蓝
  'linear-gradient(135deg, #e8f8ff 0%, #c6eeff 100%)', // 浅海蓝
  // 蓝色系
  'linear-gradient(135deg, #e8f4ff 0%, #c6e7ff 100%)', // 天空蓝
  'linear-gradient(135deg, #e8f0ff 0%, #d1e3ff 100%)', // 靛青蓝
  // 紫色系
  'linear-gradient(135deg, #f4e8ff 0%, #e6d1ff 100%)', // 梦幻紫
  'linear-gradient(135deg, #f0e8ff 0%, #dfd1ff 100%)', // 优雅紫
]

// 添加色系分类
export const colorSystems = {
  warm: [0, 1, 2, 3, 4, 5, 6, 7], // 红色系、橙色系、黄色系
  cool: [8, 9, 10, 11, 12, 13, 14, 15], // 绿色系、青色系、蓝色系、紫色系
}

// 判断颜色属于哪个色系
export function getColorSystem(colorIndex: number) {
  if (colorSystems.warm.includes(colorIndex))
    return 'warm'
  if (colorSystems.cool.includes(colorIndex))
    return 'cool'
  return 'warm' // 默认归类为暖色系
}

// 获取色系名称
export function getSystemName(system: 'warm' | 'cool') {
  return system === 'warm' ? '暖色' : '冷色'
}

// 获取颜色
export function getColorByName(name: string) {
  if (!name || typeof name !== 'string') {
    return 0 // 返回默认颜色索引
  }

  let hash = 0

  // 计算字符串的哈希值
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char // 简单的哈希算法
    hash |= 0 // 转换为32位整数
  }

  // 使用哈希值计算在gradients数组范围内的索引
  const index = Math.abs(hash) % gradients.length

  return index
}
