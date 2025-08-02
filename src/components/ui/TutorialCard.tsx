//src\components\ui\TutorialCard.tsx
import { Link } from 'react-router-dom'
import { FaClock, FaEye, FaStar } from 'react-icons/fa'
import type { Tutorial } from '../../types'

interface TutorialCardProps {
  tutorial: Tutorial
  showCategory?: boolean
}

const TutorialCard = ({ tutorial, showCategory = true }: TutorialCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'success'
      case 'Intermediário':
        return 'warning'
      case 'Avançado':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'Iniciante'
      case 'Intermediário':
        return 'Intermediário'
      case 'Avançado':
        return 'Avançado'
      default:
        return difficulty
    }
  }

  const formatCategoryName = (category: string) => {
    return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className='card h-100 shadow-sm hover-shadow border-0'>
      {/* Header do Card */}
      <div className='card-header bg-white border-0 pb-2'>
        <div className='d-flex justify-content-between align-items-start'>
          {showCategory && (
            <span className='badge bg-primary'>
              {formatCategoryName(tutorial.category)}
            </span>
          )}
        </div>
      </div>

      <div className='card-body d-flex flex-column'>
        {/* Título */}
        <h5 className='card-title mb-3'>
          <Link
            to={`/tutorial/${tutorial.id}`}
            className='text-decoration-none text-dark stretched-link'
          >
            {tutorial.title}
          </Link>
        </h5>

        {/* Descrição */}
        <p className='card-text text-muted flex-grow-1 mb-3'>
          {tutorial.description.length > 120
            ? `${tutorial.description.substring(0, 120)}...`
            : tutorial.description}
        </p>

        {/* Metadata */}
        <div className='mt-auto'>
          {/* Badges de informação */}
          <div className='d-flex flex-wrap gap-2 mb-3'>
            <span className='badge bg-light text-dark border'>
              <FaClock className='me-1' size={12} />
              {tutorial.estimatedTime} min
            </span>
            <span
              className={`badge bg-${getDifficultyColor(tutorial.difficulty)}`}
            >
              <FaStar className='me-1' size={12} />
              {getDifficultyText(tutorial.difficulty)}
            </span>
            <span className='badge bg-light text-dark border'>
              <FaEye className='me-1' size={12} />
              {tutorial.views.toLocaleString()}
            </span>
          </div>

          {/* Tags */}
          <div className='mb-3'>
            {tutorial.tags.slice(0, 3).map((tag: string, index: number) => (
              <span key={index} className='badge bg-secondary me-1 mb-1'>
                #{tag}
              </span>
            ))}
            {tutorial.tags.length > 3 && (
              <span className='badge bg-light text-muted border'>
                +{tutorial.tags.length - 3} mais
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='card-footer bg-light border-0'>
        <div className='d-flex justify-content-between align-items-center text-muted small'>
          <div>
            <strong>Por:</strong> {tutorial.author}
          </div>
          <div>{new Date(tutorial.createdAt).toLocaleDateString('pt-BR')}</div>
        </div>
      </div>
    </div>
  )
}

export default TutorialCard
