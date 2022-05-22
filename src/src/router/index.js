import { RouterMount, createRouter } from 'uni-simple-router'

const router = createRouter({
    encodeURI: true,
    platform: process.env.VUE_APP_PLATFORM,
    routes: [...ROUTES]
});

const whiteList = ['/pages/profile/login']
//全局路由前置守卫
router.beforeEach((to, from, next) => {
    console.log("路由守卫");
    let token = uni.getStorageSync('token');
    if (token) {
        next()
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next({ path: '/pages/profile/login' })
        }
    }
});
// 全局路由后置守卫
router.afterEach((to, from) => {
    console.log('跳转结束')
})

export {
    router,
    RouterMount
}