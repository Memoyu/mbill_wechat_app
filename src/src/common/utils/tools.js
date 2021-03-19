
import router from '@/common/router'
import QQMapWX from "@/common/wechat/qqmap-wx-jssdk.js";
import { MAP_KEY } from "@/env";
import { AMAP_KEY } from "@/env";
import AMAP from "@/common/wechat/amap-wx";
import Tip from "@/common/utils/tip";

const amapSDK = new AMAP.AMapWX({ key: AMAP_KEY });
export default {
	/**
	 * 跳转再封装，不支持复杂传参。
	 */
	routerTo(path, params = {}, isLogin) {
		let objParams = params;
		// 是否跳转外部链接
		if (~path.indexOf('http')) {
			// // #ifdef H5
			// window.location = path;
			// // #endif
			// // #ifndef  H5
			// router.push({
			// 	path: '/pages/public/webview',
			// 	query: {
			// 		'webviewPath': path
			// 	}
			// })
			// // #endif
			return false
		}
		// 判断是否有参数
		if (path.indexOf('?') !== -1) {
			let index = path.lastIndexOf('?');
			let query = path.substring(index + 1, path.length);
			let arr = query.split('&')
			path = path.slice(0, index);
			arr.forEach(item => {
				let mArr = []
				let obj = {}
				mArr = item.split('=');
				obj[mArr[0]] = mArr[1];
				objParams = {
					...objParams,
					...obj
				}
			})
		}
		// 判断是否是tabbar
		if (isLogin) {
			router.replaceAll({
				path: path,
				query: objParams
			})
		} else {
			router.push({
				path: path,
				query: objParams
			})
		}
	},

	/**
	 * 获取位置信息
	 */
	getLocation() {
		// return new Promise((resolve, reject) => {
		// 	// 获取地址
		// 	this.qqmapSDK = new QQMapWX({
		// 		key: MAP_KEY,
		// 	});
		// 	uni.getLocation({
		// 		type: "gcj02", // 返回可以用于wx.openLocation的经纬度
		// 		success: (result) => {
		// 			this.qqmapSDK.reverseGeocoder({
		// 				location: {
		// 					latitude: result.latitude,
		// 					longitude: result.longitude,
		// 				}, // 坐标
		// 				success: (res) => {
		// 					resolve(res);
		// 				},
		// 				fail: (err) => {
		// 					Tip.toast("获取位置信息失败！请联系管理员");
		// 					reject(err);
		// 				}
		// 			});
		// 		},
		// 		fail: (err) => {
		// 			Tip.toast("请确认已允许使用位置信息！");
		// 			reject(err);
		// 		}
		// 	});
		// })
		return new Promise((resolve, reject) => {
			uni.getLocation({
				type: "gcj02", // 返回可以用于wx.openLocation的经纬度
				success: (result) => {
					amapSDK.getRegeo({
						success: (res) => {
							// console.log(res[0])
							resolve(res[0]);
						},
						fail: (err) => {
							Tip.toast("获取位置信息失败！请联系管理员");
							reject(err);
						}
					});
				},
				fail: (err) => {
					Tip.toast("请确认已允许使用位置信息！");
					reject(err);
				}
			});
		})
	},
	/**
	 * 获取天气信息
	 */
	getWeather() {
		return new Promise(async (resolve, reject) => {
			amapSDK.getWeather({
				// type:'forecast',//表示获取的是预报信息 默认live（实时天气）
				success: (res) => {
					// console.log(res)
					resolve(res);
				},
				fail: (err) => {
					Tip.toast("获取天气信息失败！");
					reject(err);
				}
			})
		})
	},

	/**
	 * 获取对应天气现象图标信息
	 * @param {String} weather 天气现象
	 * @returns  天气图标
	 */
	getWeatherIcon(weather) {
		if(weather == "多云"){
			return "icon-weather-cloudy"
		}else if(weather == "晴"){
			return "icon-weather-sun"
		}else if(weather == "阴"){
			return "icon-weather-shade"
		}else if(weather == "大风" || weather == "强风/劲风" || weather == "疾风" || weather == "烈风"){
			return "icon-weather-gale"
		}else if(weather == "雷阵雨"){
			return "icon-weather-thunderstorm-sun"
		}else if(weather == "晴间多云"){
			return "icon-weather-sunny"
		}else if(weather == "小雨"){
			return "icon-weather-small-rain"
		}else if(weather == "中雨" || weather == "大雨" || weather == "暴雨"){
			return "icon-weather-rain"
		}else if(weather == "雨夹雪" || weather == "阵雨夹雪"){
			return "icon-weather-rain-snow"
		}else if(weather == "霾" ||weather == "中度霾" || weather == "重度霾" || weather == "严重霾"){
			return "icon-weather-smog"
		}
	},


}