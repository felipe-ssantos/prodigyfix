// src/components/CategorySection.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'
import { useTutorials } from '../hooks/useTutorials'

const CategorySection: React.FC = () => {
  const { categories } = useTutorials()

  return (
    <div className='card shadow-sm'>
      <div className='card-header bg-light'>
        <h5 className='mb-0 fw-bold text-primary d-flex align-items-center gap-2'>
          <span>📂</span>
          <span>Categorias</span>
        </h5>
      </div>
      <div className='list-group list-group-flush'>
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/?category=${category.id}`}
            className='list-group-item list-group-item-action d-flex align-items-center text-decoration-none'
          >
            <span className='me-3 fs-5'>{category.icon}</span>
            <div className='flex-grow-1'>
              <div className='fw-semibold text-dark'>{category.name}</div>
              <small className='text-muted'>
                {category.tutorialCount} tutorial
                {category.tutorialCount !== 1 ? 's' : ''}
              </small>
            </div>
            <FaChevronRight className='text-muted' size={12} />
          </Link>
        ))}

        {categories.length === 0 && (
          <div className='list-group-item text-center text-muted py-4'>
            <div className='mb-2'>📂</div>
            <div>Nenhuma categoria disponível</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategorySection
