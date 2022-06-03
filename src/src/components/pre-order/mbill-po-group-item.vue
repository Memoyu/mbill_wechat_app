<template>
  <view class="mbill-po-group-item">
    <view class="group-item-content" @click="handlerToList(group)">
      <view class="content-title">
        <view class="title">{{ group.name }}</view>
        <view class="info">
          <text class="time">{{ group.time }}</text>
          <text class="note">{{ group.description }}</text>
        </view>
      </view>
      <view class="content-amount">
        <text class="expend-color done">
          {{ group.done }}
        </text>
        <text class="income-color un-done">
          {{ group.unDone }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mbill-po-group-item",
  props: {
    group: {
      type: Object,
      default: {},
    },
  },
  methods: {
    handlerToList(group) {
      uni.navigateTo({
        url: `/pages/bill/pre-order/list?id=${group.id}`,
      });
    },
    handlerEdit(group) {
      this.$emit("edit", group);
    },
  },
};
</script>

<style lang="scss" scope>
.mbill-po-group-item {
  display: flex;
  border-radius: 10px;
  padding: 10px 18px;
  align-items: center;
  .group-item-content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    .content-title {
      .title {
        margin-bottom: 5px;
        font-weight: bold;
      }
      .info {
        color: $grey-text-color;
        font-size: 13px;
        .time {
          margin-right: 5px;
        }
        .note {
        }
      }
    }
    .content-amount {
      font-weight: bold;
      font-size: 17px;
      .done {
        padding-right: 9px;
      }
      .un-done {
        padding-left: 9px;
        border-left: solid $light-color 1px;
      }
    }
  }
}
</style>
