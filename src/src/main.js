import Vue from 'vue'
import App from './App'
import store from '@/store'
import tip from '@/common/utils/tip.js'
import api from '@/api/api.js'
import { router, RouterMount } from '@/router'

Vue.use(router)

Vue.config.productionTip = false

// store
Vue.prototype.$store = store;
// tip
Vue.prototype.$tip = tip;
// request请求
Vue.prototype.$api = api

App.mpType = 'app'
const app = new Vue({
  ...App
})

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif