<template>
  <view class="b-container">
    <button type="primary" @tap="handlerLogout">注销</button>
  </view>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  onShow() {},
  onLoad() {},
  methods: {
    ...mapActions(["Logout"]),
    handlerLogout() {
      this.Logout();
    },
  },
};
</script>

<style lang="scss" scope>
</style>
