export const mixin = {
    methods: {
        setTabBarIndex(index) {
            if (typeof this.$scope.getTabBar === 'function' &&
                this.$scope.getTabBar()) {
                this.$scope.getTabBar().setData({
                    selected: index,
                })
            }
        }
    }
}