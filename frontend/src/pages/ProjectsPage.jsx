import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaFileAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { projectService } from '../services'
import { useAuthStore } from '../stores/authStore'

const ProjectsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('created_at')
  const [clientFilter, setClientFilter] = useState('all')

  useEffect(() => {
    fetchProjects()
  }, [sortBy])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      // Backend automatically filters based on user role
      const response = await projectService.getAll({ sort_by: sortBy })

      if (response.data && response.data.success) {
        setProjects(response.data.data || [])
      } else {
        setProjects(response.data || [])
      }

    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const clientOptions = Array.from(
    new Map(
      projects
        .filter((project) => project.client_id || project.client?.id || project.client_name)
        .map((project) => {
          const key = String(project.client_id || project.client?.id || project.client_name)
          const label = project.client_name || project.client?.name || 'Unknown Client'

          return [key, { key, label }]
        })
    ).values()
  )

  const filteredProjects = projects.filter((project) => {
    if (clientFilter === 'all') return true

    const projectClientKey = String(project.client_id || project.client?.id || project.client_name || '')
    return projectClientKey === clientFilter
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Header />
        
        <div className="p-8">
          {/* Page Title */}
          <h1 className="text-4xl font-bold text-orange-600 mb-8">Projects</h1>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
            >
              <option value="created_at">Date</option>
              <option value="title">Name</option>
              <option value="status">Status</option>
            </select>

            <span className="text-gray-600">Client:</span>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Clients</option>
              {clientOptions.map((client) => (
                <option key={client.key} value={client.key}>
                  {client.label}
                </option>
              ))}
            </select>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              <p className="text-gray-500 mt-4">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No projects found</p>
              <p className="text-gray-400 text-sm">
                {clientFilter === 'all'
                  ? (user?.role === 'manager'
                    ? 'Click "Add Project" in the sidebar to create your first project'
                    : 'You have not been assigned to any projects yet')
                  : 'No projects found for the selected client'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProjects.map((project) => (
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
      </div>
    </div>
  )
}

export default ProjectsPage
