import { useState, useEffect } from 'react'
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { taskService } from '../services'

const TaskDetailModal = ({ task, isOpen, onClose, onUpdate, onDelete, isLocked = false }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigned_to: '',
    due_date: ''
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        assigned_to: task.assigned_to || '',
        due_date: task.due_date || ''
      })
    }
  }, [task])

  if (!isOpen || !task) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (isLocked) {
      toast.error('Tasks in completed projects are locked')
      return
    }

    try {
      const response = await taskService.update(task.id, formData)
      toast.success('Task updated successfully')
      setIsEditing(false)
      if (onUpdate) {
        onUpdate(response.data.data || response.data)
      }
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    }
  }

  const handleDelete = async () => {
    if (isLocked) {
      toast.error('Tasks in completed projects are locked')
      return
    }

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.id)
        toast.success('Task deleted successfully')
        if (onDelete) {
          onDelete(task.id)
        }
        onClose()
      } catch (error) {
        console.error('Error deleting task:', error)
        toast.error('Failed to delete task')
      }
    }
  }

  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'bg-red-500' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-500' },
    { value: 'completed', label: 'Completed', color: 'bg-green-500' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ]

  const assignedUser = task.assignedUser || task.assigned_user || null

  const formatDateOnly = (value) => {
    if (!value) return 'No deadline'
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return String(value)
    return parsedDate.toLocaleDateString('en-EN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Task' : task.title}
          </h2>
          {isLocked && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Locked
            </span>
          )}
          <div className="flex items-center space-x-2">
            {!isEditing && !isLocked && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit className="text-orange-600" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FaTrash className="text-red-600" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLocked && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              This task is locked because the parent project is completed.
            </div>
          )}

          {/* Title */}
          {isEditing ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          ) : null}

          {/* Status, Priority, Handler, Deadline - Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-white bg-orange-600 px-4 py-2 rounded-t-lg">
                Status
              </label>
              <div className="border-2 border-orange-600 rounded-b-lg">
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-none focus:ring-0"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-2 flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${statusOptions.find(s => s.value === formData.status)?.color}`}></div>
                    <span>{statusOptions.find(s => s.value === formData.status)?.label}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-white bg-orange-600 px-4 py-2 rounded-t-lg">
                Priority
              </label>
              <div className="border-2 border-orange-600 rounded-b-lg">
                {isEditing ? (
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-none focus:ring-0"
                  >
                    {priorityOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className={`px-4 py-2 font-semibold ${priorityOptions.find(p => p.value === formData.priority)?.color}`}>
                    {priorityOptions.find(p => p.value === formData.priority)?.label}
                  </div>
                )}
              </div>
            </div>

            {/* Handler */}
            <div>
              <label className="block text-sm font-semibold text-white bg-orange-600 px-4 py-2 rounded-t-lg">
                Handler
              </label>
              <div className="border-2 border-orange-600 rounded-b-lg">
                {isEditing ? (
                  <input
                    type="text"
                    value={assignedUser?.name || 'Unassigned'}
                    readOnly
                    className="w-full px-4 py-2 border-none focus:ring-0 bg-gray-50 text-gray-700"
                  />
                ) : (
                  <div className="px-4 py-2">
                    {assignedUser?.name || formData.assigned_to || 'Unassigned'}
                  </div>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-white bg-orange-600 px-4 py-2 rounded-t-lg">
                Deadline
              </label>
              <div className="border-2 border-orange-600 rounded-b-lg">
                {isEditing ? (
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-none focus:ring-0"
                  />
                ) : (
                  <div className="px-4 py-2">
                    {formatDateOnly(formData.due_date)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-semibold text-white bg-orange-600 px-4 py-2 rounded-t-lg">
              Task Description
            </label>
            <div className="border-2 border-orange-600 rounded-b-lg">
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border-none focus:ring-0 bg-transparent rounded-b-lg resize-y"
                  placeholder="Enter task description..."
                />
              ) : (
                <div className="px-4 py-3 min-h-[100px]">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.description || 'No description provided'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Documents — only shown when documents exist */}
          {task.documents && task.documents.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-white bg-orange-600 px-4 py-2 rounded-t-lg">
                Related Documents
              </label>
              <div className="border-2 border-orange-600 rounded-b-lg px-4 py-3">
                <ul className="list-decimal list-inside text-gray-700 space-y-1">
                  {task.documents.map((doc) => (
                    <li key={doc.id} className="underline cursor-pointer hover:text-orange-600">
                      {doc.original_name || doc.name || `Document ${doc.id}`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetailModal
