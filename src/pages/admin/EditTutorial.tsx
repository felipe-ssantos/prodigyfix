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
import type { Tutorial } from '../../types'

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
    difficulty: 'beginner',
    tags: [],
    keywords: [],
    estimatedTime: 0,
    imageUrl: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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
        } else {
          setError('Tutorial não encontrado')
        }
      } catch (err) {
        setError('Erro ao carregar tutorial')
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim())
    setFormData(prev => ({ ...prev, tags }))
  }

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',').map(keyword => keyword.trim())
    setFormData(prev => ({ ...prev, keywords }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !id) return

    setIsSubmitting(true)
    setError('')

    try {
      let imageUrl = formData.imageUrl

      // Upload da nova imagem se existir
      if (imageFile) {
        // Remove a imagem antiga se existir
        if (formData.imageUrl) {
          try {
            const oldImageRef = storageRef(storage, formData.imageUrl)
            await deleteObject(oldImageRef)
          } catch (err) {
            console.warn('Erro ao remover imagem antiga:', err)
          }
        }

        const newImageRef = storageRef(
          storage,
          `tutorials/${Date.now()}_${imageFile.name}`
        )
        const snapshot = await uploadBytes(newImageRef, imageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      // Atualizar documento no Firestore
      const tutorialRef = doc(db, 'tutorials', id)
      await updateDoc(tutorialRef, {
        ...formData,
        imageUrl,
        updatedAt: new Date()
      })

      alert('Tutorial atualizado com sucesso!')
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Erro ao atualizar tutorial. Por favor, tente novamente.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
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

  if (loading)
    return <div className='container py-5 text-center'>Carregando...</div>
  if (error || !formData.title)
    return (
      <div className='container py-5 text-center'>
        {error || 'Tutorial não encontrado'}
      </div>
    )

  return (
    <div className='container py-4'>
      <div className='row justify-content-center'>
        <div className='col-lg-8'>
          <div className='card'>
            <div className='card-header bg-primary text-white'>
              <h2 className='mb-0'>Editar Tutorial</h2>
            </div>
            <div className='card-body'>
              {error && <div className='alert alert-danger'>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor='title' className='form-label'>
                    Título
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
                  <label htmlFor='description' className='form-label'>
                    Descrição
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

                <div className='mb-3'>
                  <label htmlFor='content' className='form-label'>
                    Conteúdo (Markdown suportado)
                  </label>
                  <textarea
                    className='form-control'
                    id='content'
                    name='content'
                    rows={10}
                    value={formData.content}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='row'>
                  <div className='col-md-6 mb-3'>
                    <label htmlFor='category' className='form-label'>
                      Categoria
                    </label>
                    <select
                      className='form-select'
                      id='category'
                      name='category'
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value=''>Selecione uma categoria</option>
                      <option value='html-css'>HTML & CSS</option>
                      <option value='javascript'>JavaScript</option>
                      <option value='react'>React</option>
                      <option value='nodejs'>Node.js</option>
                      <option value='database'>Banco de Dados</option>
                    </select>
                  </div>

                  <div className='col-md-6 mb-3'>
                    <label htmlFor='difficulty' className='form-label'>
                      Dificuldade
                    </label>
                    <select
                      className='form-select'
                      id='difficulty'
                      name='difficulty'
                      value={formData.difficulty}
                      onChange={handleChange}
                      required
                    >
                      <option value='beginner'>Iniciante</option>
                      <option value='intermediate'>Intermediário</option>
                      <option value='advanced'>Avançado</option>
                    </select>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-6 mb-3'>
                    <label htmlFor='tags' className='form-label'>
                      Tags (separadas por vírgula)
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='tags'
                      name='tags'
                      value={formData.tags?.join(', ') || ''}
                      onChange={handleTagsChange}
                    />
                  </div>

                  <div className='col-md-6 mb-3'>
                    <label htmlFor='keywords' className='form-label'>
                      Palavras-chave (separadas por vírgula)
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='keywords'
                      name='keywords'
                      value={formData.keywords?.join(', ') || ''}
                      onChange={handleKeywordsChange}
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-6 mb-3'>
                    <label htmlFor='estimatedTime' className='form-label'>
                      Tempo estimado (minutos)
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

                  <div className='col-md-6 mb-3'>
                    <label htmlFor='image' className='form-label'>
                      Imagem de capa
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
                      <small className='text-muted'>
                        Imagem atual:{' '}
                        <a
                          href={formData.imageUrl}
                          target='_blank'
                          rel='noreferrer'
                        >
                          Visualizar
                        </a>
                      </small>
                    )}
                  </div>
                </div>

                <div className='d-flex justify-content-between'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => navigate('/admin/dashboard')}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditTutorial
