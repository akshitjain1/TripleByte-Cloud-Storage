import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Navbar } from '../components/Layout/Navbar'
import { DashboardPage } from './DashboardPage'
import { useAuth } from '../hooks/useAuth'
import { useFileStore } from '../context/FileContext'
import { fileService } from '../services/api'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const { setFiles, setIsLoading, setError } = useFileStore()

  useEffect(() => {
    if (isAuthenticated && isAuthenticated()) {
      const loadFiles = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const data = await fileService.listFiles()
          setFiles(data)
        } catch (err) {
          const message = err.response?.data?.detail || 'Failed to load files'
          setError(message)
          toast.error(message)
        } finally {
          setIsLoading(false)
        }
      }
      loadFiles()
    }
  }, [])

  if (!isAuthenticated || !isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DashboardPage />
    </div>
  )
}
