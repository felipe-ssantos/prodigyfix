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
            <h6 className='text-white mb-3 pb-2 border-bottom border-secondary border-opacity-25'>
              Navigation
            </h6>
            <ul className='list-unstyled mb-0 d-flex justify-content-center gap-4'>
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
                  About
                </Link>
              </li>
              <li>
                <Link
                  to='/useful-links'
                  className='text-white-50 text-decoration-none hover-text-white'
                >
                  Useful Links
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className='my-4 border-secondary border-opacity-25' />

        <div className='row align-items-center'>
          <div className='col-md-6'>
            <p className='mb-0 text-white-50 small'>
              © {currentYear} Bootpedia. All rights reserved.
            </p>
          </div>
          <div className='col-md-6 text-md-end'>
            <a
              href='https://github.com/felipe-ssantos'
              target='_blank'
              rel='noopener noreferrer'
              className='text-white-50 text-decoration-none hover-text-white'
              title='GitHub'
            >
              <p className='mb-0 text-white-50 small'>
                Developed by
                <FaGithub size={20} className='ml-2' />
              </p>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
