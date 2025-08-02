// src/components/layout/Footer.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
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
              © {currentYear} Bootpedia. Todos os direitos reservados.
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
              <span className='small'>Developed by </span>
              <FaGithub size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
