<template>
  <view class="container">
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
                    :src="userInfo.avatarUrl"
                    mode="aspectFill"
                  ></image>
                </view>
                <text
                  @tap.stop="jump('/pages/profile/login')"
                  class="user-name one-t"
                  >{{ userInfo.nickname || "请登录~" }}</text
                >
              </view>
            </view>
            <view class="grade-tag tag-box x-f" v-if="userInfo.group">
              <image
                class="tag-img"
                :src="userInfo.group.image"
                mode=""
              ></image>
              <text class="tag-title">{{ userInfo.group.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 主要功能 -->
    <view class="func-btn">
      <view @tap="redirect('/pages/profile/asset_manage')">
        <view>
          <image src="~@/static/assets/icons/profile/asset_manage.png"></image>
        </view>
        <view>资产管理</view>
      </view>
      <view @tap="redirect('/pages/profile/advance_list')">
        <view>
          <image src="~@/static/assets/icons/profile/advance_list.png"></image>
        </view>
        <view>预购清单</view>
      </view>
    </view>

    <view class="bottom-container">
      <!-- 功能列表 -->
      <uni-list :border="false">
        <uni-list-item
          v-for="(item, index) in funList"
          :key="index"
          :show-extra-icon="true"
          showArrow
		  :rightText="item.rightText"
          :extra-icon="item.extraIcon"
          :title="item.title"
          link
          :to="item.path"
        />
      </uni-list>
    </view>

    <view class="foot_box">
      <view class="copyright y-f">
        <view class="author">Power By Memoyu</view>
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
      userInfo: {
        nickname: "未登录",
        avatarUrl: "../../static/assets/icons/profile/default_avatar.png",
      },
      funList: [
        {
          title: "预算管理",
          path: "",
		  extraIcon: {
            color: "#4cd964",
            size: "22",
            type: "gear-filled",
          },
        },
        {
          title: "资产管理",
          path: "",
          extraIcon: {
            color: "#4cd964",
            size: "22",
            type: "gear-filled",
          },
        },
        {
          title: "分类管理",
          path: "",
          extraIcon: {
            color: "#4cd964",
            size: "22",
            type: "gear-filled",
          },
        },
        {
          title: "系统设置",
          path: "",
          extraIcon: {
            color: "#4cd964",
            size: "22",
            type: "gear-filled",
          },
        },
        {
          title: "关于mbill",
          path: "",
          extraIcon: {
            color: "#4cd964",
            size: "22",
            type: "gear-filled",
          },
		  rightText: "v1.0"
        },
      ],
      already_login: true,
    };
  },
  onLoad() {},
  methods: {
    jump(page) {
      wx.navigateTo({
        url: page
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background: #f4f4f4;
  overflow-y:hidden;
}
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

.func-btn {
  height: 70px;
  border-radius: 10px;
  margin: 15px 10px 10px 10px;
  display: flex;
  z-index: -1;
  align-items: center;
  justify-items: center;
  background: white;
  > view {
    flex: 1;
    text-align: center;
    image {
      width: 25px;
      height: 25px;
    }
  }
}

.bottom-container {
  background: white;
  padding: 0 10px;
  margin: 10px 10px;
  border-radius: 10px;
}

.foot_box {
  padding-top: 50rpx;
  //padding-bottom: calc(var(--window-bottom) + 30px);
  //margin-bottom: 50rpx;
}
.copyright {
  color: #999;
  .author {
    font-size: 24rpx;
  }
}
</style>
