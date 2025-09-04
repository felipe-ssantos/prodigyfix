//src/services/usefulLinks.ts
import { FirebaseError } from "firebase/app";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { UsefulLink } from "../types/usefulLinks"; // Importação adicionada

export const getUsefulLinks = async (theme?: string) => {
  try {
    const linksRef = collection(db, "usefulLinks");
    let q = query(linksRef, where("isActive", "==", true), orderBy("order"));

    if (theme) {
      q = query(q, where("theme", "==", theme));
    }

    const querySnapshot = await getDocs(q);
    const links: UsefulLink[] = [];

    querySnapshot.forEach((doc) => {
      links.push({ id: doc.id, ...doc.data() } as UsefulLink);
    });

    // Agrupar por tema
    const groupedLinks = links.reduce((acc, link) => {
      if (!acc[link.theme]) {
        acc[link.theme] = [];
      }
      acc[link.theme].push(link);
      return acc;
    }, {} as Record<string, UsefulLink[]>);

    return groupedLinks;
  } catch (error) {
    console.error("Erro ao buscar links:", error);
    // Add more specific error message
    if (error instanceof FirebaseError && error.code === "permission-denied") {
      throw new Error(
        "Erro de permissão ao acessar os links. Por favor, verifique as regras do Firestore."
      );
    }
    throw error;
  }
};

export const addUsefulLink = async (
  link: Omit<UsefulLink, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const linksRef = collection(db, "usefulLinks");
    const now = new Date();

    const docRef = await addDoc(linksRef, {
      ...link,
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar link:", error);
    throw error;
  }
};

export const updateUsefulLink = async (
  id: string,
  updates: Partial<UsefulLink>
) => {
  try {
    const linkRef = doc(db, "usefulLinks", id);
    await updateDoc(linkRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Erro ao atualizar link:", error);
    throw error;
  }
};

export const deleteUsefulLink = async (id: string) => {
  try {
    const linkRef = doc(db, "usefulLinks", id);
    await deleteDoc(linkRef);
  } catch (error) {
    console.error("Erro ao excluir link:", error);
    throw error;
  }
};
