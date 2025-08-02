// src/pages/TutorialPage.tsx
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaEye,
  FaStar,
  FaShare,
  FaPrint,
  FaHome,
  FaCalendarAlt,
  FaCheck
} from 'react-icons/fa'
import { useTutorials } from '../hooks/useTutorials'
import type { Tutorial } from '../types'

const TutorialPage = () => {
  const { id } = useParams<{ id: string }>()
  const {
    getTutorialById,
    getNextTutorial,
    getPreviousTutorial,
    getTutorialsByCategory,
    categories,
    incrementViews
  } = useTutorials()

  const [tutorial, setTutorial] = useState<Tutorial | undefined>(undefined)
  const [relatedTutorials, setRelatedTutorials] = useState<Tutorial[]>([])
  const [shareSuccess, setShareSuccess] = useState(false)
  const hasIncrementedViews = useRef(false) // Referência para controlar o incremento

  useEffect(() => {
    if (id) {
      const foundTutorial = getTutorialById(id)
      setTutorial(foundTutorial)

      if (foundTutorial) {
        // Incrementar visualizações apenas uma vez por sessão
        if (!hasIncrementedViews.current) {
          incrementViews(id)
          hasIncrementedViews.current = true
        }

        const related = getTutorialsByCategory(foundTutorial.category)
          .filter(t => t.id !== id)
          .slice(0, 3)
        setRelatedTutorials(related)
        document.title = `${foundTutorial.title} - Tutorial`
      }
    }
  }, [id, getTutorialById, getTutorialsByCategory, incrementViews])

  // Função para buscar nome da categoria
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  // Função para buscar ícone da categoria
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : '📁'
  }

  if (!tutorial) {
    return (
      <div className='container-fluid py-5'>
        <div className='row justify-content-center'>
          <div className='col-md-6 text-center'>
            <div className='mb-4'>
              <div className='mb-3 display-1 text-muted'>📄</div>
              <h1 className='display-4 text-muted'>404</h1>
              <h2 className='h4 mb-4'>Tutorial não encontrado</h2>
              <p className='text-muted mb-4'>
                O tutorial que você está procurando não existe ou foi removido.
              </p>
              <div className='d-flex gap-2 justify-content-center'>
                <Link to='/' className='btn btn-primary'>
                  <FaHome className='me-2' />
                  Voltar para Home
                </Link>
                <button
                  type='button'
                  onClick={() => window.history.back()}
                  className='btn btn-outline-secondary'
                >
                  <FaArrowLeft className='me-2' />
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const nextTutorial = getNextTutorial(tutorial.id)
  const prevTutorial = getPreviousTutorial(tutorial.id)

  const handleShare = async () => {
    const shareData = {
      title: tutorial.title,
      text: tutorial.description,
      url: window.location.href
    }

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Error sharing:', err)
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 3000)
      } catch (clipboardErr) {
        console.error('Clipboard error:', clipboardErr)
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return { color: 'success', icon: '🟢', text: 'Iniciante' }
      case 'Intermediário':
        return { color: 'warning', icon: '🟡', text: 'Intermediário' }
      case 'Avançado':
        return { color: 'danger', icon: '🔴', text: 'Avançado' }
      default:
        return { color: 'secondary', icon: '⚪', text: 'Desconhecido' }
    }
  }

  const difficultyConfig = getDifficultyConfig(tutorial.difficulty)
  const categoryName = getCategoryName(tutorial.category)
  const categoryIcon = getCategoryIcon(tutorial.category)

  return (
    <div className='w-100 py-4 min-vh-100'>
      {/* Success Toast for Share */}
      {shareSuccess && (
        <div className='position-fixed top-0 end-0 p-3 toast-success'>
          <div className='toast show bg-success text-white' role='alert'>
            <div className='d-flex'>
              <div className='toast-body'>
                <FaCheck className='me-2' />
                Link copiado para a área de transferência!
              </div>
              <button
                type='button'
                className='btn-close btn-close-white me-2 m-auto'
                onClick={() => setShareSuccess(false)}
                aria-label='Link copy'
              />
            </div>
          </div>
        </div>
      )}

      <div className='container-fluid px-4'>
        {/* Breadcrumb */}
        <nav className='mb-4'>
          <ol className='breadcrumb mb-0 bg-light px-3 py-2 rounded'>
            <li className='breadcrumb-item'>
              <Link to='/' className='text-decoration-none'>
                <FaHome className='me-1' size={12} />
                Home
              </Link>
            </li>
            <li className='breadcrumb-item'>
              <Link
                to={`/?category=${encodeURIComponent(tutorial.category)}`}
                className='text-decoration-none d-flex align-items-center gap-1'
              >
                <span>{categoryIcon}</span>
                <span>{categoryName}</span>
              </Link>
            </li>
            <li className='breadcrumb-item active text-truncate'>
              {tutorial.title}
            </li>
          </ol>
        </nav>

        <div className='row gx-4'>
          {/* Main Content */}
          <div className='col-lg-8'>
            <article className='bg-white rounded-3 shadow-sm p-4 tutorial-article'>
              {/* Header */}
              <header className='mb-5'>
                <div className='d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2'>
                  <div className='d-flex gap-2 flex-wrap'>
                    <span
                      className={`badge bg-${difficultyConfig.color} d-flex align-items-center gap-1`}
                    >
                      <span>{difficultyConfig.icon}</span>
                      <span>{difficultyConfig.text}</span>
                    </span>
                    <span className='badge bg-primary d-flex align-items-center gap-1'>
                      <span>{categoryIcon}</span>
                      <span>{categoryName}</span>
                    </span>
                  </div>
                </div>

                <h1 className='fw-bold mb-3 display-6'>{tutorial.title}</h1>
                <p className='lead text-muted mb-4'>{tutorial.description}</p>

                {/* Cover Image */}
                {tutorial.imageUrl && (
                  <div className='mb-4 tutorial-cover-image'>
                    <img
                      src={tutorial.imageUrl}
                      alt={tutorial.title}
                      className='img-fluid rounded shadow-sm w-100'
                    />
                  </div>
                )}

                {/* Meta info */}
                <div className='row g-3 text-muted small border-bottom pb-3 mb-4'>
                  <div className='col-sm-6 col-md-3'>
                    <div className='d-flex align-items-center'>
                      <FaClock className='me-2 text-primary' />
                      <span>{tutorial.estimatedTime} min de leitura</span>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-3'>
                    <div className='d-flex align-items-center'>
                      <FaEye className='me-2 text-primary' />
                      <span>
                        {tutorial.views.toLocaleString()} visualizações
                      </span>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-3'>
                    <div className='d-flex align-items-center'>
                      <FaStar className='me-2 text-primary' />
                      <span>{tutorial.author}</span>
                    </div>
                  </div>
                  <div className='col-sm-6 col-md-3'>
                    <div className='d-flex align-items-center'>
                      <FaCalendarAlt className='me-2 text-primary' />
                      <span>
                        {new Date(tutorial.createdAt).toLocaleDateString(
                          'pt-BR'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {tutorial.tags.length > 0 && (
                  <div className='mb-4'>
                    <h6 className='text-muted mb-2'>Tags:</h6>
                    <div className='d-flex flex-wrap gap-2'>
                      {tutorial.tags.map((tag, index) => (
                        <span
                          key={index}
                          className='badge bg-light text-dark border'
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </header>

              {/* Content */}
              <div className='tutorial-content mb-5'>
                <div
                  dangerouslySetInnerHTML={{ __html: tutorial.content }}
                  className='lh-lg'
                />
              </div>

              {/* Quick Actions */}
              <div className='border-top pt-4 mb-4'>
                <div className='row'>
                  <div className='col-md-6'>
                    <h6 className='fw-semibold mb-3 d-flex align-items-center'>
                      <span className='me-2'>⚡</span>
                      Ações Rápidas
                    </h6>
                    <div className='d-flex gap-2 flex-wrap'>
                      <button
                        type='button'
                        onClick={handleShare}
                        className='btn btn-outline-primary btn-sm'
                      >
                        <FaShare className='me-2' size={14} />
                        Compartilhar
                      </button>
                      <button
                        type='button'
                        onClick={handlePrint}
                        className='btn btn-outline-secondary btn-sm d-print-none'
                      >
                        <FaPrint className='me-2' size={14} />
                        Imprimir
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className='d-flex justify-content-between mt-5 pt-4 border-top tutorial-navigation'>
                {prevTutorial ? (
                  <Link
                    to={`/tutorial/${prevTutorial.id}`}
                    className='btn btn-outline-primary d-flex align-items-center text-decoration-none tutorial-nav-btn'
                  >
                    <FaArrowLeft className='me-2 flex-shrink-0' />
                    <div className='text-start'>
                      <small className='d-block text-muted'>Anterior</small>
                      <span className='text-truncate d-block'>
                        {prevTutorial.title}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextTutorial ? (
                  <Link
                    to={`/tutorial/${nextTutorial.id}`}
                    className='btn btn-outline-primary d-flex align-items-center text-decoration-none tutorial-nav-btn'
                  >
                    <div className='text-end'>
                      <small className='d-block text-muted'>Próximo</small>
                      <span className='text-truncate d-block'>
                        {nextTutorial.title}
                      </span>
                    </div>
                    <FaArrowRight className='ms-2 flex-shrink-0' />
                  </Link>
                ) : (
                  <div></div>
                )}
              </nav>
            </article>
          </div>

          {/* Sidebar */}
          <div className='col-lg-4'>
            <div className='position-sticky top-0 pt-2'>
              {/* Related Tutorials */}
              {relatedTutorials.length > 0 && (
                <div className='card border-0 shadow-sm mb-4'>
                  <div className='card-header bg-white border-bottom'>
                    <h6 className='mb-0 fw-semibold d-flex align-items-center gap-2'>
                      <span>🔗</span>
                      <span>Tutoriais Relacionados</span>
                    </h6>
                  </div>
                  <div className='card-body'>
                    <div className='d-flex flex-column gap-3'>
                      {relatedTutorials.map(relatedTutorial => (
                        <div
                          key={relatedTutorial.id}
                          className='border-bottom border-light pb-3 last-child-no-border'
                        >
                          <Link
                            to={`/tutorial/${relatedTutorial.id}`}
                            className='text-decoration-none'
                          >
                            <h6 className='text-dark mb-2 fw-semibold'>
                              {relatedTutorial.title}
                            </h6>
                            <p className='text-muted mb-3 small'>
                              {relatedTutorial.description.length > 100
                                ? `${relatedTutorial.description.substring(
                                    0,
                                    100
                                  )}...`
                                : relatedTutorial.description}
                            </p>
                            <div className='d-flex flex-wrap gap-2 align-items-center'>
                              <span
                                className={`badge bg-${
                                  getDifficultyConfig(
                                    relatedTutorial.difficulty
                                  ).color
                                }`}
                              >
                                {
                                  getDifficultyConfig(
                                    relatedTutorial.difficulty
                                  ).text
                                }
                              </span>
                              <small className='text-muted d-flex align-items-center gap-1'>
                                <FaClock size={10} />
                                <span>{relatedTutorial.estimatedTime}min</span>
                              </small>
                              <small className='text-muted d-flex align-items-center gap-1'>
                                <FaEye size={10} />
                                <span>{relatedTutorial.views}</span>
                              </small>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>

                    <div className='mt-3 pt-3 border-top'>
                      <Link
                        to={`/?category=${encodeURIComponent(
                          tutorial.category
                        )}`}
                        className='btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2'
                      >
                        <span>{categoryIcon}</span>
                        <span>Ver Todos em {categoryName}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialPage
