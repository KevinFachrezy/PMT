import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { FaLock, FaCheckCircle, FaTimesCircle, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { userService } from '../services'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState('ready') // ready, loading, success, error
  const [message, setMessage] = useState('')

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (!token || !email) {
      setStatus('error')
      setMessage('Invalid reset link. Missing token or email.')
    }
  }, [token, email])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return false
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setStatus('loading')
      
      await userService.resetPassword(
        token,
        email,
        formData.password,
        formData.password_confirmation
      )

      setStatus('success')
      setMessage('Password reset successfully!')
      setSubmitted(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      console.error('Error resetting password:', error)
      setStatus('error')
      setMessage(error.response?.data?.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'success' && submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">KEVIN PMT</h1>
              <p className="text-gray-500 text-sm mt-2">Password Reset</p>
            </div>

            <div className="flex justify-center mb-6">
              <FaCheckCircle className="h-16 w-16 text-green-500" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">Password Reset! ✓</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-6">Redirecting to login in 3 seconds...</p>

            <Link
              to="/login"
              className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Go to Login Now
            </Link>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            © 2026 KEVIN PMT - Widianto & Sumbogo
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error' && !submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">KEVIN PMT</h1>
              <p className="text-gray-500 text-sm mt-2">Password Reset</p>
            </div>

            <div className="flex justify-center mb-6">
              <FaTimesCircle className="h-16 w-16 text-red-500" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">Reset Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="inline-block w-full px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Request New Reset Link
              </Link>

              <Link
                to="/login"
                className="inline-block w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            © 2026 KEVIN PMT - Widianto & Sumbogo
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">KEVIN PMT</h1>
            <p className="text-gray-500 text-sm mt-2">Create New Password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">At least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="password_confirmation"
                  type={showConfirm ? 'text' : 'password'}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Password Match Indicator */}
            {formData.password && formData.password_confirmation && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className={`text-sm font-medium ${
                  formData.password === formData.password_confirmation
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {formData.password === formData.password_confirmation
                    ? '✓ Passwords match'
                    : '✗ Passwords do not match'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || status === 'loading'}
              className="w-full py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading || status === 'loading' ? (
                <>
                  <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6">
            <Link
              to="/login"
              className="text-center block text-sm text-orange-500 hover:text-orange-600 font-semibold"
            >
              Remember your password? Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 KEVIN PMT - Widianto & Sumbogo
        </p>
      </div>
    </div>
  )
}

export default ResetPasswordPage
