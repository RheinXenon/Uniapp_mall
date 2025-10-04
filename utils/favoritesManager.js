/**
 * 收藏管理工具
 * 提供收藏商品的增删改查功能
 */

class FavoritesManager {
	constructor() {
		this.storageKey = 'user_favorites'
		this.favorites = this.loadFromStorage()
	}

	/**
	 * 从本地存储加载收藏数据
	 */
	loadFromStorage() {
		try {
			const data = uni.getStorageSync(this.storageKey)
			return data ? JSON.parse(data) : []
		} catch (error) {
			console.error('加载收藏数据失败:', error)
			return []
		}
	}

	/**
	 * 保存收藏数据到本地存储
	 */
	saveToStorage() {
		try {
			uni.setStorageSync(this.storageKey, JSON.stringify(this.favorites))
			return true
		} catch (error) {
			console.error('保存收藏数据失败:', error)
			return false
		}
	}

	/**
	 * 获取所有收藏商品
	 */
	getFavorites() {
		return this.favorites
	}

	/**
	 * 添加商品到收藏
	 * @param {Object} product - 商品信息
	 */
	addToFavorites(product) {
		// 检查是否已经收藏
		const existingIndex = this.favorites.findIndex(item => item.id === product.id)
		
		if (existingIndex > -1) {
			// 更新收藏时间
			this.favorites[existingIndex].favoriteTime = new Date().toISOString()
			this.saveToStorage()
			return {
				success: true,
				message: '商品已在收藏列表中，已更新收藏时间'
			}
		}

		// 添加新收藏
		const favoriteItem = {
			...product,
			favoriteTime: new Date().toISOString()
		}
		
		this.favorites.unshift(favoriteItem) // 添加到开头
		const success = this.saveToStorage()
		
		return {
			success: success,
			message: success ? '已添加到收藏' : '添加收藏失败'
		}
	}

	/**
	 * 从收藏中移除商品
	 * @param {number} productId - 商品ID
	 */
	removeFavorite(productId) {
		const index = this.favorites.findIndex(item => item.id === productId)
		
		if (index > -1) {
			this.favorites.splice(index, 1)
			const success = this.saveToStorage()
			return {
				success: success,
				message: success ? '已取消收藏' : '取消收藏失败'
			}
		}
		
		return {
			success: false,
			message: '商品不在收藏列表中'
		}
	}

	/**
	 * 检查商品是否已收藏
	 * @param {number} productId - 商品ID
	 */
	isFavorite(productId) {
		return this.favorites.some(item => item.id === productId)
	}

	/**
	 * 获取收藏商品数量
	 */
	getFavoriteCount() {
		return this.favorites.length
	}

	/**
	 * 批量移除收藏
	 * @param {Array} productIds - 商品ID数组
	 */
	removeMultipleFavorites(productIds) {
		const removedCount = this.favorites.length
		this.favorites = this.favorites.filter(item => !productIds.includes(item.id))
		const success = this.saveToStorage()
		
		return {
			success: success,
			removedCount: removedCount - this.favorites.length,
			message: success ? `已移除${removedCount - this.favorites.length}个收藏` : '批量移除失败'
		}
	}

	/**
	 * 清空所有收藏
	 */
	clearAllFavorites() {
		this.favorites = []
		const success = this.saveToStorage()
		
		return {
			success: success,
			message: success ? '已清空所有收藏' : '清空收藏失败'
		}
	}

	/**
	 * 按分类获取收藏商品
	 * @param {string} categoryName - 分类名称
	 */
	getFavoritesByCategory(categoryName) {
		return this.favorites.filter(item => item.categoryName === categoryName)
	}

	/**
	 * 搜索收藏商品
	 * @param {string} keyword - 搜索关键词
	 */
	searchFavorites(keyword) {
		if (!keyword) return this.favorites
		
		const lowerKeyword = keyword.toLowerCase()
		return this.favorites.filter(item => 
			item.name.toLowerCase().includes(lowerKeyword) ||
			item.desc.toLowerCase().includes(lowerKeyword) ||
			item.categoryName.toLowerCase().includes(lowerKeyword)
		)
	}

	/**
	 * 获取收藏商品的价格统计
	 */
	getPriceStats() {
		if (this.favorites.length === 0) {
			return {
				total: 0,
				average: 0,
				min: 0,
				max: 0
			}
		}

		const prices = this.favorites.map(item => item.price)
		const total = prices.reduce((sum, price) => sum + price, 0)
		
		return {
			total: total,
			average: Math.round(total / prices.length),
			min: Math.min(...prices),
			max: Math.max(...prices)
		}
	}

	/**
	 * 导出收藏数据
	 */
	exportFavorites() {
		return {
			favorites: this.favorites,
			exportTime: new Date().toISOString(),
			count: this.favorites.length
		}
	}

	/**
	 * 导入收藏数据
	 * @param {Array} favoritesData - 收藏数据
	 */
	importFavorites(favoritesData) {
		if (!Array.isArray(favoritesData)) {
			return {
				success: false,
				message: '数据格式错误'
			}
		}

		// 合并数据，避免重复
		const existingIds = this.favorites.map(item => item.id)
		const newFavorites = favoritesData.filter(item => !existingIds.includes(item.id))
		
		this.favorites = [...this.favorites, ...newFavorites]
		const success = this.saveToStorage()
		
		return {
			success: success,
			importedCount: newFavorites.length,
			message: success ? `已导入${newFavorites.length}个收藏` : '导入失败'
		}
	}

	/**
	 * 同步收藏数据到服务器（模拟）
	 * @param {string} userId - 用户ID
	 */
	async syncToServer(userId) {
		try {
			// 这里应该调用实际的API
			// const response = await uni.request({
			//   url: '/api/favorites/sync',
			//   method: 'POST',
			//   data: {
			//     userId: userId,
			//     favorites: this.favorites
			//   }
			// })
			
			// 模拟API调用
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve({
						success: true,
						message: '收藏数据同步成功',
						syncedCount: this.favorites.length
					})
				}, 1000)
			})
		} catch (error) {
			return {
				success: false,
				message: '同步失败: ' + error.message
			}
		}
	}
}

// 创建单例实例
const favoritesManager = new FavoritesManager()

export default favoritesManager
