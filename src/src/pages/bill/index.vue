<template>
	<view class="container">
		<view class="header">
			<image class="bg" :src="header.backgroundUrl"></image>
			<view class="level-2">
				<view class="overflow-hide">
					<view class="pull-right fs14 today-weather">
						<text>{{ header.positionName4 }}</text>
						<view :class="['iconfont', header.positionWeather ,'weather-icon' ]"></view>
						<text>{{ header.positionCelsius }}</text>
					</view>
				</view>
				<view class="fs14"> {{ header.positionName1 }}</view>
				<view class="fs21 today-expend">{{ header.positionAmount1 }}</view>
				<view class="overflow-hide">
					<view class="pull-left fs14">{{ header.positionName2 }} {{ header.positionAmount2 }}</view>
					<view class="pull-right fs14">{{ header.positionName3 }} {{ header.positionAmount3 }}</view>
				</view>
			</view>
			<view class="bill-btn">
				<view class="mine-bill-btn btn-shadow" v-on:click="handleAddBookkeeping">
					<i class="iconfont icon-write writeicon"></i>
				</view>
			</view>
		</view>
		<view class="bill-container">
			<view class="bill-title">今日消费</view>
			<view v-for="(item,index) in list" :key="index">
				<mbill-bill-statement-item :bill="item"></mbill-bill-statement-item>
			</view>
			<uni-load-more :status="more"></uni-load-more>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadMore: false,
				triggered: false,
				refreshing: false,
				emptyTitle: "今天没有账目噢！",
				list: [{
						id: 1,
						categoryIconPath: "http://localhost:5000/core/images/category/icon_mushroom_64.png",
						categoryName: "数码",
						assetName: "微信",
						targetAssetName: "",
						description: "买电脑",
						year: 2021,
						month: 2,
						day: 6,
						time: "16:13:11",
						type: "expend",
						amount: 300
					},
					{
						id: 2,
						categoryIconPath: "http://localhost:5000/core/images/category/icon_mushroom_64.png",
						categoryName: "",
						assetName: "微信",
						targetAssetName: "信用卡",
						description: "买电脑",
						year: 2021,
						month: 2,
						day: 6,
						time: "16:13:11",
						type: "transfer",
						amount: 300.89
					}
				],
				header: {
					backgroundUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_match%2F0%2F11260081412%2F0.jpg&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1617871514&t=c3c556302a48220806fe6e6145130c4b',
					positionName1: '今日支出',
					positionAmount1: '40.00',
					positionName2: '本月支出',
					positionAmount2: '200.45',
					positionName3: '剩余预算',
					positionAmount3: '200.00',
					positionName4: '广州',
					positionWeather: 'icon-weather-sun',
					positionCelsius: '27℃/16℃'
				},
				budgetHeader: {
					budget: '0.00',
					month_expend: '0.00',
					percentage: '0',
					color: '#FF2929'
				},
				total: 0,
				page: {
					// Date: Util.getCurrentDate(),
					Size: 10,
					Page: 0
				}
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;

		>view {
			display: block;
		}
	}

	.header {
		position: relative;
		color: white;
		height: 340rpx;

		.bg {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			z-index: -1;
			border-radius: 15rpx;
		}

		.level-2 {
			position: absolute;
			bottom: 50rpx;
			width: 100%;

			.today-weather {
				display: flex;
				margin-bottom: 15px;

				.weather-icon {
					font-size: 20px;
					margin: 0 5px 0 5px;
				}
			}

			.today-expend {
				font-size: 64rpx;
				margin-bottom: 24rpx;
			}

			>view {
				padding: 0 24rpx;
			}
		}

		.no-read-msg:after {
			content: '';
			position: absolute;
			width: 16rpx;
			height: 16rpx;
			top: 0;
			right: 0;
			border-radius: 50%;
			background: #FF0000;
		}

		.pay-num {
			background: rgb(32, 86, 174);
			margin: 0 4rpx;
		}

		.notification {
			position: absolute;
			top: 42rpx;
			right: 42rpx;
			width: 60rpx;
			height: 60rpx;
			background: black;
			border-radius: 50%;
			padding: 8rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.jz-icon-xiaoxi {
			font-size: 54rpx;
			position: absolute;
			top: 32rpx;
			right: 48rpx;
		}
	}

	.bill-btn {
		padding-top: 150px;
		width: 100%;
		text-align: -webkit-center;

		.mine-bill-btn {
			background: $primaryColor;
			color: white;
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			flex-shrink: 0;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;

			.writeicon {
				font-size: 80rpx;
				color: white;
			}

		}

		.mine-bill-btn::after {
			border: none; //移除边框
		}
	}

	.zan-btns.new-record {
		.jz-btn {
			background: $primaryColor;
			color: white;
			margin: 15px;
		}
	}

	.bill-container {
		margin-top: 30rpx;

		.bill-title {
			position: relative;
			display: inline-block;
			padding-bottom: 4px;
			margin-bottom: 12px;
			font-size: 18px;
			color: #40485B;
			font-weight: bolder;
			margin-left: 14px;

			&:before {
				content: '';
				position: absolute;
				background: $primaryColor;
				width: calc(100% + 16px);
				height: 12px;
				bottom: 0;
				left: 0;
				border-radius: 12px;
				z-index: -1;
			}
		}
	}

	.bill-list {
		margin-bottom: 40rpx;

		>.surplus {
			text-align: center;

			>text {
				font-size: 24rpx;
				padding: 0 12rpx;
			}
		}

		>.total {
			text-align: right;
			margin: 0 32rpx;

			>text {
				font-size: 24rpx;

				&:first-child {
					padding-right: 16rpx;
				}
			}
		}
	}

	// 预算设置
	.budget-setting {
		width: 100%;
		font-size: 24rpx;
		box-sizing: border-box;
		padding: 24rpx;
		margin-top: -12rpx;
		background: white;
		border-radius: 10rpx;
		border-bottom: 1px dashed #f3f3f3;

		.budget__cur-month {
			display: flex;
			justify-content: space-between;
		}

		.budget__cur-amount {
			display: flex;
			justify-content: space-between;
			color: $secondaryText;
			font-size: 24rpx;
		}

		.budget-progress {
			height: 6px;
			width: 100%;
			margin: 6px 0;
			position: relative;

			.budget-progress__bg {
				width: 100%;
				height: 100%;
				border-radius: 10px;
				background: #F0EAD7;
				position: absolute;
				top: 0;
				left: 0;
			}

			.budget-progress__item {
				position: absolute;
				top: 0;
				left: 0;
				height: 100%;
				border-radius: 10px;
			}
		}
	}
</style>
