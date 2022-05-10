import Vue from 'vue'
import App from './App'
import store from '@/store'
import tip from '@/common/utils/tip.js'
import { http } from '@/api/service.js'

Vue.config.productionTip = false

// store
Vue.prototype.$store = store;
// tip
Vue.prototype.$tip = tip;
// request请求
Vue.prototype.$http = http

App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
