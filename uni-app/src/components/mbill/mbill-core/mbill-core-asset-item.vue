<template>
	<view class="column" @tap="choseAsset(asset)">
		<view class="asset">
			<image class="ljt-icon" :src="asset.iconUrl"></image>
			<text class="asset-name fs16">{{ asset.name }}</text>
			<text class="money">（¥{{ asset.amount }}）</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "assetItem",
		props: {
			asset: {
				type: Object,
				default: {}
			}
		},
		methods: {
			choseAsset(asset) {
				this.$emit('choseItem', asset)
			}
		}
	}
</script>

<style lang="scss">
	.column {
		width: 20%;
		float: left;
		margin: 18rpx 0;

		.asset {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.asset-name {
				font-size: 24rpx;
				padding: 8rpx 0;
				color: $secondaryText;
			}
		}

		.asset .money {
			font-size: 20rpx;
			color: $secondaryText;
		}

		.ljt-icon {
			width: 60rpx;
			height: 60rpx;
			margin-right: 12rpx;
		}
	}
</style>
