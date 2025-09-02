// src/pages/admin/UsefulLinksManager.tsx
import React, { useState, useEffect } from 'react'
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaExternalLinkAlt
} from 'react-icons/fa'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'
import {
  addUsefulLink,
  updateUsefulLink,
  deleteUsefulLink
} from '../../services/usefulLinks'
import { UsefulLink } from '../../types/usefulLinks'

const UsefulLinksManager: React.FC = () => {
  const [links, setLinks] = useState<UsefulLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLink, setEditingLink] = useState<UsefulLink | null>(null)
  const [isAdding, setIsAdding] = useState(false)
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

      // Ordenar localmente por tema e ordem
      const sortedLinks = allLinks.sort((a, b) => {
        if (a.theme !== b.theme) {
          return a.theme.localeCompare(b.theme)
        }
        return (a.order || 0) - (b.order || 0)
      })

      setLinks(sortedLinks)
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
        icon: '', // Removido o valor padrão
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

  // Função para renderizar ícones (emoji ou imagem)
  const renderIcon = (icon: string) => {
    if (!icon) return <span className='text-muted'>Sem ícone</span>

    // Se for uma URL de imagem
    if (icon.startsWith('http')) {
      return (
        <img
          className='img-24 object-fit-contain'
          src={icon}
          alt='Ícone'
          onError={e => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      )
    }
    // Se for emoji ou texto
    return <span>{icon}</span>
  }

  if (loading) {
    return (
      <div className='container-fluid py-4'>
        <div className='text-center'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Carregando...</span>
          </div>
          <p className='mt-3'>Carregando links...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container-fluid py-4'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2>Gerenciar Links Úteis</h2>
        <button
          className='btn btn-primary'
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <FaPlus className='me-2' />
          Adicionar Link
        </button>
      </div>

      {/* Formulário de Adição */}
      {isAdding && (
        <div className='card mb-4'>
          <div className='card-header'>
            <h5 className='mb-0'>Adicionar Novo Link</h5>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-6 mb-3'>
                <label className='form-label'>Nome</label>
                <input
                  aria-label='Nome do link'
                  type='text'
                  className='form-control'
                  value={newLink.name}
                  onChange={e =>
                    setNewLink({ ...newLink, name: e.target.value })
                  }
                />
              </div>
              <div className='col-md-6 mb-3'>
                <label className='form-label'>URL</label>
                <input
                  aria-label='URL do link'
                  type='url'
                  className='form-control'
                  value={newLink.url}
                  onChange={e =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                />
              </div>
              <div className='col-md-12 mb-3'>
                <label className='form-label'>Descrição</label>
                <textarea
                  aria-label='Descrição do link'
                  className='form-control'
                  value={newLink.description}
                  onChange={e =>
                    setNewLink({ ...newLink, description: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div className='col-md-3 mb-3'>
                <label className='form-label'>
                  Ícone (emoji ou URL de imagem)
                </label>
                <input
                  type='text'
                  className='form-control'
                  value={newLink.icon}
                  onChange={e =>
                    setNewLink({ ...newLink, icon: e.target.value })
                  }
                  placeholder='https://...'
                />
                {newLink.icon?.startsWith('http') && (
                  <div className='mt-2'>
                    <small className='text-muted'>Preview:</small>
                    <div className='mt-1'>
                      <img
                        className='img-24 object-fit-contain'
                        src={newLink.icon}
                        alt='Preview'
                        onError={e => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className='col-md-3 mb-3'>
                <label className='form-label'>Categoria</label>
                <input
                  aria-label='Categoria do link'
                  type='text'
                  className='form-control'
                  value={newLink.category}
                  onChange={e =>
                    setNewLink({ ...newLink, category: e.target.value })
                  }
                />
              </div>
              <div className='col-md-3 mb-3'>
                <label className='form-label'>Tema</label>
                <select
                  aria-label='Tema do link'
                  className='form-select'
                  value={newLink.theme}
                  onChange={e =>
                    setNewLink({ ...newLink, theme: e.target.value })
                  }
                >
                  <option value='tools'>Ferramentas</option>
                  <option value='resources'>Recursos</option>
                  <option value='communities'>Comunidades</option>
                  <option value='learning'>Aprendizado</option>
                  <option value='security'>Segurança</option>
                </select>
              </div>
              <div className='col-md-3 mb-3'>
                <label className='form-label'>Ordem</label>
                <input
                  aria-label='Ordem do link'
                  type='number'
                  className='form-control'
                  value={newLink.order || 0}
                  onChange={e =>
                    setNewLink({
                      ...newLink,
                      order: parseInt(e.target.value) || 0
                    })
                  }
                />
              </div>
            </div>
            <div className='d-flex gap-2'>
              <button
                type='button'
                className='btn btn-primary'
                onClick={handleAddLink}
              >
                <FaSave className='me-2' />
                Salvar
              </button>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => setIsAdding(false)}
              >
                <FaTimes className='me-2' />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Links */}
      <div className='card'>
        <div className='card-body'>
          {links.length === 0 ? (
            <div className='text-center py-4'>
              <p className='text-muted'>Nenhum link encontrado.</p>
              <button
                className='btn btn-primary'
                onClick={() => setIsAdding(true)}
              >
                <FaPlus className='me-2' />
                Adicionar Primeiro Link
              </button>
            </div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>Ícone</th>
                    <th>Nome</th>
                    <th>URL</th>
                    <th>Tema</th>
                    <th>Ordem</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map(link => (
                    <tr key={link.id}>
                      <td>
                        <div className='d-flex align-items-center justify-content-center size-40'>
                          {renderIcon(link.icon)}
                        </div>
                        {editingLink?.id === link.id && (
                          <input
                            aria-label='Ícone do link'
                            type='text'
                            className='form-control form-control-sm mt-1'
                            value={editingLink.icon}
                            onChange={e =>
                              setEditingLink({
                                ...editingLink,
                                icon: e.target.value
                              })
                            }
                            placeholder='🔗 ou https://...'
                          />
                        )}
                      </td>
                      <td>
                        {editingLink?.id === link.id ? (
                          <input
                            aria-label='Nome do link'
                            type='text'
                            className='form-control form-control-sm'
                            value={editingLink.name}
                            onChange={e =>
                              setEditingLink({
                                ...editingLink,
                                name: e.target.value
                              })
                            }
                          />
                        ) : (
                          link.name
                        )}
                      </td>
                      <td>
                        {editingLink?.id === link.id ? (
                          <input
                            aria-label='URL do link'
                            type='text'
                            className='form-control form-control-sm'
                            value={editingLink.url}
                            onChange={e =>
                              setEditingLink({
                                ...editingLink,
                                url: e.target.value
                              })
                            }
                          />
                        ) : (
                          <a
                            href={link.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-decoration-none'
                          >
                            {link.url.length > 30
                              ? `${link.url.substring(0, 30)}...`
                              : link.url}
                            <FaExternalLinkAlt className='ms-1' size={10} />
                          </a>
                        )}
                      </td>
                      <td>
                        {editingLink?.id === link.id ? (
                          <select
                            aria-label='Tema do link'
                            className='form-select form-select-sm'
                            value={editingLink.theme}
                            onChange={e =>
                              setEditingLink({
                                ...editingLink,
                                theme: e.target.value
                              })
                            }
                          >
                            <option value='tools'>Ferramentas</option>
                            <option value='resources'>Recursos</option>
                            <option value='communities'>Comunidades</option>
                            <option value='learning'>Aprendizado</option>
                            <option value='security'>Segurança</option>
                          </select>
                        ) : (
                          link.theme
                        )}
                      </td>
                      <td>
                        {editingLink?.id === link.id ? (
                          <input
                            aria-label='Ordem do link'
                            type='number'
                            className='form-control form-control-sm w-25'
                            value={editingLink.order}
                            onChange={e =>
                              setEditingLink({
                                ...editingLink,
                                order: parseInt(e.target.value) || 0
                              })
                            }
                          />
                        ) : (
                          link.order
                        )}
                      </td>
                      <td>
                        {editingLink?.id === link.id ? (
                          <div className='btn-group btn-group-sm'>
                            <button
                              aria-label='Salvar link'
                              type='button'
                              className='btn btn-success'
                              onClick={handleUpdateLink}
                            >
                              <FaSave />
                            </button>
                            <button
                              aria-label='Cancelar edição'
                              type='button'
                              className='btn btn-secondary'
                              onClick={() => setEditingLink(null)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <div className='btn-group btn-group-sm'>
                            <button
                              aria-label='Editar link'
                              type='button'
                              className='btn btn-primary'
                              onClick={() => setEditingLink({ ...link })}
                            >
                              <FaEdit />
                            </button>
                            <button
                              aria-label='Excluir link'
                              type='button'
                              className='btn btn-danger'
                              onClick={() => handleDeleteLink(link.id)}
                            >
                              <FaTrash />
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
    </div>
  )
}

export default UsefulLinksManager
