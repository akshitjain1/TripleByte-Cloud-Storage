import { useState, useRef } from 'react'
import { useFiles } from '../../hooks/useFiles'
import { Upload, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function FileUploadDropzone() {
  const fileInputRef = useRef(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { uploadFile, uploadProgress } = useFiles()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`File type not allowed: ${file.type}`)
      return false
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 5MB limit')
      return false
    }

    return true
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFiles = async (files) => {
    for (const file of files) {
      if (!validateFile(file)) continue

      setIsUploading(true)
      try {
        await uploadFile(file)
      } catch (err) {
        console.error('Upload error:', err)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative p-8 border-2 border-dashed rounded-lg cursor-pointer transition ${
        isDragActive
          ? 'border-primary-600 bg-primary-50'
          : 'border-gray-300 bg-gray-50 hover:border-primary-500'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleInputChange}
        disabled={isUploading}
        className="hidden"
        accept={ALLOWED_TYPES.join(',')}
      />

      <div className="flex flex-col items-center justify-center py-4">
        {uploadProgress !== null ? (
          <>
            <div className="mb-4 flex items-center gap-2">
              {uploadProgress === 100 ? (
                <CheckCircle className="text-green-500" size={32} />
              ) : (
                <Upload className="text-primary-600 animate-pulse" size={32} />
              )}
            </div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {uploadProgress === 100 ? 'Upload complete!' : `Uploading... ${uploadProgress}%`}
            </p>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <Upload className="text-gray-400 mb-3" size={40} />
            <p className="text-sm font-medium text-gray-700">
              Drag files here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, Text, PNG, JPEG, DOCX • Max 5MB
            </p>
          </>
        )}
      </div>
    </div>
  )
}
