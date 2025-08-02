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
          <span className='fs-5'>📂</span> {/* Tamanho padronizado */}
          <span>Categorias</span>
        </h5>
      </div>
      <div className='list-group list-group-flush'>
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/?category=${category.id}`}
            className='list-group-item list-group-item-action d-flex align-items-center text-decoration-none py-3'
            aria-label={`Ver tutoriais de ${category.name}`}
          >
            <span className='me-3 fs-5'>{category.icon}</span>{' '}
            {/* Tamanho igual ao ícone da header */}
            <div className='flex-grow-1'>
              <div className='fw-semibold text-dark'>{category.name}</div>
              <div className='small text-muted mb-1 text-start'>
                {category.description}
              </div>
              <small className='text-muted'>
                {category.tutorialCount} tutorial
                {category.tutorialCount !== 1 ? 's' : ''}
              </small>
            </div>
            <FaChevronRight className='text-muted ms-2' size={14} />{' '}
            {/* Aumentado para 14px */}
          </Link>
        ))}

        {categories.length === 0 && (
          <div className='list-group-item text-center text-muted py-4'>
            <div className='mb-2 fs-5'>📂</div> {/* Tamanho consistente */}
            <div>Nenhuma categoria disponível</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategorySection
