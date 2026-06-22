import apiClient from './api'

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  // Register
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await apiClient.put('/auth/profile', userData)
    return response.data
  },
}

export const projectService = {
  // Get all projects
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/projects?${queryString}` : '/projects'
    const response = await apiClient.get(url)
    return response.data
  },

  // Get single project
  getById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`)
    return response.data
  },

  // Create project
  create: async (projectData) => {
    const response = await apiClient.post('/projects', projectData)
    return response.data
  },

  // Update project
  update: async (id, projectData) => {
    const response = await apiClient.put(`/projects/${id}`, projectData)
    return response.data
  },

  // Delete project
  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`)
    return response.data
  },

  // Request completion review from manager
  requestCompletion: async (id) => {
    const response = await apiClient.post(`/projects/${id}/request-completion`)
    return response.data
  },
}

export const documentService = {
  // Get all documents
  getAll: async (params = {}) => {
    let queryParams = {}

    if (params && typeof params === 'object' && !Array.isArray(params)) {
      queryParams = params
    } else if (params) {
      queryParams = { project_id: params }
    }

    const queryString = new URLSearchParams(queryParams).toString()
    const url = queryString ? `/documents?${queryString}` : '/documents'
    const response = await apiClient.get(url)
    return response.data
  },

  // Upload document
  upload: async (formData) => {
    const response = await apiClient.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Download document
  download: async (id) => {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    })
    return response.data
  },

  // Preview document (returns Blob for inline display)
  getPreview: async (id) => {
    const response = await apiClient.get(`/documents/${id}/preview`, {
      responseType: 'blob',
    })
    return response.data
  },

  // Delete document
  delete: async (id) => {
    const response = await apiClient.delete(`/documents/${id}`)
    return response.data
  },
}

export const taskService = {
  // Get all tasks
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/tasks?${queryString}` : '/tasks'
    const response = await apiClient.get(url)
    return response.data
  },

  // Create task
  create: async (taskData) => {
    const response = await apiClient.post('/tasks', taskData)
    return response.data
  },

  // Update task
  update: async (id, taskData) => {
    const response = await apiClient.put(`/tasks/${id}`, taskData)
    return response.data
  },

  // Delete task
  delete: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`)
    return response.data
  },
}

export const notificationService = {
  // Get all notifications
  getAll: async (paramsOrUnreadOnly = {}) => {
    let params = {}

    if (typeof paramsOrUnreadOnly === 'boolean') {
      params = paramsOrUnreadOnly ? { unread_only: 'true' } : {}
    } else {
      params = paramsOrUnreadOnly || {}
    }

    const response = await apiClient.get('/notifications', { params })
    return response.data
  },

  // Get unread count only
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count')
    return response.data
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await apiClient.post(`/notifications/${id}/read`)
    return response.data
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await apiClient.post('/notifications/read-all')
    return response.data
  },

  // Delete notification
  delete: async (id) => {
    const response = await apiClient.delete(`/notifications/${id}`)
    return response.data
  },

  // Create notification (for testing)
  create: async (notificationData) => {
    const response = await apiClient.post('/notifications', notificationData)
    return response.data
  },
}

export const templateService = {
  // Get all templates
  getAll: async (category = null) => {
    const url = category ? `/templates?category=${category}` : '/templates'
    const response = await apiClient.get(url)
    return response.data
  },

  // Get single template
  getById: async (id) => {
    const response = await apiClient.get(`/templates/${id}`)
    return response.data
  },

  // Get categories
  getCategories: async () => {
    const response = await apiClient.get('/templates/categories')
    return response.data
  },

  // Create template (Manager only)
  create: async (templateData) => {
    const response = await apiClient.post('/templates', templateData)
    return response.data
  },

  // Update template
  update: async (id, templateData) => {
    const response = await apiClient.put(`/templates/${id}`, templateData)
    return response.data
  },

  // Delete template
  delete: async (id) => {
    const response = await apiClient.delete(`/templates/${id}`)
    return response.data
  },

  // Generate document from template
  generate: async (templateId, data) => {
    const response = await apiClient.post(`/templates/${templateId}/generate`, data)
    return response.data
  },
}

export const userService = {
  // Create user
  create: async (userData) => {
    const response = await apiClient.post('/users', userData)
    return response.data
  },

  // Get all users
  getAll: async (params = {}) => {
    const response = await apiClient.get('/users', { params })
    return response.data
  },

  // Get single user
  getById: async (id) => {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  // Get statistics
  getStatistics: async () => {
    const response = await apiClient.get('/users/statistics')
    return response.data
  },

  // Update user
  update: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData)
    return response.data
  },

  // Toggle active status
  toggleActive: async (id) => {
    const response = await apiClient.post(`/users/${id}/toggle-active`)
    return response.data
  },

  // Delete user
  delete: async (id) => {
    const response = await apiClient.delete(`/users/${id}`)
    return response.data
  },

  // Verify email
  verifyEmail: async (token, email) => {
    const response = await apiClient.post('/auth/verify-email', { token, email })
    return response.data
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/request-password-reset', { email })
    return response.data
  },

  // Reset password
  resetPassword: async (token, email, password, password_confirmation) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation,
    })
    return response.data
  },

  // Resend verification email
  resendVerificationEmail: async (email) => {
    const response = await apiClient.post('/auth/resend-verification-email', { email })
    return response.data
  },
}

// Analytics service
export const analyticsService = {
  getSummary: async () => {
    const response = await apiClient.get('/analytics/summary')
    return response.data
  },
  getTasksByStatus: async (projectId = null) => {
    const params = projectId ? { project_id: projectId } : {}
    const response = await apiClient.get('/analytics/tasks-by-status', { params })
    return response.data
  },
  getTasksByPriority: async (projectId = null) => {
    const params = projectId ? { project_id: projectId } : {}
    const response = await apiClient.get('/analytics/tasks-by-priority', { params })
    return response.data
  },
  getUserWorkload: async () => {
    const response = await apiClient.get('/analytics/user-workload')
    return response.data
  },
  getProjectProgress: async () => {
    const response = await apiClient.get('/analytics/project-progress')
    return response.data
  },
  getTaskTrend: async () => {
    const response = await apiClient.get('/analytics/task-trend')
    return response.data
  },
}

// Activity Log service
export const searchService = {
  search: async (q, limit = 5) => {
    const response = await apiClient.get('/search', { params: { q, limit } })
    return response.data
  },
}

export const activityService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/activities', { params })
    return response.data
  },
  getStats: async () => {
    const response = await apiClient.get('/activities/stats')
    return response.data
  },
}
