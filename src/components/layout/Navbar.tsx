//src\components\layout\Navbar.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa'
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
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <div className='container'>
        <Link className='navbar-brand fw-bold' to='/'>
          <span className='me-2'>🔧</span>
          Bootpedia
          <p className='text-muted mb-0 small'>
            Sistema de recuperação e ferramentas Hiren's Boot
          </p>
        </Link>

        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Alternar navegação'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav me-auto'>
            <li className='nav-item'>
              <Link className='nav-link' to='/'>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/about'>
                Sobre
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/useful-links'>
                Links úteis
              </Link>
            </li>
          </ul>

          <div className='d-flex align-items-center'>
            {/* Search Bar */}
            <div className='me-3'>
              <form onSubmit={handleSearch} className='d-flex'>
                <div className='input-group'>
                  <input
                    type='text'
                    className='form-control search-input'
                    placeholder='Pesquisar tutoriais...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    aria-label='Pesquisar tutoriais'
                  />
                  <button
                    className='btn btn-outline-light'
                    type='submit'
                    disabled={!searchQuery.trim()}
                    aria-label='Procurar'
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>
            </div>

            {/* User Menu */}
            {currentUser ? (
              <div className='dropdown'>
                <button
                  className='btn btn-outline-light dropdown-toggle'
                  type='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                  title='User menu'
                >
                  <FaUser className='me-1' />
                  {currentUser.displayName || currentUser.email}
                </button>
                <ul className='dropdown-menu'>
                  {isAdmin && (
                    <li>
                      <Link className='dropdown-item' to='/admin/dashboard'>
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      type='button'
                      className='dropdown-item'
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className='me-2' />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to='/admin/login' className='btn btn-outline-light'>
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
