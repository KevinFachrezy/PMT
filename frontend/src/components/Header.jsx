import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaSignOutAlt, FaKey } from 'react-icons/fa'
import { useAuthStore } from '../stores/authStore'
import NotificationDropdown from './NotificationDropdown'
import GlobalSearchBar from './GlobalSearchBar'
import ChangePasswordModal from './ChangePasswordModal'

const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const profileMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    window.document.addEventListener('mousedown', handleClickOutside)
    return () => window.document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="bg-white shadow-sm px-8 py-4 flex items-center">
      {/* Welcome Message */}
      <div className="flex-shrink-0 w-48">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome, <span className="text-orange-600">{user?.name || user?.role || 'Manager'}</span>
        </h1>
      </div>

      {/* Global Search — centered */}
      <div className="flex-1 flex justify-center">
        <GlobalSearchBar />
      </div>

      {/* Right Side: Notifications & Profile */}
      <div className="flex items-center space-x-4 flex-shrink-0 w-48 justify-end">
        {/* Notification Bell with Dropdown */}
        <NotificationDropdown />

        {/* User Profile */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Account menu"
          >
            <FaUserCircle className="w-8 h-8 text-gray-700" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'manager'}</p>
                <p className="text-xs text-gray-500 truncate mt-1">{user?.email || '-'}</p>
              </div>

              {/* Change Password Option */}
              <button
                onClick={() => {
                  setShowProfileMenu(false)
                  setShowChangePassword(true)
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 border-b border-gray-100"
              >
                <FaKey className="text-gray-500" />
                <span>Change Password</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>
  )
}

export default Header
