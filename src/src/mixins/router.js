export const router = {
    onShow() {
        if (this._uid != 0) {
            this.$Router.forceGuardEach()
        }
    }
}