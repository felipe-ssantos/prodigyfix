// src/components/layout/Navbar.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import logo from '../../assets/logo_fundo_branco.png'

// Verifica se está em ambiente de desenvolvimento
const isDevelopment = import.meta.env.DEV
const isVSCode = import.meta.env.MODE === 'vscode'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { currentUser, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Falha ao sair:', error)
    }
  }

  // Define se deve mostrar o menu do usuário
  const shouldShowUserMenu = isDevelopment || isVSCode

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark shadow-sm'>
      <div className='container'>
        {/* Brand */}
        <Link className='navbar-brand d-flex align-items-center' to='/'>
          <img
            src={logo}
            alt='Prodigy Informática Logo'
            height='70'
            width={70}
            className='me-2'
          />
          <div>
            <div className='fw-bold fs-5'>Prodigy Informática</div>
            <div className='fs-6 small opacity-75 d-none d-lg-block'>
              Assistência confiável, soluções adequadas
            </div>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className='navbar-toggler border-0'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Alternar menu de navegação'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarNav'>
          {/* Navigation Links */}
          <ul className='navbar-nav mb-2 mb-lg-0 mr-5 ml-5 mx-auto'>
            <li className='nav-item'>
              <Link
                className='nav-link fw-bold text-white px-3 fs-6 position-relative'
                to='/'
              >
                🏠 Home
                <span className='position-absolute bottom-0 start-0 w-100 rounded hr-3px'></span>
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className='nav-link fw-bold text-white px-3 fs-6 position-relative'
                to='/about'
              >
                ℹ️ Sobre
                <span className='position-absolute bottom-0 start-0 w-100 rounded hr-3px'></span>
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className='nav-link fw-bold text-white px-3 fs-6 position-relative'
                to='/useful-links'
              >
                🔗 Links Úteis
                <span className='position-absolute bottom-0 start-0 w-100 rounded hr-3px'></span>
              </Link>
            </li>
          </ul>

          <div
            className={`d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center mt-3 mt-lg-0 ml-48 ${
              shouldShowUserMenu ? 'gap-3' : ''
            }`}
          >
            {/* Search Bar */}
            <form onSubmit={handleSearch} className='d-flex'>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control border-0 bg-white bg-opacity-10 text-white placeholder-white-50 min-w-200'
                  placeholder='Buscar tutoriais...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label='Pesquisar tutoriais'
                />
                <button
                  className='btn btn-light'
                  type='submit'
                  disabled={!searchQuery.trim()}
                  aria-label='Buscar'
                  title='Buscar tutoriais'
                >
                  <FaSearch />
                </button>
              </div>
            </form>

            {/* User Menu - Só mostra em desenvolvimento/VSCode */}
            {shouldShowUserMenu && (
              <div className='ms-lg-3'>
                {currentUser ? (
                  <div className='dropdown'>
                    <button
                      className='btn btn-outline-light dropdown-toggle d-flex align-items-center'
                      type='button'
                      data-bs-toggle='dropdown'
                      aria-expanded='false'
                      title='Menu do usuário'
                      aria-label='Abrir menu do usuário'
                    >
                      <FaUser className='me-2' />
                      <span className='d-none d-md-inline'>
                        {currentUser.displayName ||
                          currentUser.email?.split('@')[0] ||
                          'Usuário'}
                      </span>
                    </button>
                    <ul className='dropdown-menu dropdown-menu-end'>
                      <li>
                        <h6 className='dropdown-header'>
                          <FaUser className='me-2' />
                          {currentUser.displayName || currentUser.email}
                        </h6>
                      </li>
                      <li>
                        <hr className='dropdown-divider' />
                      </li>
                      {isAdmin && (
                        <>
                          <li>
                            <Link
                              className='dropdown-item'
                              to='/admin/dashboard'
                            >
                              <FaTachometerAlt className='me-2' />
                              Painel Admin
                            </Link>
                          </li>
                          <li>
                            <hr className='dropdown-divider' />
                          </li>
                        </>
                      )}
                      <li>
                        <button
                          type='button'
                          className='dropdown-item text-danger'
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className='me-2' />
                          Sair
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link
                    to='/admin/login'
                    className='btn btn-outline-light'
                    title='Fazer login como administrador'
                  >
                    <FaUser className='me-2' />
                    <span className='d-none d-md-inline'>Login</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
