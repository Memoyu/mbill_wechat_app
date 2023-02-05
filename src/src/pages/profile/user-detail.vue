<template>
  <view class="b-container">
    <view class="bg" />
    <view class="user-info">
      <view class="user-avatar">
        <button
          class="user-avatar-button"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
        >
          <image
            class="user-avatar-image"
            mode="scaleToFill"
            :src="user.avatarUrl"
          />
        </button>
      </view>
      <view class="user-cells">
        <view class="cells">
          <view
            class="cell-item"
            v-for="(item, index) in cells"
            :key="index"
            @click="onItemClick(item)"
          >
            <view class="cell-item-content">
              <view class="item-content x-bc">
                <text class="item-content-title">{{ item.title }}</text>
                <view class="item-content-text">
                  <text class="text">{{ user[item.index] }}</text>
                  <i class="iconfont icon-to right-icon" />
                </view>
              </view>
              <view v-if="index + 1 < cells.length" class="bottom-line" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-operate" id="bottom-operate">
      <mb-ba-bottom-btn @click="onBtnClick" ltext="保存" rtext="退出登录" />
    </view>

    <!-- 弹窗 -->
    <mb-ba-edit-dialog
      ref="editUserDialog"
      height="120"
      class="edit-item-input"
      @click="onDialogBtnClick"
    >
      <view class="input-item x-bc">
        <text class="title">{{ selectedItem.title }}</text>
        <radio-group
          class="radio-group"
          @change="onGenderRadioChange"
          v-if="selectedItem.index == 'genderName'"
        >
          <label
            class="radio-group-item"
            v-for="(item, index) in items"
            :key="index"
          >
            <radio :value="item.name" :checked="item.name === dialogValue" />
            {{ item.name }}
          </label>
        </radio-group>
        <input
          type="text"
          class="input"
          :maxlength="selectedItem.maxLen"
          v-model="dialogValue"
          alwaysEmbed="true"
          :placeholder="'请输入' + selectedItem.title"
          v-else
        />
      </view>
    </mb-ba-edit-dialog>
  </view>
</template>

<script>
import { mapActions } from "vuex";
import generator from "@/common/utils/generator.js";

export default {
  data() {
    return {
      user: {
        avatarUrl: "/static/assets/avatar.png",
        email: "",
        gender: "未知",
        nickname: "未知",
        phone: "",
        username: "未知",
      },
      selectedItem: {},
      dialogValue: "",
      items: [
        {
          name: "男",
          checked: "true",
        },
        {
          name: "女",
        },
      ],
      cells: [
        {
          title: "昵称",
          index: "nickname",
          maxLen: 10,
        },
        {
          title: "性别",
          index: "genderName",
        },
        {
          title: "手机号",
          index: "phone",
          maxLen: 11,
        },
        {
          title: "邮箱",
          index: "email",
          maxLen: 30,
        },
      ],
      dialodOptions: {
        onlyone: true,
        ltext: "确定",
      },
    };
  },
  computed: {
    cacheUser() {
      // console.log(this.$store);
      return this.$store.getters.user;
    },
  },
  onShow() {},
  onLoad() {
    this.getUserDetail();
  },
  methods: {
    ...mapActions(["UpdateUser", "Logout"]),

    // 获取用户详情
    getUserDetail() {
      this.$api
        .userDetail({
          id: this.cacheUser.id,
        })
        .then((res) => {
          //console.log("user detail", res);
          if (res.data.code === 0) {
            this.user = res.data.result;
            this.UpdateUser(this.user);
          } else {
            this.$tip.toast(res.data.message);
          }
        });
    },
    // 点击信息项
    onItemClick(e) {
      // console.log("点击item", e);
      this.selectedItem = e;
      this.dialogValue = this.user[e.index];
      this.$refs.editUserDialog.show(this.dialodOptions);
    },
    // 弹窗按钮点击
    onDialogBtnClick(e) {
      // console.log("onDialogBtnClick", this.dialogValue);
      if (this.dialogValue == null || this.dialogValue == "") {
        this.$tip.toast(`${this.selectedItem.title} 不能为空`);
        return;
      }
      this.user[this.selectedItem.index] = this.dialogValue;
      this.$refs.editUserDialog.hide();
    },
    onGenderRadioChange(e) {
      // console.log("onGenderRadioChange", e);
      this.dialogValue = e.detail.value;
    },
    // 获取头像
    onChooseAvatar(e) {
      this.$api
        .uploadImageToQiniu(
          "avatar/" + generator.generateUUID() + ".png",
          e.detail.avatarUrl
        )
        .then((res) => {
          this.user.avatarUrl = res;
        })
        .catch((err) => {
          this.$tip.toast(err);
        });
    },

    // 退出登录
    onBtnClick(e) {
      console.log("onBtnClick", e);
      if (e.isLeft) {
        // 保存

        this.$api
          .updateUser({
            id: this.user.id,
            avatarUrl: this.user.avatarUrl,
            nickname: this.user.nickname,
            gender:
              this.user.genderName == "未知"
                ? 0
                : this.user.genderName == "男"
                ? 1
                : 2,
            phone: this.user.phone,
            email: this.user.email,
          })
          .then((res) => {
            //console.log("updateUser", res);
            if (res.data.code === 0) {
              this.UpdateUser(this.user);
              this.$Router.back();
            } else {
              this.$tip.toast(res.data.message);
            }
          });
      } else {
        // 登出
        this.Logout();
      }
    },
  },
};
</script>

<style lang="scss" scope>
.bg {
  z-index: -1;
  position: absolute;
  top: 0;
  background-color: $light-color;
  width: 100%;
  height: 30%;
  border-radius: 0 0 30rpx 30rpx;
}
.user-info {
  width: 100%;
  .user-avatar {
    margin: 80rpx 0;
    &-button {
      width: 160rpx;
      height: 160rpx;
      padding: 0;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      &:after {
        border: none;
      }
    }
    &-image {
      background: white;
      border-radius: 50%;
      width: 160rpx;
      height: 160rpx;

      position: relative;
      &:before {
        content: "更换头像";
        position: absolute;
        right: 0;
        bottom: 0;
        width: 160rpx;
        height: 50rpx;
        padding-top: 5rpx;
        background: rgb(71, 162, 113, 0.6);
        font-size: 25rpx;
        color: #fff;
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }
    }
  }
  .user-cells {
    margin: 0 20rpx;
    padding: 14rpx 0;
    border-radius: 28rpx;
    background: white;
    .cells {
      margin: 0 30rpx;
      .cell-item {
        display: flex;
        align-items: flex-start;
        font-size: 32rpx;
        padding: 30rpx 0 0 0;

        .cell-item-content {
          width: 100%;
          .item-content {
            .item-content-title {
              font-weight: bold;
            }
            width: 100%;
            margin-bottom: 30rpx;
            .item-content-text {
              display: flex;
              align-items: center;
              .text {
                margin-right: 20rpx;
              }
              .right-icon {
                font-size: 24rpx;
                color: $bright-color;
              }
            }
          }
          .bottom-line {
            height: 2rpx;
            background: $bright-color;
            width: 100%;
          }
        }
      }
    }
  }
}
.bottom-operate {
  width: 100%;
  position: absolute;
  bottom: 0;
  margin-bottom: 40rpx;
}

.edit-item-input {
  .input-item {
    margin-top: 20rpx;
    .radio-group {
      display: flex;
      flex-direction: row;
      &-item {
        display: flex;
        flex-direction: row;
        margin-right: 30rpx;
      }
    }
    .title {
      width: 20%;
      color: $grey-text-color;
    }
    .input {
      width: 80%;
      text-align: right;
      padding: 10rpx;
      margin-bottom: 16rpx;
    }
  }
  .input-desc {
    margin-top: 36rpx;
  }
}
</style>
