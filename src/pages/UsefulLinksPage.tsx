// src/pages/UsefulLinksPage.tsx
import React, { useState, useMemo } from 'react'
import {
  FaExternalLinkAlt,
  FaSearch,
  FaTimes,
  FaCode,
  FaDatabase,
  FaShieldAlt,
  FaUsers,
  FaGraduationCap,
  FaTools,
  FaBookOpen,
  FaFilter
} from 'react-icons/fa'
import { useUsefulLinks } from '../hooks/useUsefulLinks'
import { UsefulLink } from '../types/usefulLinks'
import './UsefulLinksPage.css'

const themeIcons: Record<string, React.JSX.Element> = {
  tools: <FaTools className='theme-icon' aria-hidden='true' />,
  resources: <FaBookOpen className='theme-icon' aria-hidden='true' />,
  communities: <FaUsers className='theme-icon' aria-hidden='true' />,
  learning: <FaGraduationCap className='theme-icon' aria-hidden='true' />,
  security: <FaShieldAlt className='theme-icon' aria-hidden='true' />,
  development: <FaCode className='theme-icon' aria-hidden='true' />,
  database: <FaDatabase className='theme-icon' aria-hidden='true' />
}

const themeIconClasses: Record<string, string> = {
  tools: 'text-warning',
  resources: 'text-info',
  communities: 'text-success',
  learning: 'text-primary',
  security: 'text-danger',
  development: 'text-secondary',
  database: 'text-dark'
}

// Títulos técnicos para os temas
const themeTitles: Record<string, string> = {
  tools: 'Ferramentas de Sistema',
  resources: 'Documentação & Recursos',
  communities: 'Comunidades Técnicas',
  learning: 'Cursos & Certificações',
  security: 'Segurança & Forense',
  development: 'Desenvolvimento',
  database: 'Banco de Dados'
}

const themeDescriptions: Record<string, string> = {
  tools: 'Utilitários para diagnóstico, manutenção e administração de sistemas',
  resources: 'Documentação oficial, guias técnicos e materiais de referência',
  communities:
    'Fóruns especializados, grupos de discussão e redes profissionais',
  learning: 'Plataformas de aprendizado, certificações e cursos técnicos',
  security: 'Ferramentas de segurança, análise forense e proteção de sistemas',
  development:
    'IDEs, frameworks e ferramentas para desenvolvimento de software',
  database: 'SGBDs, ferramentas de administração e otimização de banco de dados'
}

const UsefulLinksPage = () => {
  const { links, loading, error } = useUsefulLinks()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')

  // Extrair categorias únicas
  const categories = useMemo(() => {
    const allCategories = new Set<string>()
    Object.values(links)
      .flat()
      .forEach(link => {
        if (link.category) {
          allCategories.add(link.category)
        }
      })
    return Array.from(allCategories).sort()
  }, [links])

  // Extrair temas disponíveis
  const availableThemes = useMemo(() => {
    return Object.keys(links).filter(theme => links[theme].length > 0)
  }, [links])

  // Função para filtrar os links
  const filteredLinks = useMemo(() => {
    const result: Record<string, UsefulLink[]> = {}

    Object.entries(links).forEach(([theme, themeLinks]) => {
      const filtered = themeLinks.filter(link => {
        // Filtro por tema
        if (selectedTheme && link.theme !== selectedTheme) return false

        // Filtro por categoria
        if (selectedCategory && link.category !== selectedCategory) return false

        // Filtro por busca
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase()
          return (
            link.name.toLowerCase().includes(searchLower) ||
            link.description.toLowerCase().includes(searchLower) ||
            link.category.toLowerCase().includes(searchLower) ||
            link.url.toLowerCase().includes(searchLower)
          )
        }

        return true
      })

      if (filtered.length > 0) {
        result[theme] = filtered
      }
    })

    return result
  }, [links, searchTerm, selectedCategory, selectedTheme])

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedTheme('')
  }

  // Verificar se há filtros ativos
  const hasActiveFilters = searchTerm || selectedCategory || selectedTheme

  // Calcular estatísticas
  const totalLinks = Object.values(links).flat().length
  const filteredCount = Object.values(filteredLinks).flat().length

  // Função para renderizar ícones com fallback
  const renderIcon = (icon: string) => {
    // Se for uma URL de imagem
    if (icon.startsWith('http')) {
      return (
        <img
          src={icon}
          alt=''
          className='link-icon me-3'
          width='32'
          height='32'
          onError={e => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            // Criar fallback visual
            const fallback = document.createElement('span')
            fallback.className = 'fs-4 me-3'
            fallback.innerHTML = '🔗'
            fallback.setAttribute('aria-hidden', 'true')
            target.parentNode?.insertBefore(fallback, target.nextSibling)
          }}
        />
      )
    }
    // Se for emoji ou texto
    return (
      <span className='fs-4 me-3' aria-hidden='true'>
        {icon}
      </span>
    )
  }

  const renderLinkCard = (link: UsefulLink) => (
    <div key={link.id} className='col-md-6 col-xl-4 mb-4'>
      <article className='card h-100 shadow-sm border-0 link-card'>
        <div className='card-body d-flex flex-column'>
          <header className='d-flex align-items-start mb-3'>
            {renderIcon(link.icon)}
            <div className='flex-grow-1'>
              <h3 className='card-title h6 mb-2 fw-bold'>{link.name}</h3>
              <span
                className='badge bg-secondary small'
                aria-label={`Categoria: ${link.category}`}
              >
                {link.category}
              </span>
            </div>
          </header>

          <p className='card-text text-muted small mb-auto'>
            {link.description}
          </p>

          <footer className='mt-3'>
            <a
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className='btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center'
              aria-label={`Visitar ${link.name} - abre em nova aba`}
            >
              <FaExternalLinkAlt className='me-2' aria-hidden='true' />
              Acessar Link
            </a>
          </footer>
        </div>
      </article>
    </div>
  )

  if (loading) {
    return (
      <div className='container py-5'>
        <div className='text-center' role='status' aria-live='polite'>
          <div className='spinner-border text-primary mb-3' aria-hidden='true'>
            <span className='visually-hidden'>Carregando...</span>
          </div>
          <p className='text-muted'>Carregando recursos técnicos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container py-5'>
        <div className='alert alert-danger' role='alert'>
          <h4 className='alert-heading'>Erro ao Carregar</h4>
          <p className='mb-0'>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-4'>
      {/* Header Principal */}
      <header className='row mb-5'>
        <div className='col-lg-10 mx-auto text-center'>
          <h1 className='display-4 fw-bold mb-3 technical-title'>
            <FaCode className='me-3 text-primary' aria-hidden='true' />
            Recursos Técnicos
          </h1>
          <p className='lead text-muted mb-4'>
            Coleção cuidadosamente selecionada de ferramentas, recursos e
            comunidades essenciais para manutenção de computadores e recuperação
            de sistemas. Esses links irão ajudar a expandir o conhecimento e
            encontrar suporte adicional.
          </p>

          {/* Estatísticas */}
          <div className='row justify-content-center mb-4'>
            <div className='col-auto'>
              <div className='badge bg-primary fs-6 px-3 py-2'>
                <strong>{totalLinks}</strong> recursos catalogados
              </div>
            </div>
            <div className='col-auto'>
              <div className='badge bg-secondary fs-6 px-3 py-2'>
                <strong>{availableThemes.length}</strong> categorias técnicas
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Seção de Filtros */}
      <section className='mb-5' aria-labelledby='filters-section'>
        <div className='card border-0 shadow-sm'>
          <div className='card-header bg-dark text-white'>
            <h2
              id='filters-section'
              className='h5 mb-0 d-flex align-items-center'
            >
              <FaFilter className='me-2' aria-hidden='true' />
              Filtros de Busca
            </h2>
          </div>
          <div className='card-body'>
            <form role='search' onSubmit={e => e.preventDefault()}>
              <div className='row g-3'>
                <div className='col-md-6'>
                  <label
                    htmlFor='search-input'
                    className='form-label fw-semibold'
                  >
                    <FaSearch className='me-2' aria-hidden='true' />
                    Busca Textual
                  </label>
                  <div className='input-group'>
                    <input
                      type='search'
                      className='form-control'
                      id='search-input'
                      placeholder='Nome, descrição, categoria ou URL...'
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      aria-describedby='search-help'
                    />
                    {searchTerm && (
                      <button
                        className='btn btn-outline-secondary'
                        type='button'
                        onClick={() => setSearchTerm('')}
                        aria-label='Limpar busca'
                      >
                        <FaTimes aria-hidden='true' />
                      </button>
                    )}
                  </div>
                  <small id='search-help' className='form-text text-muted'>
                    Busque por qualquer termo relacionado aos recursos
                  </small>
                </div>

                <div className='col-md-3'>
                  <label
                    htmlFor='category-filter'
                    className='form-label fw-semibold'
                  >
                    Categoria
                  </label>
                  <select
                    className='form-select'
                    id='category-filter'
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    aria-describedby='category-help'
                  >
                    <option value=''>Todas as categorias</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <small id='category-help' className='form-text text-muted'>
                    Filtrar por tipo específico
                  </small>
                </div>

                <div className='col-md-3'>
                  <label
                    htmlFor='theme-filter'
                    className='form-label fw-semibold'
                  >
                    Área Técnica
                  </label>
                  <select
                    className='form-select'
                    id='theme-filter'
                    value={selectedTheme}
                    onChange={e => setSelectedTheme(e.target.value)}
                    aria-describedby='theme-help'
                  >
                    <option value=''>Todas as áreas</option>
                    {availableThemes.map(theme => (
                      <option key={theme} value={theme}>
                        {themeTitles[theme] || theme}
                      </option>
                    ))}
                  </select>
                  <small id='theme-help' className='form-text text-muted'>
                    Filtrar por domínio técnico
                  </small>
                </div>

                {hasActiveFilters && (
                  <div className='col-12'>
                    <button
                      className='btn btn-outline-danger btn-sm'
                      onClick={clearFilters}
                      aria-label='Remover todos os filtros aplicados'
                    >
                      <FaTimes className='me-2' aria-hidden='true' />
                      Limpar Filtros
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <main>
        {Object.keys(filteredLinks).length === 0 ? (
          <section
            className='text-center py-5'
            role='status'
            aria-live='polite'
          >
            <div className='mb-4'>
              <FaSearch className='display-1 text-muted' aria-hidden='true' />
            </div>
            <h2 className='h3 text-muted mb-3'>Nenhum Recurso Encontrado</h2>
            <p className='text-muted mb-4'>
              {hasActiveFilters
                ? 'Os filtros aplicados não retornaram resultados. Tente ajustar os critérios de busca.'
                : 'Não há recursos disponíveis no momento.'}
            </p>
            {hasActiveFilters && (
              <button
                className='btn btn-primary'
                onClick={clearFilters}
                aria-label='Remover filtros para ver todos os recursos'
              >
                <FaTimes className='me-2' aria-hidden='true' />
                Remover Filtros
              </button>
            )}
          </section>
        ) : (
          <>
            {/* Contador de Resultados */}
            {hasActiveFilters && (
              <div
                className='alert alert-info border-0 shadow-sm'
                role='status'
                aria-live='polite'
              >
                <div className='d-flex align-items-center'>
                  <FaSearch className='me-2 text-info' aria-hidden='true' />
                  <div>
                    <strong>
                      {filteredCount} de {totalLinks} recursos encontrados
                    </strong>
                    <div className='small text-muted mt-1'>
                      {searchTerm && `Termo: "${searchTerm}"`}
                      {selectedCategory &&
                        ` • Categoria: "${selectedCategory}"`}
                      {selectedTheme &&
                        ` • Área: "${
                          themeTitles[selectedTheme] || selectedTheme
                        }"`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Renderizar Seções por Tema */}
            {Object.entries(filteredLinks).map(([theme, themeLinks]) => (
              <section
                key={theme}
                className='mb-5'
                aria-labelledby={`theme-${theme}`}
              >
                <header className='mb-4'>
                  <div className='d-flex align-items-center mb-2'>
                    <span
                      className={`me-3 fs-3 ${
                        themeIconClasses[theme] || 'text-secondary'
                      }`}
                    >
                      {themeIcons[theme] || <FaTools aria-hidden='true' />}
                    </span>
                    <div className='flex-grow-1'>
                      <h2 id={`theme-${theme}`} className='mb-1 fw-bold'>
                        {themeTitles[theme] || theme}
                      </h2>
                      <p className='text-muted small mb-0'>
                        {themeDescriptions[theme] || 'Recursos especializados'}
                      </p>
                    </div>
                    <span
                      className='badge bg-primary rounded-pill fs-6'
                      aria-label={`${themeLinks.length} recursos nesta categoria`}
                    >
                      {themeLinks.length}
                    </span>
                  </div>
                  <hr className='mt-3' />
                </header>

                <div
                  className='row'
                  role='group'
                  aria-labelledby={`theme-${theme}`}
                >
                  {themeLinks.map(renderLinkCard)}
                </div>
              </section>
            ))}
          </>
        )}
      </main>

      {/* Seção de Boas Práticas Técnicas */}
      <aside className='mb-5' aria-labelledby='best-practices'>
        <div className='card border-0 shadow-sm bg-light'>
          <div className='card-header bg-secondary text-white'>
            <h2
              id='best-practices'
              className='h5 mb-0 d-flex align-items-center'
            >
              <FaShieldAlt className='me-2' aria-hidden='true' />
              Diretrizes Técnicas
            </h2>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-6'>
                <h3 className='h6 fw-bold mb-3 text-danger'>
                  <FaShieldAlt className='me-2' aria-hidden='true' />
                  Segurança Operacional
                </h3>
                <ul className='list-unstyled'>
                  <li className='mb-3 d-flex align-items-start'>
                    <span className='badge bg-danger me-2 mt-1'>1</span>
                    <div>
                      <strong>Backup:</strong> Sempre faça backup se possível
                      antes de tentar qualquer reparo no sistema.
                    </div>
                  </li>
                  <li className='mb-3 d-flex align-items-start'>
                    <span className='badge bg-danger me-2 mt-1'>2</span>
                    <div>
                      <strong>Verificação de integridade:</strong> Use
                      ferramentas confiáveis para garantir segurança e
                      desempenho.
                    </div>
                  </li>
                  <li className='mb-3 d-flex align-items-start'>
                    <span className='badge bg-danger me-2 mt-1'>3</span>
                    <div>
                      <strong>Ambiente de teste:</strong> Execute testes em
                      máquinas virtuais ou ambientes isolados quando possível
                    </div>
                  </li>
                  <li className='d-flex align-items-start'>
                    <span className='badge bg-danger me-2 mt-1'>4</span>
                    <div>
                      <strong>Atualizações de segurança:</strong> Mantenha as
                      ferramentas atualizadas para garantir compatibilidade e
                      segurança
                    </div>
                  </li>
                </ul>
              </div>

              <div className='col-md-6'>
                <h3 className='h6 fw-bold mb-3 text-success'>
                  <FaCode className='me-2' aria-hidden='true' />
                  Boas Práticas
                </h3>
                <ul className='list-unstyled'>
                  <li className='mb-3 d-flex align-items-start'>
                    <span className='badge bg-success me-2 mt-1'>1</span>
                    <div>
                      <strong>Documentação técnica:</strong> Documente seus
                      passos para facilitar futuras intervenções.
                    </div>
                  </li>
                  <li className='mb-3 d-flex align-items-start'>
                    <span className='badge bg-success me-2 mt-1'>2</span>
                    <div>
                      <strong>Testes pós-implementação:</strong> Teste sempre o
                      equipamento após o reparo para validar a solução aplicada.
                    </div>
                  </li>
                  <li className='mb-3 d-flex align-items-start'>
                    <span className='badge bg-success me-2 mt-1'>3</span>
                    <div>
                      <strong>Mantenha-se atualizado:</strong> com as últimas
                      ferramentas e técnicas para entregar a melhor solução.
                    </div>
                  </li>
                  <li className='d-flex align-items-start'>
                    <span className='badge bg-success me-2 mt-1'>4</span>
                    <div>
                      <strong>Compliance:</strong> Respeite a privacidade
                      mantendo sigilo profissional.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Disclaimer Legal */}
      <footer>
        <div className='alert alert-info border-0 shadow-sm' role='contentinfo'>
          <h3 className='h6 alert-heading fw-bold'>
            <FaShieldAlt className='me-2' aria-hidden='true' />
            Aviso Legal
          </h3>
          <p className='mb-2'>
            <strong>Responsabilidade:</strong> Este catálogo de links é
            exclusivamente para fins educacionais e profissionais. Não possuímos
            afiliação com os recursos listados.
          </p>
          <p className='mb-2'>
            <strong>Verificação:</strong> Sempre verifique a autenticidade das
            ferramentas e recursos antes de fazer download ou usá-los
          </p>
          <p className='mb-0'>
            <strong>Uso responsável:</strong> Use essas ferramentas com
            responsabilidade e por sua conta e risco.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default UsefulLinksPage
