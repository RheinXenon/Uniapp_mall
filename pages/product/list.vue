<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input">
				<text class="search-icon">🔍</text>
				<input type="text" placeholder="搜索商品" v-model="searchKeyword" @confirm="onSearch" />
			</view>
		</view>
		
		<!-- 筛选栏 -->
		<view class="filter-bar">
			<view class="filter-item" :class="{ active: sortType === 'default' }" @click="changeSort('default')">
				<text>综合</text>
			</view>
			<view class="filter-item" :class="{ active: sortType === 'sales' }" @click="changeSort('sales')">
				<text>销量</text>
			</view>
			<view class="filter-item" :class="{ active: sortType === 'price' }" @click="changeSort('price')">
				<text>价格</text>
				<view class="price-arrows" v-if="sortType === 'price'">
					<text class="arrow" :class="{ active: priceOrder === 'asc' }">↑</text>
					<text class="arrow" :class="{ active: priceOrder === 'desc' }">↓</text>
				</view>
			</view>
			<view class="filter-item" :class="{ active: sortType === 'new' }" @click="changeSort('new')">
				<text>新品</text>
			</view>
		</view>
		
		<!-- 商品列表 -->
		<scroll-view class="product-list" scroll-y="true" @scrolltolower="loadMore">
			<view class="product-item" v-for="(product, index) in productList" :key="index" @click="goToProductDetail(product)">
				<image :src="product.image" class="product-image"></image>
				<view class="product-info">
					<text class="product-name">{{product.name}}</text>
					<text class="product-desc">{{product.desc}}</text>
					<view class="product-tags">
						<text class="tag" v-for="(tag, tagIndex) in product.tags" :key="tagIndex">{{tag}}</text>
					</view>
					<view class="product-bottom">
						<view class="product-price">
							<text class="current-price">¥{{product.price}}</text>
							<text class="original-price" v-if="product.originalPrice">¥{{product.originalPrice}}</text>
						</view>
						<view class="product-sales">
							<text>已售{{product.sales}}件</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class="load-more" v-if="hasMore">
				<text v-if="loading">加载中...</text>
				<text v-else>上拉加载更多</text>
			</view>
			<view class="no-more" v-else>
				<text>没有更多商品了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchKeyword: '',
				sortType: 'default',
				priceOrder: 'asc',
				loading: false,
				hasMore: true,
				page: 1,
				pageSize: 10,
				productList: [],
				allProducts: [],
				categoryId: null,
				categoryName: ''
			}
		},
		onLoad(options) {
			if (options.categoryId) {
				this.categoryId = options.categoryId
				this.categoryName = options.categoryName
			}
			this.loadProducts()
		},
		methods: {
			async loadProducts() {
				this.loading = true
				try {
					// 如果是第一页，从JSON加载数据
					if (this.page === 1) {
						const res = await uni.request({
							url: '/static/data/products.json',
							method: 'GET'
						})
						
						if (res.data && res.data.products) {
							this.allProducts = res.data.products
							
							// 根据分类筛选
							let filteredProducts = this.allProducts
							if (this.categoryId) {
								filteredProducts = this.allProducts.filter(product => product.categoryId == this.categoryId)
							}
							
							// 根据搜索关键词筛选
							if (this.searchKeyword) {
								filteredProducts = filteredProducts.filter(product => 
									product.name.includes(this.searchKeyword) || 
									product.desc.includes(this.searchKeyword)
								)
							}
							
							// 排序
							filteredProducts = this.sortProducts(filteredProducts)
							
							// 分页
							const startIndex = (this.page - 1) * this.pageSize
							const endIndex = startIndex + this.pageSize
							this.productList = filteredProducts.slice(startIndex, endIndex)
							
							// 判断是否还有更多数据
							this.hasMore = endIndex < filteredProducts.length
						}
					} else {
						// 加载更多数据
						const startIndex = (this.page - 1) * this.pageSize
						const endIndex = startIndex + this.pageSize
						const moreProducts = this.allProducts.slice(startIndex, endIndex)
						
						if (moreProducts.length > 0) {
							this.productList = [...this.productList, ...moreProducts]
							this.hasMore = endIndex < this.allProducts.length
						} else {
							this.hasMore = false
						}
					}
					
					this.loading = false
				} catch (error) {
					console.error('加载商品数据失败:', error)
					this.loading = false
					uni.showToast({
						title: '数据加载失败',
						icon: 'error'
					})
				}
			},
			loadMore() {
				if (this.loading || !this.hasMore) return
				this.page++
				this.loadProducts()
			},
			onSearch() {
				console.log('搜索:', this.searchKeyword)
				this.page = 1
				this.hasMore = true
				this.loadProducts()
			},
			changeSort(type) {
				if (type === 'price') {
					if (this.sortType === 'price') {
						this.priceOrder = this.priceOrder === 'asc' ? 'desc' : 'asc'
					} else {
						this.priceOrder = 'asc'
					}
				}
				this.sortType = type
				this.page = 1
				this.hasMore = true
				this.loadProducts()
			},
			sortProducts(products) {
				if (!products) return products
				
				switch (this.sortType) {
					case 'sales':
						return products.sort((a, b) => b.sales - a.sales)
					case 'price':
						return products.sort((a, b) => {
							return this.priceOrder === 'asc' ? a.price - b.price : b.price - a.price
						})
					case 'new':
						return products.sort((a, b) => b.id - a.id)
					default:
						return products
				}
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
	
	.filter-bar {
		background-color: #fff;
		display: flex;
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
	}
	
	.filter-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.filter-item.active {
		color: #FF6B35;
		font-weight: bold;
	}
	
	.price-arrows {
		display: flex;
		flex-direction: column;
		margin-left: 10rpx;
	}
	
	.arrow {
		font-size: 20rpx;
		line-height: 1;
		color: #ccc;
	}
	
	.arrow.active {
		color: #FF6B35;
	}
	
	.product-list {
		flex: 1;
		padding: 20rpx;
	}
	
	.product-item {
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;
		display: flex;
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
	}
	
	.product-name {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.product-desc {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 15rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.product-tags {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}
	
	.tag {
		background-color: #FF6B35;
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
	}
	
	.product-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
	}
	
	.product-price {
		display: flex;
		align-items: center;
	}
	
	.current-price {
		font-size: 36rpx;
		color: #FF6B35;
		font-weight: bold;
		margin-right: 10rpx;
	}
	
	.original-price {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
	}
	
	.product-sales {
		font-size: 24rpx;
		color: #999;
	}
	
	.load-more, .no-more {
		text-align: center;
		padding: 40rpx;
		color: #999;
		font-size: 28rpx;
	}
</style>

