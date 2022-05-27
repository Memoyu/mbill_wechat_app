export const tabbar = {
    methods: {
        setTabBarIndex(index) {
            if (typeof this.$scope.getTabBar === 'function' &&
                this.$scope.getTabBar()) {
                this.$scope.getTabBar().setData({
                    selected: index,
                })
            }
        },
        setTabBarShow(show) {
            if (typeof this.$scope.getTabBar === 'function' &&
                this.$scope.getTabBar()) {
                this.$scope.getTabBar().setData({
                    show: show,
                })
            }
        }
    }
}