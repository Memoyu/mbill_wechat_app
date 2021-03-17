<template>
  <view class="container">
    <view class="column money">
      <text>金额</text>
      <input
        :class="['money-input', repayment.type]"
        placeholder="0.00"
        :placeholder-class="repayment.type"
        type="digit"
        v-model="repayment.amount"
      />
    </view>
    <view class="column transfer-type">
      <view class="assetSource" @tap="assetSource">
        {{ repayment.assetName }}
      </view>
      <view class="iconfont icon-to transfer-icon"></view>
      <view class="assetTarget" @tap="assetTarget">
        {{ repayment.targetAssetName }}
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
        <text
          >{{ repayment.year }}-{{ repayment.month }}-{{ repayment.day }}</text
        >
      </picker>
    </view>
    <view class="column">
      <text>备注</text>
      <input
        class="pull-right remark"
        type="text"
        v-model="repayment.description"
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
import Util from '@/common/utils/util';
import Tip from '@/common/utils/tip';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
  name: "repaymentEdit",
  props: {
    repayment: {
      type: Object,
      default() {
        return {
          id: 0,
          type: "repayment",
          amount: "",
          description: "",
          assetId: 0,
          targetAssetId: 0,
          assetName: "选择还款账户",
          targetAssetName: "选择负债账户",
          year: Util.getCurrentYear(),
          month: Util.getCurrentMonth(),
          day: Util.getCurrentDay(),
          time: Util.getCurrentTime(),
        };
      },
    },
  },
  computed: {
		...mapState({
      submiting: state => state.statement.submiting,
    })
  },
  methods: {
    submitStatement() {
      const repayment = this.repayment;
      if (repayment.amount === 0 || repayment.amount === '') {
        Tip.error('金额不能为零');
        return false;
      }
      if (repayment.assetId === 0 || repayment.targetAssetId === 0) {
        Tip.error('未选择转账账户');
        return false;
      } else if (repayment.assetId === repayment.targetAssetId) {
        Tip.error('不能转向同一账户');
        return false;
      }
      this.$emit('submitStatement', repayment);
    }
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
