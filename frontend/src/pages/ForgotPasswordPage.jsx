import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { userService } from '../services'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    try {
      setLoading(true)
      await userService.requestPasswordReset(email)
      setSubmitted(true)
      toast.success('Password reset email sent successfully!')
    } catch (error) {
      console.error('Error requesting password reset:', error)
      const errorMessage = error.response?.data?.message || 'Failed to send reset email'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
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

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-2">We've sent a password reset link to:</p>
            <p className="text-lg font-semibold text-gray-800 mb-6">{email}</p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <ul className="text-left text-sm text-blue-800 space-y-2">
                <li>✓ The link will expire in 24 hours</li>
                <li>✓ Check your spam folder if you don't see it</li>
                <li>✓ Click the link to reset your password</li>
              </ul>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Login
            </Link>
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
            <p className="text-gray-500 text-sm mt-2">Reset Your Password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter the email address associated with your account.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Back to Login */}
          <Link
            to="/login"
            className="w-full block text-center py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Login
          </Link>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 KEVIN PMT - Widianto & Sumbogo
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
