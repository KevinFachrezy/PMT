import api from './api'

export const notificationService = {
  // Get all notifications
  getAll: async (unreadOnly = false) => {
    const params = unreadOnly ? { unread_only: 'true' } : {}
    return api.get('/notifications', { params })
  },

  // Get unread count only
  getUnreadCount: async () => {
    return api.get('/notifications/unread-count')
  },

  // Mark notification as read
  markAsRead: async (id) => {
    return api.post(`/notifications/${id}/read`)
  },

  // Mark all as read
  markAllAsRead: async () => {
    return api.post('/notifications/read-all')
  },

  // Delete notification
  delete: async (id) => {
    return api.delete(`/notifications/${id}`)
  },

  // Create notification (for testing)
  create: async (notificationData) => {
    return api.post('/notifications', notificationData)
  },
}
