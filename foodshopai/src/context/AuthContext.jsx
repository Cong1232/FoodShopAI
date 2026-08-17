import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  // Tự động load profile nếu có token
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await authService.getProfile()
          if (res) {
            // Support multiple possible response formats
            const userData = res.data?.user || res.data || res.user || res;
            if (userData && userData._id) {
              setCurrentUser(userData)
            } else {
              logout()
            }
          } else {
            // Token không hợp lệ
            logout()
          }
        } catch (error) {
          console.error("Lỗi xác thực:", error)
          logout()
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [token])

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password)
      if (res) {
        const payload = res.data || res;
        const user = payload.user || payload;
        const accessToken = payload.accessToken || payload.token;
        
        if (user && accessToken) {
          setToken(accessToken)
          setCurrentUser(user)
          localStorage.setItem('token', accessToken)
          return { success: true }
        }
      }
      return { success: false, message: 'Phản hồi từ máy chủ không hợp lệ' }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Đăng nhập thất bại' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const res = await authService.register(userData)
      if (res) {
        const payload = res.data || res;
        const user = payload.user || payload;
        const accessToken = payload.accessToken || payload.token;

        if (user && accessToken) {
          setToken(accessToken)
          setCurrentUser(user)
          localStorage.setItem('token', accessToken)
          return { success: true }
        }
      }
      return { success: false, message: 'Phản hồi từ máy chủ không hợp lệ' }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Đăng ký thất bại' 
      }
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const value = {
    currentUser,
    token,
    login,
    register,
    logout,
    loading
  }

  // Đợi xác thực xong mới render app để tránh flicker UI
  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
