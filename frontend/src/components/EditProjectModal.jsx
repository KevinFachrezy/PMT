import { useState, useEffect } from 'react'
import { FaTimes, FaTrash, FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { projectService, userService } from '../services'
import { useAuthStore } from '../stores/authStore'

const EditProjectModal = ({ isOpen, onClose, project, onProjectUpdated, onProjectDeleted }) => {
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
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchHandlers()
    }
  }, [isOpen])

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        handler_ids: Array.isArray(project.handlers) ? project.handlers.map(h => String(h.id)) : [],
        client_name: project.client_name || project.client?.name || '',
        status: project.status || 'pending',
        start_date: project.start_date || '',
        due_date: project.due_date || ''
      })
    }
  }, [project])

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

  if (!isOpen || !project) return null

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
      const response = await projectService.update(project.id, {
        ...formData,
        client_id: formData.handler_ids[0],
      })
      toast.success('Project updated successfully')

      if (onProjectUpdated) {
        onProjectUpdated(response.data.data || response.data)
      }

      onClose()
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error(error.response?.data?.message || 'Failed to update project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete project "${project.title}"? This action cannot be undone and will delete all associated tasks and documents.`)) {
      return
    }

    setIsDeleting(true)
    try {
      await projectService.delete(project.id)
      toast.success('Project deleted successfully')

      if (onProjectDeleted) {
        onProjectDeleted(project.id)
      }

      onClose()
    } catch (err) {
      console.error('Failed to delete project:', err)
      toast.error(err.response?.data?.message || 'Failed to delete project')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Edit Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting || isDeleting}
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
              disabled={isSubmitting || isDeleting}
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
              disabled={isSubmitting || isDeleting}
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
              disabled={isSubmitting || isDeleting}
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
                      disabled={isSubmitting || isDeleting}
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
                disabled={isSubmitting || isDeleting}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
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
                disabled={isSubmitting || isDeleting}
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
                disabled={isSubmitting || isDeleting}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            {/* Delete button (only visible to managers) */}
            {user?.role === 'manager' ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold disabled:opacity-50"
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                <span>Delete Project</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold"
                disabled={isSubmitting || isDeleting}
              >
                {isSubmitting && <FaSpinner className="animate-spin" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProjectModal
