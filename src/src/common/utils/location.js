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
                let curTime = new Date().getTime();
                let time = uni.getStorageSync(GET_LOCATION_TIME) || curTime - 60005 // 加一分多钟
                let timeDiff = curTime - time
                let leavel = timeDiff % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
                let sec = Math.floor(leavel / 1000); // 计算剩余的分钟数
                console.log(curTime, time, leavel, sec);
                if (sec < 60) {
                    this.formatLocation().then((res) => {
                        resolve(res);
                    }).catch(err => {
                        tip.error("获取地址失败")
                        console.log("reverseGeocoder获取地址信息失败", err);
                        reject(err)
                    })
                } else {
                    this.getUserLocation().then(res => {
                        uni.setStorageSync(GET_LOCATION_TIME, curTime)
                        this.formatLocation().then((res) => {
                            resolve(res);
                        }).catch(err => {
                            tip.error("获取地址失败")
                            console.log("reverseGeocoder获取地址信息失败", err);
                            reject(err)
                        })
                    }).catch(err => {
                        tip.error("获取位置失败")
                        console.log("getLocation获取地理位置失败", err);
                        reject(err)
                    })
                }
            });
        } else {
            tip.toast('请检查手机定位是否开启')
            reject("未开启手机定位")
        }
    },

    getUserLocation() {
        return new Promise((resolve, reject) => {
            uni.getLocation({
                type: "gcj02", // 返回可以用于wx.openLocation的经纬度
                success: (res) => {
                    uni.setStorageSync(USER_LOCATION, `${res.latitude},${res.longitude}`)
                    resolve(res);
                },
                fail: (err) => {
                    console.log(err);
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
                                            tip.toast('授权成功，请继续')
                                            this.getUserLocation().then(res => {
                                                resolve(res);
                                            })
                                        } else {
                                            tip.toast('授权失败，请检查设置！')
                                        }
                                    }
                                });
                            } else {
                                reject("用户取消了授权地理位置")
                            }
                        },
                        fail: (err) => {
                            reject(err)
                        }
                    });
                }
            });
        });
    },

    formatLocation() {
        return new Promise((resolve, reject) => {
            qqmapsdk.reverseGeocoder({
                location: uni.getStorageSync(USER_LOCATION) || '',
                success: function (res) {
                    // console.log("地址信息", res)
                    resolve(res.result);
                },
                fail: function (error) {
                    reject(error)
                },
            });
        });
    }

}