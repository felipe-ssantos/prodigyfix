// src/pages/admin/CreateTutorial.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTutorials } from '../../hooks/useTutorials'
import { db, storage } from '../../services/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'
import type { Tutorial } from '../../types'
import TiptapEditor from '../../components/TiptapEditor'
import { Modal, Button } from 'react-bootstrap'

const CreateTutorial: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { categories, addCategory } = useTutorials()
  const [formData, setFormData] = useState<
    Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt' | 'views'>
  >({
    title: '',
    description: '',
    content: '',
    category: '',
    keywords: [],
    author: currentUser?.displayName || currentUser?.email || 'Admin',
    difficulty: 'Iniciante',
    estimatedTime: 0,
    tags: [],
    imageUrl: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setError('O tamanho do arquivo de imagem deve ser inferior a 5 MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Selecione um arquivo de imagem válido')
        return
      }
      setImageFile(file)
      setError('')
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag)
    setFormData(prev => ({
      ...prev,
      tags
    }))
  }

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword)
    setFormData(prev => ({
      ...prev,
      keywords
    }))
  }

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await addCategory(newCategory.trim())
        setFormData(prev => ({
          ...prev,
          category: newCategory.trim()
        }))
        setNewCategory('')
        setShowCategoryModal(false)
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Erro desconhecido ao criar tutorial'
        setError(errorMessage)
        console.error('Erro ao criar tutorial:', err)
      }
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Título é obrigatório')
      return false
    }
    if (!formData.description.trim()) {
      setError('Descrição é necessária')
      return false
    }
    if (!formData.content.trim() || formData.content === '<p></p>') {
      setError('O conteúdo é obrigatório')
      return false
    }
    if (!formData.category) {
      setError('A categoria é obrigatória')
      return false
    }
    if (formData.estimatedTime < 0) {
      setError('O tempo estimado deve ser um número positivo')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      if (!currentUser || !currentUser.uid) {
        throw new Error('Usuário não autenticado')
      }

      let imageName = formData.imageUrl || ''

      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name
          .toLowerCase()
          .replace(/\s+/g, '-')}`
        const storageRef = ref(storage, `tutorials/${fileName}`)
        await uploadBytes(storageRef, imageFile)
        imageName = fileName
      }

      const tutorialData = {
        ...formData,
        imageUrl: imageName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        authorId: currentUser.uid
      }

      await addDoc(collection(db, 'tutorials'), tutorialData)
      navigate('/admin/dashboard')
    } catch (err: unknown) {
      setError(
        `Erro ao salvar: ${
          err instanceof Error ? err.message : 'Erro desconhecido'
        }`
      )
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className='container py-5'>
        <div className='alert alert-danger'>
          <h4 className='alert-heading'>Acesso negado</h4>
          <p>Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container-fluid py-4 tutorial-admin-container'>
      <div className='row gx-4'>
        <div className='col-12'>
          <article className='bg-white rounded-3 shadow-sm p-4 tutorial-admin-article'>
            <header className='mb-4'>
              <h1 className='fw-bold mb-0'>
                <i
                  className='fas fa-plus-circle me-2 text-primary'
                  aria-hidden='true'
                ></i>
                Criar Novo Tutorial
              </h1>
            </header>

            {error && (
              <div
                className='alert alert-danger alert-dismissible fade show mb-4'
                role='alert'
              >
                <strong>Erro:</strong> {error}
                <button
                  type='button'
                  className='btn-close'
                  onClick={() => setError('')}
                  aria-label='Fechar mensagem de erro'
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='row'>
                <div className='col-lg-6'>
                  <div className='mb-4'>
                    <h2 className='text-muted border-bottom pb-2 mb-3'>
                      <i
                        className='fas fa-info-circle me-2'
                        aria-hidden='true'
                      ></i>
                      Informações Básicas
                    </h2>
                    <div className='mb-3'>
                      <label htmlFor='title' className='form-label fw-semibold'>
                        Título <span className='text-danger'>*</span>
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='title'
                        name='title'
                        value={formData.title}
                        onChange={handleChange}
                        required
                        aria-required='true'
                      />
                    </div>

                    <div className='mb-3'>
                      <label
                        htmlFor='description'
                        className='form-label fw-semibold'
                      >
                        Resumo <span className='text-danger'>*</span>
                      </label>
                      <textarea
                        className='form-control'
                        id='description'
                        name='description'
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        required
                        aria-required='true'
                      />
                    </div>
                  </div>

                  <div className='mb-4'>
                    <h2 className='text-muted border-bottom pb-2 mb-3'>
                      <i className='fas fa-tags me-2' aria-hidden='true'></i>
                      Categorização
                    </h2>
                    <div className='mb-3'>
                      <label
                        htmlFor='category'
                        className='form-label fw-semibold'
                      >
                        Categoria <span className='text-danger'>*</span>
                      </label>
                      <div className='input-group'>
                        <select
                          className='form-select'
                          id='category'
                          name='category'
                          value={formData.category}
                          onChange={handleChange}
                          required
                          aria-required='true'
                        >
                          <option value=''>Selecione uma categoria</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type='button'
                          className='btn btn-outline-secondary'
                          onClick={() => setShowCategoryModal(true)}
                          aria-label='Adicionar nova categoria'
                        >
                          <i className='fas fa-plus' aria-hidden='true'>Criar nova catergoria ?</i>
                        </button>
                      </div>
                    </div>

                    <div className='mb-3'>
                      <label
                        htmlFor='difficulty'
                        className='form-label fw-semibold'
                      >
                        Dificuldade <span className='text-danger'>*</span>
                      </label>
                      <select
                        className='form-select'
                        id='difficulty'
                        name='difficulty'
                        value={formData.difficulty}
                        onChange={handleChange}
                        required
                        aria-required='true'
                      >
                        <option value='Iniciante'>Iniciante</option>
                        <option value='Intermediário'>Intermediário</option>
                        <option value='Avançado'>Avançado</option>
                      </select>
                    </div>

                    <div className='mb-3'>
                      <label htmlFor='tags' className='form-label fw-semibold'>
                        Tags
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='tags'
                        name='tags'
                        value={formData.tags.join(', ')}
                        onChange={handleTagsChange}
                        placeholder='tag1, tag2, tag3'
                        aria-describedby='tagsHelp'
                      />
                      <small id='tagsHelp' className='form-text text-muted'>
                        Separe as tags com vírgulas
                      </small>
                    </div>

                    <div className='mb-3'>
                      <label
                        htmlFor='keywords'
                        className='form-label fw-semibold'
                      >
                        Palavras-chave
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='keywords'
                        name='keywords'
                        value={formData.keywords.join(', ')}
                        onChange={handleKeywordsChange}
                        placeholder='keyword1, keyword2, keyword3'
                        aria-describedby='keywordsHelp'
                      />
                      <small id='keywordsHelp' className='form-text text-muted'>
                        Para otimização de pesquisa
                      </small>
                    </div>
                  </div>
                </div>

                <div className='col-lg-6'>
                  <div className='mb-4'>
                    <h2 className='text-muted border-bottom pb-2 mb-3'>
                      <i
                        className='fas fa-align-left me-2'
                        aria-hidden='true'
                      ></i>
                      Conteúdo
                    </h2>
                    <TiptapEditor
                      content={formData.content}
                      onChange={handleContentChange}
                    />
                  </div>

                  <div className='mb-4'>
                    <h2 className='text-muted border-bottom pb-2 mb-3'>
                      <i className='fas fa-image me-2' aria-hidden='true'></i>
                      Imagem de Capa
                    </h2>
                    <div className='mb-3'>
                      <label htmlFor='image' className='form-label'>
                        Selecione uma imagem
                      </label>
                      <input
                        type='file'
                        className='form-control'
                        id='image'
                        name='image'
                        accept='image/*'
                        onChange={handleImageChange}
                        aria-describedby='imageHelp'
                      />
                      <small id='imageHelp' className='form-text text-muted'>
                        Máx. 5MB (JPG, PNG, GIF, WebP)
                      </small>
                      {imageFile && (
                        <div className='mt-2'>
                          <span className='badge bg-success'>
                            <i
                              className='fas fa-check-circle me-1'
                              aria-hidden='true'
                            ></i>
                            {imageFile.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='mb-3'>
                    <label
                      htmlFor='estimatedTime'
                      className='form-label fw-semibold'
                    >
                      Tempo Estimado (minutos)
                    </label>
                    <input
                      type='number'
                      className='form-control'
                      id='estimatedTime'
                      name='estimatedTime'
                      min='0'
                      value={formData.estimatedTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className='d-flex justify-content-between pt-4 border-top'>
                <button
                  type='button'
                  className='btn btn-outline-secondary'
                  onClick={() => navigate('/admin/dashboard')}
                  disabled={loading}
                  aria-label='Cancelar e voltar ao painel'
                >
                  <i className='fas fa-arrow-left me-2' aria-hidden='true'></i>
                  Cancelar
                </button>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={loading}
                  aria-label={
                    loading ? 'Publicando tutorial' : 'Criar tutorial'
                  }
                >
                  {loading ? (
                    <>
                      <span
                        className='spinner-border spinner-border-sm me-2'
                        role='status'
                        aria-hidden='true'
                      ></span>
                      Publicando...
                    </>
                  ) : (
                    <>
                      <i className='fas fa-save me-2' aria-hidden='true'></i>
                      Criar Tutorial
                    </>
                  )}
                </button>
              </div>
            </form>
          </article>
        </div>
      </div>

      <Modal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        centered
        aria-labelledby='new-category-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title id='new-category-modal'>Nova Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-3'>
            <label htmlFor='newCategoryName' className='visually-hidden'>
              Nome da nova categoria
            </label>
            <input
              type='text'
              className='form-control'
              id='newCategoryName'
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder='Nome da categoria'
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowCategoryModal(false)}
            aria-label='Cancelar criação de categoria'
          >
            Cancelar
          </Button>
          <Button
            variant='primary'
            onClick={handleAddCategory}
            aria-label='Adicionar nova categoria'
            disabled={!newCategory.trim()}
          >
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CreateTutorial
