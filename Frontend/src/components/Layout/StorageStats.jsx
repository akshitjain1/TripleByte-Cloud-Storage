import { useFiles } from '../../hooks/useFiles'
import { useAuth } from '../../hooks/useAuth'
import { HardDrive, Files, Clock } from 'lucide-react'
import { formatBytes, formatDate } from '../../utils/helpers'

export function StorageStats() {
  const { user } = useAuth()
  const { files, getTotalStorageUsed } = useFiles()

  const totalSize = getTotalStorageUsed()
  const maxSize = 5 * 1024 * 1024 * 100 // Assuming 100 files * 5MB = 500MB max

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Files */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Files className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Files</p>
            <p className="text-2xl font-bold text-gray-900">{files.length}</p>
          </div>
        </div>
      </div>

      {/* Storage Used */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <HardDrive className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Storage Used</p>
            <p className="text-2xl font-bold text-gray-900">{formatBytes(totalSize)}</p>
          </div>
        </div>
      </div>

      {/* Member Since */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Clock className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-sm font-semibold text-gray-900">
              {user ? formatDate(user.created_at).split(',')[0] : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
