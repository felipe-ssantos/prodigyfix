//src\pages\admin\AdminDashboard.tsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaChartBar,
  FaUsers,
  FaFileAlt
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useTutorials } from '../../contexts/TutorialContext'
import type { Tutorial } from '../../types'

const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const { tutorials, categories, deleteTutorial } = useTutorials()
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null
  )
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Mock statistics
  const stats = {
    totalTutorials: tutorials.length,
    totalCategories: categories.length,
    totalViews: tutorials.reduce(
      (sum: number, t: Tutorial) => sum + t.views,
      0
    ),
    recentTutorials: tutorials.filter((t: Tutorial) => {
      const daysAgo =
        (Date.now() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo <= 7
    }).length
  }

  const handleDeleteTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (selectedTutorial) {
      try {
        await deleteTutorial(selectedTutorial.id)
        setShowDeleteModal(false)
        setSelectedTutorial(null)
        // Opcional: mostrar mensagem de sucesso
      } catch (err) {
        console.error('Error deleting tutorial:', err)
        // Opcional: mostrar mensagem de erro
      }
    }
  }

  if (!currentUser) {
    return (
      <div className='container py-5'>
        <div className='text-center'>
          <h1>Access Denied</h1>
          <p>You need to be logged in to access the admin dashboard.</p>
          <Link to='/admin/login' className='btn btn-primary'>
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-4'>
      {/* Header */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h1 className='mb-1'>Admin Dashboard</h1>
          <p className='text-muted mb-0'>
            Welcome back, {currentUser.displayName || currentUser.email}
          </p>
        </div>
        <div className='d-flex gap-2'>
          <Link to='/admin/tutorials/new' className='btn btn-primary'>
            <FaPlus className='me-2' />
            New Tutorial
          </Link>
          <button
            onClick={logout}
            className='btn btn-outline-secondary'
            title='Logout'
          >
            Logout
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='row mb-4'>
        <div className='col-md-3 mb-3'>
          <div className='card bg-primary text-white'>
            <div className='card-body'>
              <div className='d-flex justify-content-between'>
                <div>
                  <h4 className='mb-1'>{stats.totalTutorials}</h4>
                  <small>Total Tutorials</small>
                </div>
                <div className='align-self-center'>
                  <FaFileAlt size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-3 mb-3'>
          <div className='card bg-success text-white'>
            <div className='card-body'>
              <div className='d-flex justify-content-between'>
                <div>
                  <h4 className='mb-1'>{stats.totalCategories}</h4>
                  <small>Categories</small>
                </div>
                <div className='align-self-center'>
                  <FaChartBar size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-3 mb-3'>
          <div className='card bg-info text-white'>
            <div className='card-body'>
              <div className='d-flex justify-content-between'>
                <div>
                  <h4 className='mb-1'>{stats.totalViews.toLocaleString()}</h4>
                  <small>Total Views</small>
                </div>
                <div className='align-self-center'>
                  <FaEye size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-3 mb-3'>
          <div className='card bg-warning text-white'>
            <div className='card-body'>
              <div className='d-flex justify-content-between'>
                <div>
                  <h4 className='mb-1'>{stats.recentTutorials}</h4>
                  <small>Recent (7 days)</small>
                </div>
                <div className='align-self-center'>
                  <FaUsers size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='row mb-4'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-header'>
              <h5 className='mb-0'>Quick Actions</h5>
            </div>
            <div className='card-body'>
              <div className='row g-3'>
                <div className='col-md-3'>
                  <Link
                    to='/admin/tutorials/new'
                    className='btn btn-outline-primary w-100'
                  >
                    <FaPlus className='me-2' />
                    Create Tutorial
                  </Link>
                </div>
                <div className='col-md-3'>
                  <Link
                    to='/admin/categories'
                    className='btn btn-outline-success w-100'
                  >
                    <FaChartBar className='me-2' />
                    Manage Categories
                  </Link>
                </div>
                <div className='col-md-3'>
                  <Link to='/admin/ads' className='btn btn-outline-info w-100'>
                    <FaEye className='me-2' />
                    Manage Ads
                  </Link>
                </div>
                <div className='col-md-3'>
                  <Link
                    to='/admin/analytics'
                    className='btn btn-outline-warning w-100'
                  >
                    <FaChartBar className='me-2' />
                    View Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tutorials */}
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-header d-flex justify-content-between align-items-center'>
              <h5 className='mb-0'>Recent Tutorials</h5>
              <Link
                to='/admin/tutorials'
                className='btn btn-sm btn-outline-primary'
              >
                View All
              </Link>
            </div>
            <div className='card-body'>
              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Difficulty</th>
                      <th>Views</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tutorials.slice(0, 10).map((tutorial: Tutorial) => (
                      <tr key={tutorial.id}>
                        <td>
                          <Link
                            to={`/tutorial/${tutorial.id}`}
                            className='text-decoration-none'
                          >
                            {tutorial.title}
                          </Link>
                        </td>
                        <td>
                          <span className='badge bg-primary'>
                            {tutorial.category.replace('-', ' ')}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              tutorial.difficulty === 'beginner'
                                ? 'success'
                                : tutorial.difficulty === 'intermediate'
                                ? 'warning'
                                : 'danger'
                            }`}
                          >
                            {tutorial.difficulty}
                          </span>
                        </td>
                        <td>{tutorial.views.toLocaleString()}</td>
                        <td>
                          {new Date(tutorial.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className='btn-group btn-group-sm'>
                            <Link
                              to={`/tutorial/${tutorial.id}`}
                              className='btn btn-outline-primary'
                              title='View'
                            >
                              <FaEye />
                            </Link>
                            <Link
                              to={`/admin/tutorials/${tutorial.id}/edit`}
                              className='btn btn-outline-warning'
                              title='Edit'
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDeleteTutorial(tutorial)}
                              className='btn btn-outline-danger'
                              title='Delete'
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTutorial && (
        <div
          className='modal fade show d-block modal-delete'
          tabIndex={-1}          
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Confirm Delete</h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={() => setShowDeleteModal(false)}
                  aria-label='Close'
                />
              </div>
              <div className='modal-body'>
                <p>
                  Are you sure you want to delete the tutorial "
                  <strong>{selectedTutorial.title}</strong>"? This action cannot
                  be undone.
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='btn btn-danger'
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
