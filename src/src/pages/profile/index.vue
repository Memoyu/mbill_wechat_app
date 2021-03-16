<template>
  <view class="container">
    <!--用户信息-->
    <core-user-info :userInfo="userInfo"/>
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
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
  data() {
    return {
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
  computed: {
		...mapState({
      userInfo: state => state.user.userInfo,
    })
  },
  methods: {
   
  },
};
</script>

<style lang="scss">
page {
  background: #f4f4f4;
  overflow-y:hidden;
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
