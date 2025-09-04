// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaTerminal } from 'react-icons/fa'
import { useTutorials } from '../hooks/useTutorials'
import TutorialCard from '../components/ui/TutorialCard'
import CategorySection from '../components/CategorySection'
import '../styles/HomePage.css'

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
      {/* Active Filter Banner */}
      {selectedCategory && selectedCategoryData && (
        <div className='row mb-4'>
          <div className='col-12'>
            <div className='alert alert-info border-0 shadow-sm'>
              <div className='row align-items-center'>
                <div className='col-md-10'>
                  <div className='d-flex align-items-center gap-2 mb-2'>
                    <span className='fs-4'>{selectedCategoryData.icon}</span>
                    <h2 className='mb-0 h4'>{selectedCategoryData.name}</h2>
                    <span className='badge bg-primary'>
                      {filteredTutorials.length} tutorial
                      {filteredTutorials.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className='mb-0 text-muted'>
                    {selectedCategoryData.description}
                  </p>
                </div>
                <div className='col-md-2 text-end'>
                  <Link
                    to='/'
                    className='btn btn-outline-primary btn-sm'
                    aria-label='Limpar filtro de categoria'
                  >
                    Limpar filtro
                  </Link>
                </div>
              </div>
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
          {/* Recent Tutorials Section - Show first when no filter */}
          {!selectedCategory && (
            <section className='recent-tutorials-section mb-5'>
              <header className='mb-4'>
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <div className='d-flex align-items-center gap-2 mb-1'>
                      <span className='fs-3'>🕒</span>
                      <h2 className='fw-bold mb-0'>Tutoriais Recentes</h2>
                    </div>
                    <p className='text-muted mb-0'>
                      Conteúdo mais recente adicionado à plataforma
                    </p>
                  </div>
                  <span className='badge bg-primary fs-6'>
                    {recentTutorials.length} tutorial
                    {recentTutorials.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </header>

              <div className='row g-4'>
                {recentTutorials.map(tutorial => (
                  <div key={tutorial.id} className='col-md-6 col-xl-4'>
                    <TutorialCard tutorial={tutorial} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Featured Tutorials by Category - Show after recent when no filter */}
          {!selectedCategory && featuredTutorialsByCategory.length > 0 && (
            <section className='mb-5'>
              <header className='mb-4'>
                <div className='d-flex align-items-center gap-2 mb-2'>
                  <span className='fs-3'>⭐</span>
                  <h2 className='fw-bold mb-0'>Destaques por Categoria</h2>
                </div>
              </header>

              <div className='featured-categories-container'>
                {featuredTutorialsByCategory.map((category, index) => (
                  <div
                    key={category.id}
                    className={`featured-category-section ${
                      index < featuredTutorialsByCategory.length - 1
                        ? 'mb-5'
                        : 'mb-4'
                    }`}
                  >
                    {/* Category Header */}
                    <div className='category-header mb-3'>
                      <div className='d-flex align-items-center justify-content-between flex-wrap gap-2'>
                        <div className='d-flex align-items-center gap-2'>
                          <span className='fs-4'>{category.icon}</span>
                          <h3 className='h5 mb-0 fw-bold'>{category.name}</h3>
                          <span className='badge bg-secondary'>
                            {category.tutorialCount} total
                          </span>
                        </div>
                        <Link
                          to={`/?category=${category.id}`}
                          className='btn btn-outline-primary btn-sm d-flex align-items-center gap-1'
                          aria-label={`Ver todos os tutoriais de ${category.name}`}
                        >
                          <span>Ver todos</span>
                          <span>→</span>
                        </Link>
                      </div>
                      <p className='text-muted small mb-0 mt-1'>
                        {category.description}
                      </p>
                    </div>

                    {/* Category Cards */}
                    <div className='row g-3'>
                      {category.tutorials.map(tutorial => (
                        <div key={tutorial.id} className='col-md-6 col-xl-4'>
                          <TutorialCard
                            tutorial={tutorial}
                            showCategory={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Filtered Tutorials Section - Show when category is selected */}
          {selectedCategory && (
            <section className='filtered-tutorials-section'>
              <header className='mb-4'>
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <div className='d-flex align-items-center gap-2 mb-1'>
                      <span className='fs-3'>📁</span>
                      <h2 className='fw-bold mb-0'>
                        {selectedCategoryData?.name}
                      </h2>
                    </div>
                    <p className='text-muted mb-0'>
                      {selectedCategoryData?.description ||
                        'Tutoriais desta categoria organizados por data'}
                    </p>
                  </div>
                  <span className='badge bg-primary fs-6'>
                    {displayTutorials.length} tutorial
                    {displayTutorials.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </header>

              {displayTutorials.length > 0 ? (
                <div className='row g-4'>
                  {displayTutorials.map(tutorial => (
                    <div key={tutorial.id} className='col-md-6 col-xl-4'>
                      <TutorialCard tutorial={tutorial} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='empty-state text-center py-5'>
                  <div className='mb-4'>
                    <FaTerminal className='display-1 text-muted opacity-25' />
                  </div>
                  <h3 className='text-muted mb-3'>
                    Nenhum tutorial encontrado
                  </h3>
                  <p className='text-muted mb-4'>
                    Não há tutoriais disponíveis nesta categoria no momento.
                  </p>
                  <Link
                    to='/'
                    className='btn btn-primary'
                    aria-label='Voltar para todos os tutoriais'
                  >
                    Ver todos os tutoriais
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* Empty State for No Tutorials at All */}
          {!selectedCategory && tutorials.length === 0 && (
            <div className='empty-state text-center py-5'>
              <div className='mb-4'>
                <FaTerminal className='display-1 text-muted opacity-25' />
              </div>
              <h3 className='text-muted mb-3'>Nenhum tutorial disponível</h3>
              <p className='text-muted mb-4'>
                Nenhum tutorial disponível no momento. Volte em breve!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default HomePage
