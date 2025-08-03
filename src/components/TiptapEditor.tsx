// src/components/TiptapEditor.tsx - Versão corrigida e acessível
import React, { useState, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'
import { storage } from '../services/firebase'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaImage,
  FaUndo,
  FaRedo,
  FaUpload,
  FaTimes
} from 'react-icons/fa'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

interface ImageUploadModal {
  show: boolean
  file: File | null
  preview: string | null
  uploading: boolean
  error: string | null
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder = 'Escreva seu conteúdo aqui...',
  className = ''
}) => {
  const [imageModal, setImageModal] = useState<ImageUploadModal>({
    show: false,
    file: null,
    preview: null,
    uploading: false,
    error: null
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: 'fw-bold'
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: 'mb-3'
          }
        },
        bulletList: {
          HTMLAttributes: {
            class: 'ps-4 mb-3'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'ps-4 mb-3'
          }
        },
        blockquote: {
          HTMLAttributes: {
            class:
              'border-start border-4 border-primary ps-3 text-muted fst-italic my-3'
          }
        },
        code: {
          HTMLAttributes: {
            class: 'bg-light text-dark px-1 rounded'
          }
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-light p-3 rounded mb-3 border'
          }
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-decoration-underline text-primary'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'img-fluid rounded my-3'
        }
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'form-control border-0 p-3 h-auto',        
      }
    }
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validações
    if (file.size > 5 * 1024 * 1024) {
      setImageModal(prev => ({
        ...prev,
        error: 'O arquivo deve ter menos de 5MB'
      }))
      return
    }

    if (!file.type.startsWith('image/')) {
      setImageModal(prev => ({
        ...prev,
        error: 'Selecione apenas arquivos de imagem'
      }))
      return
    }

    // Preview da imagem
    const reader = new FileReader()
    reader.onload = e => {
      setImageModal({
        show: true,
        file,
        preview: e.target?.result as string,
        uploading: false,
        error: null
      })
    }
    reader.readAsDataURL(file)
  }

  const uploadImage = async () => {
    if (!imageModal.file || !editor) return

    setImageModal(prev => ({ ...prev, uploading: true, error: null }))

    try {
      // Gerar nome único para o arquivo
      const timestamp = Date.now()
      const fileName = `${timestamp}_${imageModal.file.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9.-]/g, '')}`

      // Upload para Firebase Storage
      const imageRef = storageRef(storage, `tutorials/${fileName}`)
      await uploadBytes(imageRef, imageModal.file)

      // Obter URL de download
      const downloadUrl = await getDownloadURL(imageRef)

      // Inserir imagem no editor
      editor
        .chain()
        .focus()
        .setImage({
          src: downloadUrl,
          alt: `Imagem do tutorial - ${fileName}`
        })
        .run()

      // Fechar modal
      setImageModal({
        show: false,
        file: null,
        preview: null,
        uploading: false,
        error: null
      })

      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      setImageModal(prev => ({
        ...prev,
        uploading: false,
        error: 'Erro ao fazer upload da imagem. Tente novamente.'
      }))
    }
  }

  const closeImageModal = () => {
    setImageModal({
      show: false,
      file: null,
      preview: null,
      uploading: false,
      error: null
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openImageDialog = () => {
    fileInputRef.current?.click()
  }

  const addImageByUrl = () => {
    const url = window.prompt('Digite a URL da imagem:')
    if (url && editor) {
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          alt: 'Imagem do tutorial'
        })
        .run()
    }
  }

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('Digite a URL:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  if (!editor) {
    return <div className='text-center p-4'>Carregando editor...</div>
  }

  return (
    <div className={`border rounded overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className='border-bottom bg-light p-2'>
        <div className='d-flex flex-wrap gap-2 align-items-center'>
          {/* Formatação de Texto */}
          <div
            className='btn-group'
            role='group'
            aria-label='Formatação de texto'
          >
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`btn btn-sm ${
                editor.isActive('bold')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              aria-label='Negrito'
              title='Negrito'
            >
              <FaBold />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`btn btn-sm ${
                editor.isActive('italic')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              aria-label='Itálico'
              title='Itálico'
            >
              <FaItalic />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`btn btn-sm ${
                editor.isActive('underline')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              aria-label='Sublinhado'
              title='Sublinhado'
            >
              <FaUnderline />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`btn btn-sm ${
                editor.isActive('strike')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              aria-label='Tachado'
              title='Tachado'
            >
              <FaStrikethrough />
            </button>
          </div>

          {/* Cabeçalhos */}
          <div
            className='btn-group'
            role='group'
            aria-label='Estilos de cabeçalho'
          >
            <select
              className='form-select form-select-sm'
              style={{ minWidth: '120px' }}
              aria-label='Selecionar estilo de texto'
              onChange={e => {
                const level = parseInt(e.target.value)
                if (level === 0) {
                  editor.chain().focus().setParagraph().run()
                } else {
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                    .run()
                }
              }}
              value={
                editor.isActive('heading', { level: 1 })
                  ? 1
                  : editor.isActive('heading', { level: 2 })
                  ? 2
                  : editor.isActive('heading', { level: 3 })
                  ? 3
                  : editor.isActive('heading', { level: 4 })
                  ? 4
                  : editor.isActive('heading', { level: 5 })
                  ? 5
                  : editor.isActive('heading', { level: 6 })
                  ? 6
                  : 0
              }
            >
              <option value={0}>Parágrafo</option>
              <option value={1}>Título 1</option>
              <option value={2}>Título 2</option>
              <option value={3}>Título 3</option>
              <option value={4}>Título 4</option>
              <option value={5}>Título 5</option>
              <option value={6}>Título 6</option>
            </select>
          </div>

          {/* Listas */}
          <div className='btn-group' role='group' aria-label='Listas'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`btn btn-sm ${
                editor.isActive('bulletList')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              aria-label='Lista não ordenada'
              title='Lista não ordenada'
            >
              <FaListUl />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`btn btn-sm ${
                editor.isActive('orderedList')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              aria-label='Lista ordenada'
              title='Lista ordenada'
            >
              <FaListOl />
            </button>
          </div>

          {/* Formatação Especial */}
          <div
            className='btn-group'
            role='group'
            aria-label='Formatação especial'
          >
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`btn btn-sm ${
                editor.isActive('blockquote')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              aria-label='Citação'
              title='Citação'
            >
              <FaQuoteLeft />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`btn btn-sm ${
                editor.isActive('code')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              aria-label='Código inline'
              title='Código inline'
            >
              <FaCode />
            </button>
          </div>

          {/* Links e Imagens */}
          <div className='btn-group' role='group' aria-label='Links e imagens'>
            <button
              type='button'
              onClick={setLink}
              className={`btn btn-sm ${
                editor.isActive('link')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              aria-label='Inserir link'
              title='Inserir link'
            >
              <FaLink />
            </button>

            <div className='btn-group' role='group'>
              <button
                type='button'
                className='btn btn-sm btn-outline-secondary dropdown-toggle'
                data-bs-toggle='dropdown'
                aria-expanded='false'
                aria-label='Opções de imagem'
                title='Inserir imagem'
              >
                <FaImage />
              </button>
              <ul className='dropdown-menu dropdown-menu-end'>
                <li>
                  <button
                    className='dropdown-item d-flex align-items-center gap-2'
                    type='button'
                    onClick={openImageDialog}
                    aria-label='Upload de imagem'
                  >
                    <FaUpload />
                    Upload de arquivo
                  </button>
                </li>
                <li>
                  <button
                    className='dropdown-item d-flex align-items-center gap-2'
                    type='button'
                    onClick={addImageByUrl}
                    aria-label='Inserir por URL'
                  >
                    <FaImage />
                    Por URL da imagem
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Desfazer/Refazer */}
          <div
            className='btn-group'
            role='group'
            aria-label='Desfazer e refazer'
          >
            <button
              type='button'
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className='btn btn-sm btn-outline-secondary'
              aria-label='Desfazer'
              title='Desfazer'
            >
              <FaUndo />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className='btn btn-sm btn-outline-secondary'
              aria-label='Refazer'
              title='Refazer'
            >
              <FaRedo />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className='bg-white'>
        <EditorContent editor={editor} />
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleImageSelect}
        className='d-none'
        aria-hidden='true'
      />

      {/* Image Upload Modal */}
      {imageModal.show && (
        <div
          className='modal fade show d-block'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          role='dialog'
          aria-modal='true'
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h2 className='modal-title h5'>Adicionar Imagem</h2>
                <button
                  type='button'
                  className='btn-close'
                  onClick={closeImageModal}
                  disabled={imageModal.uploading}
                  aria-label='Fechar modal'
                />
              </div>
              <div className='modal-body'>
                {imageModal.error && (
                  <div className='alert alert-danger d-flex align-items-center gap-2'>
                    <FaTimes />
                    <span>{imageModal.error}</span>
                  </div>
                )}

                {imageModal.preview && (
                  <div className='text-center mb-3'>
                    <img
                      src={imageModal.preview}
                      alt='Preview da imagem selecionada'
                      className='img-fluid rounded border'
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                )}

                {imageModal.file && (
                  <div className='mb-3'>
                    <p className='mb-1'>
                      <strong>Arquivo:</strong> {imageModal.file.name}
                    </p>
                    <p className='mb-0'>
                      <strong>Tamanho:</strong>{' '}
                      {(imageModal.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={closeImageModal}
                  disabled={imageModal.uploading}
                  aria-label='Cancelar upload'
                >
                  Cancelar
                </button>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={uploadImage}
                  disabled={!imageModal.file || imageModal.uploading}
                  aria-label='Confirmar upload da imagem'
                >
                  {imageModal.uploading ? (
                    <>
                      <span
                        className='spinner-border spinner-border-sm me-2'
                        role='status'
                        aria-hidden='true'
                      />
                      Enviando...
                    </>
                  ) : (
                    'Inserir Imagem'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TiptapEditor
