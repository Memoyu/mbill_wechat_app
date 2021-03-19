<template>
  <view class="container">
    <view class="logo-image">
      <image mode="scaleToFill" src="../../static/assets/icons/m_icon.svg" />
    </view>
    <view class="app-info">
      <view>mbill {{ version }}</view>
    </view>
    <view class="description">
      <text @tap="copyContent(github)">开源地址：{{ github }}</text>
      <text>\n\n</text>
      <text @tap="copyContent(email)">邮箱：{{ email }}</text>
    </view>
    <view class="btn-box flex align-center justify-center">
      <button class="cu-btn confirem-btn" @tap="editUserInfo">联系我</button>
    </view>
  </view>
</template>

<script>
import Tip from "@/common/utils/tip";
export default {
  data() {
    return {
      version: "v1.0.0",
      github: "https://github.com/Memoyu/mbill_wechat_app",
      email:"mmy6076@outlook.com"
    };
  },
  methods: {
    copyContent(content) {
      uni.setClipboardData({
        data: content,
        success: (res) => {
          Tip.toast("复制成功")
        },
      });
    },
  },
};
</script>

<style lang="scss">
.logo-image {
  text-align: center;
  height: 150px;
  image {
    width: 150px;
    height: 100%;
  }
}
.app-info {
  margin-top: 30px;
  font-size: 18px;
  text-align: center;
}

.description {
  padding: 0 12px;
  margin-top: 24px;
  font-size: 16px;
  color: $secondaryText;
  > view {
    margin-bottom: 8px;
  }
}
.btn-box {
  margin-top: 60rpx;

  .confirem-btn {
    width: 710rpx;
    height: 80rpx;
    background: linear-gradient(90deg, $darkPrimaryColor, $primaryColor);
    border: 1rpx solid rgba(238, 238, 238, 1);
    border-radius: 40rpx;
    font-size: 30rpx;
    color: rgba(#fff, 0.9);
  }
}
</style>
