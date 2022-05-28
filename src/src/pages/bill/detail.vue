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
            <view style="font-size: 20px">￥</view>
            <view> {{ bill.amountFormat }}</view>
          </view>
          <view class="detail-asset">{{ bill.asset }}</view>
          <view class="detail-date">{{ bill.timeFormat }}</view>
          <view class="detail-address">{{ bill.address }}</view>
        </view>
        <mb-b-end-split-line class="bottom-line" />
      </view>
      <view class="bottom-operate">
        <mb-b-bottom-btn @ltap="handlerEdit" @rtap="handlerDel" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: 0,
      amountClass: "expend-color",
      bill: {
        // id: 7,
        // type: 0,
        // category: "奶茶",
        // asset: "微信支付",
        // categoryIcon: "/static/assets/tea.png",
        // amountFormat: 33.2,
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
    this.getBillDetail(this.id);
  },
  methods: {
    // 获取账单详情
    getBillDetail(id) {
      this.$api
        .billDetail({
          id: id,
        })
        .then((res) => {
          if (res.data.code === 0) {
            let result = res.data.result;
            this.bill = result;
            this.amountClass =
              this.bill.type == 0 ? "expend-color" : "income-color";
          }
        });
    },
    handlerEdit() {
      // console.log("编辑");
      this.$Router.push({ name: "bill-edit", params: { id: this.bill.id } });
    },
    handlerDel() {
      console.log("删除");
    },
  },
};
</script>

<style lang="scss" scope>
.bill-detail-bg {
  position: absolute;
  border-radius: 14px;
  top: 0;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 80%;
  // height: 200px;
  padding: 10px 0;
  background-color: #ffffff;
  border-radius: 25px 25px 0 0;
  .circle {
    width: 30rpx;
    height: 30rpx;
    border-radius: 50%;
    background-color: $grey-bright-color;
    position: absolute;
    top: 170px;
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
    top: 170px;
    z-index: 99;
    width: 100%;
    height: 2px;
    background-image: linear-gradient(
      to right,
      $grey-bright-color 50%,
      $grey-bright-color 50%,
      transparent 0%
    );
    background-size: 14px 3px;
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
      height: 60px;
      width: 60px;
    }
    .detail-category {
      margin-top: 3%;
      font-size: 25px;
      font-weight: bold;
    }
    .detail-desc {
      margin-top: 3%;
      color: $grey-text-color;
      font-size: 15px;
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
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .detail-asset {
      color: $grey-text-color;
      font-size: 15px;
    }
    .detail-date {
      margin-top: 13px;
      color: $grey-text-color;
      font-size: 15px;
    }
    .detail-address {
      margin-top: 13px;
      color: $grey-text-color;
      font-size: 15px;
    }
  }
}
.bottom-operate {
  width: 100%;
  position: absolute;
  bottom: 0;
  margin-bottom: 20px;
}
</style>
