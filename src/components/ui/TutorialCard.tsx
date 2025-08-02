//src\components\ui\TutorialCard.tsx
import { Link } from 'react-router-dom'
import { FaHeart, FaClock, FaEye, FaStar } from 'react-icons/fa'
import type { Tutorial } from '../../types'
import { useTutorials } from '../../contexts/TutorialContext'

interface TutorialCardProps {
  tutorial: Tutorial
  showCategory?: boolean
}

const TutorialCard = ({ tutorial, showCategory = true }: TutorialCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useTutorials()
  const isFavorited = isFavorite(tutorial.id)

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorited) {
      removeFromFavorites(tutorial.id)
    } else {
      addToFavorites(tutorial.id)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'success'
      case 'intermediate':
        return 'warning'
      case 'advanced':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  }

  return (
    <div className='card h-100 shadow-sm hover-shadow'>
      <div className='card-body d-flex flex-column'>
        <div className='d-flex justify-content-between align-items-start mb-2'>
          {showCategory && (
            <span className='badge bg-primary'>
              {tutorial.category.replace('-', ' ')}
            </span>
          )}
          <button
            onClick={handleFavoriteToggle}
            className={`btn btn-sm ${
              isFavorited ? 'btn-danger' : 'btn-outline-danger'
            }`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={
              isFavorited ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <FaHeart size={14} />
          </button>
        </div>

        <h5 className='card-title mb-2'>
          <Link
            to={`/tutorial/${tutorial.id}`}
            className='text-decoration-none text-dark'
          >
            {tutorial.title}
          </Link>
        </h5>

        <p className='card-text text-muted flex-grow-1'>
          {tutorial.description}
        </p>

        <div className='mt-auto'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <div className='d-flex gap-2'>
              <span className='badge bg-secondary'>
                <FaClock className='me-1' />
                {tutorial.estimatedTime} min de leitura
              </span>
              <span
                className={`badge bg-${getDifficultyColor(
                  tutorial.difficulty
                )}`}
              >
                <FaStar className='me-1' />
                {getDifficultyText(tutorial.difficulty)}
              </span>
            </div>
            <small className='text-muted'>
              <FaEye className='me-1' />
              {tutorial.views.toLocaleString()}
            </small>
          </div>

          <div className='d-flex flex-wrap gap-1'>
            {tutorial.tags.slice(0, 3).map((tag: string, index: number) => (
              <span key={index} className='badge bg-light text-dark'>
                {tag}
              </span>
            ))}
            {tutorial.tags.length > 3 && (
              <span className='badge bg-light text-dark'>
                +{tutorial.tags.length - 3} mais
              </span>
            )}
          </div>
        </div>
      </div>

      <div className='card-footer bg-transparent'>
        <div className='d-flex justify-content-between align-items-center'>
          <small className='text-muted'>{tutorial.author}</small>
          <small className='text-muted'>
            Publicado em: {new Date(tutorial.createdAt).toLocaleDateString()}
          </small>
        </div>
      </div>
    </div>
  )
}

export default TutorialCard
