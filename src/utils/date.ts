import dayjs from 'dayjs'

const weeks = computed(() => {
  return [
    '日',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
  ]
})

/**
 * 比较两个时间的日期是否相等
 * @param {timestamp} date1
 * @param {timestamp} date2
 */
export function compareDate(date1: number, date2: number | null) {
  const dateValue1 = new Date(date1)
  const dateValue2 = new Date(date2 || '')

  const year1 = dateValue1.getFullYear()
  const year2 = dateValue2.getFullYear()
  const month1 = dateValue1.getMonth()
  const month2 = dateValue2.getMonth()
  const day1 = dateValue1.getDate()
  const day2 = dateValue2.getDate()

  if (year1 === year2) {
    if (month1 === month2) {
      return day1 === day2 ? 0 : day1 > day2 ? 1 : -1
    }
    return month1 === month2 ? 0 : month1 > month2 ? 1 : -1
  }

  return year1 > year2 ? 1 : -1
}

/**
 * 获取一个月的最后一天
 * @param {number} year
 * @param {number} month
 */
export function getMonthEndDay(year: number, month: number) {
  return 32 - new Date(year, month - 1, 32).getDate()
}

/**
 * 根据下标获取星期
 * @param {number} index
 */
export function getWeekLabel(index: number) {
  if (index >= 7) {
    index = index % 7
  }
  return weeks.value[index]
}

/**
 * 格式化时间：当天返回“今天”，昨天返回“昨天”，其余返回“年-月-日”
 * @param {string | number | Date} date - 输入的时间
 * @returns {string} 格式化后的时间字符串
 */
export function getDateFormat(date: string | number | Date): string {
  const inputDate = dayjs(date)
  const today = dayjs().startOf('day')
  const yesterday = dayjs().subtract(1, 'day').startOf('day')

  if (inputDate.isSame(today, 'day')) {
    return '今天'
  }
  else if (inputDate.isSame(yesterday, 'day')) {
    return '昨天'
  }
  else {
    return inputDate.format('YYYY-MM-DD')
  }
}

/**
 * 获取指定日期是周几（中文）
 * @param {string | number | Date} date - 输入的日期
 * @returns {string} 周几（如：日、一、二...）
 */
export function getWeekday(date: string | number | Date): string {
  const dayIndex = dayjs(date).day() // 获取星期索引（0 表示周日）
  return `周${weeks.value[dayIndex]}` // 复用已有的 weeks 数组
}
