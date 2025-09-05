import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaEye,
  FaStar,
  FaPrint,
  FaHome,
  FaCalendarAlt,
  FaCheck
} from 'react-icons/fa'
import { useTutorials } from '../hooks/useTutorials'
import {
  TutorialDetailImage,
  TutorialThumbnail
} from '../components/TutorialImage'
import type { Tutorial } from '../types'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../styles/TutorialPage.css'

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
  const hasIncrementedViews = useRef(false)

  useEffect(() => {
    if (id) {
      const foundTutorial = getTutorialById(id)
      setTutorial(foundTutorial)
      if (foundTutorial) {
        if (!hasIncrementedViews.current) {
          incrementViews(id)
          hasIncrementedViews.current = true
        }
        const related = getTutorialsByCategory(foundTutorial.category)
          .filter(t => t.id !== id)
          .slice(0, 3)
        setRelatedTutorials(related)
      }
    }
  }, [id, getTutorialById, getTutorialsByCategory, incrementViews])

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

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
    <>
      {/* Meta Tags para SEO e Compartilhamento */}
      <Helmet>
        <title>{tutorial.title} - Prodigy Informática</title>
        <meta name='description' content={tutorial.description} />
        <meta property='og:title' content={tutorial.title} />
        <meta property='og:description' content={tutorial.description} />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:type' content='article' />
        {tutorial.imageUrl && (
          <meta
            property='og:image'
            content={`${window.location.origin}/images/tutorials/${tutorial.imageUrl}`}
          />
        )}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={tutorial.title} />
        <meta name='twitter:description' content={tutorial.description} />
        {tutorial.imageUrl && (
          <meta
            name='twitter:image'
            content={`${window.location.origin}/images/tutorials/${tutorial.imageUrl}`}
          />
        )}
      </Helmet>

      <div className='w-100 py-4 min-vh-100'>
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
                  aria-label='Close'
                />
              </div>
            </div>
          </div>
        )}

        <div className='container-fluid px-4'>
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
            <div className='col-lg-8'>
              <article className='bg-white rounded-3 shadow-sm p-4 tutorial-article'>
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

                  {/* Usando TutorialDetailImage */}
                  {tutorial.imageUrl && (
                    <div className='mb-4 tutorial-cover-image'>
                      <TutorialDetailImage
                        imageName={tutorial.imageUrl}
                        title={tutorial.title}
                        responsive={true}
                      />
                    </div>
                  )}

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
                        <span>Prodigy Informática</span>
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
                </header>

                <div className='tutorial-content mb-5'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: tutorial.content.replace(
                        /<iframe(.+?)<\/iframe>/g,
                        match => `<div class="video-container">${match}</div>`
                      )
                    }}
                    className='lh-lg'
                  />
                </div>

                {/* Seção de Ações Rápidas */}
                <div className='border-top pt-4 mb-4'>
                  <div className='row'>
                    <div className='col-md-12'>
                      <h6 className='fw-semibold mb-3 d-flex align-items-center'>
                        <span className='me-2'>⚡</span>
                        Ações Rápidas
                      </h6>

                      {/* Tags */}
                      <div className='mb-4'>
                        <div className='d-flex align-items-center mb-2'>
                          <img
                            src='https://www.svgrepo.com/show/485588/tag.svg'
                            width='20'
                            height='20'
                            loading='lazy'
                            alt='Ícone tags'
                            className='me-2'
                          />
                          <span className='text-muted small'>Tags:</span>
                        </div>
                        <div className='d-flex flex-wrap gap-2 mb-3'>
                          {tutorial.tags.map((tag, index) => (
                            <a
                              href={`/?tag=${encodeURIComponent(tag)}`}
                              rel='tag'
                              key={index}
                              className='badge bg-light text-dark text-decoration-none border'
                              aria-label={`Tag ${tag}`}
                            >
                              {tag}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Botões de Ação e Compartilhamento */}
                      <div className='d-flex flex-wrap gap-2 align-items-center'>
                        <button
                          type='button'
                          onClick={handlePrint}
                          className='btn btn-outline-secondary btn-sm d-print-none'
                        >
                          <FaPrint className='me-2' size={14} />
                          Imprimir
                        </button>
                        <span className='mx-2 text-muted small'>
                          Compartilhar:
                        </span>

                        {/* WhatsApp */}
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            `${tutorial.title} - ${window.location.href}`
                          )}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='btn btn-sm btn-outline-success'
                          aria-label='Compartilhar no WhatsApp'
                        >
                          <i className='bi bi-whatsapp'></i>
                        </a>

                        {/* Twitter/X */}
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            window.location.href
                          )}&text=${encodeURIComponent(tutorial.title)}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='btn btn-sm btn-outline-dark'
                          aria-label='Compartilhar no Twitter'
                        >
                          <i className='bi bi-twitter-x'></i>
                        </a>

                        {/* Facebook */}
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            window.location.href
                          )}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='btn btn-sm btn-outline-primary'
                          aria-label='Compartilhar no Facebook'
                        >
                          <i className='bi bi-facebook'></i>
                        </a>

                        {/* Telegram */}
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(
                            window.location.href
                          )}&text=${encodeURIComponent(tutorial.title)}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='btn btn-sm btn-outline-info'
                          aria-label='Compartilhar no Telegram'
                        >
                          <i className='bi bi-telegram'></i>
                        </a>

                        {/* Email */}
                        <a
                          href={`mailto:?subject=${encodeURIComponent(
                            tutorial.title
                          )}&body=${encodeURIComponent(
                            `${tutorial.description}\n\nLeia mais: ${window.location.href}`
                          )}`}
                          className='btn btn-sm btn-outline-secondary'
                          aria-label='Compartilhar por e-mail'
                        >
                          <i className='bi bi-envelope'></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <nav className='d-flex justify-content-between mt-5 pt-4 border-top tutorial-navigation'>
                  {prevTutorial ? (
                    <Link
                      to={`/tutorial/${prevTutorial.id}`}
                      className='btn btn-outline-primary d-flex align-items-center text-decoration-none tutorial-nav-btn'
                    >
                      <FaArrowLeft className='me-2 flex-shrink-0' />
                      <div className='text-start tutorial-nav-text'>
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
                      <div className='text-end tutorial-nav-text'>
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

            <div className='col-lg-4'>
              <div className='position-sticky top-0 pt-2'>
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
                              className='text-decoration-none d-flex gap-3'
                            >
                              {/* Usando TutorialThumbnail para tutoriais relacionados */}
                              <div className='flex-shrink-0'>
                                <TutorialThumbnail
                                  imageName={relatedTutorial.imageUrl}
                                  title={relatedTutorial.title}
                                  size='sm'
                                />
                              </div>

                              <div className='flex-grow-1'>
                                <h6 className='text-dark mb-2 fw-semibold'>
                                  {relatedTutorial.title}
                                </h6>
                                <p className='text-muted mb-3 small'>
                                  {relatedTutorial.description.length > 80
                                    ? `${relatedTutorial.description.substring(
                                        0,
                                        80
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
                                    <span>
                                      {relatedTutorial.estimatedTime}min
                                    </span>
                                  </small>
                                  <small className='text-muted d-flex align-items-center gap-1'>
                                    <FaEye size={10} />
                                    <span>{relatedTutorial.views}</span>
                                  </small>
                                </div>
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
    </>
  )
}

export default TutorialPage
