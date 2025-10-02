/**
 * 购物车数据管理工具
 * 使用本地存储和JSON文件来管理购物车数据
 */

class CartManager {
    constructor() {
        this.cartKey = 'shopping_cart_data'
        this.cartFilePath = '/static/data/cart.json'
    }

    /**
     * 获取购物车数据
     */
    async getCartData() {
        try {
            // 首先尝试从本地存储获取
            const localData = uni.getStorageSync(this.cartKey)
            if (localData && Array.isArray(localData)) {
                return localData
            }
            
            // 如果本地存储没有数据，尝试从JSON文件读取
            const fileData = await this.loadCartFromFile()
            if (fileData && Array.isArray(fileData)) {
                // 将文件数据同步到本地存储
                this.saveCartToLocal(fileData)
                return fileData
            }
            
            // 如果都没有数据，返回空数组
            return []
        } catch (error) {
            console.error('获取购物车数据失败:', error)
            return []
        }
    }

    /**
     * 从JSON文件加载购物车数据
     */
    async loadCartFromFile() {
        return new Promise((resolve) => {
            uni.request({
                url: this.cartFilePath,
                method: 'GET',
                success: (res) => {
                    if (res.statusCode === 200 && res.data) {
                        resolve(res.data.items || [])
                    } else {
                        resolve([])
                    }
                },
                fail: () => {
                    resolve([])
                }
            })
        })
    }

    /**
     * 保存购物车数据到本地存储
     */
    saveCartToLocal(cartData) {
        try {
            uni.setStorageSync(this.cartKey, cartData)
            return true
        } catch (error) {
            console.error('保存购物车数据到本地失败:', error)
            return false
        }
    }

    /**
     * 保存购物车数据到JSON文件
     */
    async saveCartToFile(cartData) {
        try {
            // 在实际应用中，这里需要调用后端API来保存数据
            // 由于uniapp的限制，我们主要使用本地存储
            const data = {
                items: cartData,
                updateTime: new Date().toISOString()
            }
            
            // 保存到本地存储
            this.saveCartToLocal(cartData)
            
            console.log('购物车数据已保存:', data)
            return true
        } catch (error) {
            console.error('保存购物车数据到文件失败:', error)
            return false
        }
    }

    /**
     * 添加商品到购物车
     */
    async addToCart(product, quantity = 1, spec = '') {
        try {
            const cartData = await this.getCartData()
            
            // 检查商品是否已经在购物车中
            const existingItemIndex = cartData.findIndex(item => 
                item.id === product.id && item.spec === spec
            )
            
            if (existingItemIndex > -1) {
                // 如果商品已存在，增加数量
                cartData[existingItemIndex].quantity += quantity
            } else {
                // 如果商品不存在，添加新商品
                const cartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    selected: true,
                    image: product.images ? product.images[0] : product.image,
                    spec: spec || this.getDefaultSpec(product),
                    addTime: new Date().toISOString()
                }
                cartData.push(cartItem)
            }
            
            // 保存更新后的数据
            await this.saveCartToFile(cartData)
            
            return {
                success: true,
                message: '已加入购物车',
                cartCount: this.getCartCount(cartData)
            }
        } catch (error) {
            console.error('添加商品到购物车失败:', error)
            return {
                success: false,
                message: '添加失败，请重试',
                cartCount: 0
            }
        }
    }

    /**
     * 从购物车移除商品
     */
    async removeFromCart(productId, spec = '') {
        try {
            const cartData = await this.getCartData()
            
            const filteredData = cartData.filter(item => 
                !(item.id === productId && item.spec === spec)
            )
            
            await this.saveCartToFile(filteredData)
            
            return {
                success: true,
                message: '商品已移除',
                cartCount: this.getCartCount(filteredData)
            }
        } catch (error) {
            console.error('移除购物车商品失败:', error)
            return {
                success: false,
                message: '移除失败，请重试'
            }
        }
    }

    /**
     * 更新购物车商品数量
     */
    async updateQuantity(productId, spec, quantity) {
        try {
            const cartData = await this.getCartData()
            
            const itemIndex = cartData.findIndex(item => 
                item.id === productId && item.spec === spec
            )
            
            if (itemIndex > -1) {
                if (quantity <= 0) {
                    // 如果数量为0或负数，移除商品
                    cartData.splice(itemIndex, 1)
                } else {
                    cartData[itemIndex].quantity = quantity
                }
                
                await this.saveCartToFile(cartData)
                
                return {
                    success: true,
                    cartCount: this.getCartCount(cartData)
                }
            }
            
            return { success: false, message: '商品不存在' }
        } catch (error) {
            console.error('更新购物车数量失败:', error)
            return { success: false, message: '更新失败' }
        }
    }

    /**
     * 清空购物车
     */
    async clearCart() {
        try {
            await this.saveCartToFile([])
            return { success: true, message: '购物车已清空' }
        } catch (error) {
            console.error('清空购物车失败:', error)
            return { success: false, message: '清空失败' }
        }
    }

    /**
     * 获取购物车商品总数
     */
    getCartCount(cartData) {
        if (!cartData || !Array.isArray(cartData)) {
            return 0
        }
        return cartData.reduce((total, item) => total + item.quantity, 0)
    }

    /**
     * 获取购物车总价
     */
    getCartTotal(cartData, selectedOnly = false) {
        if (!cartData || !Array.isArray(cartData)) {
            return 0
        }
        
        return cartData
            .filter(item => selectedOnly ? item.selected : true)
            .reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    /**
     * 获取默认规格描述
     */
    getDefaultSpec(product) {
        if (product.specs && product.specs.length > 0) {
            return product.specs.map(spec => spec.value).join(' ')
        }
        return '默认规格'
    }

    /**
     * 切换商品选中状态
     */
    async toggleItemSelection(productId, spec) {
        try {
            const cartData = await this.getCartData()
            
            const itemIndex = cartData.findIndex(item => 
                item.id === productId && item.spec === spec
            )
            
            if (itemIndex > -1) {
                cartData[itemIndex].selected = !cartData[itemIndex].selected
                await this.saveCartToFile(cartData)
                return { success: true, cartData }
            }
            
            return { success: false, message: '商品不存在' }
        } catch (error) {
            console.error('切换选中状态失败:', error)
            return { success: false, message: '操作失败' }
        }
    }

    /**
     * 全选/取消全选
     */
    async toggleSelectAll(selectAll) {
        try {
            const cartData = await this.getCartData()
            
            cartData.forEach(item => {
                item.selected = selectAll
            })
            
            await this.saveCartToFile(cartData)
            return { success: true, cartData }
        } catch (error) {
            console.error('全选操作失败:', error)
            return { success: false, message: '操作失败' }
        }
    }
}

// 创建购物车管理器实例
const cartManager = new CartManager()

export default cartManager
