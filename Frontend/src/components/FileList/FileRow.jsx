import { useState } from 'react'
import { useFiles } from '../../hooks/useFiles'
import { getFileIconComponent } from '../../utils/icons'
import { formatBytes, formatDate } from '../../utils/helpers'
import { Download, Trash2, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export function FileRow({ file }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteFile, downloadFile } = useFiles()
  const FileIcon = getFileIconComponent(file.content_type)

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this file?')) return

    setIsDeleting(true)
    try {
      await deleteFile(file.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = async () => {
    await downloadFile(file.id, file.filename)
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <FileIcon className="text-gray-400" size={20} />
          <span className="text-sm font-medium text-gray-900 truncate">
            {file.filename}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatBytes(file.size_bytes)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDate(file.uploaded_at)}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600 hover:text-gray-900"
            title="Download"
          >
            <Download size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:bg-red-100 rounded-lg transition text-gray-600 hover:text-red-600 disabled:opacity-50"
            title="Delete"
          >
            {isDeleting ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}
