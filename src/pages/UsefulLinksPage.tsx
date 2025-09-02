// src/pages/UsefulLinksPage.tsx
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useUsefulLinks } from '../hooks/useUsefulLinks'
import { UsefulLink } from '../types/usefulLinks'

const themeIcons: Record<string, string> = {
  tools: '🛠️',
  resources: '📚',
  communities: '👥',
  learning: '🎓',
  security: '🛡️'
}

const themeIconClasses: Record<string, string> = {
  tools: 'text-primary',
  resources: 'text-success',
  communities: 'text-info',
  learning: 'text-warning',
  security: 'text-danger'
}

// Títulos para os temas
const themeTitles: Record<string, string> = {
  tools: 'Ferramentas Essenciais',
  resources: 'Recursos de Aprendizado',
  communities: 'Comunidades e Fóruns',
  learning: 'Aprendizado e Certificação',
  security: 'Segurança e Proteção'
}

const UsefulLinksPage = () => {
  const { links, loading, error } = useUsefulLinks()

  // Função para renderizar ícones (emoji ou imagem)
  const renderIcon = (icon: string) => {
    // Se for uma URL de imagem
    if (icon.startsWith('http')) {
      return (
        <img
          src={icon}
          alt='Ícone'
          className='me-3 img-32'
          onError={e => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            // Criar fallback visual
            const fallback = document.createElement('span')
            fallback.className = 'fs-4 me-3'
            fallback.textContent = '🖼️'
            target.parentNode?.insertBefore(fallback, target.nextSibling)
          }}
        />
      )
    }
    // Se for emoji ou texto
    return <span className='fs-4 me-3'>{icon}</span>
  }

  const renderLinkCard = (link: UsefulLink) => (
    <div key={link.id} className='col-md-6 col-lg-4 mb-3'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex align-items-start mb-3'>
            {renderIcon(link.icon)}
            <div className='flex-grow-1'>
              <h6 className='card-title mb-1'>{link.name}</h6>
              <span className='badge bg-secondary small'>{link.category}</span>
            </div>
          </div>
          <p className='card-text text-muted small mb-3'>{link.description}</p>
          <a
            href={link.url}
            target='_blank'
            // rel='noopener noreferrer'
            className='btn btn-outline-primary btn-sm'
          >
            <FaExternalLinkAlt className='me-1' />
            Visitar site
          </a>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className='container py-5'>
        <div className='text-center'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Carregando...</span>
          </div>
          <p className='mt-3'>Carregando links úteis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container py-5'>
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className='container py-4'>
      {/* Seção Principal */}
      <div className='row mb-5'>
        <div className='col-lg-8 mx-auto text-center'>
          <h1 className='display-4 fw-bold mb-3'>
            <span className='text-primary'>Links</span> Úteis
          </h1>
          <p className='lead text-muted'>
            Coleção cuidadosamente selecionada de ferramentas, recursos e
            comunidades essenciais para manutenção de computadores e recuperação
            de sistemas. Esses links irão ajudar a expandir o conhecimento e
            encontrar suporte adicional.
          </p>
        </div>
      </div>

      {/* Renderizar cada tema de links */}
      {Object.entries(links).map(([theme, themeLinks]) => (
        <section key={theme} className='mb-5'>
          <div className='d-flex align-items-center mb-4'>
            <span className={`me-2 fs-4 ${themeIconClasses[theme] || ''}`}>
              {themeIcons[theme] || '📁'}
            </span>
            <h2 className='mb-0'>{themeTitles[theme] || theme}</h2>
          </div>
          <div className='row'>{themeLinks.map(renderLinkCard)}</div>
        </section>
      ))}

      {/* Recursos Adicionais */}
      <section className='mb-5'>
        <div className='card bg-light'>
          <div className='card-body p-4'>
            <h3 className='mb-4'>Recursos Adicionais</h3>
            <div className='row'>
              <div className='col-md-6'>
                <h5>Segurança em Primeiro Lugar</h5>
                <ul className='list-unstyled text-start'>
                  <li className='mb-2'>
                    <strong>Sempre faça backup dos seus dados</strong> antes de
                    tentar qualquer reparo no sistema
                  </li>
                  <li className='mb-2'>
                    <strong>Use fontes oficiais</strong> para baixar ferramentas
                    e softwares
                  </li>
                  <li className='mb-2'>
                    <strong>Teste em sistemas não críticos</strong> ao aprender
                    novas técnicas
                  </li>
                  <li>
                    <strong>Mantenha as ferramentas atualizadas</strong> para
                    garantir compatibilidade e segurança
                  </li>
                </ul>
              </div>
              <div className='col-md-6'>
                <h5>Boas Práticas</h5>
                <ul className='list-unstyled text-start'>
                  <li className='mb-2'>
                    <strong>Documente seus passos</strong> ao solucionar
                    problemas complexos
                  </li>
                  <li className='mb-2'>
                    <strong>Participe de comunidades</strong> para aprender com
                    a experiência dos outros
                  </li>
                  <li className='mb-2'>
                    <strong>Mantenha-se atualizado</strong> com as últimas
                    ferramentas e técnicas
                  </li>
                  <li>
                    <strong>Compartilhe conhecimento</strong> para ajudar outras
                    pessoas na comunidade
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aviso Legal */}
      <section>
        <div className='alert alert-info' role='alert'>
          <h6 className='alert-heading'>Aviso Legal</h6>
          <p className='mb-0'>
            Esses links são fornecidos para fins educacionais e de referência.
            Não temos afiliação com nenhum desses sites. Sempre verifique a
            autenticidade das ferramentas e recursos antes de fazer download ou
            usá-los. Use essas ferramentas com responsabilidade e por sua conta
            e risco.
          </p>
        </div>
      </section>
    </div>
  )
}

export default UsefulLinksPage
