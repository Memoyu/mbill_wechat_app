<template>
  <view
    :class="['mbill-po-item', order.status == 0 ? '' : 'mbill-po-item-line']"
    @tap="handlerToDetail(order)"
  >
    <view :class="['order-icon', 'x-c']" :style="{ background: order.color }">
      <view class="icon-text"
        ><text>{{ order.description[0] }}</text></view
      >
    </view>
    <view class="order-content">
      <view class="content-title y-start">
        <text class="note">{{ order.description }}</text>
        <text class="time">{{ order.time }}</text>
      </view>
      <view class="content-amount">
        <text :class="[order.status == 0 ? 'income-color' : 'expend-color']">
          {{ order.amount }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-po-item",
  props: {
    order: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  methods: {
    handlerToDetail() {
      this.$emit("select", this.order);
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-po-item {
  // background: beige;
  display: flex;
  border-radius: 10px;
  padding: 10px 18px;

  .order-icon {
    margin-right: 10px;
    border-radius: 50%;
    .icon-text {
      color: #fff;
      text-align: center;
      font-size: 20px;
      line-height: 45px;
      width: 45px;
    }
  }
  .order-content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    .content-title {
      color: $grey-text-color;
      font-size: 13px;
      .time {
        margin-right: 5px;
      }
      .note {
        font-size: 16px;
      }
    }
    .content-amount {
      font-weight: bold;
    }
  }
}
.mbill-po-item-line {
  &:before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    border: 17px solid $expend-color;
    border-radius: 0 0 10px;
    border-top-color: transparent;
    border-left-color: transparent;
  }
}
</style>
