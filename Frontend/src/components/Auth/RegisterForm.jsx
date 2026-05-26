import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isValidEmail, validatePassword } from '../../utils/helpers'
import { Mail, Lock, Loader, AlertCircle } from 'lucide-react'

export function RegisterForm() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = []

    if (!email || !password || !confirmPassword) {
      newErrors.push('Please fill in all fields')
    }

    if (!isValidEmail(email)) {
      newErrors.push('Please enter a valid email')
    }

    const passwordErrors = validatePassword(password)
    newErrors.push(...passwordErrors)

    if (password !== confirmPassword) {
      newErrors.push('Passwords do not match')
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])

    try {
      await register(email, password)
      navigate('/login')
    } catch (err) {
      setErrors([err.response?.data?.detail || 'Registration failed'])
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                {errors.map((error, idx) => (
                  <p key={idx} className="text-red-800 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              At least 8 characters, 1 uppercase, 1 number
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader size={20} className="animate-spin" />}
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
