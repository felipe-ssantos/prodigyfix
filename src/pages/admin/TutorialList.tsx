// src/pages/admin/TutorialList.tsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useAuth } from '../../contexts/AuthContext'
import type { Tutorial } from '../../types'

const TutorialList: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const q = query(
          collection(db, 'tutorials'),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)

        const tutorialsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tutorial[]

        setTutorials(tutorialsData)
      } catch (err) {
        setError('Erro ao carregar tutoriais')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTutorials()
  }, [])

  if (!currentUser) {
    return (
      <div className='w-100 py-5' style={{ minHeight: '100vh' }}>
        <div className='container-fluid px-4'>
          <div className='alert alert-danger'>
            Você precisa estar logado para acessar esta página.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-100 py-4' style={{ minHeight: '100vh' }}>
      <div className='container-fluid px-4'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h1>Todos os Tutoriais</h1>
          <Link to='/admin/tutorials/new' className='btn btn-primary'>
            Criar Novo Tutorial
          </Link>
        </div>

        {loading ? (
          <div className='text-center'>Carregando...</div>
        ) : error ? (
          <div className='alert alert-danger'>{error}</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-striped table-hover'>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Dificuldade</th>
                  <th>Visualizações</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tutorials.map(tutorial => (
                  <tr key={tutorial.id}>
                    <td>{tutorial.title}</td>
                    <td>{tutorial.category}</td>
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
                    <td>{tutorial.views}</td>
                    <td>
                      <div className='btn-group'>
                        <Link
                          to={`/tutorial/${tutorial.id}`}
                          className='btn btn-sm btn-outline-primary'
                          target='_blank'
                        >
                          Visualizar
                        </Link>
                        <Link
                          to={`/admin/tutorials/${tutorial.id}/edit`}
                          className='btn btn-sm btn-outline-warning'
                        >
                          Editar
                        </Link>
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
  )
}

export default TutorialList
