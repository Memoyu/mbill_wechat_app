<template>
  <view v-if="showLoginTip" class="login-message">
    <view>
      <view class="iconfont icon-prohibit icon"></view>
      <view class="title">
        {{title}}
        <view class="navigator" @tap="jump('/pages/profile/login')">登录 ></view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";

export default {
  name: "loginModal",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      showLoginTip: state => state.user.showLoginTip
    })
  },
  props: {
    title: {
      type: String,
      default: "暂未登录"
    }
  },
  created() {},
  methods: {
    jump(path) {
      this.$Router.push({
        path: path
      });
    }
  }
};
</script>

<style lang="scss">
.login-message {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  padding-bottom: 100upx;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #fff;
  text-align: center;
  .icon {
    font-size: 60px;
    color: $primaryColor;
    margin-bottom: 10px;
  }
  .title {
    color: $secondaryText;
    font-size: 30rpx;
    display: flex;
    .navigator {
      margin-left: 16upx;
      color: $primaryColor;
    }
  }
}
</style>
