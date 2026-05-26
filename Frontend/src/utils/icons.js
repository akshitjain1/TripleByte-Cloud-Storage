import {
  FileText,
  File,
  Image,
  FileJson,
  Download,
  Trash2,
  Eye,
  Clock,
  Database,
  HardDrive
} from 'lucide-react'

export const getFileIconComponent = (contentType) => {
  if (!contentType) return File

  if (contentType.includes('pdf')) return FileText
  if (contentType.includes('image')) return Image
  if (contentType.includes('text')) return FileText
  if (contentType.includes('word') || contentType.includes('document')) return File
  if (contentType.includes('json')) return FileJson

  return File
}
