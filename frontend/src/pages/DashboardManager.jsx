import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaChevronRight,
  FaFileAlt,
  FaClock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCalendarAlt,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { projectService, taskService, userService } from '../services'
import { useAuthStore } from '../stores/authStore'

const DashboardManager = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [projects, setProjects] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [handlers, setHandlers] = useState([])
  const [loading, setLoading] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [showEventForm, setShowEventForm] = useState(false)
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)
  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false)
  const [deletingEventId, setDeletingEventId] = useState(null)
  const [editingEventId, setEditingEventId] = useState(null)
  const [eventProjectFilter, setEventProjectFilter] = useState('')
  const [eventStatusFilter, setEventStatusFilter] = useState('')
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [error, setError] = useState(null)
  const [eventForm, setEventForm] = useState({
    title: '',
    project_id: '',
    assigned_to: '',
    due_date: '',
    priority: 'medium',
    status: 'todo',
    description: '',
  })
  const [editEventForm, setEditEventForm] = useState({
    title: '',
    project_id: '',
    assigned_to: '',
    due_date: '',
    priority: 'medium',
    status: 'todo',
    description: '',
  })

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const normalizeList = (response) => {
    if (Array.isArray(response)) return response
    if (Array.isArray(response?.data)) return response.data
    if (Array.isArray(response?.data?.data)) return response.data.data
    return []
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setEventsLoading(true)
      setError(null)

      const handlerRequest = user?.role === 'manager'
        ? userService.getAll({ role: 'project_handler' })
        : Promise.resolve([])

      const [projectResponse, taskResponse, userResponse] = await Promise.all([
        projectService.getAll(),
        taskService.getAll({ sort_by: 'due_date', sort_order: 'asc' }),
        handlerRequest,
      ])

      const loadedProjects = normalizeList(projectResponse)
      const loadedTasks = normalizeList(taskResponse)
      const loadedHandlers = user?.role === 'manager'
        ? normalizeList(userResponse)
        : (user ? [user] : [])

      setProjects(loadedProjects)
      setHandlers(loadedHandlers)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const events = loadedTasks
        .filter(task => task?.due_date && task?.status !== 'completed')
        .filter(task => new Date(task.due_date) >= today)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))

      setUpcomingEvents(events)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to load projects')
      toast.error('Failed to load dashboard data')
      setProjects([])
      setUpcomingEvents([])
    } finally {
      setLoading(false)
      setEventsLoading(false)
    }
  }

  const formatEventDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getEventDotColor = (priority) => {
    if (priority === 'high') return 'bg-red-500'
    if (priority === 'medium') return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const filteredUpcomingEvents = upcomingEvents
    .filter(event => {
      if (!eventProjectFilter) return true
      return String(event.project_id) === String(eventProjectFilter)
    })
    .filter(event => {
      if (!eventStatusFilter) return true
      return event.status === eventStatusFilter
    })

  const visibleUpcomingEvents = showAllEvents
    ? filteredUpcomingEvents
    : filteredUpcomingEvents.slice(0, 8)

  const handleEventFormChange = (e) => {
    const { name, value } = e.target
    setEventForm(prev => ({ ...prev, [name]: value }))
  }

  const handleEditEventFormChange = (e) => {
    const { name, value } = e.target
    setEditEventForm(prev => ({ ...prev, [name]: value }))
  }

  const handleStartEditEvent = (event) => {
    setEditingEventId(event.id)
    setEditEventForm({
      title: event.title || '',
      project_id: String(event.project_id || ''),
      assigned_to: String(event.assigned_to || ''),
      due_date: event.due_date || '',
      priority: event.priority || 'medium',
      status: event.status || 'todo',
      description: event.description || '',
    })
  }

  const handleCancelEditEvent = () => {
    setEditingEventId(null)
    setEditEventForm({
      title: '',
      project_id: '',
      assigned_to: '',
      due_date: '',
      priority: 'medium',
      status: 'todo',
      description: '',
    })
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()

    if (!eventForm.title.trim()) {
      toast.error('Event title is required')
      return
    }
    if (!eventForm.project_id) {
      toast.error('Project is required')
      return
    }
    if (!eventForm.assigned_to) {
      toast.error('Handler is required')
      return
    }
    if (!eventForm.due_date) {
      toast.error('Event date is required')
      return
    }

    try {
      setIsCreatingEvent(true)

      await taskService.create({
        title: eventForm.title,
        description: eventForm.description,
        project_id: eventForm.project_id,
        assigned_to: eventForm.assigned_to,
        due_date: eventForm.due_date,
        priority: eventForm.priority,
        status: eventForm.status,
      })

      toast.success('Event created successfully')
      setEventForm({
        title: '',
        project_id: '',
        assigned_to: '',
        due_date: '',
        priority: 'medium',
        status: 'todo',
        description: '',
      })
      setShowEventForm(false)
      fetchDashboardData()
    } catch (err) {
      console.error('Error creating event:', err)
      toast.error(err.response?.data?.message || 'Failed to create event')
    } finally {
      setIsCreatingEvent(false)
    }
  }

  const handleUpdateEvent = async (e, eventId) => {
    e.preventDefault()

    if (!editEventForm.title.trim()) {
      toast.error('Event title is required')
      return
    }
    if (!editEventForm.project_id) {
      toast.error('Project is required')
      return
    }
    if (!editEventForm.assigned_to) {
      toast.error('Handler is required')
      return
    }
    if (!editEventForm.due_date) {
      toast.error('Event date is required')
      return
    }

    try {
      setIsUpdatingEvent(true)

      await taskService.update(eventId, {
        title: editEventForm.title,
        description: editEventForm.description,
        project_id: editEventForm.project_id,
        assigned_to: editEventForm.assigned_to,
        due_date: editEventForm.due_date,
        priority: editEventForm.priority,
        status: editEventForm.status,
      })

      toast.success('Event updated successfully')
      handleCancelEditEvent()
      fetchDashboardData()
    } catch (err) {
      console.error('Error updating event:', err)
      toast.error(err.response?.data?.message || 'Failed to update event')
    } finally {
      setIsUpdatingEvent(false)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return

    try {
      setDeletingEventId(eventId)
      await taskService.delete(eventId)
      toast.success('Event deleted successfully')
      if (editingEventId === eventId) handleCancelEditEvent()
      fetchDashboardData()
    } catch (err) {
      console.error('Error deleting event:', err)
      toast.error(err.response?.data?.message || 'Failed to delete event')
    } finally {
      setDeletingEventId(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Recent Projects Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FaClock className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
              </div>
              <button className="text-gray-600 hover:text-gray-900">
                <FaChevronRight className="w-6 h-6" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <p className="text-gray-500 mt-4">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No projects yet</p>
                <p className="text-gray-400 text-sm">Click "Add Project" to create your first project</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {projects.slice(0, 4).map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="bg-orange-600 hover:bg-orange-700 rounded-lg p-6 cursor-pointer transition-colors group"
                  >
                    <FaFileAlt className="w-12 h-12 text-white mb-4" />
                    <h3 className="text-white text-lg font-semibold mb-2">{project.title}</h3>
                    <p className="text-orange-100 text-sm mb-3">
                      Client: {project.client_name || project.client?.name || '-'}
                    </p>
                    {project.status && (
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-white rounded-full">
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-5 h-5 rounded" checked readOnly />
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
              </div>
              <div className="flex items-center space-x-2">
                {filteredUpcomingEvents.length > 8 && (
                  <button
                    onClick={() => setShowAllEvents(prev => !prev)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {showAllEvents ? 'Show Less' : 'View All'}
                  </button>
                )}
                <button
                  onClick={() => setShowEventForm(prev => !prev)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>{showEventForm ? 'Close Form' : 'Add Event'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <select
                value={eventProjectFilter}
                onChange={(e) => {
                  setEventProjectFilter(e.target.value)
                  setShowAllEvents(false)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
              <select
                value={eventStatusFilter}
                onChange={(e) => {
                  setEventStatusFilter(e.target.value)
                  setShowAllEvents(false)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {showEventForm && (
              <form
                onSubmit={handleCreateEvent}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Input New Event</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={eventForm.title}
                      onChange={handleEventFormChange}
                      placeholder="Event title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                    <select
                      name="project_id"
                      value={eventForm.project_id}
                      onChange={handleEventFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Handler</label>
                    <select
                      name="assigned_to"
                      value={eventForm.assigned_to}
                      onChange={handleEventFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select handler</option>
                      {handlers.map(handler => (
                        <option key={handler.id} value={handler.id}>{handler.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                    <input
                      type="date"
                      name="due_date"
                      value={eventForm.due_date}
                      onChange={handleEventFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={eventForm.priority}
                      onChange={handleEventFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={eventForm.status}
                      onChange={handleEventFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      rows="3"
                      value={eventForm.description}
                      onChange={handleEventFormChange}
                      placeholder="Optional description"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isCreatingEvent}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingEvent ? 'Saving...' : 'Save Event'}
                  </button>
                </div>
              </form>
            )}

            {eventsLoading ? (
              <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
                <p className="text-gray-500 mt-3">Loading events...</p>
              </div>
            ) : filteredUpcomingEvents.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No upcoming events yet</p>
                <p className="text-gray-400 text-sm mt-1">Use Add Event to create one from database flow</p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleUpcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getEventDotColor(event.priority)}`} />
                        <span className="text-gray-600 font-medium">{formatEventDate(event.due_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {event.status?.replace('_', ' ').toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleStartEditEvent(event)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit event"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={deletingEventId === event.id}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete event"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold mt-2">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Project: {event.project?.title || 'N/A'}</p>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => navigate(`/calendar?date=${event.due_date}&project_id=${event.project_id || ''}`)}
                        className="inline-flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>Open in Calendar</span>
                      </button>
                    </div>

                    {editingEventId === event.id && (
                      <form
                        onSubmit={(e) => handleUpdateEvent(e, event.id)}
                        className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="title"
                            value={editEventForm.title}
                            onChange={handleEditEventFormChange}
                            placeholder="Event title"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                          />
                          <input
                            type="date"
                            name="due_date"
                            value={editEventForm.due_date}
                            onChange={handleEditEventFormChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                          />
                          <select
                            name="project_id"
                            value={editEventForm.project_id}
                            onChange={handleEditEventFormChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select project</option>
                            {projects.map(project => (
                              <option key={project.id} value={project.id}>{project.title}</option>
                            ))}
                          </select>
                          <select
                            name="assigned_to"
                            value={editEventForm.assigned_to}
                            onChange={handleEditEventFormChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select handler</option>
                            {handlers.map(handler => (
                              <option key={handler.id} value={handler.id}>{handler.name}</option>
                            ))}
                          </select>
                          <select
                            name="priority"
                            value={editEventForm.priority}
                            onChange={handleEditEventFormChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          <select
                            name="status"
                            value={editEventForm.status}
                            onChange={handleEditEventFormChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                          </select>
                          <div className="md:col-span-2">
                            <textarea
                              name="description"
                              rows="2"
                              value={editEventForm.description}
                              onChange={handleEditEventFormChange}
                              placeholder="Optional description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="mt-3 flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={handleCancelEditEvent}
                            className="inline-flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <FaTimes className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                          <button
                            type="submit"
                            disabled={isUpdatingEvent}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUpdatingEvent ? 'Updating...' : 'Update Event'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardManager
