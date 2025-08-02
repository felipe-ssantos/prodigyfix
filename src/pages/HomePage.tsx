//src\pages\HomePage.tsx
import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaTerminal, FaChevronRight } from 'react-icons/fa'
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
    .slice(0, 12)

  const displayTutorials = selectedCategory
    ? filteredTutorials
    : recentTutorials

  return (
    <div className='container-fluid py-4'>
      {/* Filtro Ativo */}
      {selectedCategory && (
        <div className='row mb-4'>
          <div className='col-12'>
            <div className='alert alert-info d-flex align-items-center justify-content-between'>
              <div>
                <strong>Categoria selecionada:</strong>{' '}
                {categories.find(c => c.id === selectedCategory)?.name}
                <span className='badge bg-primary ms-2'>
                  {filteredTutorials.length} tutorial(s)
                </span>
              </div>
              <button
                className='btn btn-outline-primary btn-sm'
                onClick={() => {
                  setSelectedCategory(null)
                  setFilteredTutorials(tutorials)
                }}
                aria-label='Limpar filtro de categoria'
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
          <div className='position-sticky' style={{ top: '2rem' }}>
            <div className='card shadow-sm'>
              <div className='card-header bg-light'>
                <h5 className='mb-0 fw-bold text-primary'>📂 Categorias</h5>
              </div>
              <div className='list-group list-group-flush'>
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/?category=${category.id}`}
                    className={`list-group-item list-group-item-action d-flex align-items-center ${
                      selectedCategory === category.id ? 'active' : ''
                    }`}
                    aria-label={`Ver tutoriais da categoria ${category.name}`}
                  >
                    <span className='me-3 fs-5'>{category.icon}</span>
                    <div className='flex-grow-1'>
                      <div className='fw-semibold'>{category.name}</div>
                      <small className='text-muted'>
                        {category.tutorialCount} tutorial(s)
                      </small>
                    </div>
                    <FaChevronRight className='text-muted' />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className='col-lg-9'>
          {/* Tutoriais em Destaque */}
          {!selectedCategory && featuredTutorials.length > 0 && (
            <section className='mb-5'>
              <div className='d-flex align-items-center justify-content-between mb-4'>
                <div>
                  <h2 className='fw-bold mb-1 text-start'>⭐ Mais Acessados</h2>
                  <p className='text-dark mb-0 text-start'>
                    Os tutoriais mais populares da nossa comunidade
                  </p>
                </div>
                <span className='badge bg-success fs-6'>
                  {featuredTutorials.length} tutoriais
                </span>
              </div>

              <div className='row g-4'>
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
            <div className='d-flex align-items-center justify-content-between mb-4'>
              <div>
                <h2 className='fw-bold mb-1'>
                  {selectedCategory
                    ? `📁 ${
                        categories.find(c => c.id === selectedCategory)?.name
                      }`
                    : '🕒 Tutoriais Recentes'}
                </h2>
                <p className='text-dark mb-0'>
                  {selectedCategory
                    ? 'Tutoriais desta categoria organizados por data'
                    : 'Conteúdo mais recente adicionado à plataforma'}
                </p>
              </div>
              <span className='badge bg-primary fs-6'>
                {displayTutorials.length} tutorial(s)
              </span>
            </div>

            {displayTutorials.length > 0 ? (
              <div className='row g-4'>
                {displayTutorials.map(tutorial => (
                  <div key={tutorial.id} className='col-md-6 col-xl-4'>
                    <TutorialCard tutorial={tutorial} />
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-5'>
                <div className='mb-4'>
                  <FaTerminal className='display-1 text-muted opacity-25' />
                </div>
                <h3 className='text-muted mb-3'>Nenhum tutorial encontrado</h3>
                <p className='text-muted mb-4'>
                  {selectedCategory
                    ? 'Não há tutoriais disponíveis nesta categoria no momento.'
                    : 'Nenhum tutorial disponível no momento. Volte em breve!'}
                </p>
                {selectedCategory && (
                  <button
                    className='btn btn-primary'
                    onClick={() => {
                      setSelectedCategory(null)
                      setFilteredTutorials(tutorials)
                    }}
                  >
                    Ver todos os tutoriais
                  </button>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default HomePage
