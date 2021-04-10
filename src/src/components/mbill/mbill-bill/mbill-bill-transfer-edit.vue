<template>
  <view class="container">
    <view class="column money">
      <text>金额</text>
      <input
        :class="['money-input', transfer.type]"
        placeholder="0.00"
        :placeholder-class="transfer.type"
        v-model="transfer.amount"
      />
    </view>

    <view class="column transfer-type">
      <view class="assetSource" @tap="redirectChoseAssetSource">
        {{ transfer.assetName }}
      </view>
      <view
        @tap="exchangeAsset"
        class="iconfont icon-xingzhuang_1 transfer-icon"
      ></view>
      <view class="assetTarget" @tap="redirectChoseAssetTarget">
        {{ transfer.targetAssetName }}
      </view>
    </view>

    <view class="column">
      <text>日期</text>
      <view class="quick-use">
        <text class="label" @tap="quickSetDate('-2')">前天</text>
        <text class="label" @tap="quickSetDate('-1')">昨天</text>
        <text class="label" @tap="quickSetDate('0')">今天</text>
      </view>
      <picker mode="date" start="2017-01-01" @change="dateChange">
        <text>{{ transfer.year }}-{{ transfer.month }}-{{ transfer.day }}</text>
      </picker>
    </view>

    <view class="column">
      <text>备注</text>
      <input
        class="pull-right remark"
        type="text"
        v-model="transfer.description"
        placeholder="本笔账单的简单说明"
      />
    </view>

    <view class="btn-save">
      <button v-if="!submiting" @tap="submitStatement">保存</button>
      <button v-else>保存中...</button>
    </view>
  </view>
</template>

<script>
import { BASE_URL } from '@/env'
import Util from "@/common/utils/util";
import { mapMutations, mapActions, mapState } from "vuex";
export default {
  name: "transferEdit",
  props: {
    detail: {
      type: Object,
      default() {
        return {
          id: 0,
          type: "transfer",
          amount: "",
          description: "",
          assetId: 0,
          targetAssetId: 0,
          assetName: "选择账户",
          targetAssetName: "选择账户",
          year: Util.getCurrentYear(),
          month: Util.getCurrentMonth(),
          day: Util.getCurrentDay(),
          time: "",
        };
      },
    },
  },
  data() {
    return {
      AssignmentType: 1,
      transfer: {},
    };
  },
  created() {
    this.transfer = this.detail;
  },
  computed: {
    ...mapState({
      submiting: (state) => state.statement.submiting,
    }),
  },
  methods: {
    // 赋值还款账户
    redirectChoseAssetSource() {
      this.AssignmentType = 1;
      this.$Router.push({
        path: "/pages/bill/chose-asset",
        query: {
          type: this.detail.type,
        },
      });
    },
    // 赋值负债账户
    redirectChoseAssetTarget() {
      this.AssignmentType = 2;
      this.$Router.push({
        path: "/pages/bill/chose-asset",
        query: {
          type: this.detail.type,
        },
      });
    },
    // 选择账户后回调
    setAsset(asset) {
      if (this.AssignmentType === 1) {
        this.transfer.assetName = asset.name;
        this.transfer.assetId = asset.id;
      } else {
        this.transfer.targetAssetName = asset.name;
        this.transfer.targetAssetId = asset.id;
      }
    },
    // 对调账户
    exchangeAsset() {
      const tmp1 = this.transfer.assetName;
      this.transfer.assetName = this.transfer.targetAssetName;
      this.transfer.targetAssetName = tmp1;

      const tmp2 = this.transfer.assetId;
      this.transfer.assetId = this.transfer.targetAssetId;
      this.transfer.targetAssetId = tmp2;
    },
    // 时间改变
    dateChange({ detail }) {
      let date = new Date(detail.value);
      this.transfer.year = Util.getCurrentYear(date);
      this.transfer.month = Util.getCurrentMonth(date);
      this.transfer.day = Util.getCurrentDay(date);
    },
    // 快速选取时间
    quickSetDate(between) {
      let today = new Date();
      let date = today;
      if (between === "-1") {
        date = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      } else if (between === "-2") {
        date = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
      }
      this.transfer.year = Util.getCurrentYear(date);
      this.transfer.month = Util.getCurrentMonth(date);
      this.transfer.day = Util.getCurrentDay(date);
    },
    submitStatement() {
      let transfer = this.transfer;
      // console.log(transfer);
      if (transfer.amount === 0 || transfer.amount === "" || isNaN(transfer.amount)) {
        this.$tip.toast("金额不能为零");
        return false;
      }
      if (transfer.assetId === 0) {
        this.$tip.toast("未选择还款账户");
        return false;
      } else if (transfer.targetAssetId === 0) {
        this.$tip.toast("未选择负债账户");
        return false;
      } else if (transfer.assetId === transfer.targetAssetId) {
        this.$tip.toast("还款账户与负债账户不能相同");
        return false;
      }
      if(this.transfer.id === 0){
        transfer.time = Util.getCurrentTime();
      }
      this.$emit("submitStatement", transfer);
    },
  },
};
</script>

<style lang="scss">
.container {
  > .money {
    height: 100rpx !important;
    line-height: 100rpx !important;
  }
  > .column {
    height: 100rpx;
    line-height: 100rpx;
    padding: 0 24rpx;
    border-bottom: 1px solid #efefef;
    font-size: 28rpx;
    background: white;
    display: flex;
    justify-content: space-between;
    > text {
      min-width: 100rpx;
      &:last-child {
        color: $secondaryText;
      }
    }
    .remark {
      height: 120rpx !important;
      line-height: 120rpx !important;
      text-align: right;
    }
    .quick-use {
      text-align: right;
      font-size: 24rpx;
      > text:first-child {
        color: $secondaryText;
      }
      .label {
        background: #efefef;
        color: $secondaryText;
        padding: 8rpx 16rpx;
        margin-right: 8rpx;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .money-input {
    height: 100rpx;
    font-size: 48rpx;
    text-align: right;
  }
  .transfer-type {
    display: flex;
    align-items: center;
    .assetSource {
      width: 40%;
    }
    .assetTarget {
      text-align: right;
      width: 40%;
    }
    .transfer-icon {
      color: $primaryColor;
    }
  }
  .btn-save {
    margin: 12px;
    button {
      color: white;
      background-color: $primaryColor;
    }
  }
}
</style>
