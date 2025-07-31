//src\components\ui\CategoryCard.tsx
import { Link } from 'react-router-dom'
import type { Category } from '../../types'

interface CategoryCardProps {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/?category=${category.id}`} className='text-decoration-none'>
      <div className='card h-100 shadow-sm hover-shadow transition-all'>
        <div className='card-body text-center'>
          <div className='mb-3'>
            <span className='display-4'>{category.icon}</span>
          </div>

          <h5 className='card-title text-dark mb-2'>{category.name}</h5>

          <p className='card-text text-muted mb-3'>{category.description}</p>

          <div className='d-flex justify-content-center align-items-center'>
            <span className='badge bg-primary'>
              {category.tutorialCount}{' '}
              {category.tutorialCount === 1 ? 'tutorial' : 'tutorials'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
