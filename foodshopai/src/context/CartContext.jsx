import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import cartService from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const SHIPPING_FEE = 20000
const FREE_SHIPPING_THRESHOLD = 300000

export function CartProvider({ children }) {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const mapItems = (backendItems) => {
    if (!backendItems) return []
    return backendItems.map(i => ({
      cartItemId: i.product._id,
      productId: i.product._id,
      name: i.product.name,
      image: i.product.images?.[0] || 'https://placehold.co/300x300',
      price: i.product.price,
      discountPrice: i.product.discountPrice,
      stock: i.product.stock,
      quantity: i.quantity,
    }))
  }

  const fetchCart = async () => {
    if (!token) {
      setItems([])
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const res = await cartService.getCart()
      if (res && res.data && res.data.items) {
        setItems(mapItems(res.data.items))
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [token])

  const addToCart = async (product, quantity = 1) => {
    if (!token) {
      return { success: false, message: 'Vui lòng đăng nhập để mua hàng' }
    }
    try {
      const res = await cartService.addToCart(product.id || product._id, quantity)
      if (res && res.data && res.data.items) setItems(mapItems(res.data.items))
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Có lỗi xảy ra' }
    }
  }

  const addMultipleToCart = async (productsArray) => {
    if (!token) return { success: false, message: 'Vui lòng đăng nhập để mua hàng' }
    
    let hasError = false;
    let errorMsg = '';
    
    for (const p of productsArray) {
      try {
        await cartService.addToCart(p._id, p.quantity);
      } catch (error) {
        hasError = true;
        errorMsg = error.response?.data?.message || `Lỗi khi thêm ${p.name}`;
      }
    }
    
    // Fetch lại giỏ hàng một lần cuối để update state tổng
    await fetchCart();
    
    if (hasError) return { success: false, message: errorMsg };
    return { success: true };
  }

  const increaseQuantity = async (productId) => {
    if (!token) return
    const item = items.find(i => i.productId === productId)
    if (item && item.quantity < item.stock) {
      try {
        const res = await cartService.updateCartItem(productId, item.quantity + 1)
        if (res && res.data && res.data.items) setItems(mapItems(res.data.items))
      } catch (error) {
        console.error(error)
      }
    }
  }

  const decreaseQuantity = async (productId) => {
    if (!token) return
    const item = items.find(i => i.productId === productId)
    if (item && item.quantity > 1) {
      try {
        const res = await cartService.updateCartItem(productId, item.quantity - 1)
        if (res && res.data && res.data.items) setItems(mapItems(res.data.items))
      } catch (error) {
        console.error(error)
      }
    }
  }

  const updateQuantity = async (productId, qty) => {
    if (!token) return
    const item = items.find(i => i.productId === productId)
    if (item) {
      try {
        const res = await cartService.updateCartItem(productId, qty)
        if (res && res.data && res.data.items) setItems(mapItems(res.data.items))
      } catch (error) {
        console.error(error)
      }
    }
  }

  const removeFromCart = async (productId) => {
    if (!token) return
    try {
      const res = await cartService.removeCartItem(productId)
      if (res && res.data && res.data.items) setItems(mapItems(res.data.items))
    } catch (error) {
      console.error(error)
    }
  }

  const clearCart = async () => {
    if (!token) return
    try {
      const res = await cartService.clearCart()
      if (res && res.data && res.data.items) setItems(mapItems(res.data.items))
    } catch (error) {
      console.error(error)
    }
  }

  const applyVoucher = () => false
  const removeVoucher = () => {}

  const cartSubtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const currentPrice = item.discountPrice ?? item.price
      return total + currentPrice * item.quantity
    }, 0)
  }, [items])

  const cartItemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }, [items])

  const cartDiscount = 0
  const cartShipping = cartItemCount === 0 ? 0 : (cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE)
  const cartTotal = cartSubtotal - cartDiscount + cartShipping

  const value = {
    items,
    loading,
    cartItemCount,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    addToCart,
    addMultipleToCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal: cartSubtotal,
    discountAmount: cartDiscount,
    shippingFee: cartShipping,
    total: cartTotal,
    voucherCode: null,
    voucherError: '',
    applyVoucher,
    removeVoucher,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
