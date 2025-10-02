<template>
	<view class="container">
		<!-- 购物车为空 -->
		<view class="empty-cart" v-if="cartItems.length === 0">
			<image src="/static/tabbar/cart.svg" class="empty-icon"></image>
			<text class="empty-text">购物车还是空的</text>
			<text class="empty-desc">快去选购心仪的商品吧</text>
			<button class="go-shopping-btn" @click="goShopping">去购物</button>
		</view>
		
		<!-- 购物车有商品 -->
		<view class="cart-content" v-else>
			<!-- 商品列表 -->
			<scroll-view class="cart-list" scroll-y="true">
				<view class="cart-item" v-for="(item, index) in cartItems" :key="index">
					<view class="item-checkbox" @click="toggleSelect(index)">
						<text class="checkbox" :class="{ checked: item.selected }">✓</text>
					</view>
					<image :src="item.image" class="item-image"></image>
					<view class="item-info">
						<text class="item-name">{{item.name}}</text>
						<text class="item-spec">{{item.spec}}</text>
						<view class="item-bottom">
							<text class="item-price">¥{{item.price}}</text>
							<view class="quantity-control">
								<button class="quantity-btn" @click="decreaseQuantity(index)" :disabled="item.quantity <= 1">-</button>
								<text class="quantity">{{item.quantity}}</text>
								<button class="quantity-btn" @click="increaseQuantity(index)">+</button>
							</view>
						</view>
					</view>
					<view class="item-delete" @click="removeItem(index)">
						<text class="delete-icon">🗑️</text>
					</view>
				</view>
			</scroll-view>
			
			<!-- 底部结算栏 -->
			<view class="bottom-bar">
				<view class="select-all" @click="toggleSelectAll">
					<text class="checkbox" :class="{ checked: isAllSelected }">✓</text>
					<text class="select-all-text">全选</text>
				</view>
				<view class="total-info">
					<text class="total-text">合计：</text>
					<text class="total-price">¥{{totalPrice}}</text>
				</view>
				<button class="checkout-btn" :class="{ disabled: selectedCount === 0 }" @click="checkout">
					结算({{selectedCount}})
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cartItems: []
			}
		},
		computed: {
			isAllSelected() {
				return this.cartItems.length > 0 && this.cartItems.every(item => item.selected)
			},
			selectedCount() {
				return this.cartItems.filter(item => item.selected).length
			},
			totalPrice() {
				return this.cartItems
					.filter(item => item.selected)
					.reduce((total, item) => total + (item.price * item.quantity), 0)
			}
		},
		onLoad() {
			this.loadCartData()
		},
		onShow() {
			// 页面显示时刷新购物车数据
			this.loadCartData()
		},
		methods: {
			async loadCartData() {
				try {
					const cartManager = getApp().globalData.cartManager
					const cartData = await cartManager.getCartData()
					this.cartItems = cartData || []
				} catch (error) {
					console.error('加载购物车数据失败:', error)
					uni.showToast({
						title: '加载购物车数据失败',
						icon: 'error'
					})
				}
			},
			async toggleSelect(index) {
				const item = this.cartItems[index]
				const cartManager = getApp().globalData.cartManager
				
				const result = await cartManager.toggleItemSelection(item.id, item.spec)
				
				if (result.success) {
					this.cartItems[index].selected = !this.cartItems[index].selected
				} else {
					uni.showToast({
						title: result.message || '操作失败',
						icon: 'error'
					})
				}
			},
			async toggleSelectAll() {
				const shouldSelectAll = !this.isAllSelected
				const cartManager = getApp().globalData.cartManager
				
				const result = await cartManager.toggleSelectAll(shouldSelectAll)
				
				if (result.success) {
					this.cartItems.forEach(item => {
						item.selected = shouldSelectAll
					})
				} else {
					uni.showToast({
						title: result.message || '操作失败',
						icon: 'error'
					})
				}
			},
			async increaseQuantity(index) {
				const item = this.cartItems[index]
				const newQuantity = item.quantity + 1
				
				const cartManager = getApp().globalData.cartManager
				const result = await cartManager.updateQuantity(item.id, item.spec, newQuantity)
				
				if (result.success) {
					this.cartItems[index].quantity = newQuantity
				} else {
					uni.showToast({
						title: result.message || '更新失败',
						icon: 'error'
					})
				}
			},
			async decreaseQuantity(index) {
				const item = this.cartItems[index]
				if (item.quantity <= 1) return
				
				const newQuantity = item.quantity - 1
				
				const cartManager = getApp().globalData.cartManager
				const result = await cartManager.updateQuantity(item.id, item.spec, newQuantity)
				
				if (result.success) {
					this.cartItems[index].quantity = newQuantity
				} else {
					uni.showToast({
						title: result.message || '更新失败',
						icon: 'error'
					})
				}
			},
			removeItem(index) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个商品吗？',
					success: async (res) => {
						if (res.confirm) {
							const item = this.cartItems[index]
							const cartManager = getApp().globalData.cartManager
							
							const result = await cartManager.removeFromCart(item.id, item.spec)
							
							if (result.success) {
								this.cartItems.splice(index, 1)
								uni.showToast({
									title: '商品已删除',
									icon: 'success'
								})
							} else {
								uni.showToast({
									title: result.message || '删除失败',
									icon: 'error'
								})
							}
						}
					}
				})
			},
			checkout() {
				if (this.selectedCount === 0) {
					uni.showToast({
						title: '请选择要结算的商品',
						icon: 'none'
					})
					return
				}
				
				uni.showModal({
					title: '确认结算',
					content: `共${this.selectedCount}件商品，合计¥${this.totalPrice}`,
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '结算成功',
								icon: 'success'
							})
							// 这里可以跳转到订单页面
						}
					}
				})
			},
			goShopping() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style>
	.container {
		background-color: #f5f5f5;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	.empty-cart {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 40rpx;
	}
	
	.empty-icon {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 40rpx;
	}
	
	.empty-text {
		font-size: 36rpx;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.empty-desc {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 60rpx;
	}
	
	.go-shopping-btn {
		background-color: #FF6B35;
		color: #fff;
		border-radius: 50rpx;
		padding: 20rpx 60rpx;
		font-size: 32rpx;
		border: none;
	}
	
	.cart-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.cart-list {
		flex: 1;
		background-color: #fff;
		margin: 20rpx;
		border-radius: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.cart-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
		width: 100%;
		box-sizing: border-box;
	}
	
	.cart-item:last-child {
		border-bottom: none;
	}
	
	.item-checkbox {
		margin-right: 20rpx;
	}
	
	.checkbox {
		display: inline-block;
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid #ddd;
		border-radius: 50%;
		text-align: center;
		line-height: 36rpx;
		font-size: 24rpx;
		color: transparent;
	}
	
	.checkbox.checked {
		background-color: #FF6B35;
		border-color: #FF6B35;
		color: #fff;
	}
	
	.item-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}
	
	.item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		overflow: hidden;
	}
	
	.item-name {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.item-spec {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 20rpx;
	}
	
	.item-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.item-price {
		font-size: 36rpx;
		color: #FF6B35;
		font-weight: bold;
	}
	
	.quantity-control {
		display: flex;
		align-items: center;
		border: 1rpx solid #ddd;
		border-radius: 10rpx;
		overflow: hidden;
		flex-shrink: 0;
	}
	
	.quantity-btn {
		width: 60rpx;
		height: 60rpx;
		background-color: #f5f5f5;
		border: none;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.quantity-btn:disabled {
		opacity: 0.5;
	}
	
	.quantity {
		width: 80rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		font-size: 28rpx;
		background-color: #fff;
	}
	
	.item-delete {
		margin-left: 20rpx;
		padding: 10rpx;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	
	.delete-icon {
		font-size: 32rpx;
	}
	
	.bottom-bar {
		background-color: #fff;
		padding: 20rpx;
		display: flex;
		align-items: center;
		border-top: 1rpx solid #eee;
	}
	
	.select-all {
		display: flex;
		align-items: center;
		margin-right: 30rpx;
	}
	
	.select-all-text {
		margin-left: 10rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.total-info {
		flex: 1;
		display: flex;
		align-items: center;
	}
	
	.total-text {
		font-size: 28rpx;
		color: #333;
		margin-right: 10rpx;
	}
	
	.total-price {
		font-size: 36rpx;
		color: #FF6B35;
		font-weight: bold;
	}
	
	.checkout-btn {
		background-color: #FF6B35;
		color: #fff;
		border-radius: 50rpx;
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		border: none;
	}
	
	.checkout-btn.disabled {
		background-color: #ccc;
	}
</style>

