import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import { FaCalendarAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { projectService, taskService } from '../services'
import { useAuthStore } from '../stores/authStore'
import EventDetailModal from './EventDetailModal'

const CalendarView = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [viewType, setViewType] = useState('dayGridMonth')
  const { user } = useAuthStore()

  useEffect(() => {
    fetchCalendarEvents()
  }, [user])

  const isManager = user?.role === 'manager'
  const isProjectHandler = user?.role === 'project_handler'

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true)
      const calendarEvents = []

      // Fetch projects
      const projectsResponse = await projectService.getAll()
      const projectsData = projectsResponse.data?.success
        ? projectsResponse.data.data
        : projectsResponse.data
      const projects = Array.isArray(projectsData)
        ? projectsData
        : projectsData?.data || []

      // Fetch tasks
      const tasksResponse = await taskService.getAll()
      const tasksData = tasksResponse.data?.success
        ? tasksResponse.data.data
        : tasksResponse.data
      const tasks = Array.isArray(tasksData) ? tasksData : tasksData?.data || []

      // Filter dan tambah projects ke calendar
      projects.forEach((project) => {
        // Manager bisa lihat semua projects
        // Project Handler hanya lihat projects yang dia handle
        if (isManager || isProjectHandler) {
          if (project.due_date) {
            const isOverdue = new Date(project.due_date) < new Date()
            calendarEvents.push({
              id: `project-${project.id}`,
              title: `📁 ${project.title}`,
              date: project.due_date,
              type: 'project',
              backgroundColor: isOverdue ? '#EF4444' : '#A855F7',
              borderColor: isOverdue ? '#DC2626' : '#9333EA',
              textColor: '#ffffff',
              extendedProps: {
                resourceType: 'project',
                resourceId: project.id,
                resourceData: project,
                isOverdue: isOverdue,
              },
            })
          }
        }
      })

      // Filter dan tambah tasks ke calendar
      tasks.forEach((task) => {
        let shouldInclude = false

        if (isManager) {
          // Manager lihat semua tasks
          shouldInclude = true
        } else if (isProjectHandler && task.assigned_to === user?.id) {
          // Project Handler hanya lihat tasks yang diassign ke dia
          shouldInclude = true
        }

        if (shouldInclude && task.due_date) {
          const isOverdue = new Date(task.due_date) < new Date()
          calendarEvents.push({
            id: `task-${task.id}`,
            title: `✓ ${task.title}`,
            date: task.due_date,
            type: 'task',
            backgroundColor: isOverdue ? '#EF4444' : '#3B82F6',
            borderColor: isOverdue ? '#DC2626' : '#1D4ED8',
            textColor: '#ffffff',
            extendedProps: {
              resourceType: 'task',
              resourceId: task.id,
              resourceData: task,
              isOverdue: isOverdue,
            },
          })
        }
      })

      setEvents(calendarEvents)
    } catch (err) {
      console.error('Error fetching calendar events:', err)
      toast.error('Failed to load calendar events')
    } finally {
      setLoading(false)
    }
  }

  const handleEventClick = (info) => {
    const event = info.event
    setSelectedEvent({
      id: event.id,
      title: event.title,
      type: event.extendedProps.resourceType,
      resourceId: event.extendedProps.resourceId,
      resourceData: event.extendedProps.resourceData,
      date: event.start,
      isOverdue: event.extendedProps.isOverdue,
    })
  }

  const handleCloseDetailModal = () => {
    setSelectedEvent(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaCalendarAlt className="mr-3 text-purple-600 text-xl" />
          Calendar View
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('dayGridMonth')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewType === 'dayGridMonth'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewType('timeGridWeek')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewType === 'timeGridWeek'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewType('timeGridDay')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewType === 'timeGridDay'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Day
          </button>
          <button
            onClick={fetchCalendarEvents}
            className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded border border-blue-700"></div>
          <span className="text-gray-700 font-medium">Task</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded border border-purple-700"></div>
          <span className="text-gray-700 font-medium">Project</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded border border-red-700"></div>
          <span className="text-gray-700 font-medium">Overdue</span>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No upcoming deadlines</p>
          <p className="text-sm mt-2">All tasks and projects are on schedule</p>
        </div>
      ) : (
        <div className="fc-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView={viewType}
            view={viewType}
            onViewDidMount={(view) => {
              // Handle view mount if needed
            }}
            views={{
              dayGridMonth: { type: 'dayGrid', duration: { months: 1 } },
              timeGridWeek: { type: 'timeGrid', duration: { weeks: 1 } },
              timeGridDay: { type: 'timeGrid', duration: { days: 1 } },
            }}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '',
            }}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            contentHeight="auto"
            editable={false}
            eventDisplay="block"
            dayMaxEvents={3}
            eventClassNames={(arg) => {
              return ['fc-event-custom', `fc-${arg.event.extendedProps.resourceType}`]
            }}
          />
        </div>
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={handleCloseDetailModal}
          onRefresh={fetchCalendarEvents}
        />
      )}

      <style>{`
        .fc-wrapper {
          font-family: inherit;
        }

        .fc {
          font-size: 0.9rem;
        }

        .fc .fc-button-primary {
          background-color: #9333ea;
          border-color: #7e22ce;
        }

        .fc .fc-button-primary:hover {
          background-color: #a855f7;
          border-color: #9333ea;
        }

        .fc .fc-button-primary.fc-button-active {
          background-color: #a855f7;
          border-color: #9333ea;
        }

        .fc .fc-daygrid-day:hover {
          background-color: #f3f4f6;
        }

        .fc .fc-event {
          border: none;
          border-radius: 0.5rem;
          padding: 2px 4px;
        }

        .fc-event-title {
          font-weight: 600;
          font-size: 0.85rem;
          white-space: normal;
        }

        .fc-daygrid-day-number {
          padding: 6px;
          font-weight: 600;
        }

        .fc-col-header-cell {
          padding: 12px 2px;
          font-weight: 700;
          background-color: #f9fafb;
          border-color: #e5e7eb;
        }

        .fc-daygrid-day {
          border-color: #e5e7eb;
        }

        .fc-daygrid-day-frame {
          min-height: 120px;
        }
      `}</style>
    </div>
  )
}

export default CalendarView
