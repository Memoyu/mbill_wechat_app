<template>
  <view>
    <view class="container">
      <view class="bg" />
      <!-- <view class="profile-header">
        <i class="iconfont icon-list header-item" />
        <i class="iconfont icon-list header-item" />
      </view> -->
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
        <view class="le le-shadow le-3" />
        <view class="le le-shadow le-2" />
        <view class="le le-shadow le-1 x-c">
          <view class="preview-stats x-bc">
            <view
              class="stats-item"
              v-for="(item, index) in preStats"
              :key="index"
            >
              <view class="stats-amount">{{ item.amount }}</view>
              <view class="stats-title">{{ item.title }}</view>
            </view>
          </view>
        </view>
        <view class="le profile-setting">
          <view class="grid-func func">
            <view class="grids">
              <view
                class="grid-item x-c"
                @tap="handlerNavigateTo(item.path)"
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
          <view class="cells-func func">
            <view class="cells">
              <view
                class="cell-item"
                @tap="handlerNavigateTo(item.path)"
                v-for="(item, index) in cells"
                :key="index"
              >
                <i
                  :class="['iconfont', 'icon-' + item.icon, 'cell-item-icon']"
                />
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
  </view>
</template>

<script>
import { tabbar } from "@/mixins";

export default {
  mixins: [tabbar], //混入文件
  data() {
    return {
      user: {
        avatar: "/static/assets/avatar.png",
        name: "Memoyu",
        days: 360,
      },
      preStats: [
        {
          amount: "1345.00",
          title: "存入金额/元",
        },
        {
          amount: "1002.00",
          title: "预购金额/元",
        },
        {
          amount: "13245.00",
          title: "支出金额/元",
        },
      ],
      grids: [
        {
          title: "搜索",
          icon: "search",
          path: "/pages/bill/search",
        },
        {
          title: "汇总",
          icon: "summary",
          path: "/pages/bill/summary",
        },
        {
          title: "统计",
          icon: "stats",
          path: "/pages/bill/stats/index",
        },
        {
          title: "预购",
          icon: "preorder",
          path: "/pages/bill/preorder/index",
        },
      ],
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
    }
    .le-shadow {
      box-shadow: 0 0 15px #888888b6;
    }
    .le-1 {
      top: 30px;
      width: 90%;
      background: $dark-color;
      .preview-stats {
        width: 100%;
        margin: 20px;
        .stats-item {
          text-align: center;
          .stats-amount {
            color: white;
            font-size: 18px;
            font-weight: bold;
          }
          .stats-title {
            color: $grey-text-color;
            font-size: 12px;
          }
        }
      }
    }
    .le-2 {
      top: 15px;
      width: 85%;
      background: $primary-color;
    }
    .le-3 {
      width: 80%;
      background: $bright-color;
    }

    .profile-setting {
      position: absolute;
      top: 140px;
      width: 95%;
      .func {
        padding: 7px 0;
        border-radius: 14px;
        background: white;
        margin-bottom: 15px;
      }
      .grid-func {
        .grids {
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: space-around;
          margin: 10px;
          .grid-item {
            height: 60px;
            width: 60px;
            // border-radius: 50%;
            align-items: center;
            // background: $grey-bright-color;
            text-align: center;
            font-size: 14px;
            .func-icon {
              color: $primary-color;
              font-size: 25px;
            }
          }
        }
      }
      .cells-func {
        .cells {
          margin: 0 15px;
          .cell-item {
            display: flex;
            align-items: flex-start;
            font-size: 16px;
            padding: 15px 0 0 0;

            .cell-item-icon {
              margin-right: 15px;
              font-size: 25px;
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
  }
  .to-detail-icon {
    font-size: 12px;
    color: $bright-color;
  }
}
</style>
