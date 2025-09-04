// src/pages/admin/EditTutorial.tsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, deleteObject } from 'firebase/storage'
import { db, storage } from '../../services/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useTutorials } from '../../hooks/useTutorials'
import TiptapEditor from '../../components/TiptapEditor'
import type { Tutorial } from '../../types'
import { Modal, Button } from 'react-bootstrap'

// Componente TagInput
interface TagInputProps {
  label: string
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  helpText?: string
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onTagsChange,
  placeholder = 'Digite uma tag',
  helpText
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onTagsChange([...tags, trimmedValue])
      setInputValue('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className='mb-3'>
      <label className='form-label fw-semibold'>{label}</label>

      <div className='input-group mb-2'>
        <input
          type='text'
          className='form-control'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
        />
        <button
          type='button'
          className='btn btn-outline-primary'
          onClick={handleAddTag}
          disabled={!inputValue.trim() || tags.includes(inputValue.trim())}
          aria-label='Adicionar tag'
        >
          <i className='fas fa-plus'></i>
        </button>
      </div>

      {helpText && (
        <small className='form-text text-muted mb-2 d-block'>{helpText}</small>
      )}

      <div className='d-flex flex-wrap gap-2'>
        {tags.map((tag, index) => (
          <span
            key={index}
            className='badge bg-primary d-flex align-items-center'
          >
            {tag}
            <button
              type='button'
              className='btn-close btn-close-white ms-2 text-small'              
              onClick={() => handleRemoveTag(tag)}
              aria-label={`Remover tag ${tag}`}
            ></button>
          </span>
        ))}
        {tags.length === 0 && (
          <span className='text-muted fst-italic'>Nenhuma tag adicionada</span>
        )}
      </div>
    </div>
  )
}

const EditTutorial: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { categories, addCategory } = useTutorials()
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

  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }))
  }

  const handleKeywordsChange = (keywords: string[]) => {
    setFormData(prev => ({ ...prev, keywords }))
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
      } catch (err) {
        setError('Erro ao adicionar categoria')
        console.error(err)
      }
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
    if (!validateForm()) return

    setIsSubmitting(true)
    setError('')

    try {
      let imageName = formData.imageUrl

      if (imageFile) {
        // Remove a imagem antiga se existir
        if (originalImageUrl) {
          try {
            const oldImageRef = storageRef(
              storage,
              `tutorials/${originalImageUrl}`
            )
            await deleteObject(oldImageRef)
          } catch (err) {
            console.warn('Erro ao remover imagem antiga:', err)
          }
        }

        // Upload da nova imagem (armazena apenas o nome do arquivo)
        const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`
        const newImageRef = storageRef(storage, `tutorials/${fileName}`)
        await uploadBytes(newImageRef, imageFile)
        imageName = fileName
      }

      // Atualiza no Firestore (armazenando apenas o nome do arquivo)
      const tutorialRef = doc(db, 'tutorials', id)
      await updateDoc(tutorialRef, {
        ...formData,
        imageUrl: imageName, // Armazena apenas o nome do arquivo
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
          <p>Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='container-fluid py-5 text-center'>
        <div className='d-flex justify-content-center align-items-center min-vh-300'>
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
      <div className='container-fluid py-5'>
        <div className='alert alert-danger'>
          <h4 className='alert-heading'>Erro</h4>
          <p className='mb-3'>{error || 'Tutorial não encontrado'}</p>
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
    <div className='container-fluid py-4 tutorial-admin-container'>
      <div className='row gx-4'>
        <div className='col-12'>
          <article className='bg-white rounded-3 shadow-sm p-4 tutorial-admin-article'>
            <header className='mb-4'>
              <h1 className='fw-bold mb-0'>
                <i className='fas fa-edit me-2 text-primary'></i>
                Editar Tutorial
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
                        value={formData.title || ''}
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
                        value={formData.description || ''}
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
                          value={formData.category || ''}
                          onChange={handleChange}
                          required
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
                          <i className='fas fa-plus me-1'></i>
                          Nova
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
                        value={formData.difficulty || 'Iniciante'}
                        onChange={handleChange}
                        required
                      >
                        <option value='Iniciante'>Iniciante</option>
                        <option value='Intermediário'>Intermediário</option>
                        <option value='Avançado'>Avançado</option>
                      </select>
                    </div>

                    <TagInput
                      label='Tags'
                      tags={formData.tags || []}
                      onTagsChange={handleTagsChange}
                      placeholder='Digite uma tag'
                      helpText='Adicione tags para facilitar a busca'
                    />

                    <TagInput
                      label='Palavras-chave'
                      tags={formData.keywords || []}
                      onTagsChange={handleKeywordsChange}
                      placeholder='Digite uma palavra-chave'
                      helpText='Para otimização de pesquisa (SEO)'
                    />
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
                      content={formData.content || ''}
                      onChange={handleContentChange}
                    />
                  </div>

                  <div className='mb-4'>
                    <h5 className='text-muted border-bottom pb-2 mb-3'>
                      <i className='fas fa-image me-2'></i>
                      Imagem de Capa
                    </h5>

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
                      />

                      {formData.imageUrl && !imageFile && (
                        <div className='mt-2'>
                          <span className='badge bg-info text-dark'>
                            <i className='fas fa-image me-1'></i>
                            Imagem atual: {formData.imageUrl}
                          </span>
                        </div>
                      )}

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
                      value={formData.estimatedTime || 0}
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
                  disabled={isSubmitting}
                >
                  <i className='fas fa-arrow-left me-2'></i>
                  Cancelar
                </button>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className='spinner-border spinner-border-sm me-2'
                        role='status'
                        aria-hidden='true'
                      ></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className='fas fa-save me-2'></i>
                      Salvar Alterações
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
          <Modal.Title>Nova Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-3'>
            <input
              type='text'
              className='form-control'
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
          >
            Cancelar
          </Button>
          <Button variant='primary' onClick={handleAddCategory}>
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default EditTutorial
