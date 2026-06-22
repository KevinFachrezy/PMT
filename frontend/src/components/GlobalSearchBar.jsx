import { useState, useEffect, useRef, useCallback } from 'react'
import {
  FaSearch, FaTimes, FaProjectDiagram, FaTasks,
  FaFolder, FaChevronRight, FaSpinner,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { searchService } from '../services'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  // Projects
  planning:    'bg-gray-100 text-gray-600',
  active:      'bg-green-100 text-green-700',
  completed:   'bg-blue-100 text-blue-700',
  on_hold:     'bg-yellow-100 text-yellow-700',
  // Tasks
  todo:        'bg-gray-100 text-gray-600',
  in_progress: 'bg-orange-100 text-orange-700',
}

const PRIORITY_COLORS = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low:    'bg-green-100 text-green-700',
}

const FILE_TYPE_COLORS = {
  pdf:  'bg-red-100 text-red-700',
  doc:  'bg-blue-100 text-blue-700',
  docx: 'bg-blue-100 text-blue-700',
  xls:  'bg-green-100 text-green-700',
  xlsx: 'bg-green-100 text-green-700',
  jpg:  'bg-purple-100 text-purple-700',
  jpeg: 'bg-purple-100 text-purple-700',
  png:  'bg-purple-100 text-purple-700',
  txt:  'bg-gray-100 text-gray-600',
}

// Highlight matching text
const Highlight = ({ text = '', query = '' }) => {
  if (!query || !text) return <span>{text}</span>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-orange-200 text-orange-900 rounded px-0.5 not-italic font-semibold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const GlobalSearchBar = () => {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState(null)   // null = never searched
  const [loading, setLoading]   = useState(false)
  const [open, setOpen]         = useState(false)
  const [focused, setFocused]   = useState(false)

  const inputRef    = useRef(null)
  const dropdownRef = useRef(null)
  const navigate    = useNavigate()
  const debounceRef = useRef(null)

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const doSearch = useCallback(async (q) => {
    if (q.trim().length < 2) {
      setResults(null)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const res = await searchService.search(q.trim(), 5)
      setResults(res.data || { projects: [], tasks: [], documents: [] })
    } catch {
      setResults({ projects: [], tasks: [], documents: [] })
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    setOpen(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(val), 320)
  }

  const clearSearch = () => {
    setQuery('')
    setResults(null)
    setOpen(false)
    inputRef.current?.focus()
  }

  const handleNavigate = (url) => {
    setOpen(false)
    setQuery('')
    setResults(null)
    navigate(url)
  }

  const totalCount = results
    ? (results.projects?.length || 0) + (results.tasks?.length || 0) + (results.documents?.length || 0)
    : 0

  const hasResults = results && totalCount > 0
  const noResults  = results && totalCount === 0

  return (
    <div className="relative flex-1 max-w-xl mx-6">
      {/* Input */}
      <div className={`flex items-center bg-gray-100 rounded-xl px-3 py-2 transition-all ${
        focused ? 'ring-2 ring-orange-500 bg-white shadow-sm' : 'hover:bg-gray-200'
      }`}>
        {loading
          ? <FaSpinner className="text-gray-400 text-sm animate-spin flex-shrink-0" />
          : <FaSearch className="text-gray-400 text-sm flex-shrink-0" />
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { setFocused(true); if (query.length >= 2) setOpen(true) }}
          onBlur={() => setFocused(false)}
          placeholder="Search projects, tasks, documents..."
          className="flex-1 bg-transparent ml-2 text-sm text-gray-700 placeholder-gray-400 outline-none"
          autoComplete="off"
        />
        {query ? (
          <button onClick={clearSearch} className="ml-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
            <FaTimes className="text-xs" />
          </button>
        ) : (
          <span className="ml-1 text-xs text-gray-300 flex-shrink-0 hidden sm:block">Ctrl+K</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (hasResults || noResults || loading) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          style={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
          {loading && !results && (
            <div className="flex items-center justify-center py-8 space-x-2 text-gray-400">
              <FaSpinner className="animate-spin" />
              <span className="text-sm">Searching...</span>
            </div>
          )}

          {noResults && !loading && (
            <div className="py-10 text-center">
              <FaSearch className="mx-auto text-gray-300 text-3xl mb-2" />
              <p className="text-gray-500 text-sm font-medium">No results for "{query}"</p>
              <p className="text-gray-400 text-xs mt-1">Try different keywords</p>
            </div>
          )}

          {hasResults && (
            <div className="py-1">
              {/* Projects */}
              {results.projects?.length > 0 && (
                <Section
                  icon={<FaProjectDiagram className="text-orange-500" />}
                  label="Projects"
                  count={results.projects.length}
                >
                  {results.projects.map(item => (
                    <ResultRow
                      key={item.id}
                      onClick={() => handleNavigate(item.url)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          <Highlight text={item.title} query={query} />
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            <Highlight text={item.description} query={query} />
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        <Badge text={item.status?.replace('_', ' ')} color={STATUS_COLORS[item.status] || 'bg-gray-100 text-gray-600'} />
                      </div>
                    </ResultRow>
                  ))}
                </Section>
              )}

              {/* Tasks */}
              {results.tasks?.length > 0 && (
                <Section
                  icon={<FaTasks className="text-blue-500" />}
                  label="Tasks"
                  count={results.tasks.length}
                >
                  {results.tasks.map(item => (
                    <ResultRow
                      key={item.id}
                      onClick={() => handleNavigate(item.url)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          <Highlight text={item.title} query={query} />
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {item.project && <span>in <span className="text-orange-600">{item.project}</span></span>}
                          {item.assignee && <span> &bull; {item.assignee}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        {item.priority && (
                          <Badge text={item.priority} color={PRIORITY_COLORS[item.priority] || 'bg-gray-100 text-gray-600'} />
                        )}
                        <Badge text={item.status?.replace('_', ' ')} color={STATUS_COLORS[item.status] || 'bg-gray-100 text-gray-600'} />
                      </div>
                    </ResultRow>
                  ))}
                </Section>
              )}

              {/* Documents */}
              {results.documents?.length > 0 && (
                <Section
                  icon={<FaFolder className="text-purple-500" />}
                  label="Documents"
                  count={results.documents.length}
                >
                  {results.documents.map(item => (
                    <ResultRow
                      key={item.id}
                      onClick={() => handleNavigate(item.url)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          <Highlight text={item.title} query={query} />
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          <Highlight text={item.file_name} query={query} />
                          {item.project && <span> &bull; {item.project}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        {item.file_type && (
                          <Badge
                            text={item.file_type.toUpperCase()}
                            color={FILE_TYPE_COLORS[item.file_type] || 'bg-gray-100 text-gray-600'}
                          />
                        )}
                      </div>
                    </ResultRow>
                  ))}
                </Section>
              )}

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">{totalCount} result{totalCount !== 1 ? 's' : ''} for "{query}"</span>
                <span className="text-xs text-gray-300">Esc to close</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const Section = ({ icon, label, count, children }) => (
  <div>
    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
      {icon}
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 font-semibold">{count}</span>
    </div>
    {children}
  </div>
)

const ResultRow = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center px-4 py-3 hover:bg-orange-50 transition-colors text-left group"
  >
    {children}
    <FaChevronRight className="text-gray-300 group-hover:text-orange-400 text-xs flex-shrink-0 ml-2 transition-colors" />
  </button>
)

const Badge = ({ text, color }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${color}`}>
    {text}
  </span>
)

export default GlobalSearchBar
