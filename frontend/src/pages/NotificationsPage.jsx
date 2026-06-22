import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBell, FaCheck, FaCheckDouble, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { notificationService } from '../services'

const NotificationsPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [typeFilter, setTypeFilter] = useState('')
  const [readFilter, setReadFilter] = useState('all')
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0, perPage: 20 })

  useEffect(() => {
    fetchNotifications({ page: 1, reset: true })
  }, [typeFilter, readFilter])

  const fetchNotifications = async ({ page = 1, reset = false } = {}) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const params = {
        page,
        per_page: 20,
      }

      if (typeFilter) {
        params.type = typeFilter
      }

      if (readFilter === 'unread') {
        params.unread_only = 'true'
      } else if (readFilter === 'read') {
        params.is_read = 'true'
      }

      const response = await notificationService.getAll(params)
      const data = response.data || response

      const incoming = data.notifications || []
      setNotifications((prev) => (reset ? incoming : [...prev, ...incoming]))

      const meta = data.meta || {}
      setPagination({
        currentPage: meta.current_page || page,
        lastPage: meta.last_page || page,
        total: meta.total || incoming.length,
        perPage: meta.per_page || 20,
      })
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      toast.error('Failed to load notifications')
      if (reset) {
        setNotifications([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
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

  const typeOptions = useMemo(() => {
    const set = new Set(notifications.map((item) => item.type))
    return Array.from(set)
  }, [notifications])

  const unreadCount = useMemo(() => notifications.filter((item) => !item.is_read).length, [notifications])

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

  const getTypeBadge = (type) => {
    const map = {
      task_assigned: 'bg-blue-100 text-blue-700',
      project_assigned: 'bg-emerald-100 text-emerald-700',
      project_unassigned: 'bg-slate-100 text-slate-700',
      status_changed: 'bg-amber-100 text-amber-700',
      document_uploaded: 'bg-purple-100 text-purple-700',
      deadline_approaching: 'bg-red-100 text-red-700',
    }
    return map[type] || 'bg-gray-100 text-gray-700'
  }

  const getTypeLabel = (type) => {
    const map = {
      task_assigned: 'Task Assigned',
      project_assigned: 'Project Assigned',
      project_unassigned: 'Project Unassigned',
      status_changed: 'Status Changed',
      document_uploaded: 'Document Uploaded',
      deadline_approaching: 'Deadline Approaching',
    }

    return map[type] || type.replaceAll('_', ' ')
  }

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, is_read: true } : item)))
    } catch (error) {
      toast.error('Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })))
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all notifications as read')
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id)
      setNotifications((prev) => prev.filter((item) => item.id !== id))
      toast.success('Notification deleted')
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  const hasMore = pagination.currentPage < pagination.lastPage

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return
    fetchNotifications({ page: pagination.currentPage + 1, reset: false })
  }

  const openNotification = async (notification) => {
    const target = getNotificationTarget(notification)

    if (!notification.is_read) {
      await markAsRead(notification.id)
    }

    if (target) {
      navigate(target)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Header />

        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-orange-600 mb-1 flex items-center">
                <FaBell className="mr-3" />
                Notifications
              </h1>
              <p className="text-gray-600">Track updates across tasks, projects, and documents</p>
            </div>

            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center space-x-2 rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <FaCheckDouble />
              <span>Mark All Read</span>
            </button>
          </div>

          <div className="mb-6 rounded-lg bg-white p-4 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Types</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>{getTypeLabel(type)}</option>
                ))}
              </select>

              <select
                value={readFilter}
                onChange={(event) => setReadFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>

              <div className="rounded-lg bg-orange-50 border border-orange-200 px-3 py-2 text-sm text-orange-800">
                Unread: <span className="font-semibold">{unreadCount}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-orange-600"></div>
              <p className="mt-3 text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm border border-gray-200">
              <FaBell className="mx-auto mb-4 text-5xl text-gray-300" />
              <p className="text-lg text-gray-600">No notifications found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const target = getNotificationTarget(notification)

                return (
                  <div
                    key={notification.id}
                    onClick={() => openNotification(notification)}
                    className={`rounded-lg border p-4 transition-colors ${
                      notification.is_read
                        ? 'border-gray-200 bg-white hover:bg-gray-50'
                        : 'border-orange-200 bg-orange-50 hover:bg-orange-100'
                    } ${target ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getTypeBadge(notification.type)}`}>
                            {getTypeLabel(notification.type)}
                          </span>
                          {!notification.is_read && (
                            <span className="h-2 w-2 rounded-full bg-orange-600"></span>
                          )}
                        </div>

                        <p className="font-semibold text-gray-800">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.created_at)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            className="rounded p-2 text-green-600 hover:bg-green-50"
                            title="Mark as read"
                          >
                            <FaCheck />
                          </button>
                        )}

                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="rounded p-2 text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {hasMore && (
                <div className="pt-2 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage