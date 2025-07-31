// src/pages/TutorialPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaHeart, FaArrowLeft, FaArrowRight, FaClock, FaEye, FaStar, FaShare, FaPrint } from 'react-icons/fa';
import { useTutorials } from '../contexts/TutorialContext';
import type { Tutorial } from '../types';

const TutorialPage = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getTutorialById,     
    getNextTutorial,    
    getPreviousTutorial,
    addToFavorites, 
    removeFromFavorites, 
    isFavorite,
    getTutorialsByCategory
  } = useTutorials();
  
  const [tutorial, setTutorial] = useState<Tutorial | undefined>(getTutorialById(id || ''));
  const [relatedTutorials, setRelatedTutorials] = useState<Tutorial[]>([]);

  useEffect(() => {
    if (id) {
      const foundTutorial = getTutorialById(id);
      setTutorial(foundTutorial);
      
      if (foundTutorial) {
        // Get related tutorials (same category, excluding current)
        const related = getTutorialsByCategory(foundTutorial.category)
          .filter(t => t.id !== id)
          .slice(0, 3);
        setRelatedTutorials(related);
      }
    }
  }, [id, getTutorialById, getTutorialsByCategory]);

  if (!tutorial) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h1 className="display-1 text-muted">404</h1>
          <h2 className="mb-4">Tutorial Not Found</h2>
          <p className="text-muted mb-4">
            The tutorial you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isFavorited = isFavorite(tutorial.id);
  const nextTutorial = getNextTutorial(tutorial.id);
  const prevTutorial = getPreviousTutorial(tutorial.id);

  const handleFavoriteToggle = () => {
    if (isFavorited) {
      removeFromFavorites(tutorial.id);
    } else {
      addToFavorites(tutorial.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tutorial.title,
        text: tutorial.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/?category=${tutorial.category}`}>
              {tutorial.category.replace('-', ' ')}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {tutorial.title}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          <article className="tutorial-content">
            {/* Header */}
            <header className="mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className={`badge bg-${getDifficultyColor(tutorial.difficulty)} me-2`}>
                    {getDifficultyText(tutorial.difficulty)}
                  </span>
                  <span className="badge bg-primary">
                    {tutorial.category.replace('-', ' ')}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={handleShare}
                    className="btn btn-outline-secondary btn-sm"
                    title="Share"
                    aria-label="Share tutorial"
                  >
                    <FaShare />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn btn-outline-secondary btn-sm"
                    title="Print"
                    aria-label="Print tutorial"
                  >
                    <FaPrint />
                  </button>
                  <button
                    onClick={handleFavoriteToggle}
                    className={`btn btn-sm ${isFavorited ? 'btn-danger' : 'btn-outline-danger'}`}
                    title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>

              <h1 className="display-5 fw-bold mb-3">{tutorial.title}</h1>
              
              <p className="lead text-muted mb-3">{tutorial.description}</p>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                <div className="d-flex align-items-center text-muted">
                  <FaClock className="me-1" />
                  <small>{tutorial.estimatedTime} min read</small>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <FaEye className="me-1" />
                  <small>{tutorial.views.toLocaleString()} views</small>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <FaStar className="me-1" />
                  <small>By {tutorial.author}</small>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <small>
                    {new Date(tutorial.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </header>

            {/* Tags */}
            {tutorial.tags.length > 0 && (
              <div className="mb-4">
                <h6 className="mb-2">Tags:</h6>
                <div className="d-flex flex-wrap gap-1">
                  {tutorial.tags.map((tag, index) => (
                    <span key={index} className="badge bg-light text-dark">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="tutorial-body">
              <div 
                className="markdown-content"
                dangerouslySetInnerHTML={{ 
                  __html: tutorial.content.replace(/\n/g, '<br>').replace(/#{1,6}\s+(.+)/g, '<h$1>$2</h$1>')
                }} 
              />
            </div>

            {/* Navigation */}
            <nav className="d-flex justify-content-between mt-5 pt-4 border-top">
              {prevTutorial ? (
                <Link 
                  to={`/tutorial/${prevTutorial.id}`}
                  className="btn btn-outline-primary"
                >
                  <FaArrowLeft className="me-2" />
                  {prevTutorial.title}
                </Link>
              ) : (
                <div></div>
              )}
              
              {nextTutorial ? (
                <Link 
                  to={`/tutorial/${nextTutorial.id}`}
                  className="btn btn-outline-primary"
                >
                  {nextTutorial.title}
                  <FaArrowRight className="ms-2" />
                </Link>
              ) : (
                <div></div>
              )}
            </nav>
          </article>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="sidebar-sticky">
            {/* Related Tutorials */}
            {relatedTutorials.length > 0 && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Related Tutorials</h5>
                </div>
                <div className="card-body">
                  {relatedTutorials.map((relatedTutorial) => (
                    <div key={relatedTutorial.id} className="mb-3">
                      <Link 
                        to={`/tutorial/${relatedTutorial.id}`}
                        className="text-decoration-none"
                      >
                        <h6 className="text-dark mb-1">{relatedTutorial.title}</h6>
                        <p className="text-muted small mb-0">{relatedTutorial.description}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Tutorial Stats</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="h4 text-primary mb-1">{tutorial.views.toLocaleString()}</div>
                    <small className="text-muted">Views</small>
                  </div>
                  <div className="col-6">
                    <div className="h4 text-success mb-1">{tutorial.estimatedTime}</div>
                    <small className="text-muted">Minutes</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;