<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="header">
			<text class="title">我的收藏</text>
			<view class="header-actions">
				<text class="edit-btn" @click="toggleEditMode">{{isEditMode ? '完成' : '编辑'}}</text>
			</view>
		</view>
		
		<!-- 收藏统计 -->
		<view class="stats-section">
			<view class="stats-item">
				<text class="stats-number">{{favorites.length}}</text>
				<text class="stats-label">收藏商品</text>
			</view>
			<view class="stats-item">
				<text class="stats-number">{{totalPrice}}</text>
				<text class="stats-label">总价值</text>
			</view>
		</view>
		
		<!-- 筛选和排序 -->
		<view class="filter-section">
			<view class="filter-tabs">
				<text 
					class="filter-tab" 
					:class="{active: currentFilter === 'all'}"
					@click="setFilter('all')"
				>全部</text>
				<text 
					class="filter-tab" 
					:class="{active: currentFilter === 'digital'}"
					@click="setFilter('digital')"
				>数码</text>
				<text 
					class="filter-tab" 
					:class="{active: currentFilter === 'clothing'}"
					@click="setFilter('clothing')"
				>服装</text>
				<text 
					class="filter-tab" 
					:class="{active: currentFilter === 'food'}"
					@click="setFilter('food')"
				>食品</text>
			</view>
			<view class="sort-section">
				<text class="sort-label">排序：</text>
				<picker @change="onSortChange" :value="sortIndex" :range="sortOptions">
					<text class="sort-picker">{{sortOptions[sortIndex]}}</text>
				</picker>
			</view>
		</view>
		
		<!-- 收藏列表 -->
		<view class="favorites-list" v-if="filteredFavorites.length > 0">
			<view 
				class="favorite-item" 
				v-for="item in filteredFavorites" 
				:key="item.id"
				@click="goToProductDetail(item)"
			>
				<!-- 编辑模式选择框 -->
				<view class="select-box" v-if="isEditMode">
					<checkbox 
						:checked="selectedItems.includes(item.id)" 
						@change="toggleSelect(item.id)"
					/>
				</view>
				
				<!-- 商品图片 -->
				<image class="product-image" :src="item.image" mode="aspectFill"></image>
				
				<!-- 商品信息 -->
				<view class="product-info">
					<text class="product-name">{{item.name}}</text>
					<text class="product-desc">{{item.desc}}</text>
					<view class="product-tags">
						<text class="tag" v-for="tag in item.tags" :key="tag">{{tag}}</text>
					</view>
					<view class="product-price">
						<text class="current-price">¥{{item.price}}</text>
						<text class="original-price" v-if="item.originalPrice > item.price">¥{{item.originalPrice}}</text>
					</view>
					<view class="product-meta">
						<text class="sales">已售{{item.sales}}件</text>
						<text class="category">{{item.categoryName}}</text>
					</view>
				</view>
				
				<!-- 操作按钮 -->
				<view class="action-buttons">
					<button class="action-btn add-cart" @click.stop="addToCart(item)">
						<text class="btn-icon">🛒</text>
						<text class="btn-text">加购物车</text>
					</button>
					<button class="action-btn remove-favorite" @click.stop="removeFavorite(item.id)">
						<text class="btn-icon">❤️</text>
						<text class="btn-text">取消收藏</text>
					</button>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<text class="empty-icon">❤️</text>
			<text class="empty-title">暂无收藏商品</text>
			<text class="empty-desc">快去收藏一些心仪的商品吧</text>
			<button class="go-shopping-btn" @click="goShopping">去逛逛</button>
		</view>
		
		<!-- 批量操作 -->
		<view class="batch-actions" v-if="isEditMode && selectedItems.length > 0">
			<view class="batch-info">
				<text>已选择 {{selectedItems.length}} 件商品</text>
			</view>
			<view class="batch-buttons">
				<button class="batch-btn add-all-cart" @click="addAllToCart">全部加购物车</button>
				<button class="batch-btn remove-all" @click="removeAllSelected">取消收藏</button>
			</view>
		</view>
	</view>
</template>

<script>
	import favoritesManager from '../../utils/favoritesManager.js'
	import cartManager from '../../utils/cartManager.js'
	
	export default {
		data() {
			return {
				favorites: [],
				isEditMode: false,
				selectedItems: [],
				currentFilter: 'all',
				sortIndex: 0,
				sortOptions: ['收藏时间', '价格从低到高', '价格从高到低', '销量从高到低']
			}
		},
		computed: {
			filteredFavorites() {
				let filtered = this.favorites
				
				// 按分类筛选
				if (this.currentFilter !== 'all') {
					const categoryMap = {
						'digital': '数码',
						'clothing': '服装', 
						'food': '食品'
					}
					filtered = filtered.filter(item => item.categoryName === categoryMap[this.currentFilter])
				}
				
				// 排序
				switch(this.sortIndex) {
					case 0: // 收藏时间
						filtered = filtered.sort((a, b) => new Date(b.favoriteTime) - new Date(a.favoriteTime))
						break
					case 1: // 价格从低到高
						filtered = filtered.sort((a, b) => a.price - b.price)
						break
					case 2: // 价格从高到低
						filtered = filtered.sort((a, b) => b.price - a.price)
						break
					case 3: // 销量从高到低
						filtered = filtered.sort((a, b) => b.sales - a.sales)
						break
				}
				
				return filtered
			},
			totalPrice() {
				return this.favorites.reduce((total, item) => total + item.price, 0)
			}
		},
		onLoad() {
			this.loadFavorites()
		},
		onShow() {
			this.loadFavorites()
		},
		methods: {
			// 加载收藏数据
			loadFavorites() {
				this.favorites = favoritesManager.getFavorites()
			},
			
			// 切换编辑模式
			toggleEditMode() {
				this.isEditMode = !this.isEditMode
				if (!this.isEditMode) {
					this.selectedItems = []
				}
			},
			
			// 设置筛选条件
			setFilter(filter) {
				this.currentFilter = filter
			},
			
			// 排序改变
			onSortChange(e) {
				this.sortIndex = e.detail.value
			},
			
			// 切换选择状态
			toggleSelect(productId) {
				const index = this.selectedItems.indexOf(productId)
				if (index > -1) {
					this.selectedItems.splice(index, 1)
				} else {
					this.selectedItems.push(productId)
				}
			},
			
			// 跳转到商品详情
			goToProductDetail(product) {
				uni.navigateTo({
					url: `/pages/product/detail?id=${product.id}`
				})
			},
			
			// 添加到购物车
			addToCart(product) {
				cartManager.addToCart(product.id, 1)
				uni.showToast({
					title: '已添加到购物车',
					icon: 'success'
				})
			},
			
			// 取消收藏
			removeFavorite(productId) {
				uni.showModal({
					title: '确认取消收藏',
					content: '确定要取消收藏这个商品吗？',
					success: (res) => {
						if (res.confirm) {
							favoritesManager.removeFavorite(productId)
							this.loadFavorites()
							uni.showToast({
								title: '已取消收藏',
								icon: 'success'
							})
						}
					}
				})
			},
			
			// 全部加购物车
			addAllToCart() {
				this.selectedItems.forEach(productId => {
					cartManager.addToCart(productId, 1)
				})
				uni.showToast({
					title: `已添加${this.selectedItems.length}件商品到购物车`,
					icon: 'success'
				})
				this.selectedItems = []
			},
			
			// 取消全部选中商品的收藏
			removeAllSelected() {
				uni.showModal({
					title: '确认批量取消收藏',
					content: `确定要取消收藏选中的${this.selectedItems.length}件商品吗？`,
					success: (res) => {
						if (res.confirm) {
							this.selectedItems.forEach(productId => {
								favoritesManager.removeFavorite(productId)
							})
							this.loadFavorites()
							this.selectedItems = []
							uni.showToast({
								title: '已批量取消收藏',
								icon: 'success'
							})
						}
					}
				})
			},
			
			// 去购物
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
		min-height: 100vh;
	}
	
	.header {
		background-color: #fff;
		padding: 20rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
	
	.edit-btn {
		font-size: 28rpx;
		color: #FF6B35;
		padding: 10rpx 20rpx;
		border: 1rpx solid #FF6B35;
		border-radius: 20rpx;
	}
	
	.stats-section {
		background-color: #fff;
		margin: 20rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		display: flex;
		justify-content: space-around;
	}
	
	.stats-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.stats-number {
		font-size: 48rpx;
		font-weight: bold;
		color: #FF6B35;
		margin-bottom: 10rpx;
	}
	
	.stats-label {
		font-size: 24rpx;
		color: #666;
	}
	
	.filter-section {
		background-color: #fff;
		margin: 0 20rpx 20rpx;
		border-radius: 20rpx;
		padding: 30rpx;
	}
	
	.filter-tabs {
		display: flex;
		margin-bottom: 20rpx;
	}
	
	.filter-tab {
		font-size: 28rpx;
		color: #666;
		padding: 10rpx 20rpx;
		margin-right: 20rpx;
		border-radius: 20rpx;
		background-color: #f5f5f5;
	}
	
	.filter-tab.active {
		background-color: #FF6B35;
		color: #fff;
	}
	
	.sort-section {
		display: flex;
		align-items: center;
	}
	
	.sort-label {
		font-size: 28rpx;
		color: #666;
		margin-right: 20rpx;
	}
	
	.sort-picker {
		font-size: 28rpx;
		color: #FF6B35;
		padding: 10rpx 20rpx;
		border: 1rpx solid #FF6B35;
		border-radius: 20rpx;
	}
	
	.favorites-list {
		padding: 0 20rpx;
	}
	
	.favorite-item {
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		padding: 30rpx;
		display: flex;
		position: relative;
	}
	
	.select-box {
		margin-right: 20rpx;
		display: flex;
		align-items: center;
	}
	
	.product-image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 15rpx;
		margin-right: 20rpx;
	}
	
	.product-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.product-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	.product-desc {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	.product-tags {
		margin-bottom: 10rpx;
	}
	
	.tag {
		font-size: 20rpx;
		color: #FF6B35;
		background-color: #FFF5F0;
		padding: 4rpx 8rpx;
		border-radius: 8rpx;
		margin-right: 10rpx;
	}
	
	.product-price {
		margin-bottom: 10rpx;
	}
	
	.current-price {
		font-size: 32rpx;
		font-weight: bold;
		color: #FF6B35;
		margin-right: 10rpx;
	}
	
	.original-price {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
	}
	
	.product-meta {
		display: flex;
		justify-content: space-between;
	}
	
	.sales, .category {
		font-size: 22rpx;
		color: #999;
	}
	
	.action-buttons {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-left: 20rpx;
	}
	
	.action-btn {
		background-color: #FF6B35;
		color: #fff;
		border: none;
		border-radius: 25rpx;
		padding: 15rpx 20rpx;
		font-size: 24rpx;
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 120rpx;
	}
	
	.action-btn.add-cart {
		background-color: #FF6B35;
	}
	
	.action-btn.remove-favorite {
		background-color: #f5f5f5;
		color: #666;
	}
	
	.btn-icon {
		font-size: 28rpx;
		margin-bottom: 5rpx;
	}
	
	.btn-text {
		font-size: 20rpx;
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 100rpx 40rpx;
	}
	
	.empty-icon {
		font-size: 120rpx;
		margin-bottom: 30rpx;
	}
	
	.empty-title {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.empty-desc {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 40rpx;
	}
	
	.go-shopping-btn {
		background-color: #FF6B35;
		color: #fff;
		border: none;
		border-radius: 50rpx;
		padding: 25rpx 50rpx;
		font-size: 28rpx;
	}
	
	.batch-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #f0f0f0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.batch-info {
		font-size: 28rpx;
		color: #333;
	}
	
	.batch-buttons {
		display: flex;
	}
	
	.batch-btn {
		background-color: #FF6B35;
		color: #fff;
		border: none;
		border-radius: 25rpx;
		padding: 15rpx 25rpx;
		font-size: 24rpx;
		margin-left: 20rpx;
	}
	
	.batch-btn.add-all-cart {
		background-color: #FF6B35;
	}
	
	.batch-btn.remove-all {
		background-color: #f5f5f5;
		color: #666;
	}
</style>
