import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FaCheckSquare, FaPlus, FaEdit, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TaskDetailModal from '../components/TaskDetailModal'
import CreateTaskModal from '../components/CreateTaskModal'
import EditProjectModal from '../components/EditProjectModal'
import { projectService, taskService, userService } from '../services'
import { useAuthStore } from '../stores/authStore'

const ProjectView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [activeTask, setActiveTask] = useState(null)
  const [showEditProject, setShowEditProject] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [isRequestingCompletion, setIsRequestingCompletion] = useState(false)
  const [projectMembers, setProjectMembers] = useState([])
  const [highlightedTaskId, setHighlightedTaskId] = useState(null)
  const isProjectLocked = project?.status === 'completed'
  const focusTaskId = new URLSearchParams(location.search).get('focus_task')
  const handlerNames = projectMembers
    .map((member) => member?.name)
    .filter(Boolean)
    .filter((name, index, names) => names.indexOf(name) === index)

  const formatProjectDate = (value) => {
    if (!value) return '-'
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return '-'
    return parsedDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag before activating – lets click still fire
      },
    })
  )

  useEffect(() => {
    if (id) {
      fetchProjectAndTasks()
    }
  }, [id])

  useEffect(() => {
    if (!focusTaskId || tasks.length === 0) return

    const targetTask = tasks.find((task) => String(task.id) === String(focusTaskId))
    if (!targetTask) return

    setHighlightedTaskId(targetTask.id)
    setSelectedTask(targetTask)
    setShowTaskDetail(true)

    const timeoutId = setTimeout(() => {
      setHighlightedTaskId(null)
    }, 4000)

    return () => clearTimeout(timeoutId)
  }, [focusTaskId, tasks])

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true)

      // Fetch project details
      const projectRes = await projectService.getById(id)
      const projectData = projectRes.data.success ? projectRes.data.data : projectRes.data
      setProject(projectData)
      setNewStatus(projectData.status)

      // Build project members from: handlers + legacy client + users assigned to tasks
      const memberMap = {}
      if (Array.isArray(projectData.handlers)) {
        projectData.handlers.forEach((handler) => {
          memberMap[handler.id] = handler
        })
      }
      if (projectData.client) {
        memberMap[projectData.client.id] = projectData.client
      }

      // Fetch tasks for this project
      const tasksRes = await taskService.getAll({ project_id: id })
      const tasksData = tasksRes.data.success ? tasksRes.data.data : tasksRes.data
      const tasksList = Array.isArray(tasksData) ? tasksData : []
      setTasks(tasksList)

      // Collect assigned users from tasks
      tasksList.forEach(t => {
        const assignee = t.assignedUser || t.assigned_user
        if (assignee) memberMap[assignee.id] = assignee
      })
      setProjectMembers(Object.values(memberMap))

    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to load project')

      setProject({
        id: 1,
        title: 'Project 1',
        description: 'General Auditing for X Company',
        status: 'in_progress'
      })
      setTasks([
        { id: 1, title: 'Task 1', status: 'todo', priority: 'high' },
        { id: 2, title: 'Task 2', status: 'todo', priority: 'medium' },
        { id: 3, title: 'Task 3', status: 'in_progress', priority: 'high' },
        { id: 4, title: 'Task 4', status: 'in_progress', priority: 'low' },
        { id: 5, title: 'Task 5', status: 'in_progress', priority: 'medium' },
        { id: 6, title: 'Task 6', status: 'completed', priority: 'high' },
        { id: 7, title: 'Task 7', status: 'completed', priority: 'medium' },
        { id: 8, title: 'Task 8', status: 'completed', priority: 'low' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskDetail(true)
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    )
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }

  const handleTaskCreated = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask])
    fetchProjectAndTasks()
  }

  const handleUpdateProjectStatus = async () => {
    try {
      await projectService.update(id, { status: newStatus })
      setProject(prev => ({ ...prev, status: newStatus }))
      setShowEditStatus(false)
      toast.success('Project status updated')
    } catch (err) {
      console.error('Failed to update project status:', err)
      toast.error('Failed to update project status')
    }
  }

  const handleRequestCompletion = async () => {
    try {
      setIsRequestingCompletion(true)
      const response = await projectService.requestCompletion(id)
      toast.success(response?.message || 'Completion request sent to manager')
    } catch (err) {
      console.error('Failed to request project completion:', err)
      toast.error(err.response?.data?.message || 'Failed to send completion request')
    } finally {
      setIsRequestingCompletion(false)
    }
  }

  // ── Drag & Drop handlers ─────────────────────────────────────────────────
  const handleDragStart = (event) => {
    if (isProjectLocked) {
      toast.error('Tasks are locked because this project is completed')
      return
    }

    const task = tasks.find(t => String(t.id) === String(event.active.id))
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    if (isProjectLocked) {
      toast.error('Tasks are locked because this project is completed')
      return
    }

    const taskId = String(active.id)
    const newStatus = String(over.id) // column id = status string

    const task = tasks.find(t => String(t.id) === taskId)
    if (!task || task.status === newStatus) return

    // Optimistic update
    setTasks(prev =>
      prev.map(t => (String(t.id) === taskId ? { ...t, status: newStatus } : t))
    )

    try {
      await taskService.update(task.id, { status: newStatus })
    } catch (err) {
      console.error('Failed to update task status:', err)
      toast.error('Failed to move task')
      // Revert on failure
      setTasks(prev =>
        prev.map(t => (String(t.id) === taskId ? { ...t, status: task.status } : t))
      )
    }
  }

  const getPriorityBackgroundColor = (priority) => {
    const colorMap = {
      low: 'rgb(179, 179, 0)',
      medium: 'rgb(255, 153, 0)',
      high: 'rgb(234, 88, 12)',
    }

    return colorMap[String(priority || '').toLowerCase()] || colorMap.medium
  }

  // ── Sub-components ───────────────────────────────────────────────────────

  const DraggableTaskCard = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: String(task.id),
    })

    const style = transform
      ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
      : undefined

    let isWarning = false
    if (task.due_date && task.status !== 'completed') {
      const dueDate = new Date(task.due_date)
      dueDate.setHours(0, 0, 0, 0)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const diffTime = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
      if (diffTime <= 1) isWarning = true
    }

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={(e) => {
          // Only open modal if it wasn't a drag
          if (!isDragging) handleTaskClick(task)
        }}
        className={`rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all mb-3 flex items-center justify-between group select-none hover:brightness-95 ${
          isDragging ? 'opacity-30' : ''
        } ${String(highlightedTaskId) === String(task.id) ? 'ring-4 ring-amber-300 animate-pulse' : ''
        }`}
        style={{
          ...style,
          backgroundColor: getPriorityBackgroundColor(task.priority),
        }}
      >
        <h3 className="text-white font-semibold pr-2">{task.title}</h3>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {isWarning && <FaExclamationTriangle className="text-red-500 bg-white rounded-full p-0.5 text-xl animate-pulse" title="Mendekati deadline atau terlambat" />}
          <FaCheckSquare className="text-white text-xl opacity-80 group-hover:opacity-100" />
        </div>
      </div>
    )
  }

  const DroppableColumn = ({ title, status, dotColor, tasks }) => {
    const { setNodeRef, isOver } = useDroppable({ id: status })

    return (
      <div className="flex-1 min-w-[300px]">
        <div
          className={`bg-white rounded-lg border-2 overflow-hidden transition-colors ${
            isOver ? 'border-orange-400 bg-orange-50' : 'border-orange-600'
          }`}
        >
          <div className="bg-gray-100 px-4 py-3 border-b-2 border-orange-600">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
              <h3 className="font-semibold text-gray-800">{title}</h3>
              <span className="text-sm text-gray-500">({tasks.length})</span>
            </div>
          </div>
          <div ref={setNodeRef} className="p-4 min-h-[400px]">
            {tasks.map(task => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div className={`flex items-center justify-center h-full min-h-[120px] rounded-lg border-2 border-dashed transition-colors ${
                isOver ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
              }`}>
                <p className="text-gray-400 text-sm">
                  {isOver ? 'Drop here' : 'No tasks'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              <p className="text-gray-500 mt-4">Loading project...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="p-8">
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Project not found</p>
              <button
                onClick={() => navigate('/projects')}
                className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Back to Projects
              </button>
            </div>
          </div>
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
          {/* Project Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-orange-600 mb-2">
                  {project.title}
                </h1>
                <p className="text-gray-600 text-lg">
                  {project.description || 'No description'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Client: {project.client_name || project.client?.name || '-'}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Handler: {handlerNames.length > 0 ? handlerNames.join(', ') : '-'}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Due Date: {formatProjectDate(project.due_date)}
                </p>
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : project.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : project.status === 'on_hold'
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}>
                    {project.status?.replace(/_/g, ' ') || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex gap-3">
                {/* Edit Project Button — visible to managers */}
                {user?.role === 'manager' && (
                  <button
                    onClick={() => setShowEditProject(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <FaEdit />
                    <span className="font-semibold">Edit Project</span>
                  </button>
                )}

                {/* Completion request button — visible to project handlers */}
                {user?.role === 'project_handler' && !isProjectLocked && (
                  <button
                    onClick={handleRequestCompletion}
                    disabled={isRequestingCompletion}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane />
                    <span className="font-semibold">
                      {isRequestingCompletion ? 'Sending...' : 'Request Completion'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* New Task Button */}
          <div className="mb-6 flex justify-end">
            <button 
              onClick={() => {
                if (isProjectLocked) {
                  toast.error('Completed projects cannot receive new tasks')
                  return
                }

                setShowCreateTask(true)
              }}
              disabled={isProjectLocked}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FaPlus />
              <span>{isProjectLocked ? 'Tasks Locked' : 'New Task'}</span>
            </button>
          </div>

          {isProjectLocked && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              This project is completed. Task status changes, edits, deletions, and new task creation are locked.
            </div>
          )}

          {/* Kanban Board */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 overflow-x-auto pb-4">
              <DroppableColumn
                title="To Do"
                status="todo"
                dotColor="bg-red-500"
                tasks={getTasksByStatus('todo')}
              />
              <DroppableColumn
                title="In Progress"
                status="in_progress"
                dotColor="bg-yellow-500"
                tasks={getTasksByStatus('in_progress')}
              />
              <DroppableColumn
                title="Done"
                status="completed"
                dotColor="bg-green-500"
                tasks={getTasksByStatus('completed')}
              />
            </div>

            {/* Ghost card shown while dragging */}
            <DragOverlay>
              {activeTask ? (
                <div
                  className="rounded-lg p-4 shadow-2xl flex items-center justify-between opacity-95 rotate-2"
                  style={{ backgroundColor: getPriorityBackgroundColor(activeTask.priority) }}
                >
                  <h3 className="text-white font-semibold">{activeTask.title}</h3>
                  <FaCheckSquare className="text-white text-xl opacity-80" />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Modals */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={showTaskDetail}
        onClose={() => setShowTaskDetail(false)}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
        isLocked={isProjectLocked}
      />

      <CreateTaskModal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        projectId={id}
        onTaskCreated={handleTaskCreated}
        projectMembers={projectMembers}
        isLocked={isProjectLocked}
      />

      <EditProjectModal
        isOpen={showEditProject}
        onClose={() => setShowEditProject(false)}
        project={project}
        onProjectUpdated={() => {
          fetchProjectAndTasks()
        }}
        onProjectDeleted={() => {
          navigate('/projects')
        }}
      />
    </div>
  )
}

export default ProjectView
