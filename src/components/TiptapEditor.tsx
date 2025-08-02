// src/components/TiptapEditor.tsx
import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
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
  FaRedo
} from 'react-icons/fa'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder = 'Escreva seu conteúdo aqui...',
  className = ''
}) => {
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
        class: 'form-control border-0 p-3 h-auto tiptap-editor-content'
      }
    }
  })

  const addImage = () => {
    const url = window.prompt('Insira a URL da imagem:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
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
        <div className='d-flex flex-wrap gap-1'>
          {/* Text Formatting */}
          <div className='btn-group me-2' role='group'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`btn btn-sm ${
                editor.isActive('bold')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              title='Bold'
            >
              <FaBold size={12} />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`btn btn-sm ${
                editor.isActive('italic')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              title='Italic'
            >
              <FaItalic size={12} />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`btn btn-sm ${
                editor.isActive('underline')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              title='Underline'
            >
              <FaUnderline size={12} />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`btn btn-sm ${
                editor.isActive('strike')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              title='Strikethrough'
            >
              <FaStrikethrough size={12} />
            </button>
          </div>

          {/* Headings */}
          <div className='btn-group me-2' role='group'>
            <select
              className='form-select form-select-sm'
              aria-label='Opções de formatação de texto'
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
              <option value={0}>Paragraph</option>
              <option value={1}>Heading 1</option>
              <option value={2}>Heading 2</option>
              <option value={3}>Heading 3</option>
              <option value={4}>Heading 4</option>
              <option value={5}>Heading 5</option>
              <option value={6}>Heading 6</option>
            </select>
          </div>

          {/* Lists */}
          <div className='btn-group me-2' role='group'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`btn btn-sm ${
                editor.isActive('bulletList')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              title='Bullet List'
            >
              <FaListUl size={12} />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`btn btn-sm ${
                editor.isActive('orderedList')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              title='Ordered List'
            >
              <FaListOl size={12} />
            </button>
          </div>

          {/* Special Formatting */}
          <div className='btn-group me-2' role='group'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`btn btn-sm ${
                editor.isActive('blockquote')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              title='Quote'
            >
              <FaQuoteLeft size={12} />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`btn btn-sm ${
                editor.isActive('code')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              title='Inline Code'
            >
              <FaCode size={12} />
            </button>
          </div>

          {/* Links and Images */}
          <div className='btn-group me-2' role='group'>
            <button
              type='button'
              onClick={setLink}
              className={`btn btn-sm ${
                editor.isActive('link')
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              title='Add Link'
            >
              <FaLink size={12} />
            </button>
            <button
              type='button'
              onClick={addImage}
              className='btn btn-sm btn-outline-secondary'
              title='Add Image'
            >
              <FaImage size={12} />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className='btn-group' role='group'>
            <button
              type='button'
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className='btn btn-sm btn-outline-secondary'
              title='Undo'
            >
              <FaUndo size={12} />
            </button>
            <button
              type='button'
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className='btn btn-sm btn-outline-secondary'
              title='Redo'
            >
              <FaRedo size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className='bg-white'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TiptapEditor
