// src/components/TutorialImage.tsx - Versão aprimorada sem inline styles
import React, { useState } from 'react'
import { useImageUrl } from '../hooks/useImageUrl'
import '../styles/TutorialImage.css'

interface TutorialImageProps {
  imageName?: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
  showLoadingText?: boolean
  fallbackIcon?: string
  onLoad?: () => void
  onError?: (error: string) => void
  sizes?: string
  srcSet?: string
}

const TutorialImage: React.FC<TutorialImageProps> = ({
  imageName,
  alt,
  className = '',
  loading = 'lazy',
  showLoadingText = true,
  fallbackIcon = '🖼️',
  onLoad,
  onError,
  sizes,
  srcSet
}) => {
  const { imageUrl, loading: urlLoading, error } = useImageUrl(imageName)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className={`skeleton-loader ${className}`}>
      {showLoadingText && (
        <div className='text-center'>
          <div className='spinner-border text-secondary mb-2' role='status'>
            <span className='visually-hidden'>Carregando...</span>
          </div>
          <div className='small text-muted'>Carregando imagem...</div>
        </div>
      )}
    </div>
  )

  // Placeholder component
  const Placeholder = ({ message = 'Sem imagem' }: { message?: string }) => (
    <div className={`placeholder-image ${className}`}>
      <div className='text-center'>
        <div className='fs-1 mb-2' role='img' aria-label='Placeholder'>
          {fallbackIcon}
        </div>
        <div className='small'>{message}</div>
      </div>
    </div>
  )

  if (urlLoading) return <SkeletonLoader />
  if (!imageUrl || error) return <Placeholder message={error || 'Sem imagem'} />

  const handleImageLoad = () => {
    setImageLoaded(true)
    onLoad?.()
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Erro ao carregar imagem:', e)
    setImageError(true)
    onError?.(error || 'Erro ao carregar imagem')
  }

  if (imageError) return <Placeholder message='Erro ao carregar imagem' />

  return (
    <div className='position-relative'>
      {!imageLoaded && <SkeletonLoader />}

      <img
        src={imageUrl}
        alt={alt}
        className={`${className} ${
          !imageLoaded ? 'image-placeholder' : 'image-loaded'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={loading}
        sizes={sizes}
        srcSet={srcSet}
      />
    </div>
  )
}

export default TutorialImage

// Componentes específicos aprimorados usando CSS externo
export const TutorialCardImage: React.FC<{
  imageName?: string
  title: string
  lazy?: boolean
}> = ({ imageName, title, lazy = true }) => (
  <TutorialImage
    imageName={imageName}
    alt={`Imagem do tutorial: ${title}`}
    className='tutorial-card-image card-img-top'
    loading={lazy ? 'lazy' : 'eager'}
    fallbackIcon='📚'
  />
)

export const TutorialDetailImage: React.FC<{
  imageName?: string
  title: string
  responsive?: boolean
}> = ({ imageName, title, responsive = true }) => (
  <TutorialImage
    imageName={imageName}
    alt={`Imagem do tutorial: ${title}`}
    className={`tutorial-detail-image img-fluid rounded ${
      responsive ? 'w-100' : ''
    }`}
    loading='eager'
    fallbackIcon='📖'
  />
)

export const TutorialThumbnail: React.FC<{
  imageName?: string
  title: string
  size?: 'sm' | 'md' | 'lg'
}> = ({ imageName, title, size = 'md' }) => {
  const sizeClass = {
    sm: 'tutorial-thumbnail-sm',
    md: 'tutorial-thumbnail-md',
    lg: 'tutorial-thumbnail-lg'
  }

  return (
    <TutorialImage
      imageName={imageName}
      alt={`Miniatura: ${title}`}
      className={`rounded ${sizeClass[size]}`}
      loading='lazy'
      showLoadingText={false}
      fallbackIcon='🔗'
    />
  )
}

export const TutorialHeroImage: React.FC<{
  imageName?: string
  title: string
}> = ({ imageName, title }) => (
  <TutorialImage
    imageName={imageName}
    alt={`Imagem de destaque: ${title}`}
    className='tutorial-hero-image img-fluid rounded shadow-lg'
    loading='eager'
    fallbackIcon='🌟'
  />
)
