//src\pages\AboutPage.tsx
import React from 'react'
import { FaTools, FaBook, FaUsers, FaHeart } from 'react-icons/fa'

const AboutPage: React.FC = () => {
  return (
    <div className='container py-4'>
      {/* Hero Section */}
      <div className='row mb-5'>
        <div className='col-lg-8 mx-auto text-center'>
          <h1 className='display-4 fw-bold mb-3'>
            About <span className='text-primary'>Bootpedia</span>
          </h1>
          <p className='lead text-muted'>
            Seu guia completo sobre as ferramentas Hiren's Boot e técnicas de
            recuperação do sistema. Nos dedicamos a ajudar os usuários a dominar
            habilidades essenciais de manutenção e recuperação de computadores.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className='row mb-5'>
        <div className='col-lg-6'>
          <h2 className='mb-4'>Missão</h2>
          <p className='mb-3 text-start'>
            A Bootpedia nasceu com um propósito claro: tornar o conhecimento
            sobre recuperação e manutenção de sistemas acessível a todos. Seja
            você um profissional de TI experiente ou alguém iniciando na área,
            nossos tutoriais detalhados foram criados para guiá-lo passo a
            passo, de forma prática e objetiva.
          </p>
          <p className='mb-3 text-start'>
            Este é um projeto pessoal e open-source, criado como um complemento
            ao Hiren's BootCD — não temos qualquer intenção de prejudicar ou
            competir com a ferramenta original, apenas contribuir com a
            comunidade. A ideia surgiu da necessidade de reunir, em um só lugar,
            informações organizadas sobre as ferramentas disponíveis no Hiren’s
            Boot, facilitando a vida de quem busca aprender ou resolver
            problemas sem precisar garimpar conteúdo disperso pela internet.
          </p>
        </div>
        <div className='col-lg-6'>
          <div className='card bg-light'>
            <div className='card-body p-5'>
              <h5 className='card-title mb-3'>O Que Cobrimos</h5>
              <ul className='list-unstyled text-start'>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' />
                  Recuperação de Dados e Restauração de Arquivos
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' />
                  Reparo e Recuperação da Inicialização do Sistema
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' />
                  Particionamento e Gerenciamento de Discos
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' />
                  Recuperação e Redefinição de Senhas
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' />
                  Backup e Restauração do Sistema
                </li>
                <li className='mb-2'>
                  <FaTools className='text-primary me-2' />
                  Diagnóstico de Rede e Ferramentas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What is Hiren's BootCD */}
      <div className='row mb-5 text-start'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body p-4'>
              <h2 className='mb-4'>O que é o Hiren's BootCD?</h2>
              <div className='row'>
                <div className='col-lg-8'>
                  <p className='mb-3'>
                    O <strong>Hiren's BootCD</strong> é uma coletânea abrangente
                    de ferramentas de recuperação e manutenção de sistemas, que
                    pode ser inicializada a partir de um CD, DVD ou pen drive.
                    Ele reúne centenas de utilitários gratuitos voltados para
                    recuperação de dados, reparo do sistema, gerenciamento de
                    disco, entre outros.
                  </p>
                  <p className='mb-3'>
                    Criado por Hiren, esse kit de ferramentas inicializável se
                    tornou um recurso essencial para profissionais de TI,
                    administradores de sistemas e qualquer pessoa que precise
                    diagnosticar ou reparar computadores. É especialmente útil
                    quando o Windows não inicia ou quando há necessidade de
                    acessar ferramentas fora do sistema operacional.
                  </p>
                  <p>
                    Nossos tutoriais abordam as ferramentas mais utilizadas e
                    eficazes do Hiren’s BootCD, com instruções passo a passo,
                    tanto para iniciantes quanto para usuários avançados.
                  </p>
                </div>
                <div className='col-lg-4'>
                  <div className='text-center'>
                    <div className='mb-3'>
                      <span className='display-1'>💿</span>
                    </div>
                    <h5>Kit de Ferramentas Essencial</h5>
                    <p className='text-muted small'>
                      Uma suíte completa de ferramentas de recuperação e
                      manutenção
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className='row mb-5'>
        <div className='col-12'>
          <h2 className='text-center mb-4'>Por que escolher a Bootpedia?</h2>
          <div className='row g-4'>
            <div className='col-md-6 col-lg-3'>
              <div className='card h-100 text-center'>
                <div className='card-body'>
                  <div className='mb-3'>
                    <FaBook size={48} className='text-primary' />
                  </div>
                  <h5 className='card-title'>Guias Abrangentes</h5>
                  <p className='card-text text-muted'>
                    Tutoriais passo a passo cobrindo todos os aspectos de
                    recuperação e manutenção de sistemas.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-6 col-lg-3'>
              <div className='card h-100 text-center'>
                <div className='card-body'>
                  <div className='mb-3'>
                    <FaUsers size={48} className='text-success' />
                  </div>
                  <h5 className='card-title'>Feito pela Comunidade</h5>
                  <p className='card-text text-muted'>
                    Criado por e para a comunidade tech.
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
                  <h5 className='card-title'>Foco Prático</h5>
                  <p className='card-text text-muted'>
                    Cenários do dia a dia e soluções práticas para problemas
                    comuns em computadores.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-6 col-lg-3'>
              <div className='card h-100 text-center'>
                <div className='card-body'>
                  <div className='mb-3'>
                    <FaHeart size={48} className='text-danger' />
                  </div>
                  <h5 className='card-title'>Livre e Aberto</h5>
                  <p className='card-text text-muted'>
                    Totalmente gratuito, limitações de conteúdo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className='row mb-5'>
        <div className='col-12'>
          <div className='card bg-light'>
            <div className='card-body p-4'>
              <h2 className='text-center mb-4'>Nossa Equipe</h2>
              <div className='row'>
                <div className='col-lg-6'>
                  <h5>Equipe Bootpedia</h5>
                  <p className='text-muted text-start'>
                    Nossa equipe é formada por profissionais de TI,
                    administradores de sistemas e entusiastas da tecnologia,
                    todos apaixonados por compartilhar conhecimento e ajudar
                    outras pessoas a dominar habilidades essenciais em
                    informática.
                  </p>
                  <p className='text-muted text-start'>
                    Acreditamos no poder da educação e da comunidade. Por isso,
                    criamos a Bootpedia como uma plataforma totalmente gratuita
                    e acessível a todos.
                  </p>
                </div>
                <div className='col-lg-6'>
                  <h5>Colaboradores</h5>
                  <p className='text-muted text-start'>
                    A Bootpedia não seria possível sem as contribuições da ampla
                    comunidade tecnológica. Valorizamos e incentivamos a
                    participação de qualquer pessoa interessada em melhorar
                    nossos tutoriais ou adicionar novos conteúdos.
                  </p>
                  <p className='text-muted text-start'>
                    Se você deseja colaborar, entre em contato conosco através
                    da nossa página de contato. Sua ajuda é muito bem-vinda!
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
                Explore nossos tutoriais e comece a aprender hoje mesmo as
                principais técnicas de recuperação de sistemas.
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
