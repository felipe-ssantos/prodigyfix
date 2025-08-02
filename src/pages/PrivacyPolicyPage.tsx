// src/pages/PrivacyPolicyPage.tsx
import React from 'react'

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className='container py-5'>
      <div className='row justify-content-center'>
        <div className='col-lg-10 col-xl-8'>
          <header className='text-center mb-5'>
            <h1 className='display-4 fw-bold text-primary mb-3'>
              Política de Privacidade
            </h1>
            <p className='lead text-muted'>
              Sua privacidade é importante para nós. Veja como lidamos com suas
              informações.
            </p>
            <div className='d-flex justify-content-center align-items-center'>
              <span className='badge bg-light text-dark me-2'>
                <i className='bi bi-calendar-check me-1'></i>
                Última atualização: {new Date().toLocaleDateString()}
              </span>
              <span className='badge bg-light text-dark'>
                <i className='bi bi-shield-lock me-1'></i>
                Compatível com a LGPD
              </span>
            </div>
          </header>

          <div className='card shadow-sm mb-5'>
            <div className='card-body p-4 p-lg-5'>
              <section className='mb-5'>
                <h2 className='h3 fw-bold mb-4 d-flex align-items-center'>
                  <i className='bi bi-collection me-3 text-primary'></i>
                  Informações que Coletamos
                </h2>
                <p className='mb-3'>
                  A Bootpedia coleta informações mínimas para oferecer nossos
                  serviços:
                </p>
                <ul className='list-group list-group-flush mb-3 text-start'>
                  <li className='list-group-item bg-transparent d-flex align-items-center'>
                    <i className='bi bi-check-circle-fill text-success me-2'></i>
                  </li>
                  <li className='list-group-item bg-transparent d-flex align-items-center'>
                    <i className='bi bi-check-circle-fill text-success me-2'></i>
                    Dados de uso (visualizações de tutoriais, favoritos)
                    armazenados localmente no navegador
                  </li>
                  <li className='list-group-item bg-transparent d-flex align-items-center'>
                    <i className='bi bi-check-circle-fill text-success me-2'></i>
                    Dados analíticos básicos para melhorar nosso conteúdo
                  </li>
                </ul>
              </section>

              <section className='mb-5'>
                <h2 className='h3 fw-bold mb-4 d-flex align-items-center'>
                  <i className='bi bi-gear me-3 text-primary'></i>
                  Como Utilizamos suas Informações
                </h2>
                <p className='mb-3'>Utilizamos os dados coletados para:</p>
                <ul className='list-group list-group-flush mb-3'>
                  <li className='list-group-item bg-transparent d-flex align-items-center'>
                    <i className='bi bi-arrow-right-circle-fill text-primary me-2'></i>
                    Fornecer e manter nossos tutoriais
                  </li>
                  <li className='list-group-item bg-transparent d-flex align-items-center'>
                    <i className='bi bi-arrow-right-circle-fill text-primary me-2'></i>
                    Melhorar a experiência do usuário e a qualidade do conteúdo
                  </li>
                  <li className='list-group-item bg-transparent d-flex align-items-center'>
                    <i className='bi bi-arrow-right-circle-fill text-primary me-2'></i>
                    Enviar atualizações importantes (apenas para
                    administradores)
                  </li>
                </ul>
              </section>

              <section className='mb-5'>
                <h2 className='h3 fw-bold mb-4 d-flex align-items-center'>
                  <i className='bi bi-shield me-3 text-primary'></i>
                  Serviços de Terceiros
                </h2>
                <div className='alert alert-warning text-start'>
                  <i className='bi bi-exclamation-triangle-fill me-2'></i>
                  <p>
                    A Bootpedia utiliza o Firebase (Google) para armazenamento
                    de dados. Consulte a Política de Privacidade do Google para
                    mais informações sobre como eles tratam seus dados.
                  </p>
                </div>
              </section>

              <section className='mb-5'>
                <h2 className='h3 fw-bold mb-4 d-flex align-items-center justify-content-center'>
                  <i className='bi bi-person-check me-3 text-primary'></i>
                  Seus Direitos
                </h2>
                <p className='mb-3 text-center'>
                  Como visitante, você tem o direito de:
                </p>
                <div className='row g-3 justify-content-center'>
                  <div className='col-md-4'>
                    <div className='card h-100 border-info'>
                      <div className='card-body text-center'>
                        <i className='bi bi-browser-safari text-info fs-3 mb-2'></i>
                        <h5 className='card-title'>Controlar</h5>
                        <p className='card-text small'>
                          Limpar dados, cookies e preferências armazenadas
                          localmente no seu navegador
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className='mb-4'>
                <h2 className='h3 fw-bold mb-4 d-flex align-items-center'>
                  <i className='bi bi-envelope me-3 text-primary'></i>
                  Fale Conosco
                </h2>
                <div className='d-flex align-items-center'>
                  <i className='bi bi-question-circle-fill text-secondary me-3 fs-4'></i>
                  <p className='mb-0'>
                    Se você tiver dúvidas sobre esta Política de Privacidade,
                    entre em contato conosco pelo nosso repositório no GitHub ou
                    pelas informações disponíveis no site.
                  </p>
                </div>
              </section>
            </div>
          </div>

          <div className='text-center'>
            <a href='/' className='btn btn-primary btn-lg px-4'>
              <i className='bi bi-house-door-fill me-2'></i>
              Voltar ao Início
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
