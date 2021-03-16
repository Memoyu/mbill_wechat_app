<template>
  <view>
    <view class="empty"></view>
    <view class="container">
      <view class="title">
        <view>
          <image class="icon" :src="statement.categoryIconPath"></image>
          <text
            v-if="statement.type === 'expend' || statement.type === 'income'"
            >{{ statement.categoryName }}</text
          >
          <text v-else>{{ statement.typeName }}</text>
        </view>
        <text :class="statement.type"
          >{{ statement.type == "expend" ? "-" : "+" }} {{ statement.amount }}</text
        >
      </view>

      <view class="column">
        <view>
          <view class="iconfont jz-icon-fenlei"></view>
          <text>分类</text>
        </view>
        <text v-if="statement.type === 'expend' || statement.type === 'income'"
          >{{ statement.categoryParentName }}/{{ statement.categoryName }}</text
        >
        <text v-else
          >[{{ statement.typeName }}]{{ statement.assetName }}/{{
            statement.targetAssetName
          }}</text
        >
      </view>

      <view class="column">
        <view>
          <view class="iconfont jz-icon-qianbao"></view>
          <text>账户</text>
        </view>
        <text>{{ statement.assetParentName }}/{{ statement.assetName }}</text>
      </view>

      <view class="column">
        <view>
          <view class="iconfont jz-icon-50"></view>
          <text>使用后账户余额</text>
        </view>
        <text>{{ statement.assetResidue }}</text>
      </view>

      <view class="column">
        <view>
          <view class="iconfont jz-icon-shijian"></view>
          <text>时间</text>
        </view>
        <text
          >{{ statement.year }}-{{ statement.month }}-{{ statement.day }}
          {{ statement.time }}</text
        >
      </view>

      <view
        class="column"
        v-if=" statement.address != null && statement.address != '' "
      >
        <view>
          <view class="iconfont jz-icon-address"></view>
          <text>坐标</text>
        </view>
        <text>{{ statement.address }}</text>
      </view>

      <view
        class="column"
        v-if="statement.description != null && statement.description != ''"
      >
        <view>
          <view class="iconfont jz-icon-remark"></view>
          <text>描述</text>
        </view>
        <text>{{ statement.description }}</text>
      </view>
    </view>
    <view class="button-groups">
      <view class="delete-button" @click="handlerDel">
        <view class="iconfont icon-delete-note"></view>
        <text>删除</text>
      </view>
      <view class="edit-button" @click="handlerEdit">
        <view class="iconfont icon-edit-note"></view>
        <text>编辑</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statement: {
        // id: 1,
        // categoryIconPath: 'http://localhost:5000/core/images/category/icon_mushroom_64.png',
        // categoryName: '数码',
        // categoryParentName: "休闲娱乐",
        // assetName: '微信',
        // assetParentName: '虚拟账户',
        // targetAssetName: '信用卡',
        // description: '买电脑',
        // year: '2020',
        // month: '11',
        // day: '01',
        // time: '01:26:30',
        // residue: -400,
        // type: 'expend',
        // address: '广东广州白云区',
        // amount: 300

        id: 1,
        categoryIconPath:
          "http://localhost:5000/core/images/category/icon_mushroom_64.png",
        categoryName: "还款",
        categoryParentName: "",
        assetName: "微信",
        assetParentName: "虚拟账户",
        targetAssetName: "信用卡",
        description: "还款信用卡",
        year: "2020",
        month: "11",
        day: "01",
        time: "01:26:30",
        assetResidue: -400,
        typeName: "还款",
        type: "repayment",
        address: "",
        amount: 300,
      },
    };
  },
};
</script>

<style lang="scss">
.empty {
  height: 200rpx;
}
.container {
  padding: 24rpx;
  background: #fff;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2rpx dashed #999;
    padding: 0 0 20rpx 0;
    font-weight: bold;

    > view {
      display: flex;
      align-items: center;
    }
    .icon {
      margin-right: 10px;
      width: 60rpx;
      height: 60rpx;
    }
  }

  .column {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 30rpx 0;
    color: #999;
    border-bottom: 2rpx dashed #999;
    font-size: 14px;
    > view {
      display: flex;
      flex: 2;
      align-items: center;
      text {
        margin-left: 8rpx;
        margin-bottom: 20rpx;
      }
    }
    > text {
      flex: 3;
      text-align: right;
      margin-bottom: 20rpx;
    }
    .icon {
      width: 30rpx;
      height: 30rpx;
      margin-right: 10px;
    }
  }
}

.button-groups {
  position: absolute;
  bottom: 0;
  left: 0;
  background: #f4f4f4;
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  display: flex;
  > view {
    flex: 1;
    font-size: 28rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .delete-button {
    border-right: 2px solid #f8f8f8;
  }
  .icon {
    width: 35rpx;
    height: 35rpx;
    margin-right: 8rpx;
  }
}
</style>
