import { create } from 'zustand'

export const useFileStore = create((set, get) => ({
  // State
  files: [],
  isLoading: false,
  error: null,
  uploadProgress: null,
  searchQuery: '',
  sortBy: 'date', // 'date', 'name', 'size'
  sortOrder: 'desc', // 'asc', 'desc'

  // Actions
  setFiles: (files) => set({ files }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),

  addFile: (file) => set((state) => ({
    files: [file, ...state.files]
  })),

  removeFile: (fileId) => set((state) => ({
    files: state.files.filter((f) => f.id !== fileId)
  })),

  // Computed
  getFilteredAndSortedFiles: () => {
    const state = get()
    let filtered = state.files

    if (state.searchQuery) {
      filtered = filtered.filter((f) =>
        f.filename.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    }

    let sorted = [...filtered]
    sorted.sort((a, b) => {
      let compareValue = 0

      if (state.sortBy === 'date') {
        compareValue = new Date(a.uploaded_at) - new Date(b.uploaded_at)
      } else if (state.sortBy === 'name') {
        compareValue = a.filename.localeCompare(b.filename)
      } else if (state.sortBy === 'size') {
        compareValue = a.size_bytes - b.size_bytes
      }

      return state.sortOrder === 'desc' ? -compareValue : compareValue
    })

    return sorted
  },

  getTotalStorageUsed: () => {
    return get().files.reduce((sum, f) => sum + f.size_bytes, 0)
  }
}))
