import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

 import user from './modules/user.js'
 import statement from './modules/statement.js'

const store = new Vuex.Store({
	modules: {
		user,
		statement,
	}
})

export default store






