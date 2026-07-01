import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import CreateProjectModal from './CreateProjectModal'
import { 
  FaHome, 
  FaFileAlt, 
  FaFolder, 
  FaCalendar,
  FaBell,
  FaSignOutAlt,
  FaPlus,
  FaUsers,
  FaChartBar,
  FaHistory,
  FaCogs,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const [showCreateProject, setShowCreateProject] = useState(false)
  const canAddProject = user?.role !== 'project_handler'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleProjectCreated = (newProject) => {
    navigate(`/projects/${newProject.id}`)
  }

  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: FaHome },
    { name: 'Projects', path: '/projects', icon: FaFileAlt },
    { name: 'Document Center', path: '/documents', icon: FaFolder },
    { name: 'Calender', path: '/calendar', icon: FaCalendar },
  ]

  // Add manager-only menu items
  if (user?.role === 'manager') {
    menuItems.push({ name: 'Analytics', path: '/analytics', icon: FaChartBar })
  }

  // Submenu items under Administrasi
  const adminSubItems = [
    { name: 'Notifications', path: '/notifications', icon: FaBell }
  ]

  if (user?.role === 'manager') {
    adminSubItems.unshift({ name: 'Users', path: '/users', icon: FaUsers })
    adminSubItems.push({ name: 'Activity Log', path: '/activities', icon: FaHistory })
  }

  const isSubmenuActive = adminSubItems.some(item => location.pathname === item.path)
  const [isAdminOpen, setIsAdminOpen] = useState(isSubmenuActive)

  const isActive = (path) => location.pathname === path

  return (
    <div className="w-64 h-screen bg-gray-800 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="bg-orange-600 p-6 text-center">
        <h1 className="text-white text-4xl font-bold">PMT</h1>
      </div>

      {/* Add Project Button */}
      {canAddProject && (
        <div className="p-4">
          <button 
            onClick={() => setShowCreateProject(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <FaPlus className="w-5 h-5" />
            <span>Add Project</span>
          </button>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="p-2 rounded-lg bg-orange-600">
                <Icon className="text-white text-lg" />
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}

        {/* Collapsible Administrasi Menu */}
        <div className="mb-2">
          <button
            onClick={() => setIsAdminOpen(prev => !prev)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              isSubmenuActive
                ? 'bg-gray-900 text-white font-semibold'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-orange-600">
                <FaCogs className="text-white text-lg" />
              </div>
              <span className="font-medium">Administrasi</span>
            </div>
            {isAdminOpen ? <FaChevronUp className="text-white text-sm" /> : <FaChevronDown className="text-white text-sm" />}
          </button>

          {isAdminOpen && (
            <div className="mt-2 pl-4 space-y-1">
              {adminSubItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-gray-700 text-white font-medium'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="text-white text-md" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Sign Out */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <div className="p-2 rounded-lg bg-orange-600">
            <FaSignOutAlt className="text-white text-lg" />
          </div>
          <span className="font-medium">Sign out</span>
        </button>
      </div>

      {/* Create Project Modal */}
      {canAddProject && (
        <CreateProjectModal
          isOpen={showCreateProject}
          onClose={() => setShowCreateProject(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  )
}

export default Sidebar
