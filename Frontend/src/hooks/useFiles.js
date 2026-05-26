import { useFileStore } from '../context/FileContext'
import { fileService } from '../services/api'
import toast from 'react-hot-toast'

export const useFiles = () => {
  const {
    files,
    isLoading,
    error,
    uploadProgress,
    searchQuery,
    setFiles,
    setIsLoading,
    setError,
    setUploadProgress,
    addFile,
    removeFile
  } = useFileStore()

  const loadFiles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fileService.listFiles()
      setFiles(data)
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load files'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const uploadFile = async (file) => {
    setError(null)
    try {
      const response = await fileService.uploadFile(file, (progress) => {
        setUploadProgress(progress)
      })

      if (response?.file) {
        addFile(response.file)
        toast.success('File uploaded successfully!')
      }
      setUploadProgress(null)
      return response
    } catch (err) {
      const message = err.response?.data?.detail || 'Upload failed'
      setError(message)
      toast.error(message)
      setUploadProgress(null)
      throw err
    }
  }

  const deleteFile = async (fileId) => {
    setError(null)
    try {
      await fileService.deleteFile(fileId)
      removeFile(fileId)
      toast.success('File deleted successfully!')
    } catch (err) {
      const message = err.response?.data?.detail || 'Delete failed'
      setError(message)
      toast.error(message)
      throw err
    }
  }

  const downloadFile = async (fileId, filename) => {
    try {
      const response = await fileService.getDownloadUrl(fileId)
      window.open(response.download_url, '_blank')
      toast.success('Download started')
    } catch (err) {
      const message = err.response?.data?.detail || 'Download failed'
      setError(message)
      toast.error(message)
    }
  }

  return {
    files,
    isLoading,
    error,
    uploadProgress,
    searchQuery,
    loadFiles,
    uploadFile,
    deleteFile,
    downloadFile,
    setSearchQuery: useFileStore((state) => state.setSearchQuery),
    getFilteredAndSortedFiles: useFileStore((state) => state.getFilteredAndSortedFiles),
    getTotalStorageUsed: useFileStore((state) => state.getTotalStorageUsed)
  }
}
