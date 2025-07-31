// src/pages/admin/CreateTutorial.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { db, storage } from '../../services/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import type { Tutorial } from '../../types'

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
    difficulty: 'beginner',
    estimatedTime: 0,
    tags: [],
    imageUrl: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim())
    setFormData(prev => ({
      ...prev,
      tags
    }))
  }

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',').map(keyword => keyword.trim())
    setFormData(prev => ({
      ...prev,
      keywords
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Upload da imagem se existir
      let imageUrl = formData.imageUrl
      if (imageFile) {
        const storageRef = ref(
          storage,
          `tutorials/${Date.now()}_${imageFile.name}`
        )
        const snapshot = await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      // Criar objeto do tutorial
      const tutorialData = {
        ...formData,
        imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0
      }

      // Salvar no Firestore
      const docRef = await addDoc(collection(db, 'tutorials'), tutorialData)

      alert(`Tutorial criado com sucesso! ID: ${docRef.id}`)
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Falha ao criar tutorial. Por favor, tente novamente.')
      console.error('Erro ao criar tutorial:', err)
    } finally {
      setLoading(false)
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

  return (
    <div className='container py-4'>
      <div className='row justify-content-center'>
        <div className='col-lg-8'>
          <div className='card'>
            <div className='card-header bg-primary text-white'>
              <h2 className='mb-0'>Criar Novo Tutorial</h2>
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
                      value={formData.tags.join(', ')}
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
                      value={formData.keywords.join(', ')}
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
                      value={formData.estimatedTime}
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
                        URL atual: {formData.imageUrl}
                      </small>
                    )}
                  </div>
                </div>

                <div className='d-flex justify-content-between'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => navigate('/admin/dashboard')}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={loading}
                  >
                    {loading ? 'Criando...' : 'Criar Tutorial'}
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

export default CreateTutorial
