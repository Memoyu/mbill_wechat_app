<template>
  <view class="bill-detail-container">
    <view class="b-detail-container">
      <view class="b-detail-container-content y-f">
        <view class="b-detail-container-content-header">
          <image class="detail-image" :src="bill.categoryIcon" />
          <view class="detail-category">{{ bill.category }}</view>
          <view class="detail-desc">{{ bill.description }}</view>
        </view>
        <view class="b-detail-container-content-order-line x-f">
          <view class="circle left-circle" />
          <view class="order-line"> </view>
          <view class="circle right-circle" />
        </view>
        <view class="b-detail-container-content-info">
          <view :class="['detail-amount', amountClass]">
            <view class="detail-amount-type">{{
              bill.type == 0 ? "-" : "+"
            }}</view>
            <view class="detail-amount-text">
              <view> {{ bill.amountFormat }}</view>
              <view class="detail-amount-text-char">￥</view>
            </view>
          </view>
          <view class="detail-asset">{{ bill.asset }}</view>
          <view class="detail-date">{{ bill.timeFormat }}</view>
          <view class="detail-address">{{ bill.address }}</view>
        </view>
        <mb-ba-end-split-line />
      </view>
      <view class="b-detail-copy" @click="onCopyAndToEdit">再记一笔</view>
      <view class="bottom-operate">
        <mb-ba-bottom-btn @click="onBtnClick" @rtap="onDel" />
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

    //编辑账单
    onBtnClick(e) {
      // console.log("编辑");
      if (e.isLeft) {
        this.$Router.push({ name: "bill-edit", params: { id: this.bill.id } });
      } else {
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
      }
    },

    // 再来一笔账单
    onCopyAndToEdit() {
      this.$Router.push({
        name: "bill-edit",
        params: { copyId: this.bill.id },
      });
    },
  },
};
</script>

<style lang="scss" scope>
.bill-detail-container {
  display: flex;
  align-items: center;
  height: 90%;
  .b-detail-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .b-detail-container-content {
      justify-content: center;
      width: 80%;
      background-color: #ffffff;
      border-radius: 50rpx 50rpx 0 0;
      &-header {
        margin-top: 70rpx;
        margin-bottom: 30rpx;
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

      &-order-line {
        width: 100%;
        .circle {
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          background-color: $grey-bright-color;
        }
        .left-circle {
          margin-left: -15rpx;
        }

        .right-circle {
          margin-right: -15rpx;
        }
        .order-line {
          width: 100%;
          z-index: 99;
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
      }
      &-info {
        margin-top: 30rpx;
        margin-bottom: 150rpx;
        text-align: center;

        .detail-amount {
          display: flex;
          justify-content: center;
          font-size: 60rpx;
          &-type {
            font-weight: bold;
            margin-right: 5rpx;
          }
          &-text {
            display: flex;
            align-items: baseline;
            font-weight: bold;
            margin-bottom: 10rpx;
            &-char {
              font-size: 40rpx;
            }
          }
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
      &-bottom-line {
        width: 100%;
        margin-top: -15px;
      }
    }

    .b-detail-copy {
      font-weight: bold;
      margin-top: 40rpx;
      color: $primary-color;
      border-bottom: 2rpx solid $primary-color;
      padding-bottom: 3rpx;
    }
  }
  .bottom-operate {
    width: 100%;
    position: absolute;
    bottom: 0;
    margin-bottom: 40rpx;
  }
}
</style>
