import Vue from 'vue'
import Vuex from 'vuex'
import account from "./modules/account"
import bill from "./modules/bill"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        account,
        bill
    }
})
