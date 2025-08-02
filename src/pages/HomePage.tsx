//src\pages\HomePage.tsx
import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaTerminal, FaClock, FaBookOpen, FaChevronRight } from 'react-icons/fa'
import { useTutorials } from '../contexts/TutorialContext'
import TutorialCard from '../components/ui/TutorialCard'

const HomePage: React.FC = () => {
  const { categories, tutorials, getTutorialsByCategory } = useTutorials()
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredTutorials, setFilteredTutorials] = useState(tutorials)

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    setSelectedCategory(categoryParam)

    if (categoryParam) {
      setFilteredTutorials(getTutorialsByCategory(categoryParam))
    } else {
      setFilteredTutorials(tutorials)
    }
  }, [searchParams, tutorials, getTutorialsByCategory])

  // Get featured tutorials (most viewed)
  const featuredTutorials = tutorials
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)

  const recentTutorials = tutorials
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8)

  const displayTutorials = selectedCategory
    ? filteredTutorials
    : recentTutorials

  return (
    <div className='container-fluid px-4 py-3'>
      {/* Header Section - Minimalista */}
      <header className='row mb-4'>
        <div className='col-12'>
          <div className='d-flex align-items-center justify-content-between border-bottom pb-3'>
            <div>
            </div>
            <div className='d-flex gap-4 text-muted small'>
              <span>
                <FaBookOpen className='me-1' />
                {tutorials.length} Tutoriais publicados
              </span>
              <span>
                <FaClock className='me-1' />
                Atualizado diariamente
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats - Compacto */}
      {selectedCategory && (
        <div className='row mb-4'>
          <div className='col-12'>
            <div className='d-flex align-items-center justify-content-between p-3 bg-light rounded'>
              <div>
                <h5 className='mb-1'>
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h5>
                <small className='text-muted'>
                  {filteredTutorials.length} tutorial(s) encontrado(s)
                </small>
              </div>
              <button
                className='btn btn-sm btn-outline-secondary'
                onClick={() => {
                  setSelectedCategory(null)
                  setFilteredTutorials(tutorials)
                }}
              >
                Limpar filtro
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='row'>
        {/* Sidebar com Categorias */}
        <aside className='col-lg-3 mb-4'>
          <div className='position-sticky top-0 pt-3'>
            <div className='card border-0 shadow-sm'>
              <div className='card-header bg-white'>
                <h6 className='mb-0 fw-semibold'>Categorias</h6>
              </div>
              <div className='card-body p-0'>
                <div className='list-group list-group-flush'>
                  {categories.map(category => (
                    <Link
                      key={category.id}
                      to={`/?category=${category.id}`}
                      className={`list-group-item list-group-item-action border-0 py-3 ${
                        selectedCategory === category.id ? 'active' : ''
                      }`}
                    >
                      <div className='d-flex align-items-center'>
                        <span className='me-3 fs-5'>{category.icon}</span>
                        <div className='flex-grow-1'>
                          <div className='fw-medium'>{category.name}</div>
                          <small className='text-muted'>
                            {category.tutorialCount} tutorial(s)
                          </small>
                        </div>
                        <small className='text-muted'>
                          <FaChevronRight />
                        </small>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className='col-lg-9'>
          {/* Tutoriais em Destaque - Apenas se não houver categoria selecionada */}
          {!selectedCategory && featuredTutorials.length > 0 && (
            <section className='mb-5'>
              <div className='d-flex align-items-center mb-3'>
                <h5 className='mb-0 fw-semibold'>Mais Acessados</h5>
                <div className='ms-auto'>
                  <span className='badge bg-secondary'>
                    {featuredTutorials.length}
                  </span>
                </div>
              </div>

              <div className='row g-3'>
                {featuredTutorials.map(tutorial => (
                  <div key={tutorial.id} className='col-md-6 col-xl-4'>
                    <TutorialCard tutorial={tutorial} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Lista Principal de Tutoriais */}
          <section>
            <div className='d-flex align-items-center mb-3'>
              <h5 className='mb-0 fw-semibold'>
                {selectedCategory
                  ? `Categoria: ${
                      categories.find(c => c.id === selectedCategory)?.name
                    }`
                  : 'Tutoriais Recentes'}
              </h5>
              <div className='ms-auto'>
                <span className='badge bg-primary'>
                  {displayTutorials.length}
                </span>
              </div>
            </div>

            {displayTutorials.length > 0 ? (
              <div className='row g-3'>
                {displayTutorials.map(tutorial => (
                  <div key={tutorial.id} className='col-md-6 col-xl-4'>
                    <TutorialCard tutorial={tutorial} />
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-5'>
                <div className='text-muted mb-3'>
                  <FaTerminal className='display-3 opacity-25' />
                </div>
                <h6 className='text-muted mb-2'>Nenhum tutorial encontrado</h6>
                <p className='text-muted small mb-0'>
                  {selectedCategory
                    ? 'Não há tutoriais disponíveis nesta categoria.'
                    : 'Nenhum tutorial disponível no momento.'}
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default HomePage
