// src/types/usefulLinks.ts
export interface UsefulLink {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  theme: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
