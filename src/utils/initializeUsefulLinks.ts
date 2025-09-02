// src/utils/initializeUsefulLinks.ts
import { addUsefulLink } from "../services/usefulLinks";
import { UsefulLink } from "../types/usefulLinks"; // Importação adicionada

export const initializeDefaultLinks = async () => {
  const defaultLinks: Omit<UsefulLink, "id" | "createdAt" | "updatedAt">[] = [
    {
      name: "Hiren's BootCD",
      description: "Download oficial e informações do Hiren's BootCD",
      url: "https://www.hirensbootcd.org/",
      icon: "💿",
      category: "Ferramenta Principal",
      theme: "tools",
      order: 1,
      isActive: true,
    },
    // Adicione todos os outros links padrão aqui...
  ];

  try {
    for (const link of defaultLinks) {
      await addUsefulLink(link);
    }
    console.log("Links padrão inicializados com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar links padrão:", error);
  }
};
