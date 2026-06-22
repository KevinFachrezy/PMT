import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaEnvelope } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { userService } from '../services'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  const token = searchParams.get('token')
  const emailParam = searchParams.get('email')

  useEffect(() => {
    if (!token || !emailParam) {
      setStatus('error')
      setMessage('Invalid verification link. Missing token or email.')
      return
    }

    verifyEmailToken()
  }, [token, emailParam])

  const verifyEmailToken = async () => {
    try {
      setEmail(emailParam)
      const response = await userService.verifyEmail(token, emailParam)
      
      setStatus('success')
      setMessage(response.message || 'Email verified successfully!')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      console.error('Error verifying email:', error)
      setStatus('error')
      setMessage(error.response?.data?.message || 'Failed to verify email. The link may have expired.')
    }
  }

  const handleResendEmail = async () => {
    if (!email) return

    try {
      toast.loading('Sending verification email...')
      await userService.resendVerificationEmail(email)
      toast.dismiss()
      toast.success('Verification email resent! Check your inbox.')
    } catch (error) {
      console.error('Error resending email:', error)
      toast.error(error.response?.data?.message || 'Failed to resend verification email')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Logo/Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">KEVIN PMT</h1>
            <p className="text-gray-500 text-sm mt-2">Email Verification</p>
          </div>

          {/* Status Icon and Message */}
          {status === 'loading' && (
            <div>
              <div className="flex justify-center mb-6">
                <FaSpinner className="h-16 w-16 text-orange-500 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying your email...</h2>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="flex justify-center mb-6">
                <FaCheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Email Verified! ✓</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login in 3 seconds...</p>
              <Link
                to="/login"
                className="inline-block mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="flex justify-center mb-6">
                <FaTimesCircle className="h-16 w-16 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>

              {email && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 mb-4">
                    <FaEnvelope className="inline mr-2" />
                    Email: {email}
                  </p>
                  <button
                    onClick={handleResendEmail}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    Resend verification email
                  </button>
                </div>
              )}

              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 KEVIN PMT - Widianto & Sumbogo
        </p>
      </div>
    </div>
  )
}

export default VerifyEmailPage
