import Vue from 'vue'
import App from './App'
import store from '@/store'
import tip from '@/common/utils/tip.js'
import api from '@/api/api.js'

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
app.$mount()
