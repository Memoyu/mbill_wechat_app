<template>
  <view class="comp-container">
    <view class="category-pie-con">
      <core-empty v-if="chartData.length <= 0" :title="emptyTitle"></core-empty>
      <canvas v-else
        id="canvasPie"
        type="2d"
        class="category-pie"
        @touchstart="touchPie($event,'canvasPie')"
      ></canvas>
    </view>
    <view class="expend-category-bars" v-if="groups.length > 0 ">
      <view class="group" v-for="(child, index) in groups" :key="index">
        <view class="category-title fs14">{{ child.parentName }}</view>
        <view class="category-childs">
          <view
            class="category-item"
            v-for="(item, id) in child.childs"
            :key="id"
            @tap="jump( item )"
          >
            <image class="category-icon" :src="item.categoryIconPath">
            <view class="item" :style="'background-size:' + item.percent + '% 100%;'">
              <view class="title">
                {{ item.name }}
                <text class="percent">{{ item.percent }}%</text>
              </view>
              <view class="amount">共支出：{{ item.data }} 元</view>
            </view>
            <view class="zan-icon zan-icon-arrow"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uCharts from "@/static/plugin/u-charts/u-charts.js";
import { mapState } from "vuex";

var _self;
var canvaPie = null;
export default {
  name: "categoryChart",
  props: {
    date: {
      type: Object
    }
  },
  data() {
    return {
      emptyTitle: "空空如也！",
      groups: [],
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
      chartData:[]
    };
  },
  watch: {
    async date() {
      await this.getData();
      this.showChart();
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  components: {},
  async created() {
    _self = this;
    _self.pixelRatio = uni.getSystemInfoSync().pixelRatio;
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(500);
    await this.getData();
    this.showChart();
  },
  methods: {
    // 跳转分类详情
    jump(category) {
      console.log(category);
      let that = this;
      this.$Router.push({
        path: "/pages/bill/category-statements",
        query: {
          id: category.id,
          name: category.name,
          year: that.date.year,
          month: that.date.month
        }
      });
    },

    async getData(){
      await this.getExpendCategory();
    },
    showChart(){
      if(this.chartData.length > 0)
        this.showPie("canvasPie", this.chartData);
    },
    // 获取支出分类统计
    async getExpendCategory() {
      let that = this;
      await that
        .$api("statement.expendCategory", {
          Year: that.date.year,
          Month: that.date.month,
          UserId: that.userInfo.id
        })
        .then(res => {
          if (res.code === 0) {
            that.groups = res.result.childCategoryStas;
            that.chartData = res.result.parentCategoryStas;
          }
        });
    },
    // 显示饼图
    showPie(canvasId, chartData) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#" + canvasId)
        .fields({ node: true, size: true })
        .exec(res => {
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");
          canvas.width = res[0].width * _self.pixelRatio;
          canvas.height = res[0].height * _self.pixelRatio;
          canvaPie = new uCharts({
            $this: _self,
            canvas2d: true,
            context: ctx,
            canvasId: canvasId,
            type: "pie",
            fontSize: 13,
            padding: [15, 15, 0, 15],
            legend: {
              show: true,
              padding: 5,
              lineHeight: 11,
              margin: 0
            },
            background: "#FFFFFF",
            pixelRatio: _self.pixelRatio,
            series: chartData,
            animation: true,
            width: _self.cWidth * _self.pixelRatio,
            height: _self.cHeight * _self.pixelRatio,
            dataLabel: true,
            extra: {
              pie: {
                lableWidth: 15
              }
            }
          });
        });
    },
    touchPie(e, id) {
      canvaPie.showToolTip(e, {
        format: function(item) {
          return item.name + ":" + item.data;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.comp-container {
  .category-pie-con {
    margin-bottom: 30px;
    .category-pie {
      width: 750rpx;
      height: 500rpx;
    }
  }
  .expend-category-bars {
    margin: 12px;
    .group {
      .category-title {
        line-height: 25px;
        padding-left: 10px;
        border-radius: 10px;
        background: $primaryColor;
        font-weight: bold;
      }
      .category-childs {
        margin: 0 10px;
        .category-icon {
          min-width: 70rpx;
          width: 70rpx;
          height: 70rpx;
          margin-right: 15px;
        }
        .category-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .item {
            width: 100%;
            color: #212121;
            margin: 12px 0;
            padding: 8px;
            background-repeat: no-repeat;
            background-image: linear-gradient(#c1afaf, #c1afaf);
            border-radius: 4px;
            .title {
              font-size: 14px;
            }
            .amount {
              margin-top: 4px;
              font-size: 14px;
              color: green;
            }
            .percent {
              font-size: 12px;
              margin-left: 12px;
              color: #757575;
            }
          }
        }
      }
    }
    .zan-icon-arrow {
      font-size: 14px;
      color: #ccc;
    }
  }
}
</style>
