// src/components/CategorySection.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'
import { useTutorials } from '../hooks/useTutorials'

const CategorySection: React.FC = () => {
  const { categories } = useTutorials()

  return (
    <section aria-labelledby='categories-heading'>
      <div className='card shadow-sm category-section-card'>
        <div className='card-header bg-light'>
          <h2
            id='categories-heading'
            className='mb-1 fs-3 fw-bold text-primary d-flex align-items-center gap-2'
          >
            <span className='category-section-icon' aria-hidden='true'>
              📂 <span>Categorias</span>
            </span>
          </h2>
        </div>
        <div className='list-group list-group-flush'>
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/?category=${category.id}`}
              className='list-group-item list-group-item-action d-flex align-items-center text-decoration-none py-3 category-section-item'
              aria-label={`Ver tutoriais de ${category.name}`}
            >
              <span className='me-3 category-section-icon' aria-hidden='true'>
                {category.icon}
              </span>
              <div className='flex-grow-1'>
                <div className='d-flex justify-content-between align-items-start'>
                  <div>
                    <h3 className='fw-semibold text-dark category-section-title'>
                      {category.name}
                    </h3>
                    <p className='small text-muted mb-1 text-start category-section-description'>
                      {category.description}
                    </p>
                  </div>
                  <FaChevronRight
                    className='text-muted ms-2 flex-shrink-0 category-section-chevron'
                    aria-hidden='true'
                  />
                </div>
                <span className='text-muted d-block mt-1 category-section-count'>
                  {category.tutorialCount} tutorial
                  {category.tutorialCount !== 1 ? 's' : ''}
                </span>
              </div>
            </Link>
          ))}

          {categories.length === 0 && (
            <div className='list-group-item text-center text-muted py-4 category-section-empty'>
              <div className='mb-2 fs-5' aria-hidden='true'>
                📂
              </div>
              <p>Nenhuma categoria disponível</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
