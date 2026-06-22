import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBell, FaTimes, FaCheck, FaCheckDouble } from 'react-icons/fa'
import { notificationService } from '../services'
import toast from 'react-hot-toast'

const NotificationDropdown = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, unreadOnly])

  // Fetch unread count on mount and periodically
  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = { per_page: 20 }
      if (unreadOnly) {
        params.unread_only = 'true'
      }

      const response = await notificationService.getAll(params)
      const data = response.data || response
      setNotifications(data.notifications || [])
      setUnreadCount(data.unread_count || 0)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      const data = response.data || response
      setUnreadCount(data.count || 0)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
      toast.success('Marked as read')
    } catch (error) {
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id)
      setNotifications(prev => prev.filter(notif => notif.id !== id))
      toast.success('Notification deleted')
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  const getNotificationTarget = (notification) => {
    const data = notification?.data || {}

    if (data.url && typeof data.url === 'string') {
      return data.url
    }

    if (notification.type === 'status_changed' && data.project_id && data.task_id) {
      return `/projects/${data.project_id}?focus_task=${data.task_id}`
    }

    if (notification.type === 'project_unassigned') {
      return '/projects'
    }

    if (data.project_id) {
      return `/projects/${data.project_id}`
    }

    if (notification.type === 'document_uploaded') {
      return '/documents'
    }

    return null
  }

  const handleNotificationOpen = async (notification) => {
    const target = getNotificationTarget(notification)

    if (!notification.is_read) {
      try {
        await notificationService.markAsRead(notification.id)
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notification.id ? { ...notif, is_read: true } : notif
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (error) {
        toast.error('Failed to open notification')
        return
      }
    }

    if (target) {
      setIsOpen(false)
      navigate(target)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_assigned':
        return '📋'
      case 'project_assigned':
        return '📁'
      case 'project_unassigned':
        return '📂'
      case 'deadline_approaching':
        return '⏰'
      case 'status_changed':
        return '🔄'
      case 'document_uploaded':
        return '📄'
      default:
        return '🔔'
    }
  }

  const getNotificationTypeLabel = (type) => {
    const labels = {
      task_assigned: 'Task Assigned',
      project_assigned: 'Project Assigned',
      project_unassigned: 'Project Unassigned',
      deadline_approaching: 'Deadline Approaching',
      status_changed: 'Status Changed',
      document_uploaded: 'Document Uploaded',
    }

    return labels[type] || type.replaceAll('_', ' ')
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <FaBell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUnreadOnly((prev) => !prev)}
                className={`text-xs font-semibold px-2 py-1 rounded-md border ${
                  unreadOnly
                    ? 'bg-orange-100 text-orange-700 border-orange-200'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {unreadOnly ? 'Unread only' : 'All'}
              </button>

              {notifications.length > 0 && unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1"
                >
                  <FaCheckDouble />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  You'll be notified about project assignments, task assignments, deadlines, and more
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationOpen(notification)}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.is_read ? 'bg-orange-50' : ''
                    } ${getNotificationTarget(notification) ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="font-semibold text-gray-800 text-sm">
                            {notification.title}
                          </p>
                          <p className="text-xs font-medium text-orange-700 mt-1">
                            {getNotificationTypeLabel(notification.type)}
                          </p>
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-orange-600 rounded-full ml-2 flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {!notification.is_read && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation()
                              handleMarkAsRead(notification.id)
                            }}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Mark as read"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDelete(notification.id)
                          }}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
              <button
                onClick={() => {
                  setIsOpen(false)
                  navigate('/notifications')
                }}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
