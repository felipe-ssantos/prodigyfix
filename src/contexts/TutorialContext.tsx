// src/contexts/TutorialContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../services/firebase'
import type { Tutorial, Category, SearchFilters } from '../types'

interface TutorialContextType {
  tutorials: Tutorial[]
  categories: Category[]
  favorites: string[]
  loading: boolean
  error: string | null
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
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load tutorials from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'tutorials'), orderBy('createdAt', 'desc')),
      snapshot => {
        const tutorialsData: Tutorial[] = []
        snapshot.forEach(doc => {
          const data = doc.data()
          tutorialsData.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            content: data.content,
            category: data.category,
            keywords: data.keywords || [],
            author: data.author,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            views: data.views || 0,
            difficulty: data.difficulty || 'Iniciante',
            estimatedTime: data.estimatedTime || 0,
            tags: data.tags || [],
            imageUrl: data.imageUrl || ''
          })
        })
        setTutorials(tutorialsData)
        setLoading(false)
      },
      err => {
        setError('Falha ao carregar tutoriais')
        console.error('Erro ao carregar tutoriais:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Load categories from Firestore
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'))
        const categoriesData: Category[] = []
        querySnapshot.forEach(doc => {
          const data = doc.data()
          categoriesData.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            icon: data.icon,
            tutorialCount: data.tutorialCount || 0
          })
        })
        setCategories(categoriesData)
      } catch (err) {
        console.error('Erro ao carregar categorias:', err)
      }
    }

    loadCategories()
  }, [])

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bootpedia-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('bootpedia-favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (tutorialId: string) => {
    setFavorites(prev => [...prev, tutorialId])
  }

  const removeFromFavorites = (tutorialId: string) => {
    setFavorites(prev => prev.filter(id => id !== tutorialId))
  }

  const isFavorite = (tutorialId: string) => {
    return favorites.includes(tutorialId)
  }

  const searchTutorials = (searchQuery: string, filters?: SearchFilters) => {
    return tutorials.filter(tutorial => {
      const matchesQuery =
        !searchQuery ||
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tutorial.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesCategory =
        !filters?.category || tutorial.category === filters.category
      const matchesDifficulty =
        !filters?.difficulty || tutorial.difficulty === filters.difficulty
      const matchesTags =
        !filters?.tags?.length ||
        filters.tags.some(tag => tutorial.tags.includes(tag))

      return matchesQuery && matchesCategory && matchesDifficulty && matchesTags
    })
  }

  const getTutorialById = (id: string) => {
    return tutorials.find(tutorial => tutorial.id === id)
  }

  const getTutorialsByCategory = (category: string) => {
    return tutorials.filter(tutorial => tutorial.category === category)
  }

  const getNextTutorial = (id: string) => {
    const currentIndex = tutorials.findIndex(tutorial => tutorial.id === id)
    if (currentIndex !== -1 && currentIndex < tutorials.length - 1) {
      return tutorials[currentIndex + 1]
    }
    return undefined
  }

  const getPreviousTutorial = (id: string) => {
    const currentIndex = tutorials.findIndex(tutorial => tutorial.id === id)
    if (currentIndex > 0) {
      return tutorials[currentIndex - 1]
    }
    return undefined
  }

  const createTutorial = async (
    tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt' | 'views'>
  ) => {
    try {
      const docRef = await addDoc(collection(db, 'tutorials'), {
        ...tutorialData,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0
      })
      return docRef.id
    } catch (err) {
      console.error('Erro ao criar tutorial:', err)
      throw err
    }
  }

  const updateTutorial = async (
    id: string,
    tutorialData: Partial<Tutorial>
  ) => {
    try {
      const tutorialRef = doc(db, 'tutorials', id)
      await updateDoc(tutorialRef, {
        ...tutorialData,
        updatedAt: new Date()
      })
    } catch (err) {
      console.error('Erro ao atualizar o tutorial:', err)
      throw err
    }
  }

  const deleteTutorial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tutorials', id))
    } catch (err) {
      console.error('Erro ao excluir tutorial:', err)
      throw err
    }
  }

  const incrementViews = async (id: string) => {
    try {
      const tutorialRef = doc(db, 'tutorials', id)
      const tutorialSnap = await getDoc(tutorialRef)

      if (tutorialSnap.exists()) {
        const currentViews = tutorialSnap.data().views || 0
        await updateDoc(tutorialRef, {
          views: currentViews + 1,
          updatedAt: new Date()
        })
      }
    } catch (err) {
      console.error('Erro ao incrementar visualizações:', err)
    }
  }

  const value: TutorialContextType = {
    tutorials,
    categories,
    favorites,
    loading,
    error,
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
    incrementViews
  }

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTutorials = (): TutorialContextType => {
  const context = useContext(TutorialContext)
  if (context === undefined) {
    throw new Error('useTutorials deve ser usado dentro de um TutorialProvider')
  }
  return context
}
