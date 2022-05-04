<template>
  <view>
    <view class="content">
      <view>
        <text class="title">个人</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mixin } from "@/mixins/tabbar.js";

export default {
  mixins: [mixin], //混入 文件
  data() {
    return {};
  },
  onShow() {
    this.setTabBarIndex(1);
  },
  onLoad() {},
  methods: {},
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
