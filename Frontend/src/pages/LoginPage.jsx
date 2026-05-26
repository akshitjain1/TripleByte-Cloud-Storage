import { Navigate } from 'react-router-dom'
import { LoginForm } from '../components/Auth/LoginForm'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CloudStore</h1>
          <p className="text-gray-600">Secure Cloud File Storage</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
