import { useFiles } from '../../hooks/useFiles'
import { FileListTable } from './FileListTable'
import { FileSearch } from './FileSearch'
import { Loader } from 'lucide-react'

export function FileList() {
  const { isLoading, error, loadFiles, getFilteredAndSortedFiles } = useFiles()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadFiles}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  const files = getFilteredAndSortedFiles()

  return (
    <div className="space-y-4">
      <FileSearch />

      {files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No files uploaded yet</p>
        </div>
      ) : (
        <FileListTable files={files} />
      )}
    </div>
  )
}
