import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaTimes, FaCalendarAlt, FaClock, FaUser, FaFlag,
  FaCheckCircle, FaExclamationTriangle, FaLink
} from 'react-icons/fa'
import { projectService, taskService } from '../services'
import toast from 'react-hot-toast'

const EventDetailModal = ({ event, onClose, onRefresh }) => {
  const navigate = useNavigate()
  const [updating, setUpdating] = useState(false)
  const isTask = event.type === 'task'
  const isProject = event.type === 'project'
  const data = event.resourceData

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'on_hold': 'bg-gray-100 text-gray-800',
      'overdue': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'text-blue-600',
      'medium': 'text-yellow-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600',
    }
    return colors[priority] || 'text-gray-600'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-EN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true)
      if (isTask) {
        await taskService.update(event.resourceId, { status: newStatus })
      } else {
        await projectService.update(event.resourceId, { status: newStatus })
      }
      toast.success('Status updated successfully')
      onRefresh()
      onClose()
    } catch (err) {
      console.error('Error updating status:', err)
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const daysUntilDue = Math.ceil(
    (new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24)
  )

  const getDueStatusText = () => {
    if (event.isOverdue) {
      return `${Math.abs(daysUntilDue)} days overdue`
    } else if (daysUntilDue === 0) {
      return 'Due today'
    } else if (daysUntilDue === 1) {
      return 'Due tomorrow'
    } else {
      return `Due in ${daysUntilDue} days`
    }
  }

  const openFullDetails = () => {
    if (isTask) {
      const projectId = data?.project_id || data?.project?.id
      if (!projectId || !event?.resourceId) {
        toast.error('Task tidak punya tujuan detail')
        return
      }
      navigate(`/projects/${projectId}?focus_task=${event.resourceId}`)
      onClose()
      return
    }

    if (isProject) {
      if (!event?.resourceId) {
        toast.error('Project tidak punya tujuan detail')
        return
      }
      navigate(`/projects/${event.resourceId}`)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 flex items-start justify-between ${event.isOverdue ? 'bg-red-50' : 'bg-gradient-to-r from-purple-50 to-blue-50'
          }`}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-3xl ${isTask ? '✓' : '📁'}`} />
              <h2 className="text-2xl font-bold text-gray-900 line-clamp-2">
                {data?.title}
              </h2>
              {event.isOverdue && (
                <FaExclamationTriangle className="text-red-600 text-xl flex-shrink-0" />
              )}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(data?.status)}`}>
                {data?.status?.replace('_', ' ').toUpperCase()}
              </span>
              {isTask && data?.priority && (
                <span className={`flex items-center gap-1 text-sm font-bold ${getPriorityColor(data.priority)}`}>
                  <FaFlag className="text-xs" />
                  {data.priority.toUpperCase()}
                </span>
              )}
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${event.isOverdue
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
                }`}>
                {getDueStatusText()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-200 rounded-lg transition-all flex-shrink-0"
          >
            <FaTimes className="text-gray-600 text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Timeline Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-purple-600" />
                <span className="font-bold text-gray-900">Due Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">
                {formatDate(event.date)}
              </p>
              {data?.created_at && (
                <p className="text-xs text-gray-600 mt-2">
                  Created: {formatDate(data.created_at)}
                </p>
              )}
            </div>

            {isTask && data?.assigned_to && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaUser className="text-blue-600" />
                  <span className="font-bold text-gray-900">Assigned To</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {data?.assigned_user?.name || data?.assignedUser?.name || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {data?.assigned_user?.email || data?.assignedUser?.email || 'N/A'}
                </p>
              </div>
            )}

            {isProject && data?.manager_id && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaUser className="text-orange-600" />
                  <span className="font-bold text-gray-900">Project Manager</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {data?.manager?.name || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {data?.manager?.email || 'N/A'}
                </p>
              </div>
            )}

            {isProject && data?.start_date && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-green-600" />
                  <span className="font-bold text-gray-900">Start Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {formatDate(data.start_date)}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {data?.description && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap line-clamp-4">
                {data.description}
              </p>
            </div>
          )}

          {/* Additional Info */}
          {isProject && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3">Project Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-bold text-gray-800">Client:</span>{' '}
                  <span className="text-gray-700">{data?.client_name || 'N/A'}</span>
                </p>
                <p>
                  <span className="font-bold text-gray-800">Status:</span>{' '}
                  <span className={`font-bold ${getStatusColor(data?.status)}`}>
                    {data?.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          )}

          {isTask && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3">Task Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-bold text-gray-800">Project:</span>{' '}
                  <span className="text-gray-700">{data?.project?.title || 'N/A'}</span>
                </p>
                <p>
                  <span className="font-bold text-gray-800">Priority:</span>{' '}
                  <span className={`font-bold ${getPriorityColor(data?.priority)}`}>
                    {data?.priority?.toUpperCase() || 'NORMAL'}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Status Update Actions */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <h3 className="font-bold text-gray-900 mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {isTask && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('pending')}
                    disabled={updating || data?.status === 'pending'}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('in_progress')}
                    disabled={updating || data?.status === 'in_progress'}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={updating || data?.status === 'completed'}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Completed
                  </button>
                </>
              )}
              {isProject && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('pending')}
                    disabled={updating || data?.status === 'pending'}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('in_progress')}
                    disabled={updating || data?.status === 'in_progress'}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={updating || data?.status === 'completed'}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Completed
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-bold transition-all"
          >
            Close
          </button>
          {isTask && (
            <button
              onClick={openFullDetails}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all flex items-center gap-2"
            >
              <FaLink className="text-sm" />
              View Full Details
            </button>
          )}
          {isProject && (
            <button
              onClick={openFullDetails}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all flex items-center gap-2"
            >
              <FaLink className="text-sm" />
              View Full Details
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetailModal
