import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { FaCalendar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import EventDetailModal from '../components/EventDetailModal'
import { taskService, projectService } from '../services'
import { useAuthStore } from '../stores/authStore'

const toDateKey = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

const CalendarPage = () => {
  const location = useLocation()
  const { user } = useAuthStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedDateKey, setSelectedDateKey] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchData()
  }, [selectedProject])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const queryProjectId = params.get('project_id')
    const queryDate = params.get('date')

    if (queryProjectId) {
      setSelectedProject(queryProjectId)
    }

    if (queryDate) {
      const parsedDate = new Date(queryDate)
      if (!Number.isNaN(parsedDate.getTime())) {
        setCurrentDate(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1))
        setSelectedDateKey(toDateKey(parsedDate))
      }
    }
  }, [location.search])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch projects
      const projectsRes = await projectService.getAll()
      const projectsData = projectsRes.data.success ? projectsRes.data.data : projectsRes.data
      const rawProjects = Array.isArray(projectsData) ? projectsData : projectsData.data || []

      const filteredProjects = rawProjects.filter((project) => {
        if (user?.role === 'manager') return true
        if (user?.role === 'project_handler') {
          const isClientContact = String(project.client_id) === String(user.id)
          const isHandler = Array.isArray(project.handlers)
            ? project.handlers.some((h) => String(h.id) === String(user.id))
            : false
          return isClientContact || isHandler
        }
        return true
      })

      setProjects(filteredProjects)

      // Fetch tasks
      const params = {}
      if (selectedProject) {
        params.project_id = selectedProject
      }

      const tasksRes = await taskService.getAll(params)
      const tasksData = tasksRes.data.success ? tasksRes.data.data : tasksRes.data
      const rawTasks = Array.isArray(tasksData) ? tasksData : tasksData.data || []

      const filteredTasks = rawTasks.filter((task) => {
        if (user?.role === 'manager') return true
        if (user?.role === 'project_handler') return String(task.assigned_to) === String(user.id)
        return true
      })

      setTasks(filteredTasks)

    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }

  // Calendar calculations
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDateKey(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDateKey(null)
  }

  const tasksByDate = useMemo(() => {
    const map = new Map()

    const groupedTasks = Object.values(tasks.reduce((acc, task) => {
      const key = `${task.title}_${task.due_date}_${task.project_id}_${task.status}`
      if (!acc[key]) {
        acc[key] = {
          ...task,
          grouped_ids: [task.id],
          grouped_handlers: task.assignedUser ? [task.assignedUser] : [],
        }
      } else {
        acc[key].grouped_ids.push(task.id)
        if (task.assignedUser && !acc[key].grouped_handlers.some(h => h.id === task.assignedUser.id)) {
          acc[key].grouped_handlers.push(task.assignedUser)
        }
      }
      return acc
    }, {}))

    groupedTasks.forEach((task) => {
      const key = toDateKey(task.due_date)
      if (!key) return
      const prev = map.get(key) || []
      prev.push(task)
      map.set(key, prev)
    })
    return map
  }, [tasks])

  const projectsByDate = useMemo(() => {
    const map = new Map()
    const visibleProjects = selectedProject
      ? projects.filter((p) => String(p.id) === String(selectedProject))
      : projects

    visibleProjects.forEach((project) => {
      const key = toDateKey(project.due_date)
      if (!key) return
      const prev = map.get(key) || []
      prev.push(project)
      map.set(key, prev)
    })
    return map
  }, [projects, selectedProject])

  const getDateKeyForDay = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const getItemsForDate = (day) => {
    const key = getDateKeyForDay(day)
    return {
      tasks: tasksByDate.get(key) || [],
      projects: projectsByDate.get(key) || [],
    }
  }

  const handleTaskClick = (task, event) => {
    if (event) {
      event.stopPropagation()
    }

    if (!task?.id) {
      toast.error('Task tidak valid')
      return
    }

    const dueDate = task.due_date ? new Date(task.due_date) : null
    setSelectedEvent({
      id: `task-${task.id}`,
      type: 'task',
      title: task.title,
      resourceId: task.id,
      resourceData: task,
      date: dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate : new Date(),
      isOverdue: dueDate ? dueDate < new Date() : false,
    })
  }

  const handleProjectClick = (project, event) => {
    if (event) {
      event.stopPropagation()
    }

    if (!project?.id) {
      toast.error('Project invalid')
      return
    }

    const dueDate = project.due_date ? new Date(project.due_date) : null
    setSelectedEvent({
      id: `project-${project.id}`,
      type: 'project',
      title: project.title,
      resourceId: project.id,
      resourceData: project,
      date: dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate : new Date(),
      isOverdue: dueDate ? dueDate < new Date() : false,
    })
  }

  const handleCloseDetailModal = () => {
    setSelectedEvent(null)
  }

  // Generate calendar grid
  const calendarDays = []

  // Empty cells before first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="p-2 min-h-[100px] bg-gray-50"></div>)
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayItems = getItemsForDate(day)
    const totalItems = dayItems.tasks.length + dayItems.projects.length
    const dateKey = getDateKeyForDay(day)
    const isToday = new Date().getDate() === day &&
      new Date().getMonth() === month &&
      new Date().getFullYear() === year

    calendarDays.push(
      <div
        key={day}
        onClick={() => setSelectedDateKey(dateKey)}
        className={`p-2 min-h-[100px] border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${isToday ? 'bg-orange-50 border-orange-300' : 'bg-white'
          } ${selectedDateKey === dateKey ? 'ring-2 ring-orange-500' : ''}`}
      >
        <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-orange-600' : 'text-gray-700'}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayItems.projects.slice(0, 1).map((project) => (
            <div
              key={`project-${project.id}`}
              onClick={(event) => handleProjectClick(project, event)}
              className="text-xs p-1 rounded text-white truncate bg-purple-600 cursor-pointer hover:brightness-95"
              title={`Project deadline: ${project.title}`}
            >
              Project: {project.title}
            </div>
          ))}
          {dayItems.tasks.slice(0, 2).map(task => {
            const priorityColor =
              task.priority === 'high' ? 'bg-red-500' :
                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'

            return (
              <div
                key={task.id}
                onClick={(event) => handleTaskClick(task, event)}
                className={`text-xs p-1 rounded text-white truncate ${priorityColor} cursor-pointer hover:brightness-95`}
                title={task.title}
              >
                {task.title}
              </div>
            )
          })}
          {totalItems > 3 && (
            <div className="text-xs text-gray-500 font-semibold">
              +{totalItems - 3} more
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Header />

        <div className="p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-orange-600 flex items-center">
              <FaCalendar className="mr-3" />
              Calendar
            </h1>

            {/* Filter by Project */}
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {/* Calendar Navigation */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronLeft className="text-xl text-gray-600" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800">
                {monthName} {year}
              </h2>

              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronRight className="text-xl text-gray-600" />
              </button>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading calendar...</p>
              </div>
            ) : (
              <>
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center font-semibold text-gray-700 bg-gray-100">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0 border border-gray-200">
                  {calendarDays}
                </div>
              </>
            )}
          </div>

          {/* Task and Project Details for Selected Date */}
          {selectedDateKey && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Details for {selectedDateKey}
              </h3>

              {(tasksByDate.get(selectedDateKey)?.length || 0) === 0 &&
                (projectsByDate.get(selectedDateKey)?.length || 0) === 0 ? (
                <p className="text-gray-500 text-center py-8">No deadline scheduled for this date</p>
              ) : (
                <div className="space-y-6">
                  {(projectsByDate.get(selectedDateKey) || []).length > 0 && (
                    <div>
                      <h4 className="font-bold text-purple-700 mb-3">Project Deadlines</h4>
                      <div className="space-y-3">
                        {(projectsByDate.get(selectedDateKey) || []).map((project) => (
                          <div
                            key={`project-${project.id}`}
                            onClick={(event) => handleProjectClick(project, event)}
                            className="border border-purple-200 bg-purple-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <h5 className="font-semibold text-gray-800 mb-1">{project.title}</h5>
                            <p className="text-sm text-gray-700 mb-2">{project.description || 'No description'}</p>
                            <div className="text-xs text-gray-600 font-medium">
                              Status: {project.status?.replace('_', ' ').toUpperCase()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  )}

                  {(tasksByDate.get(selectedDateKey) || []).length > 0 && (
                    <div>
                      <h4 className="font-bold text-blue-700 mb-3">Task Deadlines</h4>
                      <div className="space-y-3">
                        {(tasksByDate.get(selectedDateKey) || []).map(task => (
                          <div
                            key={task.id}
                            onClick={(event) => handleTaskClick(task, event)}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800 mb-1">{task.title}</h5>
                                <p className="text-sm text-gray-600 mb-2">{task.description || 'No description'}</p>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <span className={`px-2 py-1 rounded font-semibold ${task.priority === 'high' ? 'bg-red-100 text-red-600' :
                                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                    {task.priority?.toUpperCase()}
                                  </span>
                                  <span className={`px-2 py-1 rounded font-semibold ${task.status === 'completed' ? 'bg-green-100 text-green-600' :
                                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    {task.status?.replace('_', ' ').toUpperCase()}
                                  </span>
                                  {task.project && (
                                    <span className="text-gray-500">
                                      Project: {task.project.title}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Legend:</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span className="text-sm text-gray-600">Project Deadline</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">High Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Medium Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Low Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={handleCloseDetailModal}
          onRefresh={fetchData}
        />
      )}
    </div>
  )
}

export default CalendarPage
