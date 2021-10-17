<template>
  <view class="header">
    <image class="user-bg" :src="bgImage" mode=""></image>
    <view class="head-wrap">
      <view class="x-ac">
        <image
          class="head-img"
          @tap.stop="jump"
          :src="
            userInfo.avatarUrl ||
            '../../static/assets/icons/profile/default_avatar.png'
          "
          mode="aspectFill"
        ></image>
      </view>
      <view class="x-ac" style="margin-top: 20rpx">
        <text @tap.stop="jump" class="user-name one-t">{{
          userInfo.nickname || "未登录~"
        }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { BASE_URL } from "@/env";
import { mapState } from "vuex";

export default {
  data() {
    return {
      bgImage: BASE_URL + "/core/images/other/index_bg4_533x300.png",
    };
  },
  computed: {},
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapState({
      showLoginTip: (state) => state.user.showLoginTip,
    }),
  },
  methods: {
    jump() {
      var path = "/pages/profile/user-info";
      if (this.showLoginTip) {
        path = "/pages/profile/login";
      }
      this.$Router.push({
        path: path,
      });
    },
  },
};
</script>

<style lang="scss">
.header {
  position: relative;
  // height: calc(var(--status-bar-height) + 300rpx);
  .user-bg {
    width: 100%;
  }
  .head-wrap {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    top: 30rpx;
    .nav-title {
      font-size: 38rpx;
      font-weight: 500;
      color: #fff;
      position: relative;
    }
    .head-img {
      text-align: -webkit-center;
      width: 130rpx;
      height: 130rpx;
      border-radius: 50%;
      background: #ccc;
      overflow: hidden;
    }
    .user-name {
      font-weight: bold;
      text-align: center;
      color: #fff;
      line-height: 40rpx;
    }
  }
  .tag-box {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 21rpx;
    line-height: 38rpx;
    padding-right: 10rpx;
    margin-left: 10rpx;
    .tag-img {
      width: 40rpx;
      height: 40rpx;
      margin-right: 6rpx;
      border-radius: 50%;
    }

    .tag-title {
      font-size: 20rpx;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 20rpx;
    }
  }
}
</style>
