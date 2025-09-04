// src/types/index.ts
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  keywords: string[];
  imageUrl?: string;
  videoUrl?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  estimatedTime: number;
  tags: string[];
  version?: string;
  osCompatibility?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  tutorialCount: number;
  isFeatured?: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "user";
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
  position: "sidebar" | "header" | "footer";
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

export interface UsefulLink {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  theme: string; // Nova propriedade para agrupar por temas
  order: number; // Para ordenação personalizada
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
