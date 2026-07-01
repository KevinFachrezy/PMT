import { useState, useEffect } from 'react'
import { FaTimes, FaSave, FaUserEdit, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { userService } from '../services'

const EditUserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'project_handler',
    is_active: true,
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'project_handler',
        is_active: user.is_active !== undefined ? user.is_active : true,
        password: '',
      })
      setChangePassword(false)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (!formData.email.trim()) {
      toast.error('Email is required')
      return
    }

    if (changePassword && formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    try {
      setLoading(true)

      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
      }

      // Only include password if changing
      if (changePassword && formData.password) {
        updateData.password = formData.password
      }

      await userService.update(user.id, updateData)
      toast.success('User updated successfully')
      onSuccess()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(error.response?.data?.message || 'Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FaUserEdit className="text-orange-600 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
              <p className="text-sm text-gray-500 mt-1">
                Update user information and permissions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="example@wspmt.com"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="manager">Manager</option>
                <option value="project_handler">Project Handler</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.role === 'manager' 
                  ? 'Full access to all features including user management' 
                  : 'Can be assigned to tasks and projects'}
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                id="is_active"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active User
              </label>
              <p className="text-xs text-gray-500">
                (Inactive users cannot log in)
              </p>
            </div>

            {/* Password Section */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  id="change_password"
                />
                <label htmlFor="change_password" className="text-sm font-medium text-gray-700">
                  Change Password
                </label>
              </div>

              {changePassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                      placeholder="Enter new password (min 8 characters)"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-2"
                      tabIndex="-1"
                    >
                      {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to keep current password
                  </p>
                </div>
              )}
            </div>

            {/* User Statistics (Read-only) */}
            {user && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">User Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-xs text-blue-600 font-medium">Assigned Tasks</div>
                    <div className="text-2xl font-bold text-blue-700">
                      {user.assigned_tasks_count || 0}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-xs text-purple-600 font-medium">Managed Projects</div>
                    <div className="text-2xl font-bold text-purple-700">
                      {user.managed_projects_count || 0}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-xs text-green-600 font-medium">Completion Rate</div>
                    <div className="text-2xl font-bold text-green-700">
                      {user.completion_rate || 0}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditUserModal
