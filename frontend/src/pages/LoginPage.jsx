import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authService.login(formData)
      const data = response.data || response
      login(data.user, data.token)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="bg-orange-600 rounded-2xl shadow-2xl p-10">
          <h1 className="text-4xl font-extrabold text-white text-center mb-10 tracking-wide uppercase">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 bg-stone-100 rounded-full text-gray-700 text-center placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-black/20 text-lg"
              placeholder="Username"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 bg-stone-100 rounded-full text-gray-700 text-center placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-black/20 text-lg"
              placeholder="Password"
            />

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gray-900 text-white px-16 py-4 rounded-full font-semibold text-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Login now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
