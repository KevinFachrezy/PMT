import { useState } from 'react'
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { userService } from '../services'

const initialFormData = {
  name: '',
  email: '',
  role: 'project_handler',
  is_active: true,
  password: '',
  password_confirmation: '',
}

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleClose = () => {
    if (loading) return
    setFormData(initialFormData)
    onClose()
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

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error('Password confirmation does not match')
      return
    }

    try {
      setLoading(true)
      await userService.create(formData)
      toast.success('User created! Verification email sent to ' + formData.email, {
        duration: 5000,
      })
      setFormData(initialFormData)
      onSuccess()
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error(error.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-orange-100 p-3">
              <FaPlus className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
              <p className="mt-1 text-sm text-gray-500">Create a new manager or project handler account</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            disabled={loading}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
              placeholder="example@wspmt.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
            >
              <option value="manager">Manager</option>
              <option value="project_handler">Project Handler</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                placeholder="Repeat password"
                minLength={8}
                required
              />
            </div>
          </div>

          <label className="flex items-center space-x-3 rounded-lg bg-gray-50 p-4">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">Active User</span>
          </label>

          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 rounded-lg bg-orange-600 px-6 py-2 text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUserModal