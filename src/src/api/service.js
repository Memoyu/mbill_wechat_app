import Request from 'luch-request'
import tip from '@/common/utils/tip.js'
import store from '@/store'
import { API_URL } from '@/env.js'
import { ACCESS_TOKEN } from "@/common/utils/constants"


const getTokenStorage = () => {
    let token = ''
    try {
        token = "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
    } catch (e) {
    }
    return token
}

const http = new Request()
http.setConfig((config) => {
    config.baseURL = API_URL
    config.timeout = 10000 // 十秒请求超时
    config.header = {
        ...config.header,
        'content-type': 'application/json',
    }
    return config
})

const whiteList = ['account/wxlogin']
http.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作 */
    config.header = {
        ...config.header,
        Authorization: getTokenStorage()
    }
    // console.log("req", config);
    const token = uni.getStorageSync(ACCESS_TOKEN)
    if (!token && whiteList.indexOf(config.url) === -1) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
        return Promise.reject(config)
    }
    return config
}, (config) => {
    return Promise.reject(config)
})


// 是否正在刷新的标记
let isRefreshing = false
//重试队列
let requests = []

http.interceptors.response.use(async (response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
    // if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
    //   return Promise.reject(response)
    // }
    // console.log("响应", response);
    return response
}, async (response) => { // 请求错误做点什么。可以使用async await 做异步操作
    // console.log(response)
    if (response && response.data) {
        let data = response.data
        console.log("响应Data", data);
        // const token = uni.getStorageSync(ACCESS_TOKEN)
        switch (data.code) {
            case 10030:
                tip.toast(data.message);
                break;
            case 10000:
            case 10040:
                tip.alert('登录已过期');
                store.dispatch('Logout');
                break
            case 10001:
                tip.error('没有权限');
                break
            case 10050:
                // console.log("进来啦");
                if (!isRefreshing) {
                    isRefreshing = true
                    return new Promise(resolve => {
                        store.dispatch('RefreshToken').then((res) => {
                            let data = res.data;
                            // console.log("刷新token结果", data);
                            if (data.success) {
                                // console.log("请求集合", requests);
                                requests.forEach((cb) => cb(data.result.accessToken))
                                requests = [] // 重新请求完清空
                                resolve(http.request(response.config));
                            } else {
                                store.dispatch('Logout');
                            }
                        }).catch(error => {
                            // console.log("请求错误：", error);
                            store.dispatch('Logout');
                        }).finally(() => {
                            isRefreshing = false
                        })
                    });
                } else {
                    return new Promise(resolve => {
                        // 用函数形式将 resolve 存入，等待刷新后再执行
                        requests.push(token => {
                            // response.header.Authorization = `Bearer ${token}`
                            resolve(http.request(response.config))
                        })
                    })
                }
                break
            default:
                tip.error(data.message);
                break
        }
    }
    // console.log("从这走", response);
    // tip.toast("网络错误，请稍后再试"); // 暂时关闭
    return Promise.reject(response);
})

export {
    http
}