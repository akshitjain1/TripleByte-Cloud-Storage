export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getFileIcon = (contentType) => {
  if (!contentType) return 'file'

  if (contentType.includes('pdf')) return 'pdf'
  if (contentType.includes('image')) return 'image'
  if (contentType.includes('text')) return 'text'
  if (contentType.includes('word') || contentType.includes('document')) return 'document'

  return 'file'
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  const errors = []
  if (password.length < 8) errors.push('Password must be at least 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter')
  if (!/[0-9]/.test(password)) errors.push('Password must contain a number')
  return errors
}
