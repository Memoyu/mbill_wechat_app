<template>
  <view class="b-container">
    <!-- 清单统计 -->
    <view class="list-header" id="list-header">
      <view class="list-stat">
        <view class="pre-order-stat">
          <view class="pre-order-stat-content">
            <view class="pre-order-stat-text">
              <text class="text">预购金额</text>
              <text class="total">{{ stat.amount }}</text>
            </view>
            <view class="pre-order-stat-text">
              <text class="text">已完成</text>
              <text class="total">{{ stat.done }}</text>
            </view>
            <view class="pre-order-stat-text">
              <text class="text">未完成</text>
              <text class="total">{{ stat.unDone }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 预购清单列表 -->
    <view class="list-content">
      <scroll-view
        :style="{
          height: scrollHeight + 'px',
        }"
        scroll-y="true"
        @scrolltolower="lowerBottom"
      >
        <view class="list-content-items" v-for="(o, ind) in orders" :key="ind">
          <mb-po-item :order="g" />
        </view>
        <mb-b-empty v-if="orders.length <= 0" />
      </scroll-view>
    </view>
    <view class="bottom-operate" id="bottom-operate">
      <mb-b-bottom-btn
        @ltap="handlerEdit"
        @rtap="handlerDel"
        ltext="新建预购"
        rtext="删除分组"
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      stat: {
        amount: 0,
        done: 0,
        unDone: 0,
      },
      scrollHeight: 0,
    };
  },
  onShow() {},
  onLoad() {},
  onReady() {
    this.dynamicHeight();
  },
  methods: {
    //#region 接口调用

    getPreOrders({ id }) {
      // console.log("param", param);
      // this.$api
      //   .dayBills({
      //     date: `${date.year}-${date.month}-${date.day}`,
      //   })
      //   .then((res) => {
      //     // console.log("列表", res);
      //     if (res.data.code === 0) {
      //       let result = res.data.result;
      //       this.title = `${result.day}日 ${result.week}`;
      //       this.items = result.items;
      //     }
      //   });
    },

    //#endregion

    //#region 组件事件

    // 计算高度，动态调整scroll 高度
    dynamicHeight() {
      let that = this;
      uni.getSystemInfo({
        success(res) {
          let pH = res.windowHeight;
          let query = uni.createSelectorQuery().in(that);
          query.select("#list-header").fields({ size: true });
          // query.select("#bottom-operate").fields({ size: true });
          query.exec((data) => {
            console.log(data);
            data.map((i) => {
              that.scrollHeight += i.height;
            });
            that.scrollHeight = pH - that.scrollHeight;
          });
        },
      });
    },

    //#endregion
  },
};
</script>

<style lang="scss" scope>
.list-header {
  width: 100%;
  .list-stat {
    background-color: $light-color;
    padding: 10px;
    align-items: center;
    border-radius: 0 0 15px 15px;
    .pre-order-stat {
      display: flex;
      flex-direction: column;
      .pre-order-stat-content {
        display: flex;
        justify-content: space-around;
      }
    }

    .pre-order-stat-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;

      .text {
        font-size: 15px;
      }
      .total {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
.list-content {
  width: 95%;
  .list-content-items {
    margin-top: 10px;
    padding: 5px 0;
    border-radius: 13px;
    background: white;
  }
}
.bottom-operate {
  width: 100%;
  position: absolute;
  bottom: 0;
}
</style>
