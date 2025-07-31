//src\components\layout\Navbar.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useTutorials } from '../../contexts/TutorialContext'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { currentUser, logout, isAdmin } = useAuth()
  const { favorites } = useTutorials()
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
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <div className='container'>
        <Link className='navbar-brand fw-bold' to='/'>
          <span className='me-2'>🔧</span>
          Bootpedia
        </Link>

        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
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
                About
              </Link>
            </li> 
            <li className='nav-item'>
              <Link className='nav-link' to='/useful-links'>
                Useful Links
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
                    placeholder='Search tutorials...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    aria-label='Search tutorials'
                  />
                  <button
                    className='btn btn-outline-light'
                    type='submit'
                    disabled={!searchQuery.trim()}
                    aria-label='Search'
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>
            </div>

            {/* Favorites */}
            <Link
              to='/favorites'
              className='btn btn-outline-light me-2 position-relative'
              title='Favorites'
            >
              <FaHeart />
              {favorites.length > 0 && (
                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                  {favorites.length}
                </span>
              )}
            </Link>

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
                    <button className='dropdown-item' onClick={handleLogout}>
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
