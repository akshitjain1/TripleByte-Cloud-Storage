import { useEffect } from 'react'
import { useAuthStore } from '../context/AuthContext'
import { authService } from '../services/api'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const { user, token, isLoading, error, setUser, setToken, setIsLoading, setError, logout, isAuthenticated: isAuthFunc } = useAuthStore()

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authService.login(email, password)
      setToken(data.access_token)

      // Fetch current user info
      const userData = await authService.getCurrentUser()
      setUser(userData)
      toast.success('Login successful!')
      return userData
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed'
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await authService.register(email, password)
      toast.success('Registration successful! Please login.')
      return userData
    } catch (err) {
      const message = err.response?.data?.detail || 'Registration failed'
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentUser = async () => {
    if (!token) return null
    try {
      const userData = await authService.getCurrentUser()
      setUser(userData)
      return userData
    } catch (err) {
      logout()
      return null
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    getCurrentUser,
    logout: handleLogout,
    isAuthenticated: isAuthFunc
  }
}
