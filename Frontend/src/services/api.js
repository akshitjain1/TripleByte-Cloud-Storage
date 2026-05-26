import apiClient from './apiClient'

export const authService = {
  /**
   * Register a new user
   * POST /auth/register
   */
  register: async (email, password) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password
    })
    return response.data
  },

  /**
   * Login user
   * POST /auth/login (OAuth2 form data)
   */
  login: async (email, password) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)

    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response.data // { access_token, token_type }
  },

  /**
   * Get current user info
   * GET /auth/me
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  }
}

export const fileService = {
  /**
   * Upload a file
   * POST /files/upload
   */
  uploadFile: async (file, onProgress) => {
    const formData = new FormData()
    formData.append('uploaded_file', file)

    const response = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      }
    })
    return response.data
  },

  /**
   * List all files for current user
   * GET /files
   */
  listFiles: async () => {
    const response = await apiClient.get('/files')
    return response.data
  },

  /**
   * Get download URL for a file
   * GET /files/{file_id}/download
   */
  getDownloadUrl: async (fileId) => {
    const response = await apiClient.get(`/files/${fileId}/download`)
    return response.data
  },

  /**
   * Delete a file
   * DELETE /files/{file_id}
   */
  deleteFile: async (fileId) => {
    const response = await apiClient.delete(`/files/${fileId}`)
    return response.data
  }
}

export const healthService = {
  /**
   * Check API health
   * GET /health
   */
  checkHealth: async () => {
    const response = await apiClient.get('/health')
    return response.data
  },

  /**
   * Check database health
   * GET /health/db
   */
  checkDatabaseHealth: async () => {
    const response = await apiClient.get('/health/db')
    return response.data
  },

  /**
   * Check S3 health
   * GET /health/s3
   */
  checkS3Health: async () => {
    const response = await apiClient.get('/health/s3')
    return response.data
  }
}
