<template>
  <view class="profile-container">
    <view class="bg" />
    <!-- <view class="profile-header">
      <i class="iconfont .icon-weather-thunderstorm-sun header-item" />
      <text>广东-广州</text>
    </view> -->
    <!-- 用户信息 -->
    <view
      class="profile-info"
      @click="
        onNavigateTo({
          path: isLogin ? '/pages/profile/user-detail' : '/pages/profile/login',
          needLogin: false,
        })
      "
    >
      <view class="avatar-image">
        <image class="image" mode="widthFix" :src="user.avatarUrl" />
      </view>
      <view class="user-info">
        <text class="user-name">{{ user.nickname }}</text>
        <text class="user-days" v-if="user.days > 0"
          >已经记账{{ user.days }}天</text
        >
      </view>
      <i class="iconfont icon-to to-detail-icon" />
    </view>
    <!-- 统计信息 -->
    <view class="profile-asset">
      <view class="profile-asset-content">
        <view class="le le-shadow le-3" />
        <view class="le le-shadow le-2" />
        <view class="le le-shadow le-1">
          <view class="preview-stats x-bc">
            <view class="stats-item" v-for="(item, index) in rows" :key="index">
              <view class="stats-amount">{{ profileStat[item.index] }}</view>
              <view class="stats-title">{{ item.title }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 功能网格 -->
    <view class="profile-setting">
      <view class="grid-func func">
        <view class="grids">
          <view
            class="grid-item x-c"
            @click="onNavigateTo(item)"
            v-for="(item, index) in grids"
            :key="index"
          >
            <view class="y-b">
              <i :class="['iconfont', 'icon-' + item.icon, 'func-icon']" />
              <view>{{ item.title }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 设置列表 -->
      <view class="cells-func func">
        <view class="cells">
          <!-- 设置共功能 -->
          <view
            class="cell-item"
            @click="onNavigateTo(item)"
            v-for="(item, index) in cells"
            :key="index"
          >
            <i :class="['iconfont', 'icon-' + item.icon, 'cell-item-icon']" />
            <view class="cell-item-content">
              <view class="item-title x-bc">
                <text>{{ item.title }}</text>
                <i class="iconfont icon-to to-detail-icon" />
              </view>
              <view class="bottom-line" />
            </view>
          </view>

          <!-- 联系开发者 -->
          <button open-type="contact">
            <view class="cell-item">
              <i class="iconfont icon-shoucang cell-item-icon" />
              <view class="cell-item-content">
                <view class="item-title x-bc">
                  <text>联系开发者</text>
                  <i class="iconfont icon-to to-detail-icon" />
                </view>
              </view>
            </view>
          </button>
        </view>
      </view>
    </view>
    <view class="app-version">v2.1.4</view>
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { tabbar } from "@/mixins";

export default {
  mixins: [tabbar], //混入文件
  data() {
    return {
      defaultAvatar: "/static/assets/avatar.png",
      rows: [
        {
          index: "income",
          title: "收入金额/元",
        },
        {
          index: "expend",
          title: "支出金额/元",
        },
        {
          index: "surplus",
          title: "结余金额/元",
        },
      ],
      grids: [
        {
          title: "搜索",
          icon: "search",
          path: "/pages/bill/search",
          needLogin: true,
        },
        {
          title: "汇总",
          icon: "summary",
          path: "/pages/bill/summary",
          needLogin: true,
        },
        {
          title: "统计",
          icon: "stats",
          path: "/pages/bill/stats/index",
          needLogin: true,
        },
        {
          title: "预购",
          icon: "preorder",
          path: "/pages/bill/pre-order/index",
          needLogin: true,
        },
      ],
      cells: [
        {
          id: 1,
          title: "账户管理",
          icon: "qianbao",
          path: "/pages/bill/asset/manage",
          needLogin: true,
        },
        {
          id: 2,
          title: "分类管理",
          icon: "biaoqian",
          path: "/pages/bill/category/manage",
          needLogin: true,
        },
        {
          id: 3,
          title: "系统设置",
          icon: "shezhi",
          path: "/pages/profile/setting",
          needLogin: false,
        },
        // {
        //   id: 4,
        //   title: "联系客服",
        //   icon: "shoucang",
        //   path: "/pages/profile/setting",
        //   needLogin: false,
        // },
      ],
    };
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.account.isLogin,
      user: (state) => state.account.user,
      profileStat: (state) => state.bill.profileStat,
    }),
    ...mapGetters(["isLogin"]),
  },
  onShow() {
    this.setTabBarIndex(1);
  },
  onLoad() {
    this.getProfileTotalStat();
  },
  methods: {
    ...mapActions(["getProfileTotalStat"]),
    onNavigateTo(item) {
      // console.log("yonghu ", this.user);
      // console.log(path);
      if (item.needLogin && !this.isLogin) {
        this.$tip.toast("暂未登录，请先登录！");
        return;
      }
      if (item.id === 4) {
        this.gotoCustomerService();
      }

      uni.navigateTo({ url: item.path });
    },
    gotoCustomerService() {},
  },
};
</script>

<style lang="scss" scope>
.profile-container {
  padding-bottom: 140rpx;
}
.bg {
  z-index: -1;
  position: absolute;
  top: 0;
  background-color: $light-color;
  width: 100%;
  height: 30%;
  border-radius: 0 0 30rpx 30rpx;
}
.profile-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  .header-item {
    margin-right: 20rpx;
    font-size: 50rpx;
  }
  margin: 0 30rpx;
}
.profile-info {
  margin: 0 40rpx;
  display: flex;
  align-items: center;

  .avatar-image {
    margin-right: 40rpx;
    .image {
      background: white;
      border-radius: 50%;
      width: 160rpx;
      height: 160rpx;
    }
  }
  .user-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    .user-name {
      font-size: 46rpx;
      font-weight: 900;
      color: $grey-black-text-color;
    }
    .user-days {
      font-size: 28rpx;
      color: $bright-color;
    }
  }
}

.profile-asset {
  z-index: -1;
  position: relative;
  margin-top: 60rpx;
  .profile-asset-content {
    height: 270rpx;
    .le {
      position: absolute;
      border-radius: 28rpx;
      height: 280rpx;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .le-shadow {
      box-shadow: 0 0 30rpx #888888b6;
    }
    .le-1 {
      top: 60rpx;
      width: 90%;
      background: $dark-color;
      .preview-stats {
        margin: 70rpx 40rpx;
        .stats-item {
          text-align: center;
          .stats-amount {
            color: white;
            font-size: 35rpx;
            font-weight: bold;
          }
          .stats-title {
            color: $grey-text-color;
            font-size: 24rpx;
          }
        }
      }
    }
    .le-2 {
      top: 30rpx;
      width: 85%;
      background: $primary-color;
      .preview-stats-refresh {
        margin-top: -12rpx;
        color: white;
        .icon {
          font-size: 40rpx;
          width: 60rpx;
          text-align: center;
        }
      }
    }
    .le-3 {
      width: 80%;
      background: $bright-color;
    }
  }
}
.profile-setting {
  margin: 0 20rpx;

  .func {
    padding: 14rpx 0;
    border-radius: 28rpx;
    background: white;
    margin-bottom: 30rpx;
  }
  .grid-func {
    .grids {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: space-around;
      margin: 20rpx;
      .grid-item {
        height: 120rpx;
        width: 120rpx;
        // border-radius: 50%;
        align-items: center;
        // background: $grey-bright-color;
        text-align: center;
        font-size: 28rpx;
        .func-icon {
          color: $primary-color;
          font-size: 50rpx;
        }
      }
    }
  }
  .cells-func {
    .cells {
      margin: 0 30rpx;
      .cell-item {
        display: flex;
        align-items: center;
        font-size: 32rpx;

        .cell-item-icon {
          margin-right: 30rpx;
          font-size: 50rpx;
        }
        .cell-item-content {
          width: 100%;
          .item-title {
            width: 100%;
            margin: 32rpx 0;
          }
          .bottom-line {
            height: 2rpx;
            background: $bright-color;
            width: 100%;
          }
        }
      }
      button {
        background-color: transparent;
        line-height: unset;
        font-size: 32rpx;
        padding: 0 !important;
        &::after {
          border: none;
        }
      }
    }
  }
}
.app-version {
  color: $dark-color;
  font-size: 30rpx;
  font-weight: bold;
  text-align: center;
  // margin-bottom: 80rpx;
}
.to-detail-icon {
  font-size: 24rpx;
  color: $bright-color;
}
</style>
