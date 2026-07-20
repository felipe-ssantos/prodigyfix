import React from 'react'

interface TutorialPreviewProps {
  title: string
  description: string
  imageSrc: string
  difficulty: string
  categoryName: string
  categoryIcon: string
  estimatedTime: number
  tags: string[]
}

const getDifficultyConfig = (difficulty: string) => {
  switch (difficulty) {
    case 'Iniciante':
      return { color: 'success', icon: '🟢' }
    case 'Intermediário':
      return { color: 'warning', icon: '🟡' }
    case 'Avançado':
      return { color: 'danger', icon: '🔴' }
    default:
      return { color: 'secondary', icon: '⚪' }
  }
}

const TutorialPreview: React.FC<TutorialPreviewProps> = ({
  title,
  description,
  imageSrc,
  difficulty,
  categoryName,
  categoryIcon,
  estimatedTime,
  tags
}) => {
  const diffConfig = getDifficultyConfig(difficulty)

  return (
    <div className='bg-white rounded-3 shadow-sm p-4 border'>
      <div className='d-flex gap-2 flex-wrap mb-3'>
        <span className={`badge bg-${diffConfig.color}`}>
          {diffConfig.icon} {difficulty}
        </span>
        <span className='badge bg-primary'>
          {categoryIcon} {categoryName || 'Sem categoria'}
        </span>
      </div>

      <h3 className='fw-bold mb-2'>{title || 'Título do tutorial'}</h3>
      <p className='text-muted mb-3'>
        {description || 'A descrição aparecerá aqui'}
      </p>

      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title}
          className='img-fluid rounded mb-3'
          style={{ maxHeight: '280px', width: '100%', objectFit: 'cover' }}
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        <div
          className='rounded mb-3 bg-light d-flex align-items-center justify-content-center text-muted'
          style={{ height: '200px' }}
        >
          Sem imagem de capa
        </div>
      )}

      <div className='d-flex gap-3 text-muted small mb-3'>
        <span><i className='fas fa-clock me-1'></i>{estimatedTime} min</span>
      </div>

      {tags.length > 0 && (
        <div className='d-flex flex-wrap gap-2'>
          {tags.map((tag, i) => (
            <span key={i} className='badge bg-light text-dark border'>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default TutorialPreview