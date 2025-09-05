// src/pages/SearchResults.tsx
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa'
import { useTutorials } from '../hooks/useTutorials'
import TutorialCard from '../components/ui/TutorialCard'
import { SearchFilters, Tutorial, Category } from '../types'

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchTutorials, categories } = useTutorials()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [searchResults, setSearchResults] = useState<{
    tutorials: Tutorial[]
    total: number
  }>({ tutorials: [], total: 0 })

  useEffect(() => {
    const searchQuery = searchParams.get('q') || ''
    setQuery(searchQuery)

    const results = searchTutorials(searchQuery, filters)
    setSearchResults({ tutorials: results, total: results.length })
  }, [searchParams, filters, searchTutorials])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query.trim() })
    }
  }

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string | string[] | undefined
  ) => {
    const newFilters = { ...filters }
    if (value) {
      newFilters[key] = value as string & string[]
    } else {
      delete newFilters[key]
    }
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className='container py-4'>
      {/* Search Header */}
      <div className='row mb-4'>
        <div className='col-lg-8 mx-auto'>
          <form onSubmit={handleSearch} className='mb-4'>
            <div className='input-group input-group-lg'>
              <input
                type='text'
                className='form-control'
                placeholder='Pesquisar tutoriais...'
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button
                className='btn btn-primary'
                type='submit'
                aria-label='Search'
              >
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Filters Toggle */}
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <div>
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm'
                onClick={() => setShowFilters(!showFilters)}
                aria-label={showFilters ? 'Esconder filtros' : 'Mostrar filtros'}
              >
                <FaFilter className='me-1' />
                Filtros
              </button>
              {hasActiveFilters && (
                <button
                  type='button'
                  className='btn btn-outline-danger btn-sm ms-2'
                  onClick={clearFilters}
                  aria-label='Limpar filtros'
                >
                  <FaTimes className='me-1' />
                  Limpar filtros
                </button>
              )}
            </div>
            <div className='text-muted'>
              {searchResults.total}{' '}
              {searchResults.total === 1 ? 'resultado' : 'resultados'} encontrados
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className='card mb-4'>
              <div className='card-body'>
                <h6 className='mb-3'>Resultado da Pesquisa</h6>
                <div className='row g-3'>
                  <div className='col-md-6'>
                    <label htmlFor='category-filter' className='form-label'>
                      Categoria
                    </label>
                    <select
                      id='category-filter'
                      className='form-select'
                      value={filters.category || ''}
                      onChange={e =>
                        handleFilterChange(
                          'category',
                          e.target.value || undefined
                        )
                      }
                      aria-label='Select category'
                    >
                      <option value=''>Todas as Categorias</option>
                      {categories.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col-md-6'>
                    <label htmlFor='difficulty-filter' className='form-label'>
                      Dificuldade
                    </label>
                    <select
                      id='difficulty-filter'
                      className='form-select'
                      value={filters.difficulty || ''}
                      onChange={e =>
                        handleFilterChange(
                          'difficulty',
                          e.target.value || undefined
                        )
                      }
                      aria-label='Select difficulty level'
                    >
                      <option value=''>Todas as Dificuldades</option>
                      <option value='beginner'>Iniciante</option>
                      <option value='intermediate'>Intermediário</option>
                      <option value='advanced'>Avançado</option>
                    </select>
                  </div>
                  <div className='col-md-6'>
                    <label htmlFor='time-range-filter' className='form-label'>
                      Faixa de Tempo
                    </label>
                    <select
                      id='time-range-filter'
                      className='form-select'
                      value={filters.timeRange || ''}
                      onChange={e =>
                        handleFilterChange(
                          'timeRange',
                          e.target.value || undefined
                        )
                      }
                      aria-label='Select time range'
                    >
                      <option value=''>Qualquer Tempo</option>
                      <option value='0-15'>0-15 minutos</option>
                      <option value='15-30'>15-30 minutos</option>
                      <option value='30-60'>30-60 minutos</option>
                      <option value='60+'>60+ minutos</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className='row'>
        <div className='col-12'>
          {searchResults.tutorials.length > 0 ? (
            <>
              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className='mb-3'>
                  <small className='text-muted'>Active filters:</small>
                  <div className='d-flex flex-wrap gap-2 mt-1'>
                    {filters.category && (
                      <span className='badge bg-primary'>
                        Category:{' '}
                        {
                          categories.find(
                            (c: Category) => c.id === filters.category
                          )?.name
                        }
                      </span>
                    )}
                    {filters.difficulty && (
                      <span className='badge bg-warning'>
                        Difficulty: {filters.difficulty}
                      </span>
                    )}
                    {filters.timeRange && (
                      <span className='badge bg-info'>
                        Time: {filters.timeRange}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Results Grid */}
              <div className='row g-4'>
                {searchResults.tutorials.map((tutorial: Tutorial) => (
                  <div key={tutorial.id} className='col-md-6 col-lg-4'>
                    <TutorialCard tutorial={tutorial} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='text-center py-5'>
              <div className='mb-3'>
                <span className='display-1 text-muted'>🔍</span>
              </div>
              <h4 className='text-muted'>
                {query ? 'Nenhum resultado encontrado' : 'Comece a pesquisar'}
              </h4>
              <p className='text-muted'>
                {query
                  ? `Nenhum tutorial encontrado para "${query}". Tente palavras-chave diferentes ou ajuste seus filtros.`
                  : 'Digite palavras-chave para pesquisar tutoriais.'}
              </p>
              {query && (
                <div className='mt-3'>
                  <button
                    type='button'
                    className='btn btn-outline-secondary'
                    onClick={() => {
                      setQuery('')
                      setSearchParams({})
                    }}
                    aria-label='Clear search'
                  >
                    Limpar Pesquisa
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResults
