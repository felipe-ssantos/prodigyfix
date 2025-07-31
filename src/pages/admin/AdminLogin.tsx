import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to login. Please check your credentials.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container py-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6 col-lg-4'>
          <div className='card shadow'>
            <div className='card-body p-5'>
              <div className='text-center mb-4'>
                <div className='mb-3'>
                  <span className='display-4'>🔧</span>
                </div>
                <h2 className='fw-bold'>Admin Login</h2>
                <p className='text-muted'>Access the Bootpedia admin panel</p>
              </div>

              {error && (
                <div className='alert alert-danger' role='alert'>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor='email' className='form-label'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    className='form-control'
                    id='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor='password' className='form-label'>
                    Password
                  </label>
                  <div className='input-group'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className='form-control'
                      id='password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <button
                      type='button'
                      className='btn btn-outline-secondary'
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type='submit'
                  className='btn btn-primary w-100 mb-3'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className='spinner-border spinner-border-sm me-2'
                        role='status'
                        aria-hidden='true'
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <FaLock className='me-2' />
                      Login
                    </>
                  )}
                </button>
              </form>

              <div className='text-center'>
                <Link to='/' className='text-muted text-decoration-none'>
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className='card mt-3'>
            <div className='card-body'>
              <h6 className='card-title'>Demo Credentials</h6>
              <p className='card-text small text-muted'>
                For testing purposes, you can use these demo credentials:
              </p>
              <div className='small'>
                <strong>Email:</strong> admin@bootpedia.com
                <br />
                <strong>Password:</strong> admin123
              </div>
              <small className='text-muted'>
                Note: In a real application, you would need to set up Firebase
                Authentication with these credentials.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
