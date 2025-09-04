// src/contexts/TutorialContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../services/firebase'
import type { Tutorial, Category, SearchFilters } from '../types'

interface TutorialContextType {
  tutorials: Tutorial[]
  categories: Category[]
  favorites: string[]
  loading: boolean
  error: string | null
  categoriesLoading: boolean
  categoriesError: string | null
  addToFavorites: (tutorialId: string) => void
  removeFromFavorites: (tutorialId: string) => void
  isFavorite: (tutorialId: string) => boolean
  searchTutorials: (query: string, filters?: SearchFilters) => Tutorial[]
  getTutorialById: (id: string) => Tutorial | undefined
  getTutorialsByCategory: (category: string) => Tutorial[]
  getNextTutorial: (id: string) => Tutorial | undefined
  getPreviousTutorial: (id: string) => Tutorial | undefined
  createTutorial: (
    tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt' | 'views'>
  ) => Promise<string>
  updateTutorial: (id: string, tutorialData: Partial<Tutorial>) => Promise<void>
  deleteTutorial: (id: string) => Promise<void>
  incrementViews: (id: string) => Promise<void>
  getDifficultyLabel: (difficulty: string) => string
  formatCategoryName: (category: string) => string
  refreshCategories: () => Promise<void>
  addCategory: (categoryName: string) => Promise<void>
}

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined
)

interface TutorialProviderProps {
  children: ReactNode
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({
  children
}) => {
  const [user] = useAuthState(auth) as [User | null, boolean, Error | undefined]
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  // Carrega tutoriais do Firestore
  const loadTutorials = async () => {
    try {
      setLoading(true)
      setError(null)

      const tutorialsRef = collection(db, 'tutorials')
      const querySnapshot = await getDocs(
        query(tutorialsRef, orderBy('createdAt', 'desc'))
      )

      const tutorialsList: Tutorial[] = []
      querySnapshot.forEach(doc => {
        const data = doc.data()
        tutorialsList.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Tutorial)
      })

      setTutorials(tutorialsList)
    } catch (err) {
      console.error('Erro ao carregar tutoriais:', err)
      setError('Erro ao carregar tutoriais')
    } finally {
      setLoading(false)
    }
  }

  // Carrega categorias do Firestore
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true)
      setCategoriesError(null)

      const categoriesRef = collection(db, 'categories')
      const querySnapshot = await getDocs(categoriesRef)

      const categoriesList: Category[] = []
      querySnapshot.forEach(doc => {
        const data = doc.data()
        categoriesList.push({
          id: doc.id,
          ...data
        } as Category)
      })

      setCategories(categoriesList)
    } catch (err) {
      console.error('Erro ao carregar categorias:', err)
      setCategoriesError('Erro ao carregar categorias')
    } finally {
      setCategoriesLoading(false)
    }
  }

  // Carrega favoritos do usuário (se estiver logado)
  const loadFavorites = React.useCallback(async () => {
    if (!user) {
      setFavorites([])
      return
    }

    try {
      // Implementar lógica de favoritos se necessário
      // Por enquanto, mantém vazio
      setFavorites([])
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err)
    }
  }, [user])

  useEffect(() => {
    loadTutorials()
    loadCategories()
  }, [])

  useEffect(() => {
    loadFavorites()
  }, [user, loadFavorites])

  // Função para incrementar visualizações (com tratamento de erro)
  const incrementViews = async (id: string): Promise<void> => {
    try {
      const tutorialRef = doc(db, 'tutorials', id)

      // Primeiro, verifica se o documento existe e tem o campo views
      const tutorialDoc = await getDoc(tutorialRef)
      if (!tutorialDoc.exists()) {
        throw new Error('Tutorial não encontrado')
      }

      const currentViews = tutorialDoc.data()?.views ?? 0

      // Atualiza no Firebase
      await updateDoc(tutorialRef, {
        views: currentViews + 1
      })

      // Incrementa localmente após sucesso no Firebase
      setTutorials(prev =>
        prev.map(tutorial =>
          tutorial.id === id
            ? { ...tutorial, views: (tutorial.views ?? 0) + 1 }
            : tutorial
        )
      )
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error)
      // Em caso de erro, ainda incrementa localmente para melhor UX
      setTutorials(prev =>
        prev.map(tutorial =>
          tutorial.id === id
            ? { ...tutorial, views: (tutorial.views ?? 0) + 1 }
            : tutorial
        )
      )
    }
  }

  // Implementações das funções de favoritos
  const addToFavorites = (tutorialId: string) => {
    if (!favorites.includes(tutorialId)) {
      setFavorites(prev => [...prev, tutorialId])
      // Aqui você pode adicionar lógica para salvar no Firebase se necessário
    }
  }

  const removeFromFavorites = (tutorialId: string) => {
    setFavorites(prev => prev.filter(id => id !== tutorialId))
    // Aqui você pode adicionar lógica para remover do Firebase se necessário
  }

  const isFavorite = (tutorialId: string) => {
    return favorites.includes(tutorialId)
  }

  // Função de busca
  const searchTutorials = (
    query: string,
    filters?: SearchFilters
  ): Tutorial[] => {
    let filtered = tutorials

    if (query) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(
        tutorial =>
          tutorial.title.toLowerCase().includes(searchTerm) ||
          tutorial.description.toLowerCase().includes(searchTerm) ||
          tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          tutorial.keywords.some(keyword =>
            keyword.toLowerCase().includes(searchTerm)
          )
      )
    }

    if (filters?.category) {
      filtered = filtered.filter(
        tutorial => tutorial.category === filters.category
      )
    }

    if (filters?.difficulty) {
      filtered = filtered.filter(
        tutorial => tutorial.difficulty === filters.difficulty
      )
    }

    if (filters?.tags?.length) {
      filtered = filtered.filter(tutorial =>
        filters.tags!.some(tag => tutorial.tags.includes(tag))
      )
    }

    return filtered
  }

  // Funções utilitárias
  const getTutorialById = (id: string): Tutorial | undefined => {
    return tutorials.find(tutorial => tutorial.id === id)
  }

  const getTutorialsByCategory = (category: string): Tutorial[] => {
    return tutorials.filter(tutorial => tutorial.category === category)
  }

  const getNextTutorial = (id: string): Tutorial | undefined => {
    const currentIndex = tutorials.findIndex(tutorial => tutorial.id === id)
    if (currentIndex !== -1 && currentIndex < tutorials.length - 1) {
      return tutorials[currentIndex + 1]
    }
    return undefined
  }

  const getPreviousTutorial = (id: string): Tutorial | undefined => {
    const currentIndex = tutorials.findIndex(tutorial => tutorial.id === id)
    if (currentIndex > 0) {
      return tutorials[currentIndex - 1]
    }
    return undefined
  }

  // Funções CRUD (apenas para usuários autenticados)
  const createTutorial = async (
    tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt' | 'views'>
  ): Promise<string> => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    try {
      const now = new Date()
      const docRef = await addDoc(collection(db, 'tutorials'), {
        ...tutorialData,
        views: 0,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      })

      // Recarrega tutoriais
      await loadTutorials()

      return docRef.id
    } catch (error) {
      console.error('Erro ao criar tutorial:', error)
      throw error
    }
  }

  const updateTutorial = async (
    id: string,
    tutorialData: Partial<Tutorial>
  ): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    try {
      const tutorialRef = doc(db, 'tutorials', id)
      await updateDoc(tutorialRef, {
        ...tutorialData,
        updatedAt: Timestamp.fromDate(new Date())
      })

      // Recarrega tutoriais
      await loadTutorials()
    } catch (error) {
      console.error('Erro ao atualizar tutorial:', error)
      throw error
    }
  }

  const deleteTutorial = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    try {
      await deleteDoc(doc(db, 'tutorials', id))

      // Recarrega tutoriais
      await loadTutorials()
    } catch (error) {
      console.error('Erro ao deletar tutorial:', error)
      throw error
    }
  }

  // Funções utilitárias
  const getDifficultyLabel = (difficulty: string): string => {
    const labels: { [key: string]: string } = {
      Iniciante: 'Iniciante',
      Intermediário: 'Intermediário',
      Avançado: 'Avançado'
    }
    return labels[difficulty] || difficulty
  }

  const formatCategoryName = (category: string): string => {
    const categoryData = categories.find(cat => cat.id === category)
    return categoryData ? categoryData.name : category
  }

  const refreshCategories = async (): Promise<void> => {
    await loadCategories()
  }

  const addCategory = async (categoryName: string): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    try {
      await addDoc(collection(db, 'categories'), {
        name: categoryName,
        description: '',
        icon: '📁',
        tutorialCount: 0,
        isFeatured: false
      })

      await refreshCategories()
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error)
      throw error
    }
  }

  const contextValue: TutorialContextType = {
    tutorials,
    categories,
    favorites,
    loading,
    error,
    categoriesLoading,
    categoriesError,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    searchTutorials,
    getTutorialById,
    getTutorialsByCategory,
    getNextTutorial,
    getPreviousTutorial,
    createTutorial,
    updateTutorial,
    deleteTutorial,
    incrementViews,
    getDifficultyLabel,
    formatCategoryName,
    refreshCategories,
    addCategory
  }

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  )
}

export { TutorialContext }
export type { TutorialContextType }
