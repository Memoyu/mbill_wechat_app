<template>
  <view>
    <view class="container">
      <view class="bg" />
      <view class="profile-header">
        <i class="iconfont icon-list header-item" />
        <i class="iconfont icon-list header-item" />
      </view>
      <view
        class="profile-info"
        @tap="handlerNavigateTo('/pages/profile/user-detail')"
      >
        <image class="image" mode="widthFix" :src="user.avatar" />
        <view class="user-info">
          <text class="user-name">{{ user.name }}</text>
          <text class="user-days">已经记账{{ user.days }}天</text>
        </view>
        <i class="iconfont icon-to to-detail-icon" />
      </view>
      <view class="profile-asset">
        <view class="le le-3" />
        <view class="le le-2" />
        <view class="le le-1"> </view>
        <view class="profile-setting">
          <!-- <view class="manage-func">
            <view class="func-item">
              <i class="iconfont icon-assets func-icon" />
            </view>
            <view class="func-item">
              <i class="iconfont icon-assets func-icon" />
            </view>
            <view class="func-item">
              <i class="iconfont icon-assets func-icon" />
            </view>
            <view class="func-item">
              <i class="iconfont icon-assets func-icon" />
            </view>
          </view> -->
          <view class="cells">
            <view
              class="cell-item"
              @tap="handlerNavigateTo(item.path)"
              v-for="(item, index) in cells"
              :key="index"
            >
              <i :class="['iconfont', 'icon-' + item.icon, 'cell-item-icon']" />
              <view class="cell-item-content">
                <view class="item-title x-bc">
                  <text>{{ item.title }}</text>
                  <i class="iconfont icon-to to-detail-icon" />
                </view>
                <view v-if="index < cells.length - 1" class="bottom-line" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mixin } from "@/mixins/tabbar.js";

export default {
  mixins: [mixin], //混入文件
  data() {
    return {
      user: {
        avatar: "/static/assets/avatar.png",
        name: "Memoyu",
        days: 360,
      },
      cells: [
        {
          title: "账户管理",
          icon: "qianbao",
          path: "/pages/bill/asset/manage",
        },
        {
          title: "分类管理",
          icon: "biaoqian",
          path: "/pages/bill/category/manage",
        },
        { title: "系统设置", icon: "shezhi", path: "/pages/profile/setting" },
      ],
    };
  },
  onShow() {
    this.setTabBarIndex(1);
  },
  onLoad() {},
  methods: {
    handlerNavigateTo(path) {
      console.log(path);
      uni.navigateTo({ url: path });
    },
  },
};
</script>

<style lang="scss" scope>
.container {
  .bg {
    z-index: -1;
    position: absolute;
    top: 0;
    background-color: $light-color;
    width: 100%;
    height: 30%;
    border-radius: 0 0 15px 15px;
  }
  .profile-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .header-item {
      margin: 10px 15px;
      font-size: 20px;
    }
  }
  .profile-info {
    margin: 0 20px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    .image {
      background: white;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      margin-right: 20px;
    }
    .user-info {
      width: 100%;
      display: flex;
      flex-direction: column;
      .user-name {
        font-size: 23px;
        font-weight: 900;
        color: $grey-black-text-color;
      }
      .user-days {
        font-size: 14px;
        color: $bright-color;
      }
    }
  }
  .profile-asset {
    position: relative;
    margin-top: 30px;
    width: 100%;
    .le {
      position: absolute;
      border-radius: 14px;
      height: 140px;
      left: 50%;
      transform: translate(-50%, 0);
      box-shadow: 0 0 15px #888888b6;
    }
    .le-1 {
      top: 30px;
      width: 95%;
      background: $dark-color;
    }
    .le-2 {
      top: 15px;
      width: 90%;
      background: $primary-color;
    }
    .le-3 {
      width: 85%;
      background: $bright-color;
    }

    .profile-setting {
      position: absolute;
      top: 140px;
      border-radius: 14px;
      background: white;
      width: 100%;
      padding: 15px 0;
      // height: 200px;

      .manage-func {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-around;
        margin: 15px;
        .func-item {
          height: 40px;
          width: 40px;
          padding: 10px;
          border-radius: 50%;
          background: $dark-color;
          text-align: center;
          .func-icon {
            font-size: 23px;
          }
        }
      }
      .cells {
        margin: 15px;
        .cell-item {
          // background: yellow;
          display: flex;
          align-items: flex-start;
          font-size: 18px;
          padding: 15px 0 0 0;

          .cell-item-icon {
            margin-right: 15px;
            font-size: 27px;
          }
          .cell-item-content {
            width: 100%;
            .item-title {
              width: 100%;
              margin-bottom: 15px;
            }
            .bottom-line {
              height: 1px;
              background: $bright-color;
              width: 100%;
            }
          }
        }
      }
    }
  }
  .to-detail-icon {
    font-size: 12px;
    color: $bright-color;
  }
}
</style>
