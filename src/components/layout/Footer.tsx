// src/components/layout/Footer.tsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaGithub, FaArrowUp  } from 'react-icons/fa'
import '../../styles/Footer.css'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Detectar scroll para mostrar/esconder o botão
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowBackToTop(scrollTop > 300) // Mostrar após 300px de scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Função para scroll suave até o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {/* Botão Voltar ao Topo */}
      {showBackToTop && (
        <button
          type='button'
          onClick={scrollToTop}
          className={`btn btn-secondary position-fixed d-flex align-items-center justify-content-center shadow-lg transition-all footer-voltar-top ${
            showBackToTop ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label='Voltar ao topo'
          title='Voltar ao topo'
        >
          <FaArrowUp size={18} />
        </button>
      )}

      <footer className='bg-dark py-4 mt-5'>
        <div className='container'>
          <div className='row'>
            {/* Quick Links Section - Simplificada */}
            <div className='col-md-8 mb-4 mx-auto text-center'>
              <ul className='list-unstyled mb-0 d-flex justify-content-center gap-4 flex-wrap'>
                <li>
                  <Link
                    to='/'
                    className='text-white-50 text-decoration-none hover-text-white'
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to='/about'
                    className='text-white-50 text-decoration-none hover-text-white'
                  >
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link
                    to='/useful-links'
                    className='text-white-50 text-decoration-none hover-text-white'
                  >
                    Links úteis
                  </Link>
                </li>
                <li>
                  <Link
                    to='/privacy-policy'
                    className='text-white-50 text-decoration-none hover-text-white'
                  >
                    Políticas de Privacidade / LGPD
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <hr className='my-4 border-secondary border-opacity-25' />

          <div className='row align-items-center'>
            <div className='col-md-6'>
              <p className='mb-0 text-white-50 small'>
                © {currentYear} Prodigy Informática. Todos os direitos
                reservados.
              </p>
            </div>
            <div className='col-md-6 text-md-end'>
              <a
                href='https://github.com/felipe-ssantos'
                target='_blank'
                rel='noopener noreferrer'
                className='text-white-50 text-decoration-none hover-text-white d-inline-flex align-items-center gap-2'
                title='GitHub'
              >
                <span className='small'>
                  Developed by <FaGithub size={16} /> Felipe Silveira
                </span>
                <span className='small'>• v.1.0 • Since 2021 </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
