<template>
	<view class="bill" @tap="editStatement('id', bill.id )">
		<view class="information">
			<view class="icon">
				<image :src="bill.categoryIconPath"></image>
			</view>
			<view class="st-title">
				<view v-if="bill.type === 'expend' || bill.type === 'income' " class="title">{{ bill.categoryName }}</view>
				<view v-if="bill.type === 'transfer' || bill.type === 'repayment' " class="title">{{bill.type === 'transfer' ? '[转账]' : '[还款]'}}{{ bill.assetName }}->{{ bill.targetAssetName }}
				</view>
				<view class="description" v-if="bill.description">{{ bill.description }}</view>
				<view class="time">{{bill.year}}-{{ bill.month }}-{{bill.day}} {{bill.time}} · {{ bill.assetName }}</view>
			</view>
		</view>
		<view :class="['amount',bill.type ]">
			{{ bill.amount }}
		</view>
	</view>
</template>

<script>
	export default {
		name: "statementItem",
		props: {
			bill: {
				type: Object,
				default: {}
			}
		},
		methods: {
			editStatement(key, id) {
				console.log(key, id)
				wx.navigateTo({
					url: `/pages/bill/detail?${key}=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.bill {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 20px;
		border-bottom: 2rpx solid $borderColor;
		padding: 16rpx 0;
		color: $primaryText;

		.information {
			display: flex;
			align-items: center;
			flex: 1;
		}

		.icon {
			margin-right: 16rpx;
			display: flex;
			align-items: center;

			image {
				width: 70rpx;
				height: 70rpx;
			}
		}

		.st-title {
			>view {
				margin-bottom: 4rpx;
			}

			.title {
				font-size: 28rpx;
			}

			.description {
				color: $secondaryText;
				font-size: 24rpx;
			}

			.time {
				color: $secondaryText;
				font-size: 24rpx;
			}
		}

		.amount {
			font-size: 30rpx;
			font-weight: bold;
		}

		.transfer-icon {
			margin-right: 16rpx;
			display: flex;
			align-items: center;
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
		}
	}
</style>
