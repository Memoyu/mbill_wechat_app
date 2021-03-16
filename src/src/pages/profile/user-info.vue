<template>
  <view class="container">
    <view class="user-list x-bc">
      <text class="list-name">头像</text>
      <view class="x-f" @tap="onChooseImg">
        <image class="avatar" :src="userInfo.avatarUrl" mode=""></image>
        <text class="cuIcon-right"></text>
      </view>
    </view>
    <view class="user-list x-bc">
      <text class="list-name">用户名</text>
      <view class="x-f">
        <input class="list-val" v-model="userInfo.username" />
        <text class="cuIcon-right"></text>
      </view>
    </view>
    <view class="user-list x-bc">
      <text class="list-name">昵称</text>
      <view class="x-f">
        <input class="list-val" v-model="userInfo.nickname" />
        <text class="cuIcon-right"></text>
      </view>
    </view>
    <picker
      style="width: 750rpx"
      mode="date"
      :value="userInfo.birthday"
      :start="startDate"
      :end="endDate"
      @change="onDateChange"
    >
      <view class="user-list x-bc">
        <text class="list-name">生日</text>
        <view class="x-f">
          <text class="list-val">{{ userInfo.birthday || "请选择生日~" }}</text>
          <text class="cuIcon-right"></text>
        </view>
      </view>
    </picker>
    <view class="user-list x-bc" @tap="jump('/pages/user/edit-phone')">
      <text class="list-name">修改手机号</text>
      <view class="x-f">
        <text class="list-val">{{ userInfo.phone }}</text>
        <text class="cuIcon-right"></text>
      </view>
    </view>
    <view class="btn-box flex align-center justify-center"
      ><button class="cu-btn confirem-btn" @tap="editUserInfo">
        保存
      </button></view
    >
  </view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
  data() {
    return {
      // userInfo: {
      //   avatarUrl: "../../static/assets/icons/profile/default_avatar.png",
      //   username: "蒙明宇",
      //   nickname: "memoyu",
      //   birthday: "1996-10-15",
      //   phone: "18878613483",
      // },
    };
  },
  computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		}),
  },
  methods: {
    jump(page) {
      uni.navigateTo({
        url: page
      });
    },
  },
};
</script>

<style lang="scss">
.user-list {
  background: #fff;
  height: 100rpx;
  border-bottom: 1rpx solid #f6f6f6;
  padding: 0 20rpx;

  .list-name {
    font-size: 28rpx;
  }

  .avatar {
    width: 67rpx;
    height: 67rpx;
    border-radius: 50%;
    // background: #ccc;
  }

  .cuIcon-right {
    margin-left: 25rpx;
  }

  .list-val {
    color: #999;
    font-size: 28rpxc;
    text-align: right;
  }
}

.btn-box {
  margin-top: 60rpx;

  .confirem-btn {
    width: 710rpx;
    height: 80rpx;
    background: linear-gradient(
      90deg,
      $darkPrimaryColor,
      $primaryColor
    );
    border: 1rpx solid rgba(238, 238, 238, 1);
    border-radius: 40rpx;
    font-size: 30rpx;
    color: rgba(#fff, 0.9);
  }
}
</style>
