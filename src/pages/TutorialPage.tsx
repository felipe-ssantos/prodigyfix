// src/pages/TutorialPage.tsx
import { useState, useEffect } from 'react'
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
  FaCalendarAlt
} from 'react-icons/fa'
import { useTutorials } from '../contexts/TutorialContext'
import type { Tutorial } from '../types'

const TutorialPage = () => {
  const { id } = useParams<{ id: string }>()
  const {
    getTutorialById,
    getNextTutorial,
    getPreviousTutorial,
    getTutorialsByCategory
  } = useTutorials()

  const [tutorial, setTutorial] = useState<Tutorial | undefined>(
    getTutorialById(id || '')
  )
  const [relatedTutorials, setRelatedTutorials] = useState<Tutorial[]>([])
  const [shareSuccess, setShareSuccess] = useState(false)

  useEffect(() => {
    if (id) {
      const foundTutorial = getTutorialById(id)
      setTutorial(foundTutorial)

      if (foundTutorial) {
        const related = getTutorialsByCategory(foundTutorial.category)
          .filter(t => t.id !== id)
          .slice(0, 3)
        setRelatedTutorials(related)

        // Update page title
        document.title = `${foundTutorial.title} - Tutorial`
      }
    }
  }, [id, getTutorialById, getTutorialsByCategory])

  if (!tutorial) {
    return (
      <div className='container py-5'>
        <div className='row justify-content-center'>
          <div className='col-md-6 text-center'>
            <div className='mb-4'>
              <i className='fas fa-search fa-5x text-muted mb-3'></i>
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
                  Go Back
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
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Error sharing:', err)
      // Fallback to clipboard
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
        return { color: 'success', text: 'Iniciante' }
      case 'intermediate':
        return { color: 'warning', text: 'Intermediário' }
      case 'advanced':
        return { color: 'danger', text: 'Avançado' }
      default:
        return { color: 'secondary', icon: '⚪', text: 'Desconhecido' }
    }
  }

  const difficultyConfig = getDifficultyConfig(tutorial.difficulty)

  return (
    <div className='container py-4'>
      {/* Success Toast for Share */}
      {shareSuccess && (
        <div className='position-fixed top-0 end-0 p-3 shareSuccess-tutorial-page'>
          <div className='toast show bg-success text-white' role='alert'>
            <div className='d-flex'>
              <div className='toast-body'>
                <i className='fas fa-check-circle me-2'></i>
                Link copied to clipboard!
              </div>
              <button
                type='button'
                className='btn-close btn-close-white me-2 m-auto'
                onClick={() => setShareSuccess(false)}
                aria-label='Close notification'
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label='breadcrumb' className='mb-4'>
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
              className='text-decoration-none'
            >
              {tutorial.category}
            </Link>
          </li>
          <li
            className='breadcrumb-item active text-truncate breadcrumb-tutorial-page'
            aria-current='page'
          >
            {tutorial.title}
          </li>
        </ol>
      </nav>

      <div className='row'>
        {/* Main Content */}
        <div className='col-lg-8'>
          <article className='bg-white'>
            {/* Header */}
            <header className='mb-5'>
              <div className='d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2'>
                <div className='d-flex gap-2 flex-wrap'>
                  <span
                    className={`badge bg-${difficultyConfig.color} d-flex align-items-center`}
                  >
                    <span className='me-1'>{difficultyConfig.icon}</span>
                    {difficultyConfig.text}
                  </span>
                  <span className='badge bg-primary'>{tutorial.category}</span>
                </div>
              </div>

              <h1 className='fw-bold mb-3 display-6'>{tutorial.title}</h1>
              <p className='lead text-muted mb-4'>{tutorial.description}</p>

              {/* Cover Image */}
              {tutorial.imageUrl && (
                <div className='mb-4'>
                  <img
                    src={tutorial.imageUrl}
                    alt={tutorial.title}
                    className='img-fluid rounded shadow-sm cover-image-tutorial-page'
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
                    <span>{tutorial.views.toLocaleString()} Vizualizações</span>
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
                      Publicado em: {new Date(tutorial.createdAt).toLocaleDateString()}
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
                className='lh-lg content-tutorial-page'
              />
            </div>

            {/* Navigation */}
            <nav className='d-flex justify-content-between mt-5 pt-4 border-top'>
              {prevTutorial ? (
                <Link
                  to={`/tutorial/${prevTutorial.id}`}
                  className='btn btn-outline-primary d-flex align-items-center text-decoration-none'
                  style={{ maxWidth: '45%' }}
                >
                  <FaArrowLeft className='me-2 flex-shrink-0' />
                  <div className='text-start'>
                    <small className='d-block text-muted'>Previous</small>
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
                  className='btn btn-outline-primary d-flex align-items-center text-decoration-none'
                  style={{ maxWidth: '45%' }}
                >
                  <div className='text-end'>
                    <small className='d-block text-muted'>Next</small>
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
          <div className='sticky-top sidebar-tutorial-page'>
            {/* Quick Stats */}
            <div className='card border-0 shadow-sm mb-4'></div>

            {/* Related Tutorials */}
            {relatedTutorials.length > 0 && (
              <div className='card border-0 shadow-sm mb-4'>
                <div className='card-header bg-white border-bottom-0'>
                  <h6 className='mb-0 fw-semibold d-flex align-items-center'>
                    <i className='fas fa-bookmark me-2 text-primary'></i>
                    Related Tutorials
                  </h6>
                </div>
                <div className='card-body pt-0'>
                  {relatedTutorials.map((relatedTutorial, index) => (
                    <div
                      key={relatedTutorial.id}
                      className={`py-3 ${
                        index < relatedTutorials.length - 1
                          ? 'border-bottom border-light'
                          : ''
                      }`}
                    >
                      <Link
                        to={`/tutorial/${relatedTutorial.id}`}
                        className='text-decoration-none'
                      >
                        <div className='d-flex'>
                          <div className='flex-grow-1'>
                            <h6 className='text-dark mb-1 small fw-semibold'>
                              {relatedTutorial.title}
                            </h6>
                            <p className='text-muted mb-2 small'>
                              {relatedTutorial.description.length > 80
                                ? `${relatedTutorial.description.substring(
                                    0,
                                    80
                                  )}...`
                                : relatedTutorial.description}
                            </p>
                            <div className='d-flex gap-2'>
                              <span
                                className={`badge bg-${
                                  getDifficultyConfig(
                                    relatedTutorial.difficulty
                                  ).color
                                } badge-sm`}
                              >
                                {
                                  getDifficultyConfig(
                                    relatedTutorial.difficulty
                                  ).text
                                }
                              </span>
                              <small className='text-muted d-flex align-items-center'>
                                <FaClock size={10} className='me-1' />
                                {relatedTutorial.estimatedTime}min
                              </small>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}

                  <div className='pt-3'>
                    <Link
                      to={`/?category=${encodeURIComponent(tutorial.category)}`}
                      className='btn btn-outline-primary btn-sm w-100'
                    >
                      View All in {tutorial.category}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className='card border-0 shadow-sm'>
              <div className='card-header bg-white border-bottom-0'>
                <h6 className='mb-0 fw-semibold d-flex align-items-center'>
                  <i className='fas fa-lightning-bolt me-2 text-warning'></i>
                  Ações rápidas
                </h6>
              </div>
              <div className='card-body pt-0'>
                <div className='d-grid gap-2'>
                  <button
                    type='button'
                    onClick={handleShare}
                    className='btn btn-outline-primary btn-sm'
                  >
                    <FaShare className='me-2' size={14} />
                    Compartilhar Tutorial ?
                  </button>

                  <button
                    type='button'
                    onClick={handlePrint}
                    className='btn btn-outline-secondary btn-sm d-print-none'
                  >
                    <FaPrint className='me-2' size={14} />
                    Imprimir Tutorial ?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialPage
