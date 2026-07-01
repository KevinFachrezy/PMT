import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaHistory, FaSearch, FaFilter, FaChevronLeft, FaChevronRight,
  FaPlus, FaEdit, FaTrash, FaUpload, FaDownload, FaExchangeAlt,
  FaFolder, FaTasks, FaProjectDiagram, FaUsers,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { activityService } from '../services'

// ─── Config maps ────────────────────────────────────────────────────────────

const ACTION_CONFIG = {
  created:        { label: 'Created',        icon: FaPlus,         color: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  updated:        { label: 'Updated',        icon: FaEdit,         color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
  status_changed: { label: 'Moved',          icon: FaExchangeAlt,  color: 'bg-yellow-100 text-yellow-700',dot: 'bg-yellow-500' },
  deleted:        { label: 'Deleted',        icon: FaTrash,        color: 'bg-red-100 text-red-700',      dot: 'bg-red-500' },
  uploaded:       { label: 'Uploaded',       icon: FaUpload,       color: 'bg-purple-100 text-purple-700',dot: 'bg-purple-500' },
  downloaded:     { label: 'Downloaded',     icon: FaDownload,     color: 'bg-indigo-100 text-indigo-700',dot: 'bg-indigo-500' },
}

const MODEL_CONFIG = {
  Project:  { icon: FaProjectDiagram, color: 'text-orange-500' },
  Task:     { icon: FaTasks,          color: 'text-blue-500' },
  Document: { icon: FaFolder,         color: 'text-purple-500' },
  User:     { icon: FaUsers,          color: 'text-green-500' },
}

const getActionConfig = (action) =>
  ACTION_CONFIG[action] || { label: action, icon: FaEdit, color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' }

const getModelConfig = (modelType) =>
  MODEL_CONFIG[modelType] || { icon: FaHistory, color: 'text-gray-500' }

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatTime = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const formatRelative = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d ago`
  return formatDate(dateStr)
}

// ─── Page ────────────────────────────────────────────────────────────────────

const ActivityPage = () => {
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 })

  // Filters
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [modelFilter, setModelFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  // Grouped by date for timeline view
  const grouped = activities.reduce((acc, act) => {
    const key = formatDate(act.created_at)
    if (!acc[key]) acc[key] = []
    acc[key].push(act)
    return acc
  }, {})

  const fetchActivities = useCallback(async (p = page) => {
    try {
      setLoading(true)
      const params = { page: p }
      if (search)       params.search     = search
      if (actionFilter) params.action     = actionFilter
      if (modelFilter)  params.model_type = modelFilter
      if (dateFrom)     params.date_from  = dateFrom
      if (dateTo)       params.date_to    = dateTo

      const res = await activityService.getAll(params)
      setActivities(res.data || [])
      setMeta(res.meta || { current_page: 1, last_page: 1, total: 0 })
    } catch (err) {
      console.error('Error loading activities:', err)

      if (err.response?.status === 403) {
        setAccessDenied(true)
        return
      }

      toast.error('Failed to load activity log')
    } finally {
      setLoading(false)
    }
  }, [search, actionFilter, modelFilter, dateFrom, dateTo, page])

  useEffect(() => {
    activityService
      .getStats()
      .then(r => setStats(r.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setAccessDenied(true)
        }
      })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchActivities(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, actionFilter, modelFilter, dateFrom, dateTo]) // eslint-disable-line

  useEffect(() => {
    fetchActivities(page)
  }, [page]) // eslint-disable-line

  const handlePageChange = (p) => {
    if (p < 1 || p > meta.last_page) return
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearch(''); setActionFilter(''); setModelFilter('')
    setDateFrom(''); setDateTo(''); setPage(1)
  }

  const hasFilters = search || actionFilter || modelFilter || dateFrom || dateTo

  if (accessDenied) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="p-8">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
              <FaHistory className="mx-auto mb-4 text-5xl text-amber-600" />
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Akses Ditolak</h2>
              <p className="text-amber-700 mb-6">
                Anda tidak memiliki izin untuk membuka halaman Activity Log.
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

        <div className="p-8 space-y-6">
          {/* Page title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">Activity Log</h1>
              <p className="text-gray-500 mt-1">
                {stats ? `${stats.total.toLocaleString()} total activities` : 'Loading...'}
              </p>
            </div>
            <button
              onClick={() => { setPage(1); fetchActivities(1) }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold"
            >
              Refresh
            </button>
          </div>

          {/* Quick stat badges */}
          {stats && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(ACTION_CONFIG).map(([key, cfg]) => {
                const count = stats.by_action?.[key] ?? 0
                if (!count) return null
                const Icon = cfg.icon
                return (
                  <button
                    key={key}
                    onClick={() => setActionFilter(actionFilter === key ? '' : key)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      actionFilter === key
                        ? `${cfg.color} border-transparent ring-2 ring-offset-1 ring-orange-400`
                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}
                  >
                    <Icon className="text-xs" />
                    <span>{cfg.label}</span>
                    <span className="bg-white bg-opacity-70 px-1.5 py-0.5 rounded-full">{count}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Filters bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-wrap gap-3 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-gray-500 font-medium mb-1 block">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search activities..."
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Model type */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Type</label>
                <select
                  value={modelFilter}
                  onChange={e => setModelFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Types</option>
                  <option value="Project">Project</option>
                  <option value="Task">Task</option>
                  <option value="Document">Document</option>
                  <option value="User">User</option>
                </select>
              </div>

              {/* Action */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Action</label>
                <select
                  value={actionFilter}
                  onChange={e => setActionFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Actions</option>
                  {Object.entries(ACTION_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              {/* Date range */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-red-500 hover:text-red-700 underline self-end"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Timeline */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
            </div>
          ) : activities.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
              <FaHistory className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No activities found</p>
              <p className="text-gray-400 text-sm mt-1">
                {hasFilters ? 'Try adjusting your filters' : 'Activities will appear here as users work'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([date, items]) => (
                <div key={date}>
                  {/* Date divider */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                      {date}
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  {/* Activity cards */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                    {items.map((act) => {
                      const acfg = getActionConfig(act.action)
                      const mcfg = getModelConfig(act.model_type)
                      const ActionIcon = acfg.icon
                      const ModelIcon  = mcfg.icon

                      return (
                        <div key={act.id} className="flex items-start p-4 hover:bg-gray-50 transition-colors">
                          {/* Dot + icon */}
                          <div className="flex-shrink-0 flex items-center pt-0.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${acfg.color} mr-3`}>
                              <ActionIcon className="text-xs" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="text-sm text-gray-800">{act.description}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  {/* Model type badge */}
                                  <span className={`flex items-center gap-1 text-xs font-medium ${mcfg.color}`}>
                                    <ModelIcon className="text-xs" />
                                    {act.model_type}
                                  </span>

                                  {/* Action badge */}
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${acfg.color}`}>
                                    {acfg.label}
                                  </span>

                                  {/* Properties (from / to) */}
                                  {act.properties?.from && act.properties?.to && (
                                    <span className="text-xs text-gray-400">
                                      {act.properties.from} → {act.properties.to}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Right: user + time */}
                              <div className="text-right flex-shrink-0">
                                {act.user && (
                                  <p className="text-xs font-semibold text-gray-700">{act.user.name}</p>
                                )}
                                <p className="text-xs text-gray-400" title={`${formatDate(act.created_at)} ${formatTime(act.created_at)}`}>
                                  {formatRelative(act.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-3 shadow-sm">
              <p className="text-sm text-gray-500">
                Page {meta.current_page} of {meta.last_page} ({meta.total} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(meta.current_page - 1)}
                  disabled={meta.current_page === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="text-gray-600 text-sm" />
                </button>

                {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                  const start = Math.max(1, Math.min(meta.current_page - 2, meta.last_page - 4))
                  const p = start + i
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        p === meta.current_page
                          ? 'bg-orange-600 text-white'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(meta.current_page + 1)}
                  disabled={meta.current_page === meta.last_page}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="text-gray-600 text-sm" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityPage
