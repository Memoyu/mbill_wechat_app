/* eslint-disable style/indent */
import type { PageMetaDatum, SubPackages } from '@uni-helper/vite-plugin-uni-pages'
/** 如果是运行抖音小程序，就不引入 @uni-helper/uni-env，否则运行报错（找不到process) */
import { isMpWeixin } from '@uni-helper/uni-env'

import { pages, subPackages } from '@/pages.json'

export type PageInstance = Page.PageInstance<AnyObject, object> & { $page: Page.PageInstance<AnyObject, object> & { fullPath: string } }

export function getLastPage() {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  // const lastPage = getCurrentPages().at(-1)
  // 上面那个在低版本安卓中打包会报错，所以改用下面这个【虽然我加了 src/interceptions/prototype.ts，但依然报错】
  const pages = getCurrentPages()
  return pages[pages.length - 1] as PageInstance
}

/**
 * 获取当前页面路由的 path 路径和 redirectPath 路径
 * path 如 '/pages/login/login'
 * redirectPath 如 '/pages/demo/base/route-interceptor'
 */
export function currRoute() {
  const lastPage = getLastPage() as PageInstance
  if (!lastPage) {
    return {
      path: '',
      query: {},
    }
  }
  const currRoute = lastPage.$page
  // console.log('lastPage.$page:', currRoute)
  // console.log('lastPage.$page.fullpath:', currRoute.fullPath)
  // console.log('lastPage.$page.options:', currRoute.options)
  // console.log('lastPage.options:', (lastPage as any).options)
  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  const { fullPath } = currRoute
  // console.log(fullPath)
  // eg: /pages/login/login?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
  // eg: /pages/login/login?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
  return parseUrlToObj(fullPath)
}

export function ensureDecodeURIComponent(url: string) {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/login?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/login, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export function parseUrlToObj(url: string) {
  const [path, queryStr] = url.split('?')
  // console.log(path, queryStr)

  if (!queryStr) {
    return {
      path,
      query: {},
    }
  }
  const query: Record<string, string> = {}
  queryStr.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    // console.log(key, value)
    query[key] = ensureDecodeURIComponent(value) // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
  })
  return { path, query }
}
/**
 * 得到所有的需要登录的 pages，包括主包和分包的
 * 这里设计得通用一点，可以传递 key 作为判断依据，默认是 excludeLoginPath, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的 pages，如果传递了 key, 则表示通过 key 过滤
 */
export function getAllPages(key?: string) {
  // 这里处理主包
  const mainPages = (pages as PageMetaDatum[])
    .filter(page => !key || page[key])
    .map(page => ({
      ...page,
      path: `/${page.path}`,
    }))

  // 这里处理分包
  const subPages: PageMetaDatum[] = []
    ; (subPackages as SubPackages).forEach((subPageObj) => {
      // console.log(subPageObj)
      const { root } = subPageObj
      subPageObj.pages
        .filter(page => !key || page[key])
        .forEach((page) => {
          subPages.push({
            ...page,
            path: `/${root}/${page.path}`,
          })
        })
    })
  const result = [...mainPages, ...subPages]
  // console.log(`getAllPages by ${key} result: `, result)
  return result
}

export function getCurrentPageI18nKey() {
  const routeObj = currRoute()
  const currPage = (pages as PageMetaDatum[]).find(page => `/${page.path}` === routeObj.path)
  if (!currPage) {
    console.warn('路由不正确')
    return ''
  }
  console.log(currPage)
  console.log(currPage.style.navigationBarTitleText)
  return currPage.style?.navigationBarTitleText || ''
}

/**
 * 根据微信小程序当前环境，判断应该获取的 baseUrl
 */
export function getEnvBaseUrl() {
  // 请求基准地址
  let baseUrl = import.meta.env.VITE_SERVER_BASEURL

  // # 有些同学可能需要在微信小程序里面根据 develop、trial、release 分别设置上传地址，参考代码如下。
  const VITE_SERVER_BASEURL__WEIXIN_DEVELOP = 'https://ukw0y1.laf.run'
  const VITE_SERVER_BASEURL__WEIXIN_TRIAL = 'https://ukw0y1.laf.run'
  const VITE_SERVER_BASEURL__WEIXIN_RELEASE = 'https://ukw0y1.laf.run'

  // 微信小程序端环境区分
  if (isMpWeixin) {
    const {
      miniProgram: { envVersion },
    } = uni.getAccountInfoSync()

    switch (envVersion) {
      case 'develop':
        baseUrl = VITE_SERVER_BASEURL__WEIXIN_DEVELOP || baseUrl
        break
      case 'trial':
        baseUrl = VITE_SERVER_BASEURL__WEIXIN_TRIAL || baseUrl
        break
      case 'release':
        baseUrl = VITE_SERVER_BASEURL__WEIXIN_RELEASE || baseUrl
        break
    }
  }

  return baseUrl
}

/**
 * 是否是双token模式
 */
export const isDoubleTokenMode = import.meta.env.VITE_AUTH_MODE === 'double'

/**
 * 首页路径，通过 page.json 里面的 type 为 home 的页面获取，如果没有，则默认是第一个页面
 * 通常为 /pages/index/index
 */
export const HOME_PAGE = `/${(pages as PageMetaDatum[]).find(page => page.type === 'home')?.path || (pages as PageMetaDatum[])[0].path}`

/**
 * 检查给定值是否为数组。
 * @param {any} value 要检查的值
 * @returns {boolean} 如果是数组则返回 true，否则返回 false
 */
export function isArray(value: any): value is Array<any> {
  // 如果 Array.isArray 函数可用，直接使用该函数检查
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value)
  }
  // 否则，使用对象原型的 toString 方法进行检查
  return Object.prototype.toString.call(value) === '[object Array]'
}

/**
 * @description 判断target是否对象
 * @param value
 * @return {boolean}
 */
export function isObj(value: any): value is object {
  return Object.prototype.toString.call(value) === '[object Object]' || typeof value === 'object'
}

/**
 * 检查给定值是否为字符串。
 * @param {unknown} value 要检查的值
 * @returns {value is string} 如果是字符串则返回 true，否则返回 false
 */
export function isString(value: unknown): value is string {
  return getType(value) === 'string'
}

/**
 * 否是数值
 * @param {*} value
 */
export function isNumber(value: any): value is number {
  return getType(value) === 'number'
}

/**
 * 获取目标原始类型
 * @param target 任意类型
 * @returns {string} type 数据类型
 */
export function getType(target: unknown): string {
  // 得到原生类型
  const typeStr = Object.prototype.toString.call(target)
  // 拿到类型值
  const match = typeStr.match(/\[object (\w+)\]/)
  const type = match && match.length ? match[1].toLowerCase() : ''
  // 类型值转小写并返回
  return type
}

/**
 * 将驼峰命名转换为短横线命名。
 * @param {string} word 待转换的词条
 * @returns {string} 转换后的结果
 */
export function kebabCase(word: string): string {
  // 使用正则表达式匹配所有大写字母，并在前面加上短横线，然后转换为小写
  const newWord: string = word
    .replace(/[A-Z]/g, (match) => {
      return `-${match}`
    })
    .toLowerCase()

  return newWord
}

/**
 * 将外部传入的样式格式化为可读的 CSS 样式。
 * @param {object | object[]} styles 外部传入的样式对象或数组
 * @returns {string} 格式化后的 CSS 样式字符串
 */
export function objToStyle(styles: Record<string, any> | Record<string, any>[]): string {
  // 如果 styles 是数组类型
  if (isArray(styles)) {
    // 使用过滤函数去除空值和 null 值的元素
    // 对每个非空元素递归调用 objToStyle，然后通过分号连接
    const result = styles
      .filter((item) => {
        return item != null && item !== ''
      })
      .map((item) => {
        return objToStyle(item)
      })
      .join(';')

    // 如果结果不为空，确保末尾有分号
    return result ? (result.endsWith(';') ? result : `${result};`) : ''
  }

  if (isString(styles)) {
    // 如果是字符串且不为空，确保末尾有分号
    return styles ? (styles.endsWith(';') ? styles : `${styles};`) : ''
  }

  // 如果 styles 是对象类型
  if (isObj(styles)) {
    // 使用 Object.keys 获取所有属性名
    // 使用过滤函数去除值为 null 或空字符串的属性
    // 对每个属性名和属性值进行格式化，通过分号连接
    const result = Object.keys(styles)
      .filter((key) => {
        return styles[key] != null && styles[key] !== ''
      })
      .map((key) => {
        // 使用 kebabCase 函数将属性名转换为 kebab-case 格式
        // 将属性名和属性值格式化为 CSS 样式的键值对
        return [kebabCase(key), styles[key]].join(':')
      })
      .join(';')

    // 如果结果不为空，确保末尾有分号
    return result ? (result.endsWith(';') ? result : `${result};`) : ''
  }
  // 如果 styles 不是对象也不是数组，则直接返回
  return ''
}

/**
 * 格式化Float，保留两位小数，并用逗号分隔千位
 * @param {number | string} amount - 输入的金额
 * @param {number} [digit] - 保留的小数位数
 * @returns {string} 格式化后的金额字符串
 */
export function formatFloat(amount: number | string, digit: number = 2): string {
  // 转换为数字类型，并保留两位小数
  const num = Number.parseFloat(amount.toString()).toFixed(digit)

  // 使用正则表达式添加千位分隔符
  const parts = num.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 千位分隔符

  // 返回格式化后的金额
  return parts.join('.')
}

export function toFixed(num: number, digit: number = 2): number {
  const c = 10 * digit
  return Math.floor(num * c) / c
}

// 删除对象中的属性
export function omit(obj, args): object {
  if (!args)
    return obj
  const newObj = {}
  const isString = typeof args === 'string'
  const keys = Object.keys(obj).filter((item) => {
    if (isString) {
      return item !== args
    }
    return !args.includes(item)
  })

  keys.forEach((key) => {
    if (obj[key] !== undefined)
      newObj[key] = obj[key]
  })
  return newObj
}
