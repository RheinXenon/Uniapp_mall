<template>
	<view class="container">
		<!-- 物流信息头部 -->
		<view class="logistics-header">
			<view class="logistics-info">
				<text class="company">{{ logistics.company }}</text>
				<text class="number">运单号：{{ logistics.number }}</text>
			</view>
			<view class="logistics-status">
				<text class="status-text">{{ logistics.status }}</text>
			</view>
		</view>
		
		<!-- 物流轨迹 -->
		<view class="logistics-traces">
			<view v-for="(trace, index) in logistics.traces" :key="index" class="trace-item">
				<view class="trace-dot" :class="{ active: index === 0 }"></view>
				<view class="trace-content">
					<text class="trace-desc">{{ trace.desc }}</text>
					<text class="trace-time">{{ trace.time }}</text>
				</view>
			</view>
		</view>
		
		<!-- 商品信息 -->
		<view class="product-info">
			<view class="section-title">商品信息</view>
			<view v-for="item in order.items" :key="item.id" class="product-item">
				<image class="product-image" :src="item.image" mode="aspectFill"></image>
				<view class="product-details">
					<text class="product-name">{{ item.name }}</text>
					<text class="product-specs">{{ item.specs }}</text>
					<text class="product-quantity">数量：{{ item.quantity }}</text>
				</view>
			</view>
		</view>
		
		<!-- 收货地址 -->
		<view class="address-info">
			<view class="section-title">收货地址</view>
			<view class="address-content">
				<text class="address-name">{{ order.address.name }}</text>
				<text class="address-phone">{{ order.address.phone }}</text>
				<text class="address-detail">{{ order.address.fullAddress }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				order: {},
				logistics: {
					company: '',
					number: '',
					status: '',
					traces: []
				}
			}
		},
		onLoad(options) {
			this.orderId = options.orderId
			this.loadLogisticsData()
		},
		methods: {
			loadLogisticsData() {
				// 模拟加载物流数据
				uni.request({
					url: '/static/data/orders.json',
					success: (res) => {
						const order = res.data.orders.find(o => o.id === this.orderId)
						if (order) {
							this.order = order
							this.logistics = order.logistics
						}
					},
					fail: () => {
						// 模拟数据
						this.order = {
							id: "ORD003",
							items: [
								{
									id: 5,
									name: "Apple Watch Series 9",
									image: "/static/products/apple-watch.jpg",
									specs: "午夜色, 45mm",
									quantity: 1
								}
							],
							address: {
								name: "王五",
								phone: "137****7777",
								fullAddress: "广东省深圳市南山区科技园南区深南大道10000号"
							}
						}
						this.logistics = {
							company: "顺丰速运",
							number: "SF1234567890",
							status: "运输中",
							traces: [
								{
									time: "2024-01-14 14:30:00",
									desc: "快件已从【深圳分拨中心】发出，下一站【深圳南山营业点】"
								},
								{
									time: "2024-01-14 16:45:00",
									desc: "快件已到达【深圳南山营业点】"
								},
								{
									time: "2024-01-15 08:30:00",
									desc: "快件正在派送中，派送员：张师傅，联系电话：138****1234"
								}
							]
						}
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	.logistics-header {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.logistics-info {
		flex: 1;
	}
	
	.company {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.number {
		font-size: 28rpx;
		color: #666;
	}
	
	.logistics-status {
		margin-left: 20rpx;
	}
	
	.status-text {
		font-size: 28rpx;
		color: #52C41A;
		font-weight: bold;
		padding: 8rpx 16rpx;
		background-color: #F6FFED;
		border-radius: 20rpx;
	}
	
	.logistics-traces {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.trace-item {
		display: flex;
		position: relative;
		padding-left: 40rpx;
		margin-bottom: 40rpx;
	}
	
	.trace-item:last-child {
		margin-bottom: 0;
	}
	
	.trace-dot {
		position: absolute;
		left: 0;
		top: 10rpx;
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background-color: #ddd;
		border: 4rpx solid #fff;
		box-shadow: 0 0 0 2rpx #ddd;
	}
	
	.trace-dot.active {
		background-color: #FF6B35;
		box-shadow: 0 0 0 2rpx #FF6B35;
	}
	
	.trace-content {
		flex: 1;
	}
	
	.trace-desc {
		font-size: 28rpx;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
		line-height: 1.4;
	}
	
	.trace-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.product-info, .address-info {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.product-item {
		display: flex;
		margin-bottom: 20rpx;
	}
	
	.product-item:last-child {
		margin-bottom: 0;
	}
	
	.product-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}
	
	.product-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.product-name {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	.product-specs {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}
	
	.product-quantity {
		font-size: 24rpx;
		color: #666;
	}
	
	.address-content {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}
	
	.address-name {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}
	
	.address-phone {
		font-size: 28rpx;
		color: #333;
	}
	
	.address-detail {
		font-size: 28rpx;
		color: #666;
		line-height: 1.4;
	}
</style>
