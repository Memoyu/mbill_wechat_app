<template>
  <view class="mbill-login-hint">
    <view class="iconfont icon-bill need-to-login"></view>
    <view class="hint-content">
      <view class="title">暂未登录</view>
      <view class="goto" @click="handleGotoLogin">登录 ></view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-login-hint",
  props: {},
  methods: {
    handleGotoLogin() {
      this.$Router.push({ name: "login" });
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-login-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  .need-to-login {
    font-size: 50px;
    color: $primary-color;
  }
  .hint-content {
    display: flex;
    .title {
      color: $grey-color;
    }
    .goto {
      margin-left: 20px;
      color: $primary-color;
    }
  }
}
</style>
