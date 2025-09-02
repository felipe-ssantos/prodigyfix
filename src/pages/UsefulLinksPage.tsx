// src/pages/UsefulLinksPage.tsx
import { useState, useMemo } from 'react'
import { FaExternalLinkAlt, FaSearch, FaTimes } from 'react-icons/fa'
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

  // Função para renderizar ícones (emoji ou imagem)
  const renderIcon = (icon: string) => {
    // Se for uma URL de imagem
    if (icon.startsWith('http')) {
      return (
        <img
          src={icon}
          alt='Ícone'
          className='me-3 img-32 object-fit-contain'
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
            rel='noopener noreferrer'
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
      <div className='row mb-4'>
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

      {/* Barra de Busca e Filtros */}
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='row g-3'>
            <div className='col-md-6'>
              <label htmlFor='search' className='form-label'>
                <FaSearch className='me-2' />
                Buscar por nome, descrição ou URL
              </label>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control'
                  id='search'
                  placeholder='Digite para buscar...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className='btn btn-outline-secondary'
                    type='button'
                    onClick={() => setSearchTerm('')}
                    title='Limpar busca'
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className='col-md-3'>
              <label htmlFor='category' className='form-label'>
                Filtrar por categoria
              </label>
              <select
                className='form-select'
                id='category'
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value=''>Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-md-3'>
              <label htmlFor='theme' className='form-label'>
                Filtrar por tema
              </label>
              <select
                className='form-select'
                id='theme'
                value={selectedTheme}
                onChange={e => setSelectedTheme(e.target.value)}
              >
                <option value=''>Todos os temas</option>
                {Object.entries(themeTitles).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <div className='col-12'>
                <button
                  className='btn btn-outline-secondary btn-sm'
                  onClick={clearFilters}
                >
                  <FaTimes className='me-1' />
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resultados da Busca */}
      {Object.keys(filteredLinks).length === 0 ? (
        <div className='text-center py-5'>
          <div className='mb-4'>
            <span className='display-1 text-muted'>🔍</span>
          </div>
          <h3 className='text-muted'>Nenhum resultado encontrado</h3>
          <p className='text-muted mb-4'>
            Tente ajustar os termos de busca ou filtrar por outra categoria.
          </p>
          {hasActiveFilters && (
            <button className='btn btn-primary' onClick={clearFilters}>
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Contador de resultados */}
          {hasActiveFilters && (
            <div className='alert alert-info mb-4'>
              <strong>
                {Object.values(filteredLinks).flat().length} resultado(s)
                encontrado(s)
              </strong>
              {searchTerm && ` para "${searchTerm}"`}
              {selectedCategory && ` na categoria "${selectedCategory}"`}
              {selectedTheme &&
                ` no tema "${themeTitles[selectedTheme] || selectedTheme}"`}
            </div>
          )}

          {/* Renderizar cada tema de links filtrados */}
          {Object.entries(filteredLinks).map(([theme, themeLinks]) => (
            <section key={theme} className='mb-5'>
              <div className='d-flex align-items-center mb-4'>
                <span className={`me-2 fs-4 ${themeIconClasses[theme] || ''}`}>
                  {themeIcons[theme] || '📁'}
                </span>
                <h2 className='mb-0'>{themeTitles[theme] || theme}</h2>
                <span className='badge bg-primary ms-3'>
                  {themeLinks.length} link(s)
                </span>
              </div>
              <div className='row'>{themeLinks.map(renderLinkCard)}</div>
            </section>
          ))}
        </>
      )}

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
                    <strong>
                      Sempre faça backup (se possível) dos seus dados
                    </strong>{' '}
                    antes de tentar qualquer reparo no sistema
                  </li>
                  <li className='mb-2'>
                    <strong>Use ferramentas confiáveis</strong> para garantir
                    segurança e desempenho.
                  </li>
                  <li className='mb-2'>
                    <strong>Teste sempre o equipamento após o reparo</strong>{' '}
                    para validar a solução aplicada.
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
                    <strong>Documente seus passos</strong> para facilitar
                    futuras intervenções.
                  </li>
                  <li className='mb-2'>
                    <strong>Teste sempre o equipamento após o reparo</strong>{' '}
                    para validar a solução aplicada.
                  </li>
                  <li className='mb-2'>
                    <strong>Mantenha-se atualizado</strong> com as últimas
                    ferramentas e técnicas
                  </li>
                  <li className='mb-2'>
                    <strong>Respeite a privacidade</strong> mantendo sigilo
                    profissional.
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
