// src/components/TutorialImage.tsx - Versão aprimorada
import React, { useState } from 'react'
import { useImageUrl } from '../hooks/useImageUrl'

interface TutorialImageProps {
  imageName?: string
  alt: string
  className?: string
  style?: React.CSSProperties
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
  style,
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
    <div
      className={`bg-light d-flex align-items-center justify-content-center ${className} skeleton-loader`}
      style={{
        minHeight: '200px',
        background:
          'linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%)',
        backgroundSize: '400% 100%',
        animation: 'skeleton 1.5s ease-in-out infinite',
        ...style
      }}
    >
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
    <div
      className={`bg-light d-flex align-items-center justify-content-center text-muted ${className} placeholder-image`}
      style={{
        minHeight: '200px',
        border: '2px dashed #dee2e6',
        ...style
      }}
    >
      <div className='text-center'>
        <div className='fs-1 mb-2' role='img' aria-label='Placeholder'>
          {fallbackIcon}
        </div>
        <div className='small'>{message}</div>
      </div>
    </div>
  )

  // Show skeleton while URL is loading
  if (urlLoading) {
    return <SkeletonLoader />
  }

  // Show placeholder if no image or error occurred
  if (!imageUrl || error) {
    return <Placeholder message={error || 'Sem imagem'} />
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    onLoad?.()
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Erro ao carregar imagem:', e)
    setImageError(true)
    onError?.(error || 'Erro ao carregar imagem')
  }

  // Show placeholder if image failed to load
  if (imageError) {
    return <Placeholder message='Erro ao carregar imagem' />
  }

  return (
    <div className='position-relative'>
      {/* Show skeleton until image loads */}
      {!imageLoaded && <SkeletonLoader />}

      <img
        src={imageUrl}
        alt={alt}
        className={`${className} ${
          !imageLoaded ? 'opacity-0 position-absolute' : ''
        }`}
        style={
          imageLoaded
            ? style
            : { ...style, top: 0, left: 0, width: '100%', height: '100%' }
        }
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        sizes={sizes}
        srcSet={srcSet}
      />
    </div>
  )
}

export default TutorialImage

// Componentes específicos aprimorados
export const TutorialCardImage: React.FC<{
  imageName?: string
  title: string
  lazy?: boolean
}> = ({ imageName, title, lazy = true }) => (
  <TutorialImage
    imageName={imageName}
    alt={`Imagem do tutorial: ${title}`}
    className='card-img-top'
    style={{
      height: '200px',
      objectFit: 'cover',
      width: '100%'
    }}
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
    className={`img-fluid rounded ${responsive ? 'w-100' : ''}`}
    style={{
      maxHeight: '400px',
      objectFit: 'cover',
      ...(responsive ? { width: '100%' } : {})
    }}
    loading='eager'
    fallbackIcon='📖'
  />
)

export const TutorialThumbnail: React.FC<{
  imageName?: string
  title: string
  size?: 'sm' | 'md' | 'lg'
}> = ({ imageName, title, size = 'md' }) => {
  const sizeMap = {
    sm: { width: '60px', height: '60px' },
    md: { width: '100px', height: '100px' },
    lg: { width: '150px', height: '150px' }
  }

  return (
    <TutorialImage
      imageName={imageName}
      alt={`Miniatura: ${title}`}
      className='rounded'
      style={{
        ...sizeMap[size],
        objectFit: 'cover'
      }}
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
    className='img-fluid rounded shadow-lg'
    style={{
      width: '100%',
      minHeight: '300px',
      maxHeight: '500px',
      objectFit: 'cover'
    }}
    loading='eager'
    fallbackIcon='🌟'
  />
)
