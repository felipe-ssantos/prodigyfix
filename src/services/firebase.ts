//src\services\firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração usando variáveis de ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_CONFIG_A,
  authDomain: import.meta.env.VITE_FB_CONFIG_B,
  projectId: import.meta.env.VITE_FB_CONFIG_C,
  storageBucket: import.meta.env.VITE_FB_CONFIG_D,
  messagingSenderId: import.meta.env.VITE_FB_CONFIG_E,
  appId: import.meta.env.VITE_FB_CONFIG_F,
};

// Inicializar de forma segura
function initializeFirebase() {
  try {
    const app = initializeApp(firebaseConfig);
    return {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      storage: getStorage(app),
    };
  } catch (error) {
    console.error("Erro na inicialização do Firebase:", error);
    throw error;
  }
}

// Inicialização e exportação
const { app, auth, db, storage } = initializeFirebase();

export { app, auth, db, storage };

// Mock uploadImage function - replace with actual Firebase Storage implementation
export const uploadImage = async (file: File): Promise<string> => {
  // Mock implementation - replace with actual Firebase Storage upload
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

export default app;
