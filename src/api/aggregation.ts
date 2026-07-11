import type { IAddressInfo, IWeatherInfo } from './types/aggregation'
import { http } from '@/utils/http'

/**
 * 获取地址信息
 */
export function getAddressInfo(longitude: number, latitude: number) {
  return http.get<IAddressInfo>('aggregation/address', { location: `${longitude},${latitude}` })
}

/**
 * 获取地址信息
 */
export function getWeatherInfo(adcode: string) {
  return http.get<IWeatherInfo>('aggregation/weatherinfo', { city: adcode })
}
