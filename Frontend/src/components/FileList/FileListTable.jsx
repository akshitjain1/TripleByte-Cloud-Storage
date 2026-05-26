import { useFiles } from '../../hooks/useFiles'
import { useFileStore } from '../../context/FileContext'
import { FileRow } from './FileRow'
import { ChevronDown } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

export function FileListTable({ files }) {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useFileStore()

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  const SortHeader = ({ label, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center gap-1 hover:text-gray-900 transition"
    >
      {label}
      {sortBy === sortKey && (
        <ChevronDown
          size={16}
          className={`transition ${sortOrder === 'desc' ? '' : 'rotate-180'}`}
        />
      )}
    </button>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-600">
            <th className="px-4 py-3">
              <SortHeader label="Name" sortKey="name" />
            </th>
            <th className="px-4 py-3">
              <SortHeader label="Size" sortKey="size" />
            </th>
            <th className="px-4 py-3">
              <SortHeader label="Uploaded" sortKey="date" />
            </th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
