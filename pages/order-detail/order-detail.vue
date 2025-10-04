<template>
	<view class="container">
		<!-- 订单状态 -->
		<view class="order-status">
			<view class="status-icon">
				<text class="icon">{{ getStatusIcon(order.status) }}</text>
			</view>
			<view class="status-info">
				<text class="status-text">{{ order.statusText }}</text>
				<text class="status-desc">{{ getStatusDesc(order.status) }}</text>
			</view>
		</view>
		
		<!-- 物流信息 -->
		<view v-if="order.status === 'shipped' || order.status === 'completed'" class="logistics-info">
			<view class="logistics-header" @click="viewLogistics">
				<view class="logistics-details">
					<text class="company">{{ order.logistics.company }}</text>
					<text class="number">{{ order.logistics.number }}</text>
				</view>
				<view class="logistics-status">
					<text class="status">{{ order.logistics.status }}</text>
					<text class="arrow">></text>
				</view>
			</view>
		</view>
		
		<!-- 收货地址 -->
		<view class="address-section">
			<view class="section-header">
				<text class="section-title">收货地址</text>
			</view>
			<view class="address-content">
				<view class="address-info">
					<text class="name">{{ order.address.name }}</text>
					<text class="phone">{{ order.address.phone }}</text>
				</view>
				<text class="address-detail">{{ order.address.fullAddress }}</text>
			</view>
		</view>
		
		<!-- 商品信息 -->
		<view class="products-section">
			<view class="section-header">
				<text class="section-title">商品信息</text>
			</view>
			<view class="products-list">
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
		</view>
		
		<!-- 订单信息 -->
		<view class="order-info-section">
			<view class="section-header">
				<text class="section-title">订单信息</text>
			</view>
			<view class="info-list">
				<view class="info-item">
					<text class="label">订单编号</text>
					<text class="value">{{ order.orderNumber }}</text>
				</view>
				<view class="info-item">
					<text class="label">下单时间</text>
					<text class="value">{{ order.createTime }}</text>
				</view>
				<view v-if="order.payTime" class="info-item">
					<text class="label">支付时间</text>
					<text class="value">{{ order.payTime }}</text>
				</view>
				<view v-if="order.shipTime" class="info-item">
					<text class="label">发货时间</text>
					<text class="value">{{ order.shipTime }}</text>
				</view>
				<view v-if="order.receiveTime" class="info-item">
					<text class="label">收货时间</text>
					<text class="value">{{ order.receiveTime }}</text>
				</view>
				<view v-if="order.remark" class="info-item">
					<text class="label">订单备注</text>
					<text class="value">{{ order.remark }}</text>
				</view>
			</view>
		</view>
		
		<!-- 费用明细 -->
		<view class="cost-section">
			<view class="section-header">
				<text class="section-title">费用明细</text>
			</view>
			<view class="cost-list">
				<view class="cost-item">
					<text class="label">商品金额</text>
					<text class="value">¥{{ order.totalAmount }}</text>
				</view>
				<view v-if="order.coupon" class="cost-item">
					<text class="label">优惠券</text>
					<text class="value discount">-¥{{ order.coupon.amount }}</text>
				</view>
				<view class="cost-item">
					<text class="label">运费</text>
					<text class="value">¥0</text>
				</view>
				<view class="cost-item total">
					<text class="label">实付金额</text>
					<text class="value">¥{{ order.payAmount }}</text>
				</view>
			</view>
		</view>
		
		<!-- 操作按钮 -->
		<view class="actions-section">
			<button 
				v-if="order.status === 'pending'" 
				class="action-btn primary" 
				@click="payOrder"
			>
				立即付款
			</button>
			<button 
				v-if="order.status === 'pending'" 
				class="action-btn" 
				@click="cancelOrder"
			>
				取消订单
			</button>
			<button 
				v-if="order.status === 'shipped'" 
				class="action-btn primary" 
				@click="confirmReceive"
			>
				确认收货
			</button>
			<button 
				v-if="order.status === 'completed'" 
				class="action-btn" 
				@click="buyAgain"
			>
				再次购买
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				order: {}
			}
		},
		onLoad(options) {
			this.orderId = options.orderId
			this.loadOrderDetail()
		},
		methods: {
			loadOrderDetail() {
				// 模拟加载订单详情
				uni.request({
					url: '/static/data/orders.json',
					success: (res) => {
						const order = res.data.orders.find(o => o.id === this.orderId)
						if (order) {
							this.order = order
						}
					},
					fail: () => {
						// 模拟数据
						this.order = {
							id: "ORD004",
							orderNumber: "202401120004",
							status: "completed",
							statusText: "已完成",
							createTime: "2024-01-12 16:45:00",
							payTime: "2024-01-12 16:50:00",
							shipTime: "2024-01-13 10:20:00",
							receiveTime: "2024-01-15 14:30:00",
							totalAmount: 5999,
							payAmount: 5999,
							items: [
								{
									id: 4,
									name: "iPad Pro 11英寸 M2芯片",
									image: "/static/products/ipad-pro.jpg",
									price: 5999,
									quantity: 1,
									specs: "深空灰色, 128GB"
								}
							],
							address: {
								name: "赵六",
								phone: "136****6666",
								fullAddress: "江苏省南京市鼓楼区中山路321号"
							},
							logistics: {
								company: "京东物流",
								number: "JD9876543210",
								status: "已签收"
							}
						}
					}
				})
			},
			getStatusIcon(status) {
				const icons = {
					pending: '⏰',
					paid: '📦',
					shipped: '🚚',
					completed: '✅',
					cancelled: '❌'
				}
				return icons[status] || '📋'
			},
			getStatusDesc(status) {
				const descs = {
					pending: '请尽快完成支付',
					paid: '商家正在准备发货',
					shipped: '商品正在配送中',
					completed: '订单已完成',
					cancelled: '订单已取消'
				}
				return descs[status] || ''
			},
			viewLogistics() {
				uni.navigateTo({
					url: `/pages/logistics/logistics?orderId=${this.order.id}`
				})
			},
			payOrder() {
				uni.showModal({
					title: '确认付款',
					content: `确认支付 ¥${this.order.payAmount} 吗？`,
					success: (res) => {
						if (res.confirm) {
							this.order.status = 'paid'
							this.order.statusText = '待发货'
							this.order.payTime = new Date().toLocaleString()
							
							uni.showToast({
								title: '支付成功',
								icon: 'success'
							})
						}
					}
				})
			},
			cancelOrder() {
				uni.showModal({
					title: '取消订单',
					content: '确定要取消这个订单吗？',
					success: (res) => {
						if (res.confirm) {
							this.order.status = 'cancelled'
							this.order.statusText = '已取消'
							
							uni.showToast({
								title: '订单已取消',
								icon: 'success'
							})
						}
					}
				})
			},
			confirmReceive() {
				uni.showModal({
					title: '确认收货',
					content: '确认已收到商品吗？',
					success: (res) => {
						if (res.confirm) {
							this.order.status = 'completed'
							this.order.statusText = '已完成'
							this.order.receiveTime = new Date().toLocaleString()
							
							uni.showToast({
								title: '确认收货成功',
								icon: 'success'
							})
						}
					}
				})
			},
			buyAgain() {
				uni.showToast({
					title: '已添加到购物车',
					icon: 'success'
				})
			}
		}
	}
</script>

<style>
	.container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 120rpx;
	}
	
	.order-status {
		background-color: #fff;
		padding: 40rpx 30rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
	}
	
	.status-icon {
		margin-right: 30rpx;
	}
	
	.icon {
		font-size: 80rpx;
	}
	
	.status-info {
		flex: 1;
	}
	
	.status-text {
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.status-desc {
		font-size: 28rpx;
		color: #666;
	}
	
	.logistics-info {
		background-color: #fff;
		margin-bottom: 20rpx;
	}
	
	.logistics-header {
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.logistics-details {
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
		display: flex;
		align-items: center;
	}
	
	.status {
		font-size: 28rpx;
		color: #52C41A;
		margin-right: 10rpx;
	}
	
	.arrow {
		font-size: 28rpx;
		color: #ccc;
	}
	
	.address-section, .products-section, .order-info-section, .cost-section {
		background-color: #fff;
		margin-bottom: 20rpx;
	}
	
	.section-header {
		padding: 30rpx 30rpx 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.section-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}
	
	.address-content {
		padding: 30rpx;
	}
	
	.address-info {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.name {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-right: 20rpx;
	}
	
	.phone {
		font-size: 32rpx;
		color: #333;
	}
	
	.address-detail {
		font-size: 28rpx;
		color: #666;
		line-height: 1.4;
	}
	
	.products-list {
		padding: 30rpx;
	}
	
	.product-item {
		display: flex;
		margin-bottom: 30rpx;
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
	
	.info-list, .cost-list {
		padding: 30rpx;
	}
	
	.info-item, .cost-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.info-item:last-child, .cost-item:last-child {
		margin-bottom: 0;
	}
	
	.label {
		font-size: 28rpx;
		color: #666;
	}
	
	.value {
		font-size: 28rpx;
		color: #333;
	}
	
	.cost-item.total {
		padding-top: 20rpx;
		border-top: 1rpx solid #f0f0f0;
		margin-top: 20rpx;
	}
	
	.cost-item.total .label {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}
	
	.cost-item.total .value {
		font-size: 32rpx;
		color: #FF6B35;
		font-weight: bold;
	}
	
	.discount {
		color: #52C41A;
	}
	
	.actions-section {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #f0f0f0;
		display: flex;
		gap: 20rpx;
		justify-content: flex-end;
	}
	
	.action-btn {
		padding: 20rpx 40rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		border: 2rpx solid #ddd;
		background-color: #fff;
		color: #666;
		min-width: 160rpx;
	}
	
	.action-btn.primary {
		background-color: #FF6B35;
		color: #fff;
		border-color: #FF6B35;
	}
</style>
