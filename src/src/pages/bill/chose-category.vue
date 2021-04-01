<template>
    <view class="category-component">
    <view v-if=" frequent.length > 0 ">
      <view class="header fs14">常用</view>
      <repeat v-for="(child , index) in frequent" :key="index" >
        <mbill-core-category-item :asset="child" @choseItem="setCategory" ></mbill-core-category-item>
      </repeat>
    </view>

    <view v-for="(item,id) in list" :key="id">
      <view class="header fs14">{{ item.name }}</view>
      <div v-for="(child,index) in item.childs" :key="index">
        <mbill-core-category-item :category="child" @choseItem="setCategory" ></mbill-core-category-item>
      </div>
    </view>

    <navigator url="/pages/categories/category_form">
      <view class="add-wallet">
        <text class="fs16">添加分类</text>
      </view>
    </navigator>
  </view>
</template>

<script>
export default {
    data() {
        return {
          frequent: [],
          last: null,
          list: [],
          category_type: 'expend',
          already_load: false
        }
    },
    onLoad (options) {
      this.category_type = options.type;
      this.getCategory();
    },
    methods: {
      //获取账单分类分组数据
      getCategory() {
        var that = this;
        let parame = this.category_type !== null ? { type: this.category_type } : {};
        that.$api("category.group", parame).then((res) => {
          this.list = res.result;
        });
      },
      //触发选中分类后赋值
      setCategory (category) {
        let pages = getCurrentPages();
        let beforePage = pages[pages.length - 2];
        // console.log(beforePage)
        let refs = beforePage.$vm.$refs;
        if (this.category_type === 'expend') {
          refs.expend.setCategory(category)
        } else {
          refs.income.setCategory(category)
        }
        uni.navigateBack({
          delta: 1
        })
      }
    }
}
</script>

<style lang="scss">
.header {
  color: $primaryText;
  border-bottom: 1px solid $borderColor;
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 24rpx;
  margin: 0 12rpx;
  font-weight: bold;
}
.column {
  width: 20%;
  float: left;
  margin: 18rpx 0;
  .category {
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .category-name {
      font-size: 24rpx;
      padding: 8rpx 0;
      color: $secondaryText;
    }
  }
  .category .money {
    font-size: 20rpx;
    color: $secondaryText;
  }
  .ljt-icon {
    width: 60rpx;
    height: 60rpx;
    margin-right: 12rpx;
  }
}
  .category-component {
    > view {
      overflow: hidden;
    }
  }
  .add-wallet {
    display:flex;
    justify-content:center;
    padding:8rpx 0;
    color:#999;
    margin:8rpx 0;
  }
  .add-wallet image {
    width:50rpx;
    height:50rpx;
    display:inline-block;
    margin-right:8rpx;
  }


</style>
