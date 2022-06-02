import Vue from 'vue'
import Vuex from 'vuex'
import account from "./modules/account"
import bill from "./modules/bill"
import preOrder from "./modules/pre-order"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        account,
        bill,
        preOrder
    }
})
