import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services'
import { userService } from '../services'
import toast from 'react-hot-toast'
import { FaEnvelope, FaTimes, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa'

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)

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
      // Check if email is unverified
      if (error.response?.status === 403 && error.response?.data?.unverified) {
        setUnverifiedEmail(error.response?.data?.email || formData.email)
        setShowVerificationModal(true)
      } else {
        toast.error(error.response?.data?.message || 'Login failed!')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    try {
      setResendLoading(true)
      await userService.resendVerificationEmail(unverifiedEmail)
      toast.success('Verification email sent! Check your inbox.')
      setShowVerificationModal(false)
      setFormData({ email: '', password: '' })
    } catch (error) {
      console.error('Error resending verification:', error)
      toast.error(error.response?.data?.message || 'Failed to resend verification email')
    } finally {
      setResendLoading(false)
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

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-stone-100 rounded-full text-gray-700 text-center placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-black/20 text-lg"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-2"
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-right pt-2">
              <Link
                to="/forgot-password"
                className="text-white text-sm hover:underline transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

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

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl overflow-hidden">
            <div className="bg-red-500 text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Email Not Verified</h2>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="text-white hover:text-gray-100 transition-colors"
                  disabled={resendLoading}
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-center mb-6">
                <FaEnvelope className="h-16 w-16 text-red-500" />
              </div>

              <p className="text-center text-gray-700 mb-4">
                Your email address <strong>{unverifiedEmail}</strong> has not been verified yet.
              </p>

              <p className="text-center text-gray-600 text-sm mb-6">
                Check your inbox for a verification link. If you didn't receive it, we can send it again.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaEnvelope className="mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={resendLoading}
                >
                  Back to Login
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-6">
                The verification link expires in 24 hours.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
