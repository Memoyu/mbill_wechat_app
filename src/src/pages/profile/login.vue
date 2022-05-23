<template>
  <view class="b-container">
    <view class="login" @tap="handlerLogin">登录</view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onShow() {
    uni.hideHomeButton();
  },
  onLoad() {},
  methods: {
    handlerLogin() {
      this.$api.login({ code: "test" }).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss" scope>
.b-container {
  justify-content: center;
  .login {
    font-weight: bold;
    color: white;
    text-align: center;
    border-radius: 20px;
    padding: 10px 0;
    width: 70%;
    background: $expend-color;
  }
}
</style>
