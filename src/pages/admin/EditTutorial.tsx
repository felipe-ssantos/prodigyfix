// src/pages/admin/EditTutorial.tsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { db, storage } from '../../services/firebase'
import { useAuth } from '../../contexts/AuthContext'
import TiptapEditor from '../../components/TiptapEditor'
import type { Tutorial } from '../../types'
import { Modal, Button } from 'react-bootstrap'

const EditTutorial: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Partial<Tutorial>>({
    title: '',
    description: '',
    content: '',
    category: '',
    difficulty: 'Iniciante',
    tags: [],
    keywords: [],
    estimatedTime: 0,
    imageUrl: ''
  })
  const [originalImageUrl, setOriginalImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        if (!id) return

        const docRef = doc(db, 'tutorials', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as Tutorial
          setFormData({
            ...data,
            tags: data.tags || [],
            keywords: data.keywords || []
          })
          setOriginalImageUrl(data.imageUrl || '')
        } else {
          setError('Tutorial não encontrado')
        }
      } catch (err) {
        setError('Erro ao carregar o tutorial')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTutorial()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('O tamanho do arquivo de imagem deve ser inferior a 5 MB')
        return
      }
      // Validate file type
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
    setFormData(prev => ({ ...prev, tags }))
  }

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword)
    setFormData(prev => ({ ...prev, keywords }))
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
    if (!formData.title?.trim()) {
      setError('Título é obrigatório')
      return false
    }
    if (!formData.description?.trim()) {
      setError('Descrição é necessária')
      return false
    }
    if (!formData.content?.trim() || formData.content === '<p></p>') {
      setError('O conteúdo é obrigatório')
      return false
    }
    if (!formData.category) {
      setError('A categoria é obrigatória')
      return false
    }
    if ((formData.estimatedTime || 0) < 0) {
      setError('O tempo estimado deve ser um número positivo')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !id) return

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      let imageUrl = formData.imageUrl

      if (imageFile) {
        // Delete old image if exists and is different
        if (originalImageUrl && originalImageUrl !== formData.imageUrl) {
          try {
            const oldImageRef = storageRef(storage, originalImageUrl)
            await deleteObject(oldImageRef)
          } catch (err) {
            console.warn('Erro ao remover imagem antiga:', err)
          }
        }

        // Upload new image
        const newImageRef = storageRef(
          storage,
          `tutorials/${Date.now()}_${imageFile.name}`
        )
        const snapshot = await uploadBytes(newImageRef, imageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      const tutorialRef = doc(db, 'tutorials', id)
      await updateDoc(tutorialRef, {
        ...formData,
        imageUrl,
        updatedAt: new Date()
      })

      alert('Tutorial atualizado com sucesso!')
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Erro ao atualizar o tutorial. Tente novamente.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentUser) {
    return (
      <div className='container py-5'>
        <div className='alert alert-danger'>
          <h4 className='alert-heading'>Acesso negado</h4>
          <p className='mb-0'>Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='container py-5 text-center'>
        <div className='d-flex justify-content-center align-items-center loading-edit-tutoral'>
          <div>
            <div className='spinner-border text-primary mb-3' role='status'>
              <span className='visually-hidden'>Carregando...</span>
            </div>
            <p className='text-muted'>Carregando tutorial...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !formData.title) {
    return (
      <div className='container py-5 text-center'>
        <div className='alert alert-danger'>
          <h4 className='alert-heading'>Error</h4>
          <p className='mb-0'>{error || 'Tutorial não encontrado'}</p>
          <hr />
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => navigate('/admin/dashboard')}
          >
            Voltar ao painel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-4'>
      <div className='row justify-content-center'>
        <div className='col-lg-12'>
          <div className='card shadow-sm'>
            <div className='card-header bg-primary text-white'>
              <h2 className='mb-0 fw-bold'>
                <i className='fas fa-edit me-2'></i>
                Editar Tutorial
              </h2>
            </div>
            <div className='card-body p-4'>
              {error && (
                <div
                  className='alert alert-danger alert-dismissible'
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
                {/* Basic Information */}
                <div className='row mb-4'>
                  <div className='col-12'>
                    <h5 className='text-muted border-bottom pb-2 mb-3'>
                      Informações Básicas
                    </h5>
                  </div>

                  <div className='col-12 mb-3'>
                    <label htmlFor='title' className='form-label fw-semibold'>
                      Título <span className='text-danger'>*</span>
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='title'
                      name='title'
                      value={formData.title || ''}
                      onChange={handleChange}
                      placeholder='Enter tutorial title'
                      required
                    />
                  </div>

                  <div className='col-12 mb-3'>
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
                      value={formData.description || ''}
                      onChange={handleChange}
                      placeholder='Brief description of the tutorial'
                      required
                    />
                  </div>
                </div>

                {/* Content */}
                <div className='row mb-4'>
                  <div className='col-12'>
                    <h5 className='text-muted border-bottom pb-2 mb-3'>
                      Conteúdo
                    </h5>
                  </div>

                  <div className='col-12 mb-3'>
                    <label
                      htmlFor='content'
                      className='form-label fw-semibold mb-2'
                    >
                      Conteúdo do tutorial{' '}
                      <span className='text-danger'>*</span>
                    </label>
                    <TiptapEditor
                      content={formData.content || ''}
                      onChange={handleContentChange}
                      placeholder='Write your detailed tutorial content here...'
                    />
                  </div>
                </div>

                {/* Categorization */}
                <div className='row mb-4'>
                  <div className='col-12'>
                    <h5 className='text-muted border-bottom pb-2 mb-3'>
                      Categorização
                    </h5>
                  </div>

                  <div className='col-md-6 mb-3'>
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
                        value={formData.category || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value=''>Select a category</option>
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
                        title='Adicionar nova categoria'
                      >
                        <i className='fas fa-plus'></i> Novo(a)
                      </button>
                    </div>
                  </div>

                  <div className='col-md-6 mb-3'>
                    <label
                      htmlFor='difficulty'
                      className='form-label fw-semibold'
                    >
                      Nível de dificuldade{' '}
                      <span className='text-danger'>*</span>
                    </label>
                    <select
                      className='form-select'
                      id='difficulty'
                      name='difficulty'
                      value={formData.difficulty || 'beginner'}
                      onChange={handleChange}
                      required
                    >
                      <option value='Iniciante'>Iniciante</option>
                      <option value='Intermediário'>Intermediário</option>
                      <option value='Avançado'>Avançado</option>
                    </select>
                  </div>

                  <div className='col-md-6 mb-3'>
                    <label htmlFor='tags' className='form-label fw-semibold'>
                      Tags
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='tags'
                      name='tags'
                      value={formData.tags?.join(', ') || ''}
                      onChange={handleTagsChange}
                      placeholder='tag1, tag2, tag3'
                    />
                    <div className='form-text'>Separe as tags com vírgulas</div>
                  </div>

                  <div className='col-md-6 mb-3'>
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
                      value={formData.keywords?.join(', ') || ''}
                      onChange={handleKeywordsChange}
                      placeholder='keyword1, keyword2, keyword3'
                    />
                    <div className='form-text'>Para otimização de pesquisa</div>
                  </div>
                </div>

                {/* Additional Settings */}
                <div className='row mb-4'>
                  <div className='col-12'>
                    <h5 className='text-muted border-bottom pb-2 mb-3'>
                      Configurações adicionais
                    </h5>
                  </div>

                  <div className='col-md-6 mb-3'>
                    <label
                      htmlFor='estimatedTime'
                      className='form-label fw-semibold'
                    >
                      Tempo estimado de leitura (em minutos)
                    </label>
                    <input
                      type='number'
                      className='form-control'
                      id='estimatedTime'
                      name='estimatedTime'
                      min='0'
                      max='999'
                      value={formData.estimatedTime || 0}
                      onChange={handleChange}
                      placeholder='0'
                    />
                  </div>

                  <div className='col-md-6 mb-3'>
                    <label htmlFor='image' className='form-label fw-semibold'>
                      Imagem da capa
                    </label>
                    <input
                      type='file'
                      className='form-control'
                      id='image'
                      name='image'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                    <div className='form-text'>
                      Max 5MB. Suportado: JPG, PNG, GIF, WebP
                    </div>

                    {formData.imageUrl && !imageFile && (
                      <div className='mt-2'>
                        <small className='text-muted d-block'>
                          Imagem atual:
                          <a
                            href={formData.imageUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='text-decoration-none ms-1'
                          >
                            <i className='fas fa-external-link-alt me-1'></i>
                            Visualizar
                          </a>
                        </small>
                      </div>
                    )}

                    {imageFile && (
                      <div className='mt-2'>
                        <small className='text-success'>
                          <i className='fas fa-check-circle me-1'></i>
                          Nova imagem selecionada: {imageFile.name}
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className='d-flex justify-content-between pt-3 border-top'>
                  <button
                    type='button'
                    className='btn btn-secondary px-4'
                    onClick={() => navigate('/admin/dashboard')}
                    disabled={isSubmitting}
                  >
                    <i className='fas fa-times me-1'></i>
                    Cancelar
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary px-4'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          className='spinner-border spinner-border-sm me-2'
                          role='status'
                        >
                          <span className='visually-hidden'>Loading...</span>
                        </div>
                        Salvando alterações...
                      </>
                    ) : (
                      <>
                        <i className='fas fa-save me-2'></i>
                        Salvar alterações
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* New Category Modal */}
      <Modal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className='fas fa-folder-plus me-2'></i>
            Adicionar nova categoria
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-3'>
            <label htmlFor='newCategory' className='form-label fw-semibold'>
              Nome da categoria
            </label>
            <input
              type='text'
              className='form-control'
              id='newCategory'
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder='Ex: Diagnostic Tools'
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
            <i className='fas fa-plus me-1'></i>
            Adicionar categoria
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default EditTutorial
