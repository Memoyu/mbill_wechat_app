export const mixin = {
    methods: {
        setTabBarIndex(index) {
            if (typeof this.$mp.page.getTabBar === 'function' &&
                this.$mp.page.getTabBar()) {
                this.$mp.page.getTabBar().setData({
                    selected: index
                })
            }
        }
    }
}