<template>
  <view>
    <view class="b-container">
      <view class="bill-detail-bg">
        <view class="circle left-circle" />
        <view class="circle right-circle" />
        <view class="order-line"> </view>
        <view class="bill-detail-header">
          <image class="detail-image" :src="bill.categoryIcon" />
          <view class="detail-category">{{ bill.category }}</view>
          <view class="detail-desc">{{ bill.description }}</view>
        </view>
        <view class="bill-detail-content">
          <view :class="['detail-amount', amountClass]">
            <view style="font-size: 40rpx">￥</view>
            <view> {{ bill.amountFormat }}</view>
          </view>
          <view class="detail-asset">{{ bill.asset }}</view>
          <view class="detail-date">{{ bill.timeFormat }}</view>
          <view class="detail-address">{{ bill.address }}</view>
        </view>
        <mb-ba-end-split-line class="bottom-line" />
      </view>
      <view class="bottom-operate">
        <mb-ba-bottom-btn @ltap="handleEdit" @rtap="handleDel" />
      </view>
    </view>
  </view>
</template>

<script>
import { DEL_INDEX_BILL } from "@/store/type";

export default {
  data() {
    return {
      id: 0,
      amountClass: "expend-color",
      bill: {
        // id: 7,
        // type: 0,
        // category: "奶茶",
        // asset: "账户",
        // categoryIcon: "/static/assets/tea.png",
        amountFormat: "0.0",
        // description: "这是备注来着",
        // time: "2022/05/08 13:30",
        // timeFormat: "星期日 2022/05/08 13:30",
        // address:
        //   "广东省广州市白云区萧岗东约大街50号22222222222222222222222222222",
      },
    };
  },
  onLoad(option) {
    // console.log(option.id);
    this.id = option.id;
  },
  onShow() {
    this.getBillDetail();
  },
  methods: {
    // 获取账单详情
    getBillDetail() {
      this.$api
        .billDetail({
          id: this.id,
        })
        .then((res) => {
          if (res.data.code === 0) {
            let result = res.data.result;
            this.bill = result;
            this.amountClass =
              this.bill.type == 0 ? "expend-color" : "income-color";
          }
        })
        .catch((err) => {
          this.$tip.error("请求错误！");
        });
    },
    handleEdit() {
      // console.log("编辑");
      this.$Router.push({ name: "bill-edit", params: { id: this.bill.id } });
    },
    handleDel() {
      // console.log("删除");
      let pages = getCurrentPages(); //当前页
      let beforePage = pages[pages.length - 2];
      // console.log(beforePage);
      let that = this;
      this.$tip.choose("是否删除该条账单？", {}, "提示").then(async () => {
        that.$api.delBill(this.id).then((res) => {
          if (res.data.code === 0) {
            // 如果是首页，进行数据处理
            if (beforePage.route === "pages/index/index") {
              // console.log("处理数据");
              this.$store.commit(DEL_INDEX_BILL, this.id);
            }
            this.$Router.back();
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scope>
.bill-detail-bg {
  position: absolute;
  border-radius: 28rpx;
  top: 0;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 80%;
  padding: 20rpx 0;
  background-color: #ffffff;
  border-radius: 50rpx 50rpx 0 0;
  .circle {
    width: 30rpx;
    height: 30rpx;
    border-radius: 50%;
    background-color: $grey-bright-color;
    position: absolute;
    top: 340rpx;
    transform: translate(0, -50%);
  }
  .left-circle {
    left: -15rpx;
  }

  .right-circle {
    right: -15rpx;
  }
  .order-line {
    position: absolute;
    top: 340rpx;
    z-index: 99;
    width: 100%;
    height: 4rpx;
    background-image: linear-gradient(
      to right,
      $grey-bright-color 50%,
      $grey-bright-color 50%,
      transparent 0%
    );
    background-size: 28rpx 6rpx;
    background-repeat: repeat-x;
  }
  .bottom-line {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
  }
  .bill-detail-header {
    text-align: center;
    .detail-image {
      border-radius: 50%;
      height: 120rpx;
      width: 120rpx;
    }
    .detail-category {
      margin-top: 3%;
      font-size: 50rpx;
      font-weight: bold;
    }
    .detail-desc {
      margin-top: 3%;
      padding: 0 20rpx;
      color: $grey-text-color;
      font-size: 30rpx;
    }
  }
  .bill-detail-content {
    margin-top: 20%;
    margin-bottom: 20%;
    text-align: center;

    .detail-amount {
      display: flex;
      justify-content: center;
      align-items: baseline;
      font-size: 60rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    .detail-asset {
      color: $grey-text-color;
      font-size: 30rpx;
    }
    .detail-date {
      margin-top: 26rpx;
      color: $grey-text-color;
      font-size: 30rpx;
    }
    .detail-address {
      margin-top: 26rpx;
      color: $grey-text-color;
      font-size: 30rpx;
    }
  }
}
.bottom-operate {
  width: 100%;
  position: absolute;
  bottom: 0;
  margin-bottom: 40rpx;
}
</style>
