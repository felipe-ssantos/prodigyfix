// src/components/ui/TutorialCard.tsx
import { Link } from 'react-router-dom'
import { FaClock, FaEye, FaStar } from 'react-icons/fa'
import { useTutorials } from '../../hooks/useTutorials'
import type { Tutorial } from '../../types'

interface TutorialCardProps {
  tutorial: Tutorial
  showCategory?: boolean
}

const TutorialCard = ({ tutorial, showCategory = true }: TutorialCardProps) => {
  const { categories } = useTutorials()

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

  // Buscar o nome da categoria pelo ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  // Buscar o ícone da categoria pelo ID
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : '📁'
  }

  const categoryName = getCategoryName(tutorial.category)
  const categoryIcon = getCategoryIcon(tutorial.category)

  return (
    <div className='card h-100 shadow-sm hover-shadow border-0'>
      {/* Card Header */}
      <div className='card-header bg-white border-0 pb-2'>
        <div className='d-flex justify-content-between align-items-start'>
          {showCategory && (
            <span className='badge bg-primary d-flex align-items-center gap-1'>
              <span>{categoryIcon}</span>
              <span>{categoryName}</span>
            </span>
          )}
        </div>
      </div>

      <div className='card-body d-flex flex-column'>
        {/* Title */}
        <h5 className='card-title mb-3'>
          <Link
            to={`/tutorial/${tutorial.id}`}
            className='text-decoration-none text-dark stretched-link'
          >
            {tutorial.title}
          </Link>
        </h5>

        {/* Description */}
        <p className='card-text text-muted flex-grow-1 mb-3'>
          {tutorial.description.length > 120
            ? `${tutorial.description.substring(0, 120)}...`
            : tutorial.description}
        </p>

        {/* Metadata */}
        <div className='mt-auto'>
          {/* Information badges */}
          <div className='d-flex flex-wrap gap-2 mb-3'>
            <span className='badge bg-light text-dark border d-flex align-items-center gap-1'>
              <FaClock size={12} />
              <span>{tutorial.estimatedTime} min</span>
            </span>
            <span
              className={`badge bg-${getDifficultyColor(
                tutorial.difficulty
              )} d-flex align-items-center gap-1`}
            >
              <FaStar size={12} />
              <span>{getDifficultyText(tutorial.difficulty)}</span>
            </span>
            <span className='badge bg-light text-dark border d-flex align-items-center gap-1'>
              <FaEye size={12} />
              <span>{tutorial.views.toLocaleString()}</span>
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
            <strong>Por:</strong> Prodigy Informática
          </div>
          <div>{new Date(tutorial.createdAt).toLocaleDateString('pt-BR')}</div>
        </div>
      </div>
    </div>
  )
}

export default TutorialCard
