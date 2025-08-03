// src/contexts/TutorialContext.ts
import { createContext } from 'react'
import type { Tutorial, Category, SearchFilters } from '../types'

export interface TutorialContextType {
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

export const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined
)
