// src/pages/admin/UsefulLinksManager.tsx
import React, { useState, useEffect, useMemo } from 'react'
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaExternalLinkAlt,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'
import {
  addUsefulLink,
  updateUsefulLink,
  deleteUsefulLink
} from '../../services/usefulLinks'
import { UsefulLink } from '../../types/usefulLinks'
import './UsefulLinksManager.css'

type SortField = 'name' | 'theme' | 'category' | 'order' | 'createdAt'
type SortDirection = 'asc' | 'desc'

const UsefulLinksManager: React.FC = () => {
  const [links, setLinks] = useState<UsefulLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLink, setEditingLink] = useState<UsefulLink | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Estados para filtros e pesquisa
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [sortField, setSortField] = useState<SortField>('order')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const [newLink, setNewLink] = useState<Partial<UsefulLink>>({
    name: '',
    description: '',
    url: '',
    icon: '',
    category: '',
    theme: 'tools',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    loadLinks()
  }, [])

  // Extrair dados únicos para filtros
  const filterOptions = useMemo(() => {
    const themes = new Set<string>()
    const categories = new Set<string>()

    links.forEach(link => {
      themes.add(link.theme)
      if (link.category) categories.add(link.category)
    })

    return {
      themes: Array.from(themes).sort(),
      categories: Array.from(categories).sort()
    }
  }, [links])

  // Filtrar e ordenar links
  const filteredAndSortedLinks = useMemo(() => {
    const filtered = links.filter(link => {
      // Filtro de busca textual
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
          link.name.toLowerCase().includes(searchLower) ||
          link.description.toLowerCase().includes(searchLower) ||
          link.url.toLowerCase().includes(searchLower) ||
          link.category.toLowerCase().includes(searchLower) ||
          link.theme.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Filtro por tema
      if (selectedTheme && link.theme !== selectedTheme) return false

      // Filtro por categoria
      if (selectedCategory && link.category !== selectedCategory) return false

      // Filtro por status
      if (statusFilter === 'active' && !link.isActive) return false
      if (statusFilter === 'inactive' && link.isActive) return false

      return true
    })

    // Ordenação
    filtered.sort((a, b) => {
      let valueA: string | number | Date
      let valueB: string | number | Date

      switch (sortField) {
        case 'name':
          valueA = a.name.toLowerCase()
          valueB = b.name.toLowerCase()
          break
        case 'theme':
          valueA = a.theme
          valueB = b.theme
          break
        case 'category':
          valueA = a.category
          valueB = b.category
          break
        case 'order':
          valueA = a.order || 0
          valueB = b.order || 0
          break
        case 'createdAt':
          valueA = a.createdAt || new Date(0)
          valueB = b.createdAt || new Date(0)
          break
        default:
          return 0
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [
    links,
    searchTerm,
    selectedTheme,
    selectedCategory,
    statusFilter,
    sortField,
    sortDirection
  ])

  const loadLinks = async () => {
    try {
      setLoading(true)
      const linksRef = collection(db, 'usefulLinks')
      const q = query(linksRef)
      const querySnapshot = await getDocs(q)

      const allLinks: UsefulLink[] = []
      querySnapshot.forEach(doc => {
        allLinks.push({ id: doc.id, ...doc.data() } as UsefulLink)
      })

      setLinks(allLinks)
    } catch (error) {
      console.error('Erro ao carregar links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLink = async () => {
    try {
      await addUsefulLink(
        newLink as Omit<UsefulLink, 'id' | 'createdAt' | 'updatedAt'>
      )
      setIsAdding(false)
      setNewLink({
        name: '',
        description: '',
        url: '',
        icon: '',
        category: '',
        theme: 'tools',
        order: 0,
        isActive: true
      })
      loadLinks()
    } catch (error) {
      console.error('Erro ao adicionar link:', error)
    }
  }

  const handleUpdateLink = async () => {
    if (!editingLink) return

    try {
      await updateUsefulLink(editingLink.id, editingLink)
      setEditingLink(null)
      loadLinks()
    } catch (error) {
      console.error('Erro ao atualizar link:', error)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este link?')) return

    try {
      await deleteUsefulLink(id)
      loadLinks()
    } catch (error) {
      console.error('Erro ao excluir link:', error)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTheme('')
    setSelectedCategory('')
    setStatusFilter('all')
  }

  const hasActiveFilters =
    searchTerm || selectedTheme || selectedCategory || statusFilter !== 'all'

  // Função para renderizar ícones (emoji ou imagem)
  const renderIcon = (icon: string) => {
    if (!icon) return <span className='text-muted small'>N/A</span>

    // Se for uma URL de imagem
    if (icon.startsWith('http')) {
      return (
        <img
          className='link-admin-icon'
          src={icon}
          alt=''
          width='24'
          height='24'
          onError={e => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      )
    }
    // Se for emoji ou texto
    return <span className='fs-5'>{icon}</span>
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className='text-muted' />
    return sortDirection === 'asc' ? (
      <FaSortUp className='text-primary' />
    ) : (
      <FaSortDown className='text-primary' />
    )
  }

  if (loading) {
    return (
      <div className='container-fluid py-4'>
        <div className='text-center' role='status' aria-live='polite'>
          <div className='spinner-border text-primary mb-3' aria-hidden='true'>
            <span className='visually-hidden'>Carregando...</span>
          </div>
          <p className='text-muted'>Carregando sistema de gerenciamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container-fluid py-4'>
      {/* Header */}
      <header className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h1 className='h2 mb-1'>Gerenciador de Recursos Técnicos</h1>
          <p className='text-muted mb-0'>
            {links.length} recursos • {filteredAndSortedLinks.length} exibidos
          </p>
        </div>
        <button
          className='btn btn-primary'
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          aria-label='Adicionar novo recurso técnico'
        >
          <FaPlus className='me-2' aria-hidden='true' />
          Novo Recurso
        </button>
      </header>

      {/* Sistema de Filtros e Pesquisa */}
      <section className='mb-4' aria-labelledby='filters-section'>
        <div className='card border-0 shadow-sm'>
          <div className='card-header bg-dark text-white'>
            <h2
              id='filters-section'
              className='h6 mb-0 d-flex align-items-center'
            >
              <FaFilter className='me-2' aria-hidden='true' />
              Filtros e Pesquisa
            </h2>
          </div>
          <div className='card-body'>
            <form role='search' onSubmit={e => e.preventDefault()}>
              <div className='row g-3'>
                {/* Busca Textual */}
                <div className='col-md-4'>
                  <label
                    htmlFor='search-input'
                    className='form-label fw-semibold'
                  >
                    <FaSearch className='me-2' aria-hidden='true' />
                    Busca Global
                  </label>
                  <div className='input-group'>
                    <input
                      type='search'
                      className='form-control'
                      id='search-input'
                      placeholder='Nome, URL, descrição...'
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
                    Busca em todos os campos do recurso
                  </small>
                </div>

                {/* Filtro por Tema */}
                <div className='col-md-2'>
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
                    <option value=''>Todas</option>
                    {filterOptions.themes.map(theme => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                  <small id='theme-help' className='form-text text-muted'>
                    Filtrar por domínio
                  </small>
                </div>

                {/* Filtro por Categoria */}
                <div className='col-md-2'>
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
                    <option value=''>Todas</option>
                    {filterOptions.categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <small id='category-help' className='form-text text-muted'>
                    Filtrar por tipo
                  </small>
                </div>

                {/* Filtro por Status */}
                <div className='col-md-2'>
                  <label
                    htmlFor='status-filter'
                    className='form-label fw-semibold'
                  >
                    Status
                  </label>
                  <select
                    className='form-select'
                    id='status-filter'
                    value={statusFilter}
                    onChange={e =>
                      setStatusFilter(
                        e.target.value as 'all' | 'active' | 'inactive'
                      )
                    }
                    aria-describedby='status-help'
                  >
                    <option value='all'>Todos</option>
                    <option value='active'>Ativos</option>
                    <option value='inactive'>Inativos</option>
                  </select>
                  <small id='status-help' className='form-text text-muted'>
                    Filtrar por estado
                  </small>
                </div>

                {/* Ordenação */}
                <div className='col-md-2'>
                  <label
                    htmlFor='sort-filter'
                    className='form-label fw-semibold'
                  >
                    Ordenação
                  </label>
                  <select
                    className='form-select'
                    id='sort-filter'
                    value={`${sortField}-${sortDirection}`}
                    onChange={e => {
                      const [field, direction] = e.target.value.split('-')
                      setSortField(field as SortField)
                      setSortDirection(direction as SortDirection)
                    }}
                    aria-describedby='sort-help'
                  >
                    <option value='name-asc'>Nome (A-Z)</option>
                    <option value='name-desc'>Nome (Z-A)</option>
                    <option value='theme-asc'>Tema (A-Z)</option>
                    <option value='theme-desc'>Tema (Z-A)</option>
                    <option value='category-asc'>Categoria (A-Z)</option>
                    <option value='category-desc'>Categoria (Z-A)</option>
                    <option value='order-asc'>Ordem (Crescente)</option>
                    <option value='order-desc'>Ordem (Decrescente)</option>
                    <option value='createdAt-desc'>Mais Recentes</option>
                    <option value='createdAt-asc'>Mais Antigos</option>
                  </select>
                  <small id='sort-help' className='form-text text-muted'>
                    Ordenar resultados
                  </small>
                </div>

                {/* Botão Limpar Filtros */}
                {hasActiveFilters && (
                  <div className='col-12'>
                    <div className='d-flex align-items-center gap-3'>
                      <button
                        className='btn btn-outline-warning btn-sm'
                        onClick={clearFilters}
                        aria-label='Remover todos os filtros aplicados'
                      >
                        <FaTimes className='me-2' aria-hidden='true' />
                        Limpar Filtros
                      </button>
                      <small className='text-muted'>
                        {filteredAndSortedLinks.length} de {links.length}{' '}
                        recursos exibidos
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Formulário de Adição */}
      {isAdding && (
        <section className='mb-4' aria-labelledby='add-form-title'>
          <div className='card border-0 shadow-sm'>
            <div className='card-header bg-primary text-white'>
              <h2 id='add-form-title' className='h5 mb-0'>
                <FaPlus className='me-2' aria-hidden='true' />
                Adicionar Novo Recurso Técnico
              </h2>
            </div>
            <div className='card-body'>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleAddLink()
                }}
              >
                <div className='row'>
                  <div className='col-md-6 mb-3'>
                    <label
                      htmlFor='add-name'
                      className='form-label fw-semibold'
                    >
                      Nome do Recurso *
                    </label>
                    <input
                      id='add-name'
                      type='text'
                      className='form-control'
                      value={newLink.name}
                      onChange={e =>
                        setNewLink({ ...newLink, name: e.target.value })
                      }
                      required
                      aria-describedby='add-name-help'
                    />
                    <small id='add-name-help' className='form-text text-muted'>
                      Nome identificador do recurso
                    </small>
                  </div>

                  <div className='col-md-6 mb-3'>
                    <label htmlFor='add-url' className='form-label fw-semibold'>
                      URL do Recurso *
                    </label>
                    <input
                      id='add-url'
                      type='url'
                      className='form-control'
                      value={newLink.url}
                      onChange={e =>
                        setNewLink({ ...newLink, url: e.target.value })
                      }
                      required
                      aria-describedby='add-url-help'
                    />
                    <small id='add-url-help' className='form-text text-muted'>
                      URL completa do recurso
                    </small>
                  </div>

                  <div className='col-md-12 mb-3'>
                    <label
                      htmlFor='add-description'
                      className='form-label fw-semibold'
                    >
                      Descrição Técnica *
                    </label>
                    <textarea
                      id='add-description'
                      className='form-control'
                      value={newLink.description}
                      onChange={e =>
                        setNewLink({ ...newLink, description: e.target.value })
                      }
                      rows={3}
                      required
                      aria-describedby='add-description-help'
                    />
                    <small
                      id='add-description-help'
                      className='form-text text-muted'
                    >
                      Descrição detalhada da funcionalidade e uso
                    </small>
                  </div>

                  <div className='col-md-3 mb-3'>
                    <label
                      htmlFor='add-icon'
                      className='form-label fw-semibold'
                    >
                      Ícone
                    </label>
                    <input
                      id='add-icon'
                      type='text'
                      className='form-control'
                      value={newLink.icon}
                      onChange={e =>
                        setNewLink({ ...newLink, icon: e.target.value })
                      }
                      placeholder='🔧 ou https://...'
                      aria-describedby='add-icon-help'
                    />
                    <small id='add-icon-help' className='form-text text-muted'>
                      Emoji ou URL da imagem
                    </small>
                    {newLink.icon && (
                      <div className='mt-2 p-2 bg-light rounded'>
                        <small className='text-muted d-block'>Preview:</small>
                        {renderIcon(newLink.icon)}
                      </div>
                    )}
                  </div>

                  <div className='col-md-3 mb-3'>
                    <label
                      htmlFor='add-category'
                      className='form-label fw-semibold'
                    >
                      Categoria *
                    </label>
                    <input
                      id='add-category'
                      type='text'
                      className='form-control'
                      value={newLink.category}
                      onChange={e =>
                        setNewLink({ ...newLink, category: e.target.value })
                      }
                      required
                      aria-describedby='add-category-help'
                      list='category-suggestions'
                    />
                    <datalist id='category-suggestions'>
                      {filterOptions.categories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                    <small
                      id='add-category-help'
                      className='form-text text-muted'
                    >
                      Tipo específico do recurso
                    </small>
                  </div>

                  <div className='col-md-3 mb-3'>
                    <label
                      htmlFor='add-theme'
                      className='form-label fw-semibold'
                    >
                      Área Técnica *
                    </label>
                    <select
                      id='add-theme'
                      className='form-select'
                      value={newLink.theme}
                      onChange={e =>
                        setNewLink({ ...newLink, theme: e.target.value })
                      }
                      required
                      aria-describedby='add-theme-help'
                    >
                      <option value='tools'>Ferramentas</option>
                      <option value='resources'>Recursos</option>
                      <option value='communities'>Comunidades</option>
                      <option value='learning'>Aprendizado</option>
                      <option value='security'>Segurança</option>
                      <option value='development'>Desenvolvimento</option>
                      <option value='database'>Banco de Dados</option>
                    </select>
                    <small id='add-theme-help' className='form-text text-muted'>
                      Domínio técnico principal
                    </small>
                  </div>

                  <div className='col-md-3 mb-3'>
                    <label
                      htmlFor='add-order'
                      className='form-label fw-semibold'
                    >
                      Ordem de Exibição
                    </label>
                    <input
                      id='add-order'
                      type='number'
                      className='form-control'
                      value={newLink.order || 0}
                      onChange={e =>
                        setNewLink({
                          ...newLink,
                          order: parseInt(e.target.value) || 0
                        })
                      }
                      min='0'
                      aria-describedby='add-order-help'
                    />
                    <small id='add-order-help' className='form-text text-muted'>
                      Posição na listagem (0 = primeiro)
                    </small>
                  </div>
                </div>

                <div className='d-flex gap-2 mt-3'>
                  <button
                    type='submit'
                    className='btn btn-success'
                    aria-label='Salvar novo recurso'
                  >
                    <FaSave className='me-2' aria-hidden='true' />
                    Salvar Recurso
                  </button>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => setIsAdding(false)}
                    aria-label='Cancelar adição'
                  >
                    <FaTimes className='me-2' aria-hidden='true' />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Tabela de Links */}
      <main>
        <div className='card border-0 shadow-sm'>
          <div className='card-header bg-secondary text-white d-flex justify-content-between align-items-center'>
            <h2 className='h6 mb-0'>Recursos Cadastrados</h2>
            {hasActiveFilters && (
              <span className='badge bg-warning text-dark'>Filtros Ativos</span>
            )}
          </div>
          <div className='card-body p-0'>
            {filteredAndSortedLinks.length === 0 ? (
              <div
                className='text-center py-5'
                role='status'
                aria-live='polite'
              >
                {hasActiveFilters ? (
                  <>
                    <FaSearch
                      className='display-4 text-muted mb-3'
                      aria-hidden='true'
                    />
                    <h3 className='h5 text-muted'>Nenhum recurso encontrado</h3>
                    <p className='text-muted mb-3'>
                      Os filtros aplicados não retornaram resultados.
                    </p>
                    <button
                      className='btn btn-outline-primary'
                      onClick={clearFilters}
                      aria-label='Remover todos os filtros'
                    >
                      <FaTimes className='me-2' aria-hidden='true' />
                      Limpar Filtros
                    </button>
                  </>
                ) : (
                  <>
                    <p className='text-muted'>Nenhum recurso cadastrado.</p>
                    <button
                      className='btn btn-primary'
                      onClick={() => setIsAdding(true)}
                      aria-label='Adicionar primeiro recurso'
                    >
                      <FaPlus className='me-2' aria-hidden='true' />
                      Adicionar Primeiro Recurso
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className='table-responsive'>
                <table className='table table-hover mb-0' role='table'>
                  <thead className='table-dark'>
                    <tr role='row'>
                      <th scope='col' className='text-center'>
                        Ícone
                      </th>
                      <th scope='col'>
                        <button
                          className='btn btn-link text-white text-decoration-none p-0 fw-semibold'
                          onClick={() => handleSort('name')}
                          aria-label='Ordenar por nome'
                        >
                          Nome {getSortIcon('name')}
                        </button>
                      </th>
                      <th scope='col'>URL</th>
                      <th scope='col'>
                        <button
                          className='btn btn-link text-white text-decoration-none p-0 fw-semibold'
                          onClick={() => handleSort('theme')}
                          aria-label='Ordenar por tema'
                        >
                          Tema {getSortIcon('theme')}
                        </button>
                      </th>
                      <th scope='col'>
                        <button
                          className='btn btn-link text-white text-decoration-none p-0 fw-semibold'
                          onClick={() => handleSort('category')}
                          aria-label='Ordenar por categoria'
                        >
                          Categoria {getSortIcon('category')}
                        </button>
                      </th>
                      <th scope='col'>
                        <button
                          className='btn btn-link text-white text-decoration-none p-0 fw-semibold'
                          onClick={() => handleSort('order')}
                          aria-label='Ordenar por ordem'
                        >
                          Ordem {getSortIcon('order')}
                        </button>
                      </th>
                      <th scope='col' className='text-center'>
                        Status
                      </th>
                      <th scope='col' className='text-center'>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedLinks.map(link => (
                      <tr key={link.id} role='row'>
                        <td className='text-center'>
                          <div className='d-flex align-items-center justify-content-center'>
                            {editingLink?.id === link.id ? (
                              <div>
                                <input
                                  type='text'
                                  className='form-control form-control-sm mb-1'
                                  value={editingLink.icon}
                                  onChange={e =>
                                    setEditingLink({
                                      ...editingLink,
                                      icon: e.target.value
                                    })
                                  }
                                  placeholder='🔗 ou https://...'
                                  aria-label='Editar ícone'
                                />
                                <div className='mt-1'>
                                  {renderIcon(editingLink.icon)}
                                </div>
                              </div>
                            ) : (
                              renderIcon(link.icon)
                            )}
                          </div>
                        </td>
                        <td>
                          {editingLink?.id === link.id ? (
                            <input
                              type='text'
                              className='form-control form-control-sm'
                              value={editingLink.name}
                              onChange={e =>
                                setEditingLink({
                                  ...editingLink,
                                  name: e.target.value
                                })
                              }
                              aria-label='Editar nome'
                            />
                          ) : (
                            <div>
                              <div className='fw-semibold'>{link.name}</div>
                              <small className='text-muted'>
                                {link.description}
                              </small>
                            </div>
                          )}
                        </td>
                        <td>
                          {editingLink?.id === link.id ? (
                            <input
                              type='url'
                              className='form-control form-control-sm'
                              value={editingLink.url}
                              onChange={e =>
                                setEditingLink({
                                  ...editingLink,
                                  url: e.target.value
                                })
                              }
                              aria-label='Editar URL'
                            />
                          ) : (
                            <a
                              href={link.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-decoration-none d-flex align-items-center'
                              aria-label={`Visitar ${link.name} - abre em nova aba`}
                            >
                              <span className='me-2'>
                                {link.url.length > 40
                                  ? `${link.url.substring(0, 40)}...`
                                  : link.url}
                              </span>
                              <FaExternalLinkAlt size={12} aria-hidden='true' />
                            </a>
                          )}
                        </td>
                        <td>
                          {editingLink?.id === link.id ? (
                            <select
                              className='form-select form-select-sm'
                              value={editingLink.theme}
                              onChange={e =>
                                setEditingLink({
                                  ...editingLink,
                                  theme: e.target.value
                                })
                              }
                              aria-label='Editar tema'
                            >
                              <option value='tools'>Ferramentas</option>
                              <option value='resources'>Recursos</option>
                              <option value='communities'>Comunidades</option>
                              <option value='learning'>Aprendizado</option>
                              <option value='security'>Segurança</option>
                              <option value='development'>
                                Desenvolvimento
                              </option>
                              <option value='database'>Banco de Dados</option>
                            </select>
                          ) : (
                            <span className='badge bg-info'>{link.theme}</span>
                          )}
                        </td>
                        <td>
                          {editingLink?.id === link.id ? (
                            <input
                              type='text'
                              className='form-control form-control-sm'
                              value={editingLink.category}
                              onChange={e =>
                                setEditingLink({
                                  ...editingLink,
                                  category: e.target.value
                                })
                              }
                              aria-label='Editar categoria'
                              list='edit-category-suggestions'
                            />
                          ) : (
                            <span className='badge bg-secondary'>
                              {link.category}
                            </span>
                          )}
                          <datalist id='edit-category-suggestions'>
                            {filterOptions.categories.map(cat => (
                              <option key={cat} value={cat} />
                            ))}
                          </datalist>
                        </td>
                        <td>
                          {editingLink?.id === link.id ? (
                            <input
                              type='number'
                              className='form-control form-control-sm'
                              value={editingLink.order}
                              onChange={e =>
                                setEditingLink({
                                  ...editingLink,
                                  order: parseInt(e.target.value) || 0
                                })
                              }
                              min='0'
                              aria-label='Editar ordem'
                            />
                          ) : (
                            <span className='badge bg-dark'>{link.order}</span>
                          )}
                        </td>
                        <td className='text-center'>
                          {editingLink?.id === link.id ? (
                            <div className='form-check form-switch d-flex justify-content-center'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                checked={editingLink.isActive}
                                onChange={e =>
                                  setEditingLink({
                                    ...editingLink,
                                    isActive: e.target.checked
                                  })
                                }
                                aria-label='Status ativo/inativo'
                              />
                            </div>
                          ) : (
                            <span
                              className={`badge ${
                                link.isActive ? 'bg-success' : 'bg-danger'
                              }`}
                            >
                              {link.isActive ? (
                                <>
                                  <FaEye className='me-1' aria-hidden='true' />
                                  Ativo
                                </>
                              ) : (
                                <>
                                  <FaEyeSlash
                                    className='me-1'
                                    aria-hidden='true'
                                  />
                                  Inativo
                                </>
                              )}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingLink?.id === link.id ? (
                            <div
                              className='btn-group btn-group-sm'
                              role='group'
                              aria-label='Ações de edição'
                            >
                              <button
                                type='button'
                                className='btn btn-success'
                                onClick={handleUpdateLink}
                                aria-label='Salvar alterações'
                              >
                                <FaSave aria-hidden='true' />
                              </button>
                              <button
                                type='button'
                                className='btn btn-secondary'
                                onClick={() => setEditingLink(null)}
                                aria-label='Cancelar edição'
                              >
                                <FaTimes aria-hidden='true' />
                              </button>
                            </div>
                          ) : (
                            <div
                              className='btn-group btn-group-sm'
                              role='group'
                              aria-label='Ações do recurso'
                            >
                              <button
                                type='button'
                                className='btn btn-outline-primary'
                                onClick={() => setEditingLink({ ...link })}
                                aria-label={`Editar ${link.name}`}
                              >
                                <FaEdit aria-hidden='true' />
                              </button>
                              <button
                                type='button'
                                className='btn btn-outline-danger'
                                onClick={() => handleDeleteLink(link.id)}
                                aria-label={`Excluir ${link.name}`}
                              >
                                <FaTrash aria-hidden='true' />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Resumo de Estatísticas */}
      <aside className='mt-4' aria-labelledby='stats-section'>
        <div className='card border-0 shadow-sm bg-light'>
          <div className='card-body'>
            <h2 id='stats-section' className='h6 fw-bold mb-3'>
              Estatísticas do Sistema
            </h2>
            <div className='row text-center'>
              <div className='col-md-3'>
                <div className='border-end'>
                  <div className='fs-4 fw-bold text-primary'>
                    {links.length}
                  </div>
                  <small className='text-muted'>Total de Recursos</small>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='border-end'>
                  <div className='fs-4 fw-bold text-success'>
                    {links.filter(l => l.isActive).length}
                  </div>
                  <small className='text-muted'>Recursos Ativos</small>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='border-end'>
                  <div className='fs-4 fw-bold text-info'>
                    {filterOptions.themes.length}
                  </div>
                  <small className='text-muted'>Áreas Técnicas</small>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='fs-4 fw-bold text-warning'>
                  {filterOptions.categories.length}
                </div>
                <small className='text-muted'>Categorias</small>
              </div>
            </div>
          </div>
        </div>
      </aside>      
    </div>
  )
}

export default UsefulLinksManager
