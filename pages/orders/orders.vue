<template>
	<view class="container">
		<!-- 状态筛选 -->
		<view class="status-tabs">
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === '' }"
				@click="switchStatus('')"
			>
				<text class="tab-text">全部</text>
				<text class="tab-count">{{ totalCount }}</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === 'pending' }"
				@click="switchStatus('pending')"
			>
				<text class="tab-text">待付款</text>
				<text class="tab-count">{{ orderStatus.pending }}</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === 'paid' }"
				@click="switchStatus('paid')"
			>
				<text class="tab-text">待发货</text>
				<text class="tab-count">{{ orderStatus.paid }}</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === 'shipped' }"
				@click="switchStatus('shipped')"
			>
				<text class="tab-text">待收货</text>
				<text class="tab-count">{{ orderStatus.shipped }}</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentStatus === 'completed' }"
				@click="switchStatus('completed')"
			>
				<text class="tab-text">已完成</text>
				<text class="tab-count">{{ orderStatus.completed }}</text>
			</view>
		</view>
		
		<!-- 订单列表 -->
		<view class="order-list">
			<view v-if="filteredOrders.length === 0" class="empty-state">
				<text class="empty-icon">📦</text>
				<text class="empty-text">暂无订单</text>
				<text class="empty-desc">快去选购心仪的商品吧</text>
			</view>
			
			<view v-for="order in filteredOrders" :key="order.id" class="order-item">
				<!-- 订单头部 -->
				<view class="order-header">
					<view class="order-info">
						<text class="order-number">订单号：{{ order.orderNumber }}</text>
						<text class="order-time">{{ order.createTime }}</text>
					</view>
					<view class="order-status">
						<text class="status-text" :class="'status-' + order.status">{{ order.statusText }}</text>
					</view>
				</view>
				
				<!-- 商品信息 -->
				<view class="order-products">
					<view v-for="item in order.items" :key="item.id" class="product-item">
						<image class="product-image" :src="item.image" mode="aspectFill"></image>
						<view class="product-info">
							<text class="product-name">{{ item.name }}</text>
							<text class="product-specs">{{ item.specs }}</text>
							<view class="product-price">
								<text class="price">¥{{ item.price }}</text>
								<text class="quantity">×{{ item.quantity }}</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 订单金额 -->
				<view class="order-amount">
					<text class="amount-label">实付金额：</text>
					<text class="amount-value">¥{{ order.payAmount }}</text>
				</view>
				
				<!-- 操作按钮 -->
				<view class="order-actions">
					<button 
						v-if="order.status === 'pending'" 
						class="action-btn primary" 
						@click="payOrder(order)"
					>
						立即付款
					</button>
					<button 
						v-if="order.status === 'pending'" 
						class="action-btn" 
						@click="cancelOrder(order)"
					>
						取消订单
					</button>
					<button 
						v-if="order.status === 'shipped'" 
						class="action-btn primary" 
						@click="confirmReceive(order)"
					>
						确认收货
					</button>
					<button 
						v-if="order.status === 'shipped'" 
						class="action-btn" 
						@click="viewLogistics(order)"
					>
						查看物流
					</button>
					<button 
						v-if="order.status === 'completed'" 
						class="action-btn" 
						@click="buyAgain(order)"
					>
						再次购买
					</button>
					<button 
						v-if="order.status === 'completed'" 
						class="action-btn" 
						@click="viewOrderDetail(order)"
					>
						订单详情
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentStatus: '',
				orders: [],
				orderStatus: {
					pending: 0,
					paid: 0,
					shipped: 0,
					completed: 0,
					cancelled: 0
				}
			}
		},
		computed: {
			filteredOrders() {
				if (this.currentStatus === '') {
					return this.orders.filter(order => order.status !== 'cancelled')
				}
				return this.orders.filter(order => order.status === this.currentStatus)
			},
			totalCount() {
				return this.orders.filter(order => order.status !== 'cancelled').length
			}
		},
		onLoad(options) {
			// 从个人中心页面传入的状态参数
			if (options.status) {
				this.currentStatus = options.status
			}
			this.loadOrders()
		},
		methods: {
			loadOrders() {
				// 模拟加载订单数据
				uni.request({
					url: '/static/data/orders.json',
					success: (res) => {
						this.orders = res.data.orders
						this.orderStatus = res.data.orderStatus
					},
					fail: () => {
						// 如果请求失败，使用模拟数据
						this.orders = [
							{
								id: "ORD001",
								orderNumber: "202401150001",
								status: "pending",
								statusText: "待付款",
								createTime: "2024-01-15 10:30:00",
								totalAmount: 7999,
								payAmount: 7999,
								items: [
									{
										id: 1,
										name: "iPhone 15 Pro 深空黑色 256GB",
										image: "/static/products/iphone15pro.jpg",
										price: 7999,
										quantity: 1,
										specs: "深空黑色, 256GB"
									}
								]
							}
						]
						this.orderStatus = {
							pending: 1,
							paid: 0,
							shipped: 0,
							completed: 0,
							cancelled: 0
						}
					}
				})
			},
			switchStatus(status) {
				this.currentStatus = status
			},
			payOrder(order) {
				uni.showModal({
					title: '确认付款',
					content: `确认支付 ¥${order.payAmount} 吗？`,
					success: (res) => {
						if (res.confirm) {
							// 模拟支付成功
							order.status = 'paid'
							order.statusText = '待发货'
							order.payTime = new Date().toLocaleString()
							this.orderStatus.pending--
							this.orderStatus.paid++
							
							uni.showToast({
								title: '支付成功',
								icon: 'success'
							})
						}
					}
				})
			},
			cancelOrder(order) {
				uni.showModal({
					title: '取消订单',
					content: '确定要取消这个订单吗？',
					success: (res) => {
						if (res.confirm) {
							order.status = 'cancelled'
							order.statusText = '已取消'
							this.orderStatus.pending--
							this.orderStatus.cancelled++
							
							uni.showToast({
								title: '订单已取消',
								icon: 'success'
							})
						}
					}
				})
			},
			confirmReceive(order) {
				uni.showModal({
					title: '确认收货',
					content: '确认已收到商品吗？',
					success: (res) => {
						if (res.confirm) {
							order.status = 'completed'
							order.statusText = '已完成'
							order.receiveTime = new Date().toLocaleString()
							this.orderStatus.shipped--
							this.orderStatus.completed++
							
							uni.showToast({
								title: '确认收货成功',
								icon: 'success'
							})
						}
					}
				})
			},
			viewLogistics(order) {
				uni.navigateTo({
					url: `/pages/logistics/logistics?orderId=${order.id}`
				})
			},
			buyAgain(order) {
				// 将商品添加到购物车
				uni.showToast({
					title: '已添加到购物车',
					icon: 'success'
				})
			},
			viewOrderDetail(order) {
				uni.navigateTo({
					url: `/pages/order-detail/order-detail?orderId=${order.id}`
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
	
	.status-tabs {
		background-color: #fff;
		display: flex;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0;
		position: relative;
	}
	
	.tab-item.active {
		color: #FF6B35;
	}
	
	.tab-text {
		font-size: 28rpx;
		margin-bottom: 8rpx;
	}
	
	.tab-count {
		font-size: 24rpx;
		color: #999;
	}
	
	.tab-item.active .tab-count {
		color: #FF6B35;
	}
	
	.order-list {
		padding: 20rpx;
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 100rpx 0;
	}
	
	.empty-icon {
		font-size: 120rpx;
		margin-bottom: 30rpx;
		opacity: 0.5;
	}
	
	.empty-text {
		font-size: 32rpx;
		color: #666;
		margin-bottom: 20rpx;
	}
	
	.empty-desc {
		font-size: 28rpx;
		color: #999;
	}
	
	.order-item {
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		padding: 30rpx;
	}
	
	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.order-info {
		flex: 1;
	}
	
	.order-number {
		font-size: 28rpx;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.order-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.order-status {
		margin-left: 20rpx;
	}
	
	.status-text {
		font-size: 28rpx;
		font-weight: bold;
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
	}
	
	.status-pending {
		color: #FF6B35;
		background-color: #FFF5F0;
	}
	
	.status-paid {
		color: #1890FF;
		background-color: #F0F8FF;
	}
	
	.status-shipped {
		color: #52C41A;
		background-color: #F6FFED;
	}
	
	.status-completed {
		color: #666;
		background-color: #F5F5F5;
	}
	
	.order-products {
		margin-bottom: 30rpx;
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
	
	.product-info {
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
	
	.product-price {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.price {
		font-size: 28rpx;
		color: #FF6B35;
		font-weight: bold;
	}
	
	.quantity {
		font-size: 24rpx;
		color: #999;
	}
	
	.order-amount {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 30rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #f0f0f0;
	}
	
	.amount-label {
		font-size: 28rpx;
		color: #666;
		margin-right: 10rpx;
	}
	
	.amount-value {
		font-size: 32rpx;
		color: #FF6B35;
		font-weight: bold;
	}
	
	.order-actions {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
	}
	
	.action-btn {
		padding: 16rpx 32rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		border: 2rpx solid #ddd;
		background-color: #fff;
		color: #666;
	}
	
	.action-btn.primary {
		background-color: #FF6B35;
		color: #fff;
		border-color: #FF6B35;
	}
</style>
