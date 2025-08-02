// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaTerminal } from 'react-icons/fa'
import { useTutorials } from '../hooks/useTutorials'
import TutorialCard from '../components/ui/TutorialCard'
import CategorySection from '../components/CategorySection'

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

  // Get featured tutorials grouped by category
  const featuredTutorialsByCategory = categories
    .map(category => ({
      ...category,
      tutorials: tutorials
        .filter(t => t.category === category.id)
        .sort((a, b) => b.views - a.views)
        .slice(0, 3)
    }))
    .filter(category => category.tutorials.length > 0)

  const recentTutorials = tutorials
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 12)

  const displayTutorials = selectedCategory
    ? filteredTutorials
    : recentTutorials

  const selectedCategoryData = categories.find(c => c.id === selectedCategory)

  return (
    <div className='container-fluid py-4'>
      {/* Active Filter */}
      {selectedCategory && selectedCategoryData && (
        <div className='row mb-4'>
          <div className='col-12'>
            <div className='alert alert-info d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center gap-2'>
                <span>{selectedCategoryData.icon}</span>
                <div>
                  <strong>Categoria selecionada:</strong>{' '}
                  {selectedCategoryData.name}
                  <span className='badge bg-primary ms-2'>
                    {filteredTutorials.length} tutorial
                    {filteredTutorials.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <Link to='/' className='btn btn-outline-primary btn-sm'>
                Limpar filtro
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className='row'>
        {/* Sidebar with Categories */}
        <aside className='col-lg-3 mb-4'>
          <div className='position-sticky top-0 pt-2'>
            <CategorySection />
          </div>
        </aside>

        {/* Main Content */}
        <main className='col-lg-9'>
          {/* Featured Tutorials by Category */}
          {!selectedCategory && featuredTutorialsByCategory.length > 0 && (
            <section className='mb-5'>
              <div className='d-flex align-items-center justify-content-between mb-4'>
                <div>
                  <h2 className='fw-bold mb-1 text-start d-flex align-items-center gap-2'>
                    <span>⭐</span>
                    <span>Destaques por Categoria</span>
                  </h2>
                  <p className='text-dark mb-0 text-start'>
                    Os tutoriais mais populares em cada categoria
                  </p>
                </div>
              </div>

              {featuredTutorialsByCategory.map(category => (
                <div key={category.id} className='mb-4'>
                  <div className='d-flex align-items-center mb-3 gap-2'>
                    <h3 className='fw-bold mb-0 d-flex align-items-center gap-2'>
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </h3>
                    <span className='badge bg-primary'>
                      {category.tutorialCount} tutorial
                      {category.tutorialCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className='row g-4'>
                    {category.tutorials.map(tutorial => (
                      <div key={tutorial.id} className='col-md-6 col-xl-4'>
                        <TutorialCard
                          tutorial={tutorial}
                          showCategory={false}
                        />
                      </div>
                    ))}
                  </div>
                  <div className='text-end mt-2'>
                    <Link
                      to={`/?category=${category.id}`}
                      className='btn btn-sm btn-outline-primary'
                    >
                      Ver todos em {category.name} →
                    </Link>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Main Tutorial List */}
          <section>
            <div className='d-flex align-items-center justify-content-between mb-4'>
              <div>
                <h2 className='fw-bold mb-1 d-flex align-items-center gap-2'>
                  {selectedCategory && selectedCategoryData ? (
                    <>
                      <span>📁</span>
                      <span>{selectedCategoryData.name}</span>
                    </>
                  ) : (
                    <>
                      <span>🕒</span>
                      <span>Tutoriais Recentes</span>
                    </>
                  )}
                </h2>
                <p className='text-dark mb-0'>
                  {selectedCategory
                    ? 'Tutoriais desta categoria organizados por data'
                    : 'Conteúdo mais recente adicionado à plataforma'}
                </p>
              </div>
              <span className='badge bg-primary fs-6'>
                {displayTutorials.length} tutorial
                {displayTutorials.length !== 1 ? 's' : ''}
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
                  <Link to='/' className='btn btn-primary'>
                    Ver todos os tutoriais
                  </Link>
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
