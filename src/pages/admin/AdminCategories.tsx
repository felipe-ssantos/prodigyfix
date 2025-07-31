// src/pages/admin/AdminCategories.tsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

const AdminCategories: React.FC = () => {
  const { currentUser } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Category>>({})
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    slug: '',
    description: ''
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'))
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[]
        setCategories(categoriesData)
      } catch (err) {
        setError('Erro ao carregar categorias')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.slug) {
      setError('Nome e slug são obrigatórios')
      return
    }

    try {
      setLoading(true)
      const docRef = await addDoc(collection(db, 'categories'), newCategory)
      setCategories(prev => [...prev, { ...newCategory, id: docRef.id }])
      setNewCategory({ name: '', slug: '', description: '' })
      setError('')
    } catch (err) {
      setError('Erro ao adicionar categoria')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCategory = async (id: string) => {
    try {
      setLoading(true)
      await updateDoc(doc(db, 'categories', id), editData)
      setCategories(prev =>
        prev.map(cat => (cat.id === id ? { ...cat, ...editData } : cat))
      )
      setEditingId(null)
      setEditData({})
    } catch (err) {
      setError('Erro ao atualizar categoria')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?'))
      return

    try {
      setLoading(true)
      await deleteDoc(doc(db, 'categories', id))
      setCategories(prev => prev.filter(cat => cat.id !== id))
    } catch (err) {
      setError('Erro ao excluir categoria')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (category: Category) => {
    setEditingId(category.id)
    setEditData({
      name: category.name,
      slug: category.slug,
      description: category.description
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditData({})
  }

  if (!currentUser) {
    return (
      <div className='container py-5'>
        <div className='alert alert-danger'>
          Você precisa estar logado para acessar esta página.
        </div>
      </div>
    )
  }

  return (
    <div className='container py-4'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1>Gerenciar Categorias</h1>
        <Link to='/admin/dashboard' className='btn btn-outline-secondary'>
          Voltar ao Dashboard
        </Link>
      </div>

      {error && <div className='alert alert-danger'>{error}</div>}

      {/* Formulário para adicionar nova categoria */}
      <div className='card mb-4'>
        <div className='card-header bg-primary text-white'>
          <h2 className='h5 mb-0'>Adicionar Nova Categoria</h2>
        </div>
        <div className='card-body'>
          <div className='row g-3'>
            <div className='col-md-4'>
              <label htmlFor='newName' className='form-label'>
                Nome
              </label>
              <input
                type='text'
                className='form-control'
                id='newName'
                value={newCategory.name}
                onChange={e =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder='Digite o nome da categoria'
                aria-label='Nome da categoria'
              />
            </div>
            <div className='col-md-4'>
              <label htmlFor='newSlug' className='form-label'>
                Slug
              </label>
              <input
                type='text'
                className='form-control'
                id='newSlug'
                value={newCategory.slug}
                onChange={e =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
                placeholder='Digite o slug da categoria'
                aria-label='Slug da categoria'
              />
            </div>
            <div className='col-md-4 d-flex align-items-end'>
              <button
                className='btn btn-primary w-100'
                onClick={handleAddCategory}
                disabled={loading}
                aria-label='Adicionar categoria'
              >
                <FaPlus className='me-2' aria-hidden='true' />
                Adicionar
              </button>
            </div>
            <div className='col-12'>
              <label htmlFor='newDescription' className='form-label'>
                Descrição
              </label>
              <textarea
                className='form-control'
                id='newDescription'
                rows={2}
                value={newCategory.description}
                onChange={e =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value
                  })
                }
                placeholder='Digite a descrição da categoria (opcional)'
                aria-label='Descrição da categoria'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de categorias */}
      <div className='card'>
        <div className='card-header bg-light'>
          <h2 className='h5 mb-0'>Lista de Categorias</h2>
        </div>
        <div className='card-body'>
          {loading ? (
            <div className='text-center py-4'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Carregando...</span>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className='alert alert-info'>Nenhuma categoria encontrada</div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-striped table-hover'>
                <caption className='visually-hidden'>
                  Lista de categorias disponíveis
                </caption>
                <thead>
                  <tr>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Slug</th>
                    <th scope='col'>Descrição</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>
                        {editingId === category.id ? (
                          <input
                            type='text'
                            className='form-control form-control-sm'
                            value={editData.name || ''}
                            onChange={e =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            aria-label={`Editar nome da categoria ${category.name}`}
                          />
                        ) : (
                          category.name
                        )}
                      </td>
                      <td>
                        {editingId === category.id ? (
                          <input
                            type='text'
                            className='form-control form-control-sm'
                            value={editData.slug || ''}
                            onChange={e =>
                              setEditData({ ...editData, slug: e.target.value })
                            }
                            aria-label={`Editar slug da categoria ${category.name}`}
                          />
                        ) : (
                          category.slug
                        )}
                      </td>
                      <td>
                        {editingId === category.id ? (
                          <input
                            type='text'
                            className='form-control form-control-sm'
                            value={editData.description || ''}
                            onChange={e =>
                              setEditData({
                                ...editData,
                                description: e.target.value
                              })
                            }
                            aria-label={`Editar descrição da categoria ${category.name}`}
                          />
                        ) : (
                          category.description || '-'
                        )}
                      </td>
                      <td>
                        {editingId === category.id ? (
                          <div className='btn-group btn-group-sm'>
                            <button
                              className='btn btn-success'
                              onClick={() => handleUpdateCategory(category.id)}
                              aria-label='Salvar alterações'
                            >
                              <FaSave aria-hidden='true' />
                            </button>
                            <button
                              className='btn btn-secondary'
                              onClick={cancelEditing}
                              aria-label='Cancelar edição'
                            >
                              <FaTimes aria-hidden='true' />
                            </button>
                          </div>
                        ) : (
                          <div className='btn-group btn-group-sm'>
                            <button
                              className='btn btn-warning'
                              onClick={() => startEditing(category)}
                              aria-label={`Editar categoria ${category.name}`}
                            >
                              <FaEdit aria-hidden='true' />
                            </button>
                            <button
                              className='btn btn-danger'
                              onClick={() => handleDeleteCategory(category.id)}
                              aria-label={`Excluir categoria ${category.name}`}
                            >
                              <FaTrash aria-hidden='true' />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminCategories
