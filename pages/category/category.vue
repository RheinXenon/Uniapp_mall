<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input">
				<text class="search-icon">🔍</text>
				<input type="text" placeholder="搜索商品" v-model="searchKeyword" @confirm="onSearch" @input="onSearchInput" />
				<text class="clear-search" v-if="isSearchMode" @click="clearSearch">✕</text>
			</view>
		</view>
		
		<view class="category-content">
			<!-- 左侧分类列表 - 搜索模式下隐藏 -->
			<scroll-view class="category-sidebar" scroll-y="true" v-if="!isSearchMode">
				<view 
					class="category-item" 
					:class="{ active: currentCategory === index }"
					v-for="(category, index) in categories" 
					:key="index"
					@click="selectCategory(index)"
				>
					<text class="category-name">{{category.name}}</text>
				</view>
			</scroll-view>
			
			<!-- 右侧商品列表 -->
			<scroll-view class="product-content" :class="{ 'full-width': isSearchMode }" scroll-y="true">
				<!-- 搜索结果标题 -->
				<view class="search-result-header" v-if="isSearchMode">
					<text class="search-result-title">搜索结果 ({{currentProducts.length}})</text>
					<text class="search-keyword">关键词: {{searchKeyword}}</text>
				</view>
				
				<view class="product-grid">
					<view 
						class="product-item" 
						v-for="(product, index) in currentProducts" 
						:key="index"
						@click="goToProductDetail(product)"
					>
						<image :src="product.image" class="product-image"></image>
						<view class="product-info">
							<text class="product-name">{{product.name}}</text>
							<view class="product-price">
								<text class="current-price">¥{{product.price}}</text>
								<text class="original-price" v-if="product.originalPrice">¥{{product.originalPrice}}</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 无搜索结果提示 -->
				<view class="no-result" v-if="isSearchMode && currentProducts.length === 0">
					<text class="no-result-text">未找到相关商品</text>
					<text class="no-result-tip">请尝试其他关键词</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchKeyword: '',
				currentCategory: 0,
				isSearchMode: false,
				searchResults: [],
				categories: [],
				allProducts: [],
				productsData: null
			}
		},
		computed: {
			currentProducts() {
				// 如果处于搜索模式，返回搜索结果
				if (this.isSearchMode) {
					return this.searchResults
				}
				// 否则返回当前分类的商品
				return this.allProducts[this.currentCategory] || []
			},
			// 获取所有商品的扁平化数组，用于搜索
			flatProducts() {
				if (!this.productsData || !this.productsData.products) {
					return []
				}
				return this.productsData.products
			}
		},
		onLoad(options) {
			this.loadData()
			if (options.categoryId) {
				this.currentCategory = parseInt(options.categoryId) - 1
			}
		},
		methods: {
			loadData() {
				// 从 JSON 文件加载数据
				uni.request({
					url: '/static/data/products.json',
					method: 'GET',
					success: (res) => {
						if (res.statusCode === 200) {
							this.productsData = res.data
							this.categories = res.data.categories || []
							this.processProductsData()
						}
					},
					fail: (err) => {
						console.error('加载商品数据失败:', err)
						uni.showToast({
							title: '加载数据失败',
							icon: 'none'
						})
					}
				})
			},
			processProductsData() {
				// 按分类组织商品数据
				this.allProducts = []
				this.categories.forEach(category => {
					const categoryProducts = this.productsData.products.filter(product => 
						product.categoryId === category.id
					)
					this.allProducts.push(categoryProducts)
				})
			},
			selectCategory(index) {
				// 如果当前处于搜索模式，先清除搜索状态
				if (this.isSearchMode) {
					this.clearSearch()
				}
				this.currentCategory = index
			},
			onSearch() {
				// 执行搜索
				this.performSearch()
			},
			onSearchInput() {
				// 实时搜索（可选，这里我们在用户输入时也进行搜索）
				if (this.searchKeyword.trim()) {
					this.performSearch()
				} else {
					this.clearSearch()
				}
			},
			performSearch() {
				const keyword = this.searchKeyword.trim().toLowerCase()
				if (!keyword) {
					this.clearSearch()
					return
				}
				
				// 在所有商品中搜索
				this.searchResults = this.flatProducts.filter(product => {
					return product.name.toLowerCase().includes(keyword)
				})
				
				this.isSearchMode = true
				
				// 显示搜索结果提示
				if (this.searchResults.length === 0) {
					uni.showToast({
						title: '未找到相关商品',
						icon: 'none'
					})
				}
			},
			clearSearch() {
				this.searchKeyword = ''
				this.searchResults = []
				this.isSearchMode = false
			},
			goToProductDetail(product) {
				uni.navigateTo({
					url: `/pages/product/detail?id=${product.id}`
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
	
	.search-bar {
		background-color: #FF6B35;
		padding: 20rpx;
	}
	
	.search-input {
		background-color: #fff;
		border-radius: 50rpx;
		padding: 20rpx 30rpx;
		display: flex;
		align-items: center;
	}
	
	.search-icon {
		margin-right: 20rpx;
		font-size: 32rpx;
	}
	
	.clear-search {
		margin-left: 20rpx;
		font-size: 32rpx;
		color: #999;
		padding: 10rpx;
	}
	
	.category-content {
		flex: 1;
		display: flex;
		height: calc(100vh - 120rpx);
	}
	
	.category-sidebar {
		width: 200rpx;
		background-color: #fff;
		border-right: 1rpx solid #eee;
	}
	
	.category-item {
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #f5f5f5;
		text-align: center;
		position: relative;
	}
	
	.category-item.active {
		background-color: #FF6B35;
		color: #fff;
	}
	
	.category-item.active::after {
		content: '';
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 6rpx;
		height: 40rpx;
		background-color: #FF6B35;
	}
	
	.category-name {
		font-size: 28rpx;
	}
	
	.product-content {
		flex: 1;
		background-color: #fff;
		padding: 20rpx;
	}
	
	.product-content.full-width {
		width: 100%;
	}
	
	.search-result-header {
		margin-bottom: 30rpx;
		padding: 20rpx;
		background-color: #f8f8f8;
		border-radius: 10rpx;
	}
	
	.search-result-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.search-keyword {
		font-size: 28rpx;
		color: #666;
	}
	
	.no-result {
		text-align: center;
		padding: 100rpx 20rpx;
	}
	
	.no-result-text {
		font-size: 32rpx;
		color: #999;
		display: block;
		margin-bottom: 20rpx;
	}
	
	.no-result-tip {
		font-size: 28rpx;
		color: #ccc;
	}
	
	.product-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	
	.product-item {
		width: 48%;
		background-color: #f9f9f9;
		border-radius: 15rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
	}
	
	.product-image {
		width: 100%;
		height: 200rpx;
	}
	
	.product-info {
		padding: 20rpx;
	}
	
	.product-name {
		font-size: 28rpx;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.product-price {
		display: flex;
		align-items: center;
	}
	
	.current-price {
		font-size: 32rpx;
		color: #FF6B35;
		font-weight: bold;
		margin-right: 10rpx;
	}
	
	.original-price {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
	}
</style>

