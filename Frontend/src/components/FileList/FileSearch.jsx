import { useFileStore } from '../../context/FileContext'
import { Search } from 'lucide-react'

export function FileSearch() {
  const { searchQuery, setSearchQuery } = useFileStore()

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search files..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  )
}
