// src/utils/createCategories.ts
// Execute este script uma vez para criar as categorias no Firestore

import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

const defaultCategories = [
  {
    id: "bcd-mbr-tools",
    name: "BCD/MBR Tools",
    description:
      "Ferramentas para reparar e gerenciar o Boot Configuration Data e Master Boot Record",
    icon: "🔧",
    isFeatured: true,
  },
  {
    id: "data-recovery",
    name: "Data Recovery",
    description:
      "Ferramentas para recuperação de dados perdidos ou corrompidos",
    icon: "💾",
    isFeatured: true,
  },
  {
    id: "disk-defrag",
    name: "Disk Defrag",
    description: "Ferramentas para desfragmentação e otimização de discos",
    icon: "🗄️",
    isFeatured: false,
  },
  {
    id: "partition-tools",
    name: "Partition Tools",
    description: "Ferramentas para gerenciamento e manipulação de partições",
    icon: "📊",
    isFeatured: true,
  },
  {
    id: "password-recovery",
    name: "Password Recovery",
    description: "Ferramentas para recuperação de senhas do sistema",
    icon: "🔑",
    isFeatured: false,
  },
  {
    id: "system-repair",
    name: "System Repair",
    description: "Ferramentas para diagnóstico e reparo do sistema",
    icon: "🔨",
    isFeatured: true,
  },
  {
    id: "network-tools",
    name: "Network Tools",
    description: "Ferramentas para diagnóstico e configuração de rede",
    icon: "🌐",
    isFeatured: false,
  },
  {
    id: "antivirus",
    name: "Antivírus",
    description: "Ferramentas de segurança e remoção de malware",
    icon: "🛡️",
    isFeatured: true,
  },
  {
    id: "backup-clone",
    name: "Backup & Clone",
    description: "Ferramentas para backup e clonagem de discos",
    icon: "💿",
    isFeatured: false,
  },
  {
    id: "hardware-info",
    name: "Hardware Info",
    description: "Ferramentas para análise e informações de hardware",
    icon: "🖥️",
    isFeatured: false,
  },
];

export const createCategoriesInFirestore = async (): Promise<void> => {
  try {
    console.log("Iniciando criação das categorias no Firestore...");

    const categoriesCollection = collection(db, "categories");

    // Verificar categorias existentes
    for (const category of defaultCategories) {
      try {
        console.log(`Verificando categoria: ${category.name}`);

        // Verificar se a categoria já existe pelo ID
        const existingQuery = query(
          categoriesCollection,
          where("name", "==", category.name)
        );
        const existingDocs = await getDocs(existingQuery);

        if (existingDocs.empty) {
          // Categoria não existe, criar nova
          const categoryData = {
            name: category.name,
            description: category.description,
            icon: category.icon,
            isFeatured: category.isFeatured,
            tutorialCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const docRef = await addDoc(categoriesCollection, categoryData);
          console.log(
            `✅ Categoria "${category.name}" criada com ID: ${docRef.id}`
          );
        } else {
          console.log(`ℹ️ Categoria "${category.name}" já existe, pulando...`);
        }
      } catch (error) {
        console.error(
          `❌ Erro ao processar categoria "${category.name}":`,
          error
        );
      }
    }

    console.log("✅ Processo de criação de categorias concluído!");

    // Verificar total de categorias criadas
    const allCategories = await getDocs(categoriesCollection);
    console.log(`📊 Total de categorias no Firestore: ${allCategories.size}`);
  } catch (error) {
    console.error("❌ Erro geral ao criar categorias:", error);
    throw error;
  }
};

// Função para executar o script (descomente para usar)
export const runScript = async (): Promise<void> => {
  try {
    await createCategoriesInFirestore();
  } catch (error) {
    console.error("Falha na execução do script:", error);
  }
};

// Para executar diretamente (descomente a linha abaixo)
// runScript();

// Função auxiliar para limpar todas as categorias (USE COM CUIDADO!)
export const clearAllCategories = async (): Promise<void> => {
  try {
    console.log("⚠️ ATENÇÃO: Removendo todas as categorias...");

    const categoriesCollection = collection(db, "categories");
    const allDocs = await getDocs(categoriesCollection);

    const deletePromises = allDocs.docs.map((doc) =>
      import("firebase/firestore").then(({ deleteDoc, doc: docRef }) =>
        deleteDoc(docRef(db, "categories", doc.id))
      )
    );

    await Promise.all(deletePromises);
    console.log(`✅ ${allDocs.size} categorias removidas com sucesso!`);
  } catch (error) {
    console.error("❌ Erro ao limpar categorias:", error);
    throw error;
  }
};

// Função para verificar o status das categorias
export const checkCategoriesStatus = async (): Promise<void> => {
  try {
    const categoriesCollection = collection(db, "categories");
    const snapshot = await getDocs(categoriesCollection);

    console.log(`📊 Status das Categorias:`);
    console.log(`Total: ${snapshot.size} categorias`);

    if (snapshot.empty) {
      console.log("⚠️ Nenhuma categoria encontrada no Firestore!");
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(
        `- ${data.name} (${data.tutorialCount || 0} tutoriais) ${
          data.isFeatured ? "⭐" : ""
        }`
      );
    });
  } catch (error) {
    console.error("❌ Erro ao verificar status das categorias:", error);
  }
};
