// src/pages/admin/AdminDashboard.tsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaEdit, FaEye, FaTrash, FaFileAlt } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useTutorials } from '../../contexts/TutorialContext'
import type { Tutorial } from '../../types'

const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const { tutorials, deleteTutorial } = useTutorials()
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null
  )
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const stats = {
    totalTutorials: tutorials.length,
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
      } catch (err) {
        console.error('Erro ao excluir tutorial:', err)
      }
    }
  }

  if (!currentUser) {
    return (
      <div className='w-100 py-5' style={{ minHeight: '100vh' }}>
        <div className='container-fluid px-4'>
          <div className='text-center'>
            <h1>Acesso Negado</h1>
            <p>
              Você precisa estar logado para acessar o painel administrativo.
            </p>
            <Link to='/admin/login' className='btn btn-primary'>
              Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-100 py-4' style={{ minHeight: '100vh' }}>
      <div className='container-fluid px-4'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <div>
            <h1 className='mb-1'>Painel Administrativo</h1>
            <p className='text-muted mb-0'>Hiren's Boot Tutorials</p>
          </div>
          <div className='d-flex gap-2'>
            <Link to='/admin/tutorials/new' className='btn btn-primary'>
              <FaPlus className='me-2' />
              Novo Tutorial
            </Link>
            <button onClick={logout} className='btn btn-outline-secondary'>
              Sair
            </button>
          </div>
        </div>

        <div className='row mb-4'>
          <div className='col-md-4 mb-3'>
            <div className='card bg-primary text-white'>
              <div className='card-body'>
                <div className='d-flex justify-content-between'>
                  <div>
                    <h4 className='mb-1'>{stats.totalTutorials}</h4>
                    <small>Total de Tutoriais</small>
                  </div>
                  <div className='align-self-center'>
                    <FaFileAlt size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 mb-3'>
            <div className='card bg-info text-white'>
              <div className='card-body'>
                <div className='d-flex justify-content-between'>
                  <div>
                    <h4 className='mb-1'>
                      {stats.totalViews.toLocaleString()}
                    </h4>
                    <small>Total de Visualizações</small>
                  </div>
                  <div className='align-self-center'>
                    <FaEye size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 mb-3'>
            <div className='card bg-success text-white'>
              <div className='card-body'>
                <div className='d-flex justify-content-between'>
                  <div>
                    <h4 className='mb-1'>{stats.recentTutorials}</h4>
                    <small>Novos (7 dias)</small>
                  </div>
                  <div className='align-self-center'>
                    <FaPlus size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='card-header d-flex justify-content-between align-items-center'>
            <h5 className='mb-0'>Tutoriais Recentes</h5>
            <Link
              to='/admin/tutorials'
              className='btn btn-sm btn-outline-primary'
            >
              Ver Todos
            </Link>
          </div>
          <div className='card-body'>
            <div className='table-responsive'>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Software</th>
                    <th>Dificuldade</th>
                    <th>Visualizações</th>
                    <th>Criado em</th>
                    <th>Ações</th>
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
                        <span className='badge bg-secondary'>
                          {tutorial.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            tutorial.difficulty === 'Iniciante'
                              ? 'success'
                              : tutorial.difficulty === 'Intermediário'
                              ? 'warning'
                              : 'danger'
                          }`}
                        >
                          {tutorial.difficulty === 'Iniciante'
                            ? 'Iniciante'
                            : tutorial.difficulty === 'Intermediário'
                            ? 'Intermediário'
                            : 'Avançado'}
                        </span>
                      </td>
                      <td>{tutorial.views.toLocaleString()}</td>
                      <td>
                        {new Date(tutorial.createdAt).toLocaleDateString(
                          'pt-BR'
                        )}
                      </td>
                      <td>
                        <div className='btn-group btn-group-sm'>
                          <Link
                            to={`/tutorial/${tutorial.id}`}
                            className='btn btn-outline-primary'
                            title='Visualizar'
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/admin/tutorials/${tutorial.id}/edit`}
                            className='btn btn-outline-warning'
                            title='Editar'
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteTutorial(tutorial)}
                            className='btn btn-outline-danger'
                            title='Excluir'
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

        {showDeleteModal && selectedTutorial && (
          <div className='modal fade show d-block'>
            <div className='modal-dialog modal-dialog-centered'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title'>Confirmar Exclusão</h5>
                  <button
                    type='button'
                    className='btn-close'
                    onClick={() => setShowDeleteModal(false)}
                    aria-label='Fechar'
                  />
                </div>
                <div className='modal-body'>
                  <p>
                    Tem certeza que deseja excluir o tutorial "
                    <strong>{selectedTutorial.title}</strong>"? Esta ação não
                    pode ser desfeita.
                  </p>
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type='button'
                    className='btn btn-danger'
                    onClick={confirmDelete}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
