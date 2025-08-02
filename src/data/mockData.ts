//src\data\mockData.ts
import type { Category } from "../types";

export const mockCategories: Category[] = [
  {
    id: 'bcd-mbr-tools',
    name: 'BCD/MBR Tools',
    description: 'Ferramentas para gerenciamento de boot e partições',
    icon: 'bi bi-hdd',
    tutorialCount: 0
  },
  {
    id: 'data-recovery',
    name: 'Recuperação de Dados',
    description: 'Ferramentas para recuperação de arquivos e partições',
    icon: 'bi bi-file-earmark-arrow-up',
    tutorialCount: 0
  },
  {
    id: 'disk-defrag',
    name: 'Desfragmentação',
    description: 'Ferramentas para otimização de discos',
    icon: 'bi bi-pie-chart',
    tutorialCount: 0
  },
]