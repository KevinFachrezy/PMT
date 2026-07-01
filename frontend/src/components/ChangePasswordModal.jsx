import { useState } from 'react'
import { FaTimes, FaLock, FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { authService } from '../services'

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      await authService.updateProfile({
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      })
      toast.success('Password updated successfully')
      setFormData({ password: '', password_confirmation: '' })
      onClose()
    } catch (err) {
      console.error('Failed to change password:', err)
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transform transition-all">
        {/* Header */}
        <div className="bg-orange-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaLock className="text-xl" />
            <h3 className="text-xl font-bold">Change Password</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-orange-200 hover:text-white hover:bg-orange-700/50 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 8 characters..."
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  placeholder="Re-type new password..."
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
