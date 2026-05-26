import { FileUploadDropzone } from '../components/FileUpload/FileUploadDropzone'
import { FileList } from '../components/FileList/FileList'
import { StorageStats } from '../components/Layout/StorageStats'

export function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cloud Storage</h1>
        <p className="text-gray-600">Upload and manage your files securely</p>
      </div>

      <StorageStats />

      <div className="mt-8 grid md:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload File</h2>
          <FileUploadDropzone />
        </div>

        {/* Files Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Files</h2>
          <FileList />
        </div>
      </div>
    </div>
  )
}
