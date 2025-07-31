// src/types/index.ts
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  keywords: string[];
  imageUrl?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  tutorialCount: number;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface SearchFilters {
  category?: string;
  difficulty?: string;
  timeRange?: string;
  tags?: string[];
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  position: 'sidebar' | 'header' | 'footer';
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  clicks: number;
  impressions: number;
}

export interface Favorite {
  id: string;
  tutorialId: string;
  userId: string;
  addedAt: Date;
}

export interface SearchResult {
  tutorials: Tutorial[];
  total: number;
  filters: SearchFilters;
} 