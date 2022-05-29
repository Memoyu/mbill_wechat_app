import { MAP_KEY } from "@/env";
import QQMapWX from "@/common/map/qqmap-wx-jssdk";
import tip from '@/common/utils/tip.js'
import { USER_LOCATION, GET_LOCATION_TIME } from "@/common/utils/constants"

var qqmapsdk = new QQMapWX({
    key: MAP_KEY
});

export default {
    /**
     * 获取位置信息
     */
    getLocation() {
        let { locationEnabled } = wx.getSystemInfoSync();
        if (locationEnabled) {
            return new Promise((resolve, reject) => {
                let getRegeo = () => {
                    qqmapsdk.reverseGeocoder({
                        location: uni.getStorageSync(USER_LOCATION) || '',
                        success: function (res) {
                            console.log("地址信息", res)
                            resolve(res.result);
                        },
                        fail: function (error) {
                            tip.toast("获取位置信息失败, 请检查手机定位是否开启");
                            reject(error);
                        },
                    });
                }

                let _locationChangeFn = res => {
                    console.log('location change', res);
                    uni.setStorageSync(USER_LOCATION, `${res.latitude},${res.longitude}`)
                    getRegeo();
                    wx.offLocationChange();
                    wx.stopLocationUpdate();
                };

                let curTime = new Date().getTime();
                let time = uni.getStorageSync(GET_LOCATION_TIME) || curTime - 60005 // 加一分多钟
                let timeDiff = curTime - time
                let leavel = timeDiff % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
                let sec = Math.floor(leavel / 1000); // 计算剩余的分钟数
                console.log(curTime, time, leavel, sec);
                if (sec < 60) {
                    getRegeo();
                }
                else {
                    uni.setStorageSync(GET_LOCATION_TIME, curTime)
                    wx.startLocationUpdate({
                        success: res => {
                            wx.onLocationChange(_locationChangeFn);
                        },
                        fail: err => {
                            console.log('获取当前位置失败', err);
                            wx.showModal({
                                title: '温馨提示',
                                content: '获取权限失败，需要获取您的地理位置才能为您提供更好的服务！是否授权获取地理位置？',
                                confirmText: '前往设置',
                                cancelText: '取消',
                                success: res => {
                                    if (res.confirm) {
                                        wx.openSetting({
                                            success: async res => {
                                                console.log(res);
                                                if (res.authSetting[
                                                    'scope.userLocation']) {
                                                    wx.showToast({
                                                        title: '授权成功请继续',
                                                        icon: 'success'
                                                    })
                                                }
                                                getRegeo();
                                            }
                                        });
                                    }
                                }
                            });
                            // reject(err);
                        }
                    });
                }
            });
        } else {
            wx.showToast({
                title: '请检查手机定位是否开启',
                icon: 'none'
            })
            return new Promise((resolve, reject) => {
                reject()
            })
        }
    },

}