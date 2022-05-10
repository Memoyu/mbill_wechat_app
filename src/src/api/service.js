import Request from 'luch-request'
import tip from '@/common/utils/tip.js'
import { API_URL } from '@/env.js'


const getTokenStorage = () => {
    let token = ''
    try {
        token = "Bearer " + uni.getStorageSync('token')
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
    /*
   if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
     return Promise.reject(config)
   }
   */
    return config
}, (config) => {
    return Promise.reject(config)
})


http.interceptors.response.use(async (response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
    // if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
    //   return Promise.reject(response)
    // }
    return response
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
    console.log(response)
    if (response) {
        let data = response.data
        const token = uni.getStorageSync('token')
        console.log("------异常响应------", token)
        console.log("------异常响应------", data.status)
        switch (data.status) {
            case 403:
                tip.error('拒绝访问');
                break
            case 500:
                if (!token || data.message == "Token失效，请重新登录") {
                    let timeout = setTimeout(tip.alert('登录已过期'), 1000);
                    store.dispatch('Logout').then(() => {
                        clearTimeout(timeout)
                        window.location.reload()
                    })
                }
                break
            case 404:
                break
            case 504:
                break
            case 401:
                if (token) {
                    /* store.dispatch('Logout').then(() => {
                       setTimeout(() => {
                         window.location.reload()
                       }, 1500)
                     }) */
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
    return Promise.reject(response)
})

export {
    http
}