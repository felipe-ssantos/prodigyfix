// src/pages/admin/AdminLogin.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'

// Verifica se está em ambiente de desenvolvimento
const isDevelopment = import.meta.env.DEV
const isVSCode = import.meta.env.MODE === 'vscode'

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  // Redireciona se não estiver em desenvolvimento/VSCode
  useEffect(() => {
    if (!isDevelopment && !isVSCode) {
      navigate('/')
    }
  }, [navigate])

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
          : 'Falha ao efetuar login. Verifique suas credenciais.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Se não for desenvolvimento, não renderiza nada
  if (!isDevelopment && !isVSCode) {
    return null
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
                <p className='text-muted'>
                  Acesse o painel de administração da Bootpedia
                </p>
              </div>

              {error && (
                <div className='alert alert-danger' role='alert'>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor='email' className='form-label'>
                    E-mail
                  </label>
                  <input
                    type='email'
                    className='form-control'
                    id='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder='Digite seu e-mail'
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor='password' className='form-label'>
                    Senha
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
                      placeholder='Digite sua senha'
                    />
                    <button
                      type='button'
                      className='btn btn-outline-secondary'
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      title={showPassword ? 'Esconder senha' : 'Mostrar senha'}
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
                      Fazendo login...
                    </>
                  ) : (
                    <>
                      <FaLock className='me-2' />
                      Entrar
                    </>
                  )}
                </button>
              </form>

              <div className='text-center'>
                <Link to='/' className='text-muted text-decoration-none'>
                  ← Voltar para Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
