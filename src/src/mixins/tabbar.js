export const mixin = {
    methods: {
        setTabBarIndex(index) {
            if (typeof this.$root.$mp.page.getTabBar === 'function' &&
                this.$root.$mp.page.getTabBar()) {
                this.$root.$mp.page.getTabBar().setData({
                    selected: index,
                })
            }
        }
    }
}