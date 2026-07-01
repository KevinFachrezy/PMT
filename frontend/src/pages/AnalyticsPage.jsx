import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts'
import {
  FaChartPie, FaChartBar, FaChartLine, FaProjectDiagram,
  FaTasks, FaUsers, FaExclamationTriangle, FaTrophy,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { analyticsService } from '../services'

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  Planning:    '#6B7280',
  'In Progress': '#F59E0B',
  Done:        '#10B981',
  'To Do':     '#EF4444',
}

const PRIORITY_COLORS = {
  todo:        '#EF4444',
  in_progress: '#F59E0B',
  completed:   '#10B981',
}

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center space-x-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="text-white text-2xl" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  </div>
)

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-2 mb-4">
    <Icon className="text-orange-500 text-lg" />
    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
  </div>
)

// Custom tooltip for recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3 text-sm">
      {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ─── Page Component ──────────────────────────────────────────────────────────

const AnalyticsPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [summary, setSummary] = useState(null)
  const [tasksByStatus, setTasksByStatus] = useState([])
  const [tasksByPriority, setTasksByPriority] = useState([])
  const [userWorkload, setUserWorkload] = useState([])
  const [projectProgress, setProjectProgress] = useState([])
  const [taskTrend, setTaskTrend] = useState([])

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [sumRes, tsByStatus, tsByPriority, workload, progress, trend] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getTasksByStatus(),
        analyticsService.getTasksByPriority(),
        analyticsService.getUserWorkload(),
        analyticsService.getProjectProgress(),
        analyticsService.getTaskTrend(),
      ])

      setSummary(sumRes.data)
      setTasksByStatus(tsByStatus.data || [])
      setTasksByPriority(tsByPriority.data || [])
      setUserWorkload((workload.data || []).sort((a, b) => b.total - a.total))
      setProjectProgress((progress.data || []).sort((a, b) => b.progress - a.progress))
      setTaskTrend(trend.data || [])
    } catch (err) {
      console.error('Error loading analytics:', err)

      if (err.response?.status === 403) {
        setAccessDenied(true)
        return
      }

      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const statusLabel = (s) => {
    const map = { planning: 'Planning', in_progress: 'In Progress', completed: 'Completed' }
    return map[s] || s
  }

  const statusBadge = (s) => {
    const map = {
      planning:    'bg-gray-100 text-gray-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      completed:   'bg-green-100 text-green-700',
    }
    return map[s] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4" />
              <p className="text-gray-500">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="p-8">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
              <FaChartBar className="mx-auto mb-4 text-5xl text-amber-600" />
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Akses Ditolak</h2>
              <p className="text-amber-700 mb-6">
                Anda tidak memiliki izin untuk membuka halaman Analytics.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-lg bg-orange-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-orange-700"
              >
                Back to Dashboard
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

        <div className="p-8 space-y-8">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">Analytics Dashboard</h1>
              <p className="text-gray-500 mt-1">Project & team performance overview</p>
            </div>
            <button
              onClick={fetchAll}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
            >
              Refresh
            </button>
          </div>

          {/* ── Stat Cards ─────────────────────────────────────────────── */}
          {summary && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={FaProjectDiagram}
                label="Total Projects"
                value={summary.projects.total}
                sub={`${summary.projects.active} active`}
                color="bg-orange-500"
              />
              <StatCard
                icon={FaTasks}
                label="Total Tasks"
                value={summary.tasks.total}
                sub={`${summary.tasks.completion_rate}% done`}
                color="bg-blue-500"
              />
              <StatCard
                icon={FaTrophy}
                label="Completed Tasks"
                value={summary.tasks.completed}
                sub={`${summary.tasks.in_progress} in progress`}
                color="bg-green-500"
              />
              <StatCard
                icon={FaExclamationTriangle}
                label="Overdue Tasks"
                value={summary.tasks.overdue}
                sub="Past due date"
                color={summary.tasks.overdue > 0 ? 'bg-red-500' : 'bg-gray-400'}
              />
            </div>
          )}

          {/* ── Row 2: Pie + Bar (Priority) ────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task status donut */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <SectionTitle icon={FaChartPie} title="Tasks by Status" />
              {tasksByStatus.every(d => d.value === 0) ? (
                <p className="text-gray-400 text-center py-12">No task data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={tasksByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {tasksByStatus.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Tasks by priority stacked bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <SectionTitle icon={FaChartBar} title="Tasks by Priority" />
              {tasksByPriority.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No task data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={tasksByPriority} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="priority" tick={{ fontSize: 13 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="todo"        name="To Do"       fill={PRIORITY_COLORS.todo}        radius={[3,3,0,0]} stackId="a" />
                    <Bar dataKey="in_progress" name="In Progress" fill={PRIORITY_COLORS.in_progress} radius={[0,0,0,0]} stackId="a" />
                    <Bar dataKey="completed"   name="Done"        fill={PRIORITY_COLORS.completed}   radius={[3,3,0,0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Task Trend Line Chart ────────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <SectionTitle icon={FaChartLine} title="Task Activity (Last 6 Months)" />
            {taskTrend.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No trend data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={taskTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="created"   name="Created"   stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Row 3: User Workload + Project Progress ──────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User workload bar chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <SectionTitle icon={FaUsers} title="Team Workload" />
              {userWorkload.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No user data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={userWorkload} layout="vertical" barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="todo"        name="To Do"       fill={PRIORITY_COLORS.todo}        stackId="b" />
                    <Bar dataKey="in_progress" name="In Progress" fill={PRIORITY_COLORS.in_progress} stackId="b" />
                    <Bar dataKey="completed"   name="Done"        fill={PRIORITY_COLORS.completed}   stackId="b" radius={[0,3,3,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Project progress table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <SectionTitle icon={FaProjectDiagram} title="Project Progress" />
              {projectProgress.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No project data yet</p>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[260px] pr-1">
                  {projectProgress.map((project) => (
                    <div key={project.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {project.title}
                          </span>
                          <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(project.status)}`}>
                            {statusLabel(project.status)}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-700 flex-shrink-0 ml-2">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {project.completed}/{project.total_tasks}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Completion Rate Cards ──────────────────────────────────────── */}
          {userWorkload.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <SectionTitle icon={FaTrophy} title="Team Completion Rate" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {userWorkload.map((user) => (
                  <div key={user.name} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-600 font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 mb-2">{user.role}</p>
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div
                        className="absolute top-0 left-0 h-2 rounded-full bg-green-500 transition-all"
                        style={{ width: `${user.completion_rate}%` }}
                      />
                    </div>
                    <p className="text-sm font-bold text-green-600 mt-1">{user.completion_rate}%</p>
                    <p className="text-xs text-gray-400">{user.completed}/{user.total} tasks</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
