// src/pages/NotFoundPage.tsx
import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
  return (
    <div className='container py-5 text-center'>
      <div className='card shadow'>
        <div className='card-body py-5'>
          <h1 className='display-1 text-danger'>404</h1>
          <h2 className='mb-4'>Página não encontrada</h2>
          <p className='lead mb-4'>
            A página que você está procurando pode ter sido removida ou não está
            disponível.
          </p>
          <div className='d-flex justify-content-center gap-3'>
            <Link to='/' className='btn btn-primary px-4'>
              Voltar à página inicial
            </Link>
            <Link to='/admin/login' className='btn btn-outline-secondary px-4'>
              Área administrativa
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
