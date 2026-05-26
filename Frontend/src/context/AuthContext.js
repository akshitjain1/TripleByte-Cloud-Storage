import { create } from 'zustand'

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, error: null })
  },

  isAuthenticated: () => get().token !== null
}))
