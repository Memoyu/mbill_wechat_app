import Vue from 'vue'
import App from './App'
import store from '@/common/store'
import api from '@/common/request/index'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$store = store;
Vue.prototype.$api = api;

const app = new Vue({
  store,
  ...App
})
app.$mount()
