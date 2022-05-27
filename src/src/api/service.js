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
    config.header = {
        ...config.header,
        'content-type': 'application/json',
    }
    return config
})


http.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作 */
    config.header = {
        ...config.header,
        Authorization: getTokenStorage()
    }
    // const token = uni.getStorageSync(ACCESS_TOKEN)
    // if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
    //     return Promise.reject(config)
    // }
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
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
    // console.log(response)
    if (response) {
        let data = response.data
        const token = uni.getStorageSync(ACCESS_TOKEN)
        console.log("------异常响应------", data.code)
        switch (data.code) {
            case 10000:
            case 10040:
                if (!token || data.message == "Token失效，请重新登录") {
                    let timeout = setTimeout(tip.alert('登录已过期'), 1000);
                    store.dispatch('Logout');
                }
                break
            case 10001:
                tip.error('没有权限');
                break
            case 10050:
                // console.log("进来啦");
                if (!isRefreshing) {
                    isRefreshing = true
                    return store.dispatch('RefreshToken').then((res) => {
                        console.log("请求集合", requests);
                        requests.forEach((cb) => cb(res.data.result.accessToken))
                        requests = [] // 重新请求完清空
                        return http.request(response.config);
                    }).catch(error => {
                        store.dispatch('Logout');
                    }).finally(() => {
                        isRefreshing = false
                    })
                } else {
                    return new Promise(resolve => {
                        // 用函数形式将 resolve 存入，等待刷新后再执行
                        requests.push(token => {
                            response.header.Authorization = `Bearer ${token}`
                            resolve(http.request(response.config))
                        })
                    })
                }
                break
            default:
                tip.error({
                    duration: 0,
                    forbidClick: true,
                    message: data.message
                });
                break
        }
    }
    return Promise.reject(response);
})

export {
    http
}