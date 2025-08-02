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
        <h5 className='mb-0 fw-bold text-primary'>📂 Categorias</h5>
      </div>
      <div className='list-group list-group-flush'>
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/?category=${category.id}`}
            className='list-group-item list-group-item-action d-flex align-items-center'
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
  )
}

export default CategorySection
