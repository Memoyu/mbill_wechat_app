<template>
    <view class="container">
        <view class="list x-bc" @tap="jump('/pages/profile/feedback')">
            <view class="title">意见反馈</view>
            <view class="iconfont icon-to"></view>
        </view>
             <view class="list x-bc" @tap="jump('/pages/profile/about')">
            <view class="title">关于mbill</view>
            <view class="iconfont icon-to"></view>
        </view>
        <view class="list x-bc" @tap="outLogin">
            <view class="title">退出登录</view>
            <view class="iconfont icon-to"></view>
        </view>
    </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
    // 退出登录
    outLogin() {
      this.$store.commit("OUT_LOGIN");
      this.$Router.replace("/pages/profile/login");
    }
  }
};
</script>

<style lang="scss">
.list {
  height: 110rpx;
  padding: 0 20rpx;
  border-bottom: 1rpx solid rgba(#dfdfdf, 0.6);

  .title {
    font-size: 28rpx;
  }

  .cuIcon-right {
    font-size: 34rpx;
    color: #999;
  }
}
</style>
