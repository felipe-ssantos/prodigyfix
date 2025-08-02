//src\components\layout\Navbar.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaTachometerAlt
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'

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

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary shadow-sm'>
      <div className='container'>
        {/* Brand */}
        <Link className='navbar-brand d-flex align-items-center' to='/'>          
          <div>
            <div className='fw-bold fs-4'>🔧 Bootpedia</div>
            <div className='fs-6 small opacity-75 d-none d-lg-block'>
              Sistema de recuperação Hiren's Boot
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
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <Link className='nav-link fw-semibold px-3' to='/'>
                🏠 Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link fw-semibold px-2' to='/about'>
                ℹ️ Sobre
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link fw-semibold px-3' to='/useful-links'>
                🔗 Links Úteis
              </Link>
            </li>
          </ul>

          <div className='d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-3 mt-3 mt-lg-0'>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className='d-flex'>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control border-0 bg-white bg-opacity-10 text-white placeholder-white-50'
                  placeholder='Buscar tutoriais...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label='Pesquisar tutoriais'
                  style={{ minWidth: '100px' }}
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

            {/* User Menu */}
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
                        <Link className='dropdown-item' to='/admin/dashboard'>
                          <FaTachometerAlt className='me-2' />
                          Painel Admin
                        </Link>
                      </li>
                      <li>
                        <Link className='dropdown-item' to='/admin/settings'>
                          <FaCog className='me-2' />
                          Configurações
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
                <span className='d-none d-md-inline'>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
