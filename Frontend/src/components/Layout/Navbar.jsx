import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Menu, X, LogOut, BarChart3 } from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BarChart3 className="text-primary-600" size={28} />
            <span className="text-xl font-bold text-gray-900">CloudStore</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            {user && (
              <>
                <p className="px-4 py-2 text-sm text-gray-600">{user.email}</p>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
