import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUsers, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSearch, FaUserCircle, FaCheckCircle, FaTimesCircle, FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import CreateUserModal from '../components/CreateUserModal'
import EditUserModal from '../components/EditUserModal'
import { userService } from '../services'
import { useAuthStore } from '../stores/authStore'

const UsersPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const { user: currentUser } = useAuthStore()

  useEffect(() => {
    fetchUsers()
    fetchStatistics()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userService.getAll()
      const data = response.data || response
      setUsers(Array.isArray(data) ? data : [])
      setAccessDenied(false)
    } catch (error) {
      console.error('Error fetching users:', error)

      if (error.response?.status === 403) {
        setAccessDenied(true)
        setUsers([])
        setFilteredUsers([])
        return
      }

      toast.error('Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await userService.getStatistics()
      const data = response.data || response
      setStatistics(data)
    } catch (error) {
      console.error('Error fetching statistics:', error)

      if (error.response?.status === 403) {
        setAccessDenied(true)
      }
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== '') {
      const isActive = statusFilter === 'active'
      filtered = filtered.filter(user => user.is_active === isActive)
    }

    setFilteredUsers(filtered)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleToggleActive = async (userId) => {
    const user = users.find(u => u.id === userId)
    const action = user.is_active ? 'deactivate' : 'activate'

    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return
    }

    try {
      await userService.toggleActive(userId)
      toast.success(`User ${action}d successfully`)
      fetchUsers()
      fetchStatistics()
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error(error.response?.data?.message || `Failed to ${action} user`)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      await userService.delete(userId)
      toast.success('User deleted successfully')
      fetchUsers()
      fetchStatistics()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleEditSuccess = () => {
    setShowEditModal(false)
    setSelectedUser(null)
    fetchUsers()
    fetchStatistics()
  }

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    fetchUsers()
    fetchStatistics()
  }

  const getRoleBadge = (role) => {
    if (role === 'manager') {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">Manager</span>
    }
    return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Handler</span>
  }

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="flex items-center space-x-1 text-green-600">
          <FaCheckCircle />
          <span className="text-sm font-medium">Active</span>
        </span>
      )
    }
    return (
      <span className="flex items-center space-x-1 text-red-600">
        <FaTimesCircle />
        <span className="text-sm font-medium">Inactive</span>
      </span>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Header />
        
        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-orange-600 mb-2 flex items-center">
                  <FaUsers className="mr-3" />
                  User Management
                </h1>
                <p className="text-gray-600">Manage team members and their roles</p>
              </div>

              {currentUser?.role === 'manager' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center space-x-2 rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-orange-700"
                >
                  <FaPlus />
                  <span>Add User</span>
                </button>
              )}
            </div>
          </div>

          {accessDenied ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
              <FaUsers className="mx-auto mb-4 text-5xl text-amber-600" />
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Akses Ditolak</h2>
              <p className="text-amber-700 mb-6">
                Anda tidak memiliki izin untuk membuka halaman User Management.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-lg bg-orange-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-orange-700"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>

          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-gray-500 text-sm mb-1">Total Users</div>
                <div className="text-3xl font-bold text-gray-800">{statistics.total}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-gray-500 text-sm mb-1">Active</div>
                <div className="text-3xl font-bold text-green-600">{statistics.active}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-gray-500 text-sm mb-1">Inactive</div>
                <div className="text-3xl font-bold text-red-600">{statistics.inactive}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-gray-500 text-sm mb-1">Managers</div>
                <div className="text-3xl font-bold text-purple-600">{statistics.managers}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-gray-500 text-sm mb-1">Handlers</div>
                <div className="text-3xl font-bold text-blue-600">{statistics.handlers}</div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="manager">Manager</option>
                <option value="project_handler">Handler</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <FaUserCircle className="mx-auto text-gray-300 text-6xl mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tasks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projects
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className={`hover:bg-gray-50 ${!user.is_active ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <FaUserCircle className="text-orange-600 text-2xl" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                                {user.id === currentUser?.id && (
                                  <span className="ml-2 text-xs text-orange-600 font-semibold">(You)</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.is_active)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.assigned_tasks_count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.managed_projects_count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${user.completion_rate || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{user.completion_rate || 0}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            {user.id !== currentUser?.id && (
                              <>
                                <button
                                  onClick={() => handleToggleActive(user.id)}
                                  className={`p-2 rounded ${
                                    user.is_active
                                      ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50'
                                      : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                  }`}
                                  title={user.is_active ? 'Deactivate' : 'Activate'}
                                >
                                  {user.is_active ? <FaToggleOn /> : <FaToggleOff />}
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {currentUser?.role === 'manager' && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}

export default UsersPage
