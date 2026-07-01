import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { projectService, userService } from '../services'
import { useAuthStore } from '../stores/authStore'

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    handler_ids: [],
    client_name: '',
    status: 'pending',
    start_date: '',
    due_date: ''
  })
  const [handlers, setHandlers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchHandlers()
    }
  }, [isOpen])

  const fetchHandlers = async () => {
    try {
      const response = await userService.getAll({ role: 'project_handler' })
      const data = response.data || response
      const users = Array.isArray(data) ? data : (data.data || [])
      setHandlers(users)
    } catch (err) {
      console.error('Failed to load handlers:', err)
    }
  }

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleHandlerChange = (handlerId) => {
    setFormData(prev => {
      const currentIds = prev.handler_ids
      const isSelected = currentIds.includes(handlerId)

      return {
        ...prev,
        handler_ids: isSelected
          ? currentIds.filter(id => id !== handlerId)
          : [...currentIds, handlerId],
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Project title is required')
      return
    }

    if (formData.handler_ids.length === 0) {
      toast.error('Please select at least one project handler')
      return
    }

    if (formData.due_date && formData.start_date && new Date(formData.due_date) < new Date(formData.start_date)) {
      toast.error('Due date must be after start date')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await projectService.create({
        ...formData,
        client_id: formData.handler_ids[0],
      })
      toast.success('Project created successfully')

      if (onProjectCreated) {
        onProjectCreated(response.data.data || response.data)
      }

      setFormData({
        title: '',
        description: '',
        handler_ids: [],
        client_name: '',
        status: 'pending',
        start_date: '',
        due_date: ''
      })

      onClose()
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error(error.response?.data?.message || 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter project title..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter project description..."
            />
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name
            </label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter client name..."
            />
          </div>

          {/* Grid: Project Handler, Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Handler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Handlers <span className="text-red-500">*</span>
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
                {handlers.map(h => (
                  <label key={h.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.handler_ids.includes(String(h.id))}
                      onChange={() => handleHandlerChange(String(h.id))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{h.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Select one or more handlers for this project.</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Grid: Start Date, Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default CreateProjectModal
