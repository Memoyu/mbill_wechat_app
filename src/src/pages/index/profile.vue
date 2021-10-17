<template>
  <view class="container">
    <!--用户信息-->
    <core-user-info :userInfo="userInfo" />
    <!-- 主要功能 -->
    <view class="func-btn">
      <view @tap="jump('/pages/profile/statement-search')">
        <i class="iconfont icon-bill-search icon-style"></i>
        <view>搜索</view>
      </view>
      <view @tap="jump('/pages/profile/advance-list')">
        <i class="iconfont icon-tolist icon-style"></i>
        <view>预购清单</view>
      </view>
    </view>
    <view class="bottom-container">
      <!-- 功能列表 -->
      <uni-list :border="false" >
        <uni-list-item
          v-for="(item, index) in funList"
          :key="index"
          :show-extra-icon="true"
          showArrow
          :rightText="item.rightText"
          :extra-icon="item.extraIcon"
          :title="item.title"
          clickable
          @click="jump(item.path)"
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
import { mapState } from "vuex";
import Tip from "@/common/utils/tip";

export default {
  data() {
    return {
      funList: [
        {
          title: "预算管理",
          path: "/pages/profile/budget-manage",
          extraIcon: {
            color: "#757575",
            size: "22",
            type: "shop",
          },
        },
        {
          title: "资产管理",
          path: "/pages/profile/asset-manage",
          extraIcon: {
            color: "#757575",
            size: "22",
            type: "circle",
          },
        },
        {
          title: "分类管理",
          path: "/pages/profile/category-manage",
          extraIcon: {
            color: "#757575",
            size: "22",
            type: "list",
          },
        },
        {
          title: "系统设置",
          path: "/pages/profile/setting",
          extraIcon: {
            color: "#757575",
            size: "22",
            type: "gear",
          },
        },
      ],
    };
  },
  onLoad() {},
  computed: {
    ...mapState({
      showLoginTip: (state) => state.user.showLoginTip,
      userInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    //跳转页面
    jump(path) {
      console.log(this.$Router);
      let routes = this.$Router.options.routes;
      let isAuth = false;
      routes.map((r) => {
        if (r.path === path && r.meta.auth !== undefined) {
          isAuth = r.meta.auth;
          return;
        }
      });
      if (!isAuth || (isAuth && !this.showLoginTip)) {
        this.$Router.push({ path: path });
      } else if (isAuth && this.showLoginTip) {
        Tip.toast("登录后才能使用哦！");
      }
    },
  },
};
</script>

<style lang="scss">
page {
  background: #f4f4f4;
  overflow-y: hidden;
}
.func-btn {
  margin-top: -100rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
  height: 80px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-items: center;
  background: white;
  position: relative;
  > view {
    flex: 1;
    text-align: center;
    image {
      width: 35px;
      height: 35px;
    }
  }
  .icon-style{
    font-size: 60rpx;
    color: $primaryColor;
  }
}

.bottom-container {
  // background: white;
  padding: 0 10px;
  margin: 10px 0px;
 // border-radius: 10px;
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
