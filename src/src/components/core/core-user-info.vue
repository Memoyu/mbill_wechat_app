<template>
  <view class="header">
    <image class="user-bg" :src="bgImage" mode=""></image>
    <view class="head-wrap">
      <view class="user-head x-bc">
        <view class="x-f">
          <view class="info-box">
            <view class="x-f">
              <view class="head-img-wrap">
                <image
                  class="head-img"
                  @tap.stop="jump('/pages/profile/user-info')"
                  :src="userInfo.avatarUrl || '../../static/assets/icons/profile/default_avatar.png' "
                  mode="aspectFill"
                ></image>
              </view>
              <text
                @tap.stop="jump('/pages/profile/user-info')"
                class="user-name one-t"
                >{{ userInfo.nickname || "未登录~" }}</text
              >
            </view>
          </view>
          <view class="grade-tag tag-box x-f" v-if="userInfo.group">
            <image class="tag-img" :src="userInfo.group.image" mode=""></image>
            <text class="tag-title">{{ userInfo.group.name }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bgImage:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_match%2F0%2F12148008023%2F0.jpg&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1618388696&t=58dfa53f6bf355c6359ad3d60d87bf0d",
    };
  },
  computed: {},
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
  },
  methods: {
    jump(path) {
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
  height: calc(var(--status-bar-height) + 300rpx);
  .user-bg {
    width: 100%;
    height: calc(var(--status-bar-height) + 300rpx);
  }
  .head-wrap {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    z-index: 9;
    top: 30rpx;
    .nav-title {
      font-size: 38rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #fff;
      position: relative;
    }
  }
  .user-head {
    width: 100%;
    padding-top: 30rpx;
    .info-box {
      padding-left: 30rpx;
      .head-img-wrap {
        position: relative;
        .refresh-btn {
          position: absolute;
          padding: 0;
          background: none;
          width: 34rpx;
          height: 34rpx;
          border-radius: 50%;
          background: #c9912c;
          top: 0;
          right: 20rpx;
          .cuIcon-refresh {
            color: #fff;
            font-size: 24rpx;
          }
          .refresh-rotate {
            transform: rotate(360deg);
            transition: all 0.2s;
          }
        }
      }
      .head-img {
        width: 94rpx;
        height: 94rpx;
        border-radius: 50%;
        background: #ccc;
        margin-right: 25rpx;
        overflow: hidden;
      }

      .user-name {
        font-size: 30rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #fff;
        line-height: 30rpx;
        width: 180rpx;
      }
    }
    .tag-box {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 21rpx;
      line-height: 38rpx;
      padding-right: 10rpx;
      margin-left: 10rpx;
      .cuIcon-refresh {
        color: #fff;
        margin: 0 10rpx;
      }
      .tag-img {
        width: 40rpx;
        height: 40rpx;
        margin-right: 6rpx;
        border-radius: 50%;
      }

      .tag-title {
        font-size: 20rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 20rpx;
      }
    }
  }
}
</style>
