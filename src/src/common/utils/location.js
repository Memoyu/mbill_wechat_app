import { AMAP_KEY } from "@/env";
import AMAP from "@/common/map/amap-wx";
import tip from '@/common/utils/tip.js'

const amapSDK = new AMAP.AMapWX({ key: AMAP_KEY });
export default {
    /**
     * 获取位置信息
     */
    getLocation() {
        let { locationEnabled } = wx.getSystemInfoSync();
        if (locationEnabled) {
            return new Promise((resolve, reject) => {
                let getRegeo = () => {
                    amapSDK.getRegeo({
                        success: (res) => {
                            // console.log("地址信息", res)
                            resolve(res[0]);
                        },
                        fail: (err) => {
                            tip.toast("获取位置信息失败, 请检查手机定位是否开启");
                            reject(err);
                        }
                    });
                }

                let _locationChangeFn = res => {
                    // console.log('location change', res);
                    getRegeo();

                    wx.offLocationChange();
                    wx.stopLocationUpdate();
                };
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