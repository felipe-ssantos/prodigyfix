// src/pages/admin/AdminDashboard.tsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaPlus,
  FaEdit,
  FaEye,
  FaTrash,
  FaFileAlt,
  FaCog,
  FaDatabase,
  FaLink
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useTutorials } from '../../hooks/useTutorials'
import {
  createCategoriesInFirestore,
  checkCategoriesStatus
} from '../../utils/createCategories'
import type { Tutorial } from '../../types'
import { deleteDoc, doc } from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { db, storage } from '../../services/firebase'

const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const { tutorials, categories, deleteTutorial, refreshCategories } =
    useTutorials()
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null
  )
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [initializingCategories, setInitializingCategories] = useState(false)
  const [showInitMessage, setShowInitMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Filtra e ordena os tutoriais
  const filteredTutorials = tutorials
    .filter((tutorial: Tutorial) => {
      const matchesSearch = searchQuery
        ? tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      const matchesCategory = selectedCategory
        ? tutorial.category === selectedCategory
        : true
      const matchesDifficulty = selectedDifficulty
        ? tutorial.difficulty === selectedDifficulty
        : true
      return matchesSearch && matchesCategory && matchesDifficulty
    })
    .sort((a: Tutorial, b: Tutorial) => {
      switch (sortBy) {
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        case 'views':
          return b.views - a.views
        case 'title':
          return a.title.localeCompare(b.title)
        default: // 'newest'
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      }
    })

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
    }).length,
    totalCategories: categories.length,
    filteredCount: filteredTutorials.length
  }

  const handleDeleteTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedTutorial) return

    try {
      if (selectedTutorial.imageUrl) {
        try {
          const imageRef = storageRef(
            storage,
            `tutorials/${selectedTutorial.id}`
          )
          await deleteObject(imageRef)
        } catch (err) {
          console.warn('Erro ao remover imagem:', err)
        }
      }

      await deleteDoc(doc(db, 'tutorials', selectedTutorial.id))
      await deleteTutorial(selectedTutorial.id)
      setShowDeleteModal(false)
      setSelectedTutorial(null)
    } catch (err) {
      console.error('Erro ao excluir:', err)
      alert('Erro ao excluir tutorial')
    }
  }

  const handleInitializeCategories = async () => {
    try {
      setInitializingCategories(true)
      setShowInitMessage('')

      console.log('🔄 Iniciando criação de categorias...')
      await createCategoriesInFirestore()

      // Aguarda um pouco e atualiza as categorias
      setTimeout(async () => {
        await refreshCategories()
        setShowInitMessage('✅ Categorias inicializadas com sucesso!')
        console.log('✅ Categorias criadas e contexto atualizado!')
      }, 1000)
    } catch (error) {
      console.error('❌ Erro ao inicializar categorias:', error)
      setShowInitMessage(
        '❌ Erro ao inicializar categorias. Verifique o console.'
      )
    } finally {
      setInitializingCategories(false)
      // Remove a mensagem após 5 segundos
      setTimeout(() => setShowInitMessage(''), 5000)
    }
  }

  const handleCheckCategoriesStatus = async () => {
    try {
      await checkCategoriesStatus()
      console.log('📊 Status das categorias exibido no console')
    } catch (error) {
      console.error('❌ Erro ao verificar status das categorias:', error)
    }
  }

  // Função para buscar nome da categoria
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  // Função para buscar ícone da categoria
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : '📁'
  }

  if (!currentUser) {
    return (
      <div className='w-100 py-5 min-vh-100'>
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
    <div className='w-100 py-4 min-vh-100'>
      <div className='container-fluid px-4'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <div>
            <h1 className='mb-1'>Painel Administrativo</h1>
            <p className='text-muted mb-0'>Prodigy Informática Tutorials</p>
          </div>
          <div className='d-flex gap-2'>
            <Link to='/admin/tutorials/new' className='btn btn-primary h-50'>
              <FaPlus className='me-2 h-100' />
              Novo Tutorial
            </Link>
            <Link
              to='/admin/useful-links'
              className='btn btn-outline-primary mb-3'
            >
              <FaLink className='me-2' />
              Gerenciar Links Úteis
            </Link>
            <button
              type='button'
              onClick={logout}
              className='btn btn-outline-secondary h-50'
            >
              Sair
            </button>
          </div>
        </div>
        {/* Mensagem de inicialização */}
        {showInitMessage && (
          <div
            className={`alert ${
              showInitMessage.includes('✅') ? 'alert-success' : 'alert-danger'
            } alert-dismissible fade show mb-4`}
          >
            {showInitMessage}
            <button
              type='button'
              className='btn-close'
              onClick={() => setShowInitMessage('')}
              aria-label='Close'
            ></button>
          </div>
        )}
        <div className='row mb-4'>
          <div className='col-md-3 mb-3'>
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
          <div className='col-md-3 mb-3'>
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
          <div className='col-md-3 mb-3'>
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
          <div className='col-md-3 mb-3'>
            <div className='card bg-warning text-white'>
              <div className='card-body'>
                <div className='d-flex justify-content-between'>
                  <div>
                    <h4 className='mb-1'>{stats.totalCategories}</h4>
                    <small>Categorias</small>
                  </div>
                  <div className='align-self-center'>
                    <FaDatabase size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Seção de Configuração de Categorias */}
        <div className='card mb-4'>
          <div className='card-header d-flex justify-content-between align-items-center'>
            <h5 className='mb-0 d-flex align-items-center gap-2'>
              <FaCog />
              Configuração do Sistema
            </h5>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-8'>
                <h6 className='fw-bold mb-2'>Inicialização de Categorias</h6>
                <p className='text-muted mb-0'>
                  {categories.length === 0
                    ? 'Nenhuma categoria encontrada. Execute a inicialização para criar as categorias padrão.'
                    : `${categories.length} categoria(s) ativa(s). Você pode reinicializar para adicionar categorias faltantes.`}
                </p>
              </div>
              <div className='col-md-4 text-end'>
                <div className='btn-group'>
                  <button
                    type='button'
                    onClick={handleInitializeCategories}
                    disabled={initializingCategories}
                    className='btn btn-outline-primary'
                    title='Criar categorias padrão no Firestore'
                  >
                    {initializingCategories ? (
                      <>
                        <span className='spinner-border spinner-border-sm me-2'></span>
                        Criando...
                      </>
                    ) : (
                      <>
                        <FaDatabase className='me-2' />
                        Inicializar Categorias
                      </>
                    )}
                  </button>
                  <button
                    type='button'
                    onClick={handleCheckCategoriesStatus}
                    className='btn btn-outline-secondary'
                    title='Verificar status das categorias (console)'
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='card'>
          <div className='card-header'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <h5 className='mb-0'>Tutoriais Recentes</h5>
              <Link
                to='/admin/tutorials'
                className='btn btn-sm btn-outline-primary'
              >
                Ver Todos
              </Link>
            </div>

            {/* Barra de pesquisa e filtros */}
            <div className='row g-3'>
              <div className='col-md-4'>
                <div className='input-group'>
                  <span className='input-group-text'>
                    <i className='fas fa-search'>🔍</i>
                  </span>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Pesquisar tutoriais...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    aria-label='Pesquisar tutoriais'
                  />
                </div>
              </div>
              <div className='col-md-3'>
                <label className='visually-hidden' htmlFor='categoryFilter'>
                  Filtrar por categoria
                </label>
                <select
                  id='categoryFilter'
                  className='form-select'
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  aria-label='Filtrar por categoria'
                >
                  <option value=''>Todas as categorias</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-md-3'>
                <label className='visually-hidden' htmlFor='difficultyFilter'>
                  Filtrar por dificuldade
                </label>
                <select
                  id='difficultyFilter'
                  className='form-select'
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value)}
                  aria-label='Filtrar por dificuldade'
                >
                  <option value=''>Todas as dificuldades</option>
                  <option value='Iniciante'>Iniciante</option>
                  <option value='Intermediário'>Intermediário</option>
                  <option value='Avançado'>Avançado</option>
                </select>
              </div>
              <div className='col-md-2'>
                <label className='visually-hidden' htmlFor='sortFilter'>
                  Ordenar por
                </label>
                <select
                  id='sortFilter'
                  className='form-select'
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  aria-label='Ordenar tutoriais'
                >
                  <option value='newest'>Mais recentes</option>
                  <option value='oldest'>Mais antigos</option>
                  <option value='views'>Mais visualizados</option>
                  <option value='title'>Título (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
          <div className='card-body'>
            {tutorials.length === 0 ? (
              <div className='text-center py-4'>
                <FaFileAlt className='display-4 text-muted mb-3' />
                <h6 className='text-muted'>Nenhum tutorial encontrado</h6>
                <p className='text-muted mb-3'>
                  Comece criando seu primeiro tutorial!
                </p>
                <Link to='/admin/tutorials/new' className='btn btn-primary'>
                  <FaPlus className='me-2' />
                  Criar Primeiro Tutorial
                </Link>
              </div>
            ) : (
              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Categoria</th>
                      <th>Dificuldade</th>
                      <th>Visualizações</th>
                      <th>Criado em</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTutorials
                      .slice(0, 10)
                      .map((tutorial: Tutorial) => (
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
                            <span className='badge bg-secondary d-flex align-items-center gap-1 w-fit-content'>
                              <span>{getCategoryIcon(tutorial.category)}</span>
                              <span>{getCategoryName(tutorial.category)}</span>
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
                              {tutorial.difficulty}
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
                                type='button'
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
            )}
          </div>
        </div>
        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && selectedTutorial && (
          <div className='modal fade show d-block' tabIndex={-1}>
            <div className='modal-dialog modal-dialog-centered'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title'>Confirmar Exclusão</h5>
                  <button
                    type='button'
                    className='btn-close'
                    onClick={() => setShowDeleteModal(false)}
                    aria-label='Confirmar Exclusao'
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
