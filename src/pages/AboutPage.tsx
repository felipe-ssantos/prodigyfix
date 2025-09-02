// src/pages/AboutPage.tsx
import React from 'react'
import { FaTools, FaLaptop, FaShieldAlt, FaLightbulb } from 'react-icons/fa'

const AboutPage: React.FC = () => {
  return (
    <div className='container py-4'>
      {/* Hero Section */}
      <div className='row mb-5'>
        <div className='col-lg-8 mx-auto text-center'>
          <h1 className='display-4 fw-bold mb-3'>
            Sobre <span className='text-primary'>Prodigy Informática</span>
          </h1>
          <p className='lead text-muted'>
            Assistência técnica confiável em informática. Realizamos manutenção,
            upgrade e recuperação de computadores e notebooks, sempre com foco
            em qualidade, rapidez e confiança.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className='row mb-5'>
        <div className='col-lg-6'>
          <h2 className='mb-4'>Nossa Missão</h2>
          <p className='mb-3 text-start'>
            Oferecer soluções em informática que realmente resolvam o problema
            do cliente, desde a formatação e limpeza de sistema até a troca de
            peças e configurações de rede.
          </p>
          <p className='mb-3 text-start'>
            Nossa meta é proporcionar <strong>tranquilidade</strong> para que
            você use seu computador, notebook ou impressora sem{' '}
            <strong>preocupações</strong>. Entendemos que seu equipamento é{' '}
            <strong>essencial</strong> no dia a dia, por isso trabalhamos com{' '}
            <u>agilidade e transparência</u> em cada atendimento.
          </p>
        </div>
        <div className='col-lg-6'>
          <div className='card bg-light'>
            <div className='card-body p-5'>
              <h5 className='card-title mb-3'>Nossos Serviços</h5>
              <ul className='list-unstyled text-start'>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' /> Formatação e
                  reinstalação do sistema
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' /> Backup e recuperação
                  de dados
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' /> Remoção de vírus e
                  otimização
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' /> Troca de peças e
                  upgrades
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' /> Instalação de
                  programas essenciais
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' /> Instalação de
                  impressoras e periféricos
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' /> Configuração de rede
                  doméstica
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Diferenciais */}
      <div className='row mb-5'>
        <div className='col-12'>
          <h2 className='text-center mb-4'>
            Por que escolher a Prodigy Informática?
          </h2>
          <div className='row g-4'>
            <div className='col-md-6 col-lg-3'>
              <div className='card h-100 text-center'>
                <div className='card-body'>
                  <div className='mb-3'>
                    <FaLaptop size={48} className='text-primary' />
                  </div>
                  <h5 className='card-title'>Atendimento Completo</h5>
                  <p className='card-text text-muted'>
                    Do backup à troca de peças, cobrimos todas as necessidades
                    do seu computador.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-6 col-lg-3'>
              <div className='card h-100 text-center'>
                <div className='card-body'>
                  <div className='mb-3'>
                    <FaShieldAlt size={48} className='text-success' />
                  </div>
                  <h5 className='card-title'>Segurança</h5>
                  <p className='card-text text-muted'>
                    Seu equipamento e seus dados tratados com total
                    responsabilidade.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-6 col-lg-3'>
              <div className='card h-100 text-center'>
                <div className='card-body'>
                  <div className='mb-3'>
                    <FaTools size={48} className='text-warning' />
                  </div>
                  <h5 className='card-title'>Agilidade</h5>
                  <p className='card-text text-muted'>
                    Diagnóstico e reparo rápidos para que você não fique sem seu
                    computador.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-6 col-lg-3'>
              <div className='card h-100 text-center'>
                <div className='card-body'>
                  <div className='mb-3'>
                    <FaLightbulb size={48} className='text-danger' />
                  </div>
                  <h5 className='card-title'>Consultoria Especializada</h5>
                  <p className='card-text text-muted'>
                    Orientação e soluções personalizadas para o seu equipamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className='row'>
        <div className='col-12'>
          <div className='card bg-primary text-white text-center'>
            <div className='card-body p-5'>
              <h3 className='mb-3'>Pronto para Começar?</h3>
              <p className='mb-4'>
                Explore nossos tutoriais e a aprenda boas práticas hoje mesmo e
                as principais técnicas de recuperação de sistemas.
              </p>
              <div className='d-flex justify-content-center gap-3'>
                <a href='/' className='btn btn-light btn-lg'>
                  Ver Tutoriais
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
