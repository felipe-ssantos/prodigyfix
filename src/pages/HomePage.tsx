//src\pages\HomePage.tsx
import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaFire, FaClock, FaStar } from 'react-icons/fa'
import { useTutorials } from '../contexts/TutorialContext'
import TutorialCard from '../components/ui/TutorialCard'
import CategoryCard from '../components/ui/CategoryCard'

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
    .slice(0, 3)
  
  const recentTutorials = tutorials
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6)
  
  const displayTutorials = selectedCategory
    ? filteredTutorials
    : recentTutorials

  return (
    <div className='container py-4'>
      {/* Hero Section */}
      <div className='row mb-5'>
        <div className='col-lg-8 mx-auto text-center'>
          <h1 className='display-4 fw-bold mb-3'>
            Welcome to <span className='text-primary'>Bootpedia</span>
          </h1>
          <p className='lead text-muted mb-4'>
            Your comprehensive guide to Hiren's Boot tools and system recovery
            techniques. Learn data recovery, system repair, and disk management
            with step-by-step tutorials.
          </p>
          <div className='d-flex justify-content-center gap-3'>
            <span className='badge bg-primary fs-6'>
              <FaFire className='me-1' />
              {tutorials.length} Tutorials
            </span>
            <span className='badge bg-success fs-6'>
              <FaStar className='me-1' />
              {categories.length} Categories
            </span>
            <span className='badge bg-info fs-6'>
              <FaClock className='me-1' />
              Updated Daily
            </span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className='mb-5'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h2 className='mb-0'>Browse by Category</h2>
          <Link to='/categories' className='btn btn-outline-primary'>
            View All Categories
          </Link>
        </div>
        <div className='row g-4'>
          {categories.map(category => (
            <div key={category.id} className='col-md-6 col-lg-4'>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tutorials */}
      <section className='mb-5'>
        <h2 className='mb-4'>
          <FaFire className='me-2 text-danger' />
          Featured Tutorials
        </h2>
        <div className='row g-4'>
          {featuredTutorials.map(tutorial => (
            <div key={tutorial.id} className='col-md-6 col-lg-4'>
              <TutorialCard tutorial={tutorial} />
            </div>
          ))}
        </div>
      </section>

      {/* Tutorials by Category or Recent */}
      <section>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h2 className='mb-0'>
            {selectedCategory
              ? `${
                  categories.find(c => c.id === selectedCategory)?.name
                } Tutorials`
              : 'Recent Tutorials'}
          </h2>
          {selectedCategory && (
            <button
              className='btn btn-outline-secondary'
              onClick={() => {
                setSelectedCategory(null)
                setFilteredTutorials(tutorials)
              }}
            >
              Clear Filter
            </button>
          )}
        </div>

        {displayTutorials.length > 0 ? (
          <div className='row g-4'>
            {displayTutorials.map(tutorial => (
              <div key={tutorial.id} className='col-md-6 col-lg-4'>
                <TutorialCard tutorial={tutorial} />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-5'>
            <div className='mb-3'>
              <span className='display-1 text-muted'>🔍</span>
            </div>
            <h4 className='text-muted'>No tutorials found</h4>
            <p className='text-muted'>
              {selectedCategory
                ? `No tutorials found in this category.`
                : 'No tutorials available at the moment.'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
