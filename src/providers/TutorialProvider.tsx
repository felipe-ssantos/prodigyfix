// src/providers/TutorialProvider.tsx
import React, { useState, useEffect, ReactNode, useCallback } from 'react'
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
import {
  TutorialContext,
  TutorialContextType
} from '../contexts/TutorialContext'

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
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  const normalizeDifficulty = useCallback(
    (difficulty: string): 'Iniciante' | 'Intermediário' | 'Avançado' => {
      const normalized = difficulty.toLowerCase().trim()
      switch (normalized) {
        case 'beginner':
        case 'iniciante':
        case 'básico':
        case 'basic':
          return 'Iniciante'
        case 'intermediate':
        case 'intermediário':
        case 'intermedio':
        case 'médio':
        case 'medio':
          return 'Intermediário'
        case 'advanced':
        case 'avançado':
        case 'avancado':
        case 'expert':
        case 'difícil':
        case 'dificil':
          return 'Avançado'
        default:
          return 'Iniciante'
      }
    },
    []
  )

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
            title: data.title || 'Sem título',
            description: data.description || 'Sem descrição',
            content: data.content || '',
            category: data.category || 'Geral',
            keywords: data.keywords || [],
            author: data.author || 'Autor desconhecido',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            views: data.views || 0,
            difficulty: normalizeDifficulty(data.difficulty || 'Iniciante'),
            estimatedTime: data.estimatedTime || 5,
            tags: data.tags || [],
            imageUrl: data.imageUrl || '',
            version: data.version || '',
            osCompatibility: data.osCompatibility || []
          })
        })
        setTutorials(tutorialsData)
        setLoading(false)
      },
      err => {
        setError('Falha ao carregar tutoriais. Verifique sua conexão.')
        console.error('Erro ao carregar tutoriais:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [normalizeDifficulty])

  const refreshCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true)
      setCategoriesError(null)

      const querySnapshot = await getDocs(collection(db, 'categories'))
      const categoriesData: Category[] = []

      querySnapshot.forEach(doc => {
        const data = doc.data()
        categoriesData.push({
          id: doc.id,
          name: data.name || 'Categoria sem nome',
          description: data.description || 'Sem descrição',
          icon: data.icon || '📁',
          tutorialCount: data.tutorialCount || 0,
          isFeatured: data.isFeatured || false
        })
      })

      const updatedCategories = categoriesData.map(category => ({
        ...category,
        tutorialCount: tutorials.filter(t => t.category === category.id).length
      }))

      setCategories(updatedCategories)
    } catch (err) {
      console.error('Erro ao carregar categorias:', err)
      setCategoriesError('Falha ao carregar categorias')
    } finally {
      setCategoriesLoading(false)
    }
  }, [tutorials])

  useEffect(() => {
    const loadCategories = async () => {
      await refreshCategories()
    }

    loadCategories()
  }, [refreshCategories])

  useEffect(() => {
    if (categories.length > 0 && tutorials.length > 0) {
      const updatedCategories = categories.map(category => ({
        ...category,
        tutorialCount: tutorials.filter(t => t.category === category.id).length
      }))

      if (JSON.stringify(updatedCategories) !== JSON.stringify(categories)) {
        setCategories(updatedCategories)
      }
    }
  }, [tutorials, categories])

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bootpedia-favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err)
        setFavorites([])
      }
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bootpedia-favorites', JSON.stringify(favorites))
    } catch (err) {
      console.error('Erro ao salvar favoritos:', err)
    }
  }, [favorites])

  const addToFavorites = useCallback((tutorialId: string) => {
    setFavorites(prev => {
      if (!prev.includes(tutorialId)) {
        return [...prev, tutorialId]
      }
      return prev
    })
  }, [])

  const removeFromFavorites = useCallback((tutorialId: string) => {
    setFavorites(prev => prev.filter(id => id !== tutorialId))
  }, [])

  const isFavorite = useCallback(
    (tutorialId: string) => favorites.includes(tutorialId),
    [favorites]
  )

  const searchTutorials = useCallback(
    (searchQuery: string, filters?: SearchFilters) => {
      const query = searchQuery?.toLowerCase().trim() || ''

      return tutorials.filter(tutorial => {
        const matchesQuery =
          !query ||
          tutorial.title.toLowerCase().includes(query) ||
          tutorial.description.toLowerCase().includes(query) ||
          tutorial.author.toLowerCase().includes(query) ||
          tutorial.tags.some(tag => tag.toLowerCase().includes(query)) ||
          tutorial.keywords.some(keyword =>
            keyword.toLowerCase().includes(query)
          )

        const matchesCategory =
          !filters?.category || tutorial.category === filters.category

        const matchesDifficulty =
          !filters?.difficulty || tutorial.difficulty === filters.difficulty

        const matchesTags =
          !filters?.tags?.length ||
          filters.tags.some(tag =>
            tutorial.tags.some(tutorialTag =>
              tutorialTag.toLowerCase().includes(tag.toLowerCase())
            )
          )

        let matchesTimeRange = true
        if (filters?.timeRange) {
          const now = new Date()
          const tutorialDate = new Date(tutorial.createdAt)
          const diffInDays = Math.floor(
            (now.getTime() - tutorialDate.getTime()) / (1000 * 3600 * 24)
          )

          switch (filters.timeRange) {
            case 'week':
              matchesTimeRange = diffInDays <= 7
              break
            case 'month':
              matchesTimeRange = diffInDays <= 30
              break
            case 'year':
              matchesTimeRange = diffInDays <= 365
              break
            default:
              matchesTimeRange = true
          }
        }

        return (
          matchesQuery &&
          matchesCategory &&
          matchesDifficulty &&
          matchesTags &&
          matchesTimeRange
        )
      })
    },
    [tutorials]
  )

  const getTutorialById = useCallback(
    (id: string) => tutorials.find(tutorial => tutorial.id === id),
    [tutorials]
  )

  const getTutorialsByCategory = useCallback(
    (category: string) => {
      return tutorials
        .filter(tutorial => tutorial.category === category)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    },
    [tutorials]
  )

  const getNextTutorial = useCallback(
    (id: string) => {
      const currentIndex = tutorials.findIndex(tutorial => tutorial.id === id)
      if (currentIndex !== -1 && currentIndex < tutorials.length - 1) {
        return tutorials[currentIndex + 1]
      }
      return undefined
    },
    [tutorials]
  )

  const getPreviousTutorial = useCallback(
    (id: string) => {
      const currentIndex = tutorials.findIndex(tutorial => tutorial.id === id)
      if (currentIndex > 0) {
        return tutorials[currentIndex - 1]
      }
      return undefined
    },
    [tutorials]
  )

  const createTutorial = useCallback(
    async (
      tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt' | 'views'>
    ) => {
      try {
        const docRef = await addDoc(collection(db, 'tutorials'), {
          ...tutorialData,
          difficulty: normalizeDifficulty(tutorialData.difficulty),
          createdAt: new Date(),
          updatedAt: new Date(),
          views: 0
        })
        return docRef.id
      } catch (err) {
        console.error('Erro ao criar tutorial:', err)
        throw new Error('Falha ao criar tutorial. Tente novamente.')
      }
    },
    [normalizeDifficulty]
  )

  const updateTutorial = useCallback(
    async (id: string, tutorialData: Partial<Tutorial>) => {
      try {
        const tutorialRef = doc(db, 'tutorials', id)
        const updateData = {
          ...tutorialData,
          updatedAt: new Date()
        }

        if (tutorialData.difficulty) {
          updateData.difficulty = normalizeDifficulty(tutorialData.difficulty)
        }

        await updateDoc(tutorialRef, updateData)
      } catch (err) {
        console.error('Erro ao atualizar tutorial:', err)
        throw new Error('Falha ao atualizar tutorial. Tente novamente.')
      }
    },
    [normalizeDifficulty]
  )

  const deleteTutorial = useCallback(
    async (id: string) => {
      try {
        await deleteDoc(doc(db, 'tutorials', id))
        removeFromFavorites(id)
      } catch (err) {
        console.error('Erro ao excluir tutorial:', err)
        throw new Error('Falha ao excluir tutorial. Tente novamente.')
      }
    },
    [removeFromFavorites]
  )

  const incrementViews = useCallback(async (id: string) => {
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
  }, [])

  const getDifficultyLabel = useCallback(
    (difficulty: string) => normalizeDifficulty(difficulty),
    [normalizeDifficulty]
  )

  const formatCategoryName = useCallback((category: string) => {
    return category
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }, [])

  const value: TutorialContextType = {
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
    refreshCategories
  }

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}
