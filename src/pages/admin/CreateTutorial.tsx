// src/pages/admin/CreateTutorial.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { db, storage } from '../../services/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import type { Tutorial } from '../../types'
import TiptapEditor from '../../components/TiptapEditor'
import { Modal, Button } from 'react-bootstrap'

const CreateTutorial: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
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
  const [categories, setCategories] = useState<string[]>([
    'BCD/MBR Tools',
    'Data Recovery',
    'Disk Defrag',
    'Partition Tools',
    'Password Recovery',
    'System Repair'
  ])

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

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const newCat = newCategory.trim()
      setCategories([...categories, newCat])
      setFormData(prev => ({
        ...prev,
        category: newCat
      }))
      setNewCategory('')
      setShowCategoryModal(false)
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
      let imageUrl = formData.imageUrl
      if (imageFile) {
        const storageRef = ref(
          storage,
          `tutorials/${Date.now()}_${imageFile.name}`
        )
        const snapshot = await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      const tutorialData = {
        ...formData,
        imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0
      }

      const docRef = await addDoc(collection(db, 'tutorials'), tutorialData)
      alert(`Tutorial criado com sucesso! ID: ${docRef.id}`)
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Falha ao criar o tutorial. Tente novamente.')
      console.error('Erro ao criar tutorial:', err)
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
                <i className='fas fa-plus-circle me-2 text-primary'></i>
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
                  aria-label='Close'
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='row'>
                {/* Left Column */}
                <div className='col-lg-6'>
                  <div className='mb-4'>
                    <h5 className='text-muted border-bottom pb-2 mb-3'>
                      <i className='fas fa-info-circle me-2'></i>
                      Informações Básicas
                    </h5>
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
                      />
                    </div>
                  </div>

                  <div className='mb-4'>
                    <h5 className='text-muted border-bottom pb-2 mb-3'>
                      <i className='fas fa-tags me-2'></i>
                      Categorização
                    </h5>
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
                        >
                          <option value=''>Selecione uma categoria</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <button
                          type='button'
                          className='btn btn-outline-secondary'
                          onClick={() => setShowCategoryModal(true)}
                          aria-label='categoria'
                        >
                          <i className='fas fa-plus'>Adicionar nova categoria?</i>
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
                      />
                      <small className='form-text text-muted'>
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
                      />
                      <small className='form-text text-muted'>
                        Para otimização de pesquisa
                      </small>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className='col-lg-6'>
                  <div className='mb-4'>
                    <h5 className='text-muted border-bottom pb-2 mb-3'>
                      <i className='fas fa-align-left me-2'></i>
                      Conteúdo
                    </h5>
                    <TiptapEditor
                      content={formData.content}
                      onChange={handleContentChange}
                    />
                  </div>

                  <div className='mb-4'>
                    <h5 className='text-muted border-bottom pb-2 mb-3'>
                      <i className='fas fa-image me-2'></i>
                      Imagem de Capa
                    </h5>
                    <div className='mb-3'>
                      <input
                        type='file'
                        className='form-control'
                        id='image'
                        name='image'
                        accept='image/*'
                        onChange={handleImageChange}
                        aria-label='imagem'
                      />
                      <small className='form-text text-muted'>
                        Máx. 5MB (JPG, PNG, GIF, WebP)
                      </small>
                      {imageFile && (
                        <div className='mt-2'>
                          <span className='badge bg-success'>
                            <i className='fas fa-check-circle me-1'></i>
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
                >
                  <i className='fas fa-arrow-left me-2'></i>
                  Cancelar
                </button>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={loading}
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
                      <i className='fas fa-save me-2'></i>
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
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className='fas fa-folder-plus me-2'></i>
            Nova Categoria
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-3'>
            <label htmlFor='newCategory' className='form-label'>
              Nome da Categoria
            </label>
            <input
              type='text'
              className='form-control'
              id='newCategory'
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowCategoryModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant='primary'
            onClick={handleAddCategory}
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
